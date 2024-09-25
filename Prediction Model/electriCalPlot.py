import csv
import modin.pandas as pd
import numpy as np
import folium
from sklearn.cluster import KMeans
from scipy.spatial import cKDTree
from math import ceil
import time
import requests
import ray
from sklearnex import patch_sklearn

ray.init() # TO RUN MODIN PROPERLY
patch_sklearn() # PATCHING SKLEARN TO USE INTEL OPTIMIZATIONS

def loadAmenities(filename):
    with open(filename, 'r', encoding='utf-8') as locationFile:
        return list(csv.reader(locationFile))[1:]

def addAmenitiesOnMap(mapObj, amenities):
    for row in amenities:
        if row[2] != 'school':
            location = (float(row[2]), float(row[3]))
            folium.CircleMarker(location, popup=row[0], radius=3, color='blue').add_to(mapObj)

def get_elevation_from_open_elevation(lat, lon, retries = 3):
    attempt = 0

    while attempt < retries:
        try:
            url = f'https://api.open-elevation.com/api/v1/lookup?locations={lat},{lon}'
            response = requests.get(url)
            if response.status_code == 200:
                data = response.json()
                return data['results'][0]['elevation']
            else:
                return None
        except Exception as e:
            attempt += 1
            
    print(f"Error fetching elevation for ({lat}, {lon}): {e}")
    return None

startTime = time.time()

# LOADING VEHICLE DATA
vehicleData = pd.read_csv('../CSV Files/merged_evDatawithZip.csv')
vehicleData.dropna(subset=['LAT', 'LNG'], inplace=True)

# FILTERING OUT VEHICLES OUTSIDE CALIFORNIA'S NORTHERN BORDER
vehicleData = vehicleData[vehicleData['LAT'] <= 42.0]

# EXTRACTING LAT, LNG, AND VEHICLE COUNT
latLng = vehicleData[['LAT', 'LNG']].values
vehicleCount = vehicleData['Vehicles'].values.astype(int)

# CREATING WEIGHTED LATLNG
weighted_latLng = np.repeat(latLng, vehicleCount, axis=0)

# PERFORMING K-MEANS CLUSTERING WITH INTEL-SKLEARN
optimalClusters = min(2250, len(weighted_latLng))
kmeans = KMeans(n_clusters=optimalClusters, init='k-means++', random_state=42, n_init='auto')
yMeans = kmeans.fit_predict(weighted_latLng)

# ASSIGN CLUSTER TO ORIGINAL DATA
clusterLabels = np.zeros(len(vehicleData), dtype=int)
index = 0
for i, count in enumerate(vehicleCount):
    clusterLabels[i] = np.bincount(yMeans[index:index + count]).argmax()
    index += count

vehicleData['Cluster'] = clusterLabels

# KDTree FOR VEHICLE COUNT NEAR CENTROID
def vehiclesNearCentroid(centroids, radius, locations):
    tree = cKDTree(locations)
    radiusDeg = radius / 111.32  # KM to degree conversion
    return np.array([len(tree.query_ball_point(centroid, radiusDeg)) for centroid in centroids])

radius = 10  # 10KM RADIUS
centroidVehicleCount = vehiclesNearCentroid(kmeans.cluster_centers_, radius, weighted_latLng)

# LOADING EXISTING EV STATIONS
existingStations = None
stationTree = None
exclusionRadius = 2 / 111.32  # 2KM IN DEGREES
comparisonRadius = 5 / 111.32  # 5KM IN DEGREES

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

# MAP CREATION
baseLocation = [np.mean(vehicleData['LAT']), np.mean(vehicleData['LNG'])]
evMap = folium.Map(location=baseLocation, zoom_start=10)

# ADDING AMENITIES AND EXISTING EV STATIONS TO THE MAP
addAmenitiesOnMap(evMap, amenities)

if existingStations is not None:
    for _, station in evStations.iterrows():
        folium.CircleMarker(
            location=(station['Latitude'], station['Longitude']),
            radius=3,
            color='green',
            popup=f'Chargers: {station["DC Fast Count"]}'
        ).add_to(evMap)

# CHECKING CENTROIDS NEAR EXISTING EV STATIONS
stationsNearCentroid = stationTree.query_ball_point(kmeans.cluster_centers_, exclusionRadius) if stationTree else [[] for _ in range(len(kmeans.cluster_centers_))]

# GENERATING OUTPUT FOR SUGGESTED EV STATIONS
outputFile = 'suggested_ev_stations.csv'
with open(outputFile, 'w', newline='', encoding='utf-8') as csvfile:
    fieldnames = ['Latitude', 'Longitude', 'Vehicles Nearby', 'Required Chargers', 'Elevation']
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
    writer.writeheader()

    mountainThreshold = 1500
    successfulRecommendations = 0

    for centroid, count, nearbyStations in zip(kmeans.cluster_centers_, centroidVehicleCount, stationsNearCentroid):
        amenityRadius = 2 / 111.32  # 2KM RADIUS IN DEGREES

        if count > 5:
            requiredChargers = int(ceil(count / 64))

            if len(nearbyStations) == 0 and not np.isnan(centroid[0]) and not np.isnan(centroid[1]):
                elevation = get_elevation_from_open_elevation(centroid[0], centroid[1])

                if elevation is not None and elevation > mountainThreshold:
                    amenityRadius = 10 / 111.32  # 10KM RADIUS IN DEGREES

                # CHECKING EXISTING CHARGERS WITHIN 5KM
                nearbyStations5km = stationTree.query_ball_point(centroid, comparisonRadius)
                totalChargersNearby = np.sum(existingStations[nearbyStations5km, 2])
                adjustedChargerCount = requiredChargers - totalChargersNearby

                if adjustedChargerCount > 0:
                    nearbyAmenities = amenityTree.query_ball_point(centroid, amenityRadius)
                    shiftedLocation = amenityLocations[nearbyAmenities[0]] if nearbyAmenities else centroid

                    folium.CircleMarker(
                        location=shiftedLocation,
                        radius=5,
                        color='red',
                        popup=f'Vehicles Nearby: {count}, Chargers: {adjustedChargerCount}'
                    ).add_to(evMap)

                    writer.writerow({
                        'Latitude': shiftedLocation[0],
                        'Longitude': shiftedLocation[1],
                        'Vehicles Nearby': count,
                        'Required Chargers': adjustedChargerCount,
                        'Elevation': elevation
                    })
                    successfulRecommendations += 1

evMap.save("latestEVPlot.html")

endTime = time.time()
executionTime = endTime - startTime

print(f"Total execution time: {executionTime:.2f} seconds")
print(f"Successful EV station recommendations: {successfulRecommendations}")
print('\nGreen -> Existing EV Stations')
print('Blue -> Amenities')
print('Red -> Suggested EV Stations')