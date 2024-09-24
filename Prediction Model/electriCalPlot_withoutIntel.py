import csv
import pandas as pd
import numpy as np
import folium
from sklearn.cluster import KMeans
from scipy.spatial import cKDTree
from math import ceil
import time

def loadAmenities(filename):
    with open(filename, 'r', encoding='utf-8') as locationFile:
        return list(csv.reader(locationFile))[1:]

# PLOTTING AMENITIES ON THE MAP EXCEPT FOR SCHOOLS
def addAmenitiesOnMap(mapObj, amenities):
    for row in amenities:
        if row[2] != 'school':
            location = (float(row[2]), float(row[3]))
            folium.CircleMarker(location, popup=row[0], radius=3, color='blue').add_to(mapObj)

startTime = time.time()

# LOADING THE DATASET
vehicleData = pd.read_csv('../CSV Files/merged_evDatawithZip.csv')
vehicleData.dropna(subset=['LAT', 'LNG'], inplace=True)

# FILTERING OUT VEHICLES OUTSIDE CALIFORNIA'S NORTHERN BORDER FROM THE DATASET
vehicleData = vehicleData[vehicleData['LAT'] <= 42.0]

# EXTRACTING LAT, LNG AND VEHICLE COUNT FROM DATASET
latLng = vehicleData[['LAT', 'LNG']].values
vehicleCount = vehicleData['Vehicles'].values.astype(int)

# CREATING WEIGHTED DATA - ASSIGNING VEHICLE COUNT TO THE LOCATIONS
weighted_latLng = np.repeat(latLng, vehicleCount, axis=0)

# PERFORMING K-MEANS CLUSTERING
optimalClusters = min(2250, len(weighted_latLng))
kmeans = KMeans(n_clusters=optimalClusters, init='k-means++', random_state=42)
yMeans = kmeans.fit_predict(weighted_latLng)

clusterLabels = np.zeros(len(vehicleData), dtype=int)
index = 0
for i, count in enumerate(vehicleCount):
    clusterLabels[i] = np.bincount(yMeans[index:index + count]).argmax()
    index += count

vehicleData['Cluster'] = clusterLabels

# USING KDTREE FOR DISTANCE CALCULATION
def vehiclesNearCentroid(centroids, radius, locations):
    tree = cKDTree(locations)
    radiusDeg = radius / 111.32 # CHANGING RADIUS FROM KM TO DEGREE
    return np.array([len(tree.query_ball_point(centroid, radiusDeg)) for centroid in centroids])

radius = 10  # 10KM RADIUS
centroidVehicleCount = vehiclesNearCentroid(kmeans.cluster_centers_, radius, weighted_latLng)

# LOADING THE DATASET FOR THE EXISTING EV STATIONS
existingStations = None
stationTree = None
exclusionRadius = 2 / 111.32  # 2KM RADIUS IN DEGREES
comparisonRadius = 5 / 111.32  # 5KM RADIUS IN DEGREES

try:
    evStations = pd.read_csv('../CSV Files/dc_fast_charger_data.csv')
    existingStations = evStations[['Latitude', 'Longitude', 'DC Fast Count']].dropna().values
    stationTree = cKDTree(existingStations[:, :2])
except FileNotFoundError:
    print("EV stations file not found. Continuing without EV station data.")

# LOADING AMENITIES DATA AND BUILDING KDTREE
amenities = loadAmenities('../CSV Files/filtered_parking_locations.csv')
amenityLocations = np.array([[float(row[2]), float(row[3])] for row in amenities])
amenityTree = cKDTree(amenityLocations)
amenityRadius = 2 / 111.32  # 2KM RADIUS IN DEGREES

# MAP CREATION
baseLocation = [np.mean(vehicleData['LAT']), np.mean(vehicleData['LNG'])]
evMap = folium.Map(location=baseLocation, zoom_start=10)

# ADDING AMENITIES TO THE MAP
addAmenitiesOnMap(evMap, amenities)

# ADDING EXISTING EV STATIONS TO THE MAP
if existingStations is not None:
    for _, station in evStations.iterrows():
        if not pd.isna(station['Latitude']) and not pd.isna(station['Longitude']):
            folium.CircleMarker(
                location=(station['Latitude'], station['Longitude']),
                radius=3,
                color='green',
                fill=True,
                icon=folium.Icon(color='green'),
                popup=f' Chargers available : {station["DC Fast Count"]}'
            ).add_to(evMap)
    print("EV stations added to the map.")

# CHECKING CENTROIDS AROUND THE EXISTING EV STATIONS
if stationTree is not None:
    stationsNearCentroid = stationTree.query_ball_point(kmeans.cluster_centers_, exclusionRadius)
else:
    stationsNearCentroid = [[] for _ in range(len(kmeans.cluster_centers_))]

# SHIFTING SUGGESTED EV STATIONS TO THE AMENITIES WITHIN 2KM RADIUS
successfulRecommendations = 0
for centroid, count, nearbyStations in zip(kmeans.cluster_centers_, centroidVehicleCount, stationsNearCentroid):
    if count > 5:
        # CALCULATING REQUIRED CHARGERS FOR THE SUGGESTED STATION
        requiredChargers = int(ceil(count / 64)) # The average time taken by the user is 22.5 mins (0.375 Hrs) on an EV Station (24 / 0.375 = 64)

        if len(nearbyStations) == 0 and not np.isnan(centroid[0]) and not np.isnan(centroid[1]):
            # CHECKING FOR EXISTING EV STATIONS WITHIN A 5KM RADIUS
            nearbyStations5km = stationTree.query_ball_point(centroid, comparisonRadius)
            totalChargersNearby = np.sum(existingStations[nearbyStations5km, 2])

            # SUBTRACTING EXISTING EV CHARGERS FROM THE SUGGESTED COUNT OF CHARGERS
            adjustedChargerCount = requiredChargers - totalChargersNearby

            # REMOVING THE STATIONS IF ADJUSTED CHARGER COUNT DROPS TO 0
            if adjustedChargerCount > 0:
                # FINDING NEAREST AMENITY WITHIN A 2KM RADIUS
                nearbyAmenities = amenityTree.query_ball_point(centroid, amenityRadius)
                if nearbyAmenities:
                    # SHIFTING THE SUGGESTED EV STATION TO THE NEAREST AMENITY
                    nearestAmenity = amenityLocations[nearbyAmenities[0]]
                    shiftedLocation = (nearestAmenity[0], nearestAmenity[1])
                else:
                    shiftedLocation = (centroid[0], centroid[1])

                # ADDING SUGGESTED STATION TO THE MAP
                folium.CircleMarker(
                    location=shiftedLocation,
                    radius=5,
                    color='red',
                    popup=f'Vehicles Nearby: {int(count)}\n\nRequired Chargers: {adjustedChargerCount}',
                    icon=folium.Icon(color='red')
                ).add_to(evMap)
                successfulRecommendations += 1

evMap.save("latestEVPlot.html")
print("Map has been saved as latestEVPlot.html")

endTime = time.time()
executionTime = endTime - startTime

print(f"Total execution time: {executionTime:.2f} seconds")
print(f"Successful EV station recommendations made: {successfulRecommendations}")

print('\nGreen -> Existing EV Stations')
print('Blue -> Amenities')
print('Red -> Suggested EV Stations')
