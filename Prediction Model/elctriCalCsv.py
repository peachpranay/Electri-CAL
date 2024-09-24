import csv
import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from scipy.spatial import cKDTree
from math import ceil
import time

def loadAmenities(filename):
    with open(filename, 'r', encoding='utf-8') as locationFile:
        return list(csv.reader(locationFile))[1:]

# LOADING THE DATASET
startTime = time.time()
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

# Handling case when clusters are smaller than requested
if len(np.unique(yMeans)) < optimalClusters:
    print(f"Warning: Found only {len(np.unique(yMeans))} unique clusters instead of {optimalClusters} due to duplicate points.")

clusterLabels = np.zeros(len(vehicleData), dtype=int)
index = 0
for i, count in enumerate(vehicleCount):
    clusterLabels[i] = np.bincount(yMeans[index:index + count]).argmax()
    index += count

vehicleData['Cluster'] = clusterLabels

# USING KDTREE FOR DISTANCE CALCULATION
def vehiclesNearCentroid(centroids, radius, locations):
    tree = cKDTree(locations)
    radiusDeg = radius / 111.32  # CHANGING RADIUS FROM KM TO DEGREE
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

# LIST TO HOLD SUGGESTED EV STATION DATA
suggested_stations = []

# CHECKING CENTROIDS AROUND THE EXISTING EV STATIONS
stationsNearCentroid = stationTree.query_ball_point(kmeans.cluster_centers_, exclusionRadius) if stationTree is not None else [[] for _ in range(len(kmeans.cluster_centers_))]

# SHIFTING SUGGESTED EV STATIONS TO THE AMENITIES WITHIN 2KM RADIUS
successfulRecommendations = 0
for centroid, count, nearbyStations in zip(kmeans.cluster_centers_, centroidVehicleCount, stationsNearCentroid):
    if count > 5:
        # CALCULATING REQUIRED CHARGERS FOR THE SUGGESTED STATION
        requiredChargers = int(ceil(count / 64))  # The average time taken by the user is 22.5 mins (0.375 Hrs) on an EV Station (24 / 0.375 = 64)

        if len(nearbyStations) == 0 and not np.isnan(centroid[0]) and not np.isnan(centroid[1]):
            # CHECKING FOR EXISTING EV STATIONS WITHIN A 5KM RADIUS
            nearbyStations5km = stationTree.query_ball_point(centroid, comparisonRadius) if stationTree is not None else []
            totalChargersNearby = np.sum(existingStations[nearbyStations5km, 2]) if nearbyStations5km else 0

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

                # APPENDING THE SUGGESTED STATION TO THE LIST
                suggested_stations.append({
                    'Latitude': shiftedLocation[0],
                    'Longitude': shiftedLocation[1],
                    'Details': f'Vehicles Nearby: {int(count)}',
                    'Required Chargers': adjustedChargerCount
                })
                successfulRecommendations += 1

# WRITE TO CSV FILE
output_filename = 'suggested_ev_stations.csv'
with open(output_filename, 'w', newline='') as csvfile:
    fieldnames = ['Latitude', 'Longitude', 'Details', 'Required Chargers']
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

    writer.writeheader()
    for station in suggested_stations:
        writer.writerow(station)

print(f"CSV file has been saved as {output_filename}")

endTime = time.time()
executionTime = endTime - startTime

print(f"Total execution time: {executionTime:.2f} seconds")
print(f"Successful EV station recommendations made: {successfulRecommendations}")

# (You can remove or comment the print statement below if you don't need this information)
print('\nDetails of the suggested EV stations are saved in the CSV file.')
