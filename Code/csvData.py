import csv
import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from scipy.spatial import cKDTree
from math import ceil
import time

startTime = time.time()

def load_amenities(filename):
    with open(filename, 'r', encoding='utf-8') as locationFile:
        return list(csv.reader(locationFile))[1:]

# Load the dataset
vehicle_data = pd.read_csv('../CSV Files/merged_evDatawithZip.csv')
vehicle_data.dropna(subset=['LAT', 'LNG'], inplace=True)

# Extract latitude, longitude, and vehicle counts
latLng = vehicle_data[['LAT', 'LNG']].values
vehicleCount = vehicle_data['Vehicles'].values.astype(int)

# Create weighted data
weighted_latLng = np.repeat(latLng, vehicleCount, axis=0)

# Perform K-Means clustering
optimal_clusters = min(2250, len(weighted_latLng))
kmeans = KMeans(n_clusters=optimal_clusters, init='k-means++', random_state=42)
y_kmeans = kmeans.fit_predict(weighted_latLng)

# Map cluster labels to original dataset
cluster_labels = np.zeros(len(vehicle_data), dtype=int)
index = 0
for i, count in enumerate(vehicleCount):
    cluster_labels[i] = np.bincount(y_kmeans[index:index + count]).argmax()
    index += count

vehicle_data['Cluster'] = cluster_labels

# KDTree for efficient distance calculations
def count_vehicles_near_centroids(centroids, radius, locations):
    tree = cKDTree(locations)
    radius_deg = radius / 111.32
    return np.array([len(tree.query_ball_point(centroid, radius_deg)) for centroid in centroids])

radius = 10  # 10 km radius
centroid_vehicle_counts = count_vehicles_near_centroids(kmeans.cluster_centers_, radius, weighted_latLng)

# Load EV station data
existing_stations = None
station_tree = None
exclusion_radius_deg = 2 / 111.32  # 2 km radius in degrees

try:
    ev_stations = pd.read_csv('../CSV Files/dc_fast_charger_data.csv')
    existing_stations = ev_stations[['Latitude', 'Longitude']].dropna().values
    station_tree = cKDTree(existing_stations)
except FileNotFoundError:
    print("EV stations file not found. Continuing without EV station data.")

# Load amenities data
amenities = load_amenities('../CSV Files/filtered_parking_locations.csv')
amenity_locations = np.array([[float(row[2]), float(row[3])] for row in amenities])
amenity_tree = cKDTree(amenity_locations)

# Precompute centroids near existing stations
if station_tree is not None:
    nearby_stations_per_centroid = station_tree.query_ball_point(kmeans.cluster_centers_, exclusion_radius_deg)
else:
    nearby_stations_per_centroid = [[] for _ in range(len(kmeans.cluster_centers_))]

# Prepare list to store suggested EV station locations
suggested_stations = []

# Suggest locations
for centroid, count, nearby_stations in zip(kmeans.cluster_centers_, centroid_vehicle_counts, nearby_stations_per_centroid):
    if count > 5:
        if len(nearby_stations) == 0 and not np.isnan(centroid[0]) and not np.isnan(centroid[1]):
            # Check if there are any amenities within 2 km of the centroid
            nearby_amenities = amenity_tree.query_ball_point(centroid, exclusion_radius_deg)
            
            if nearby_amenities:
                # If there's an amenity nearby, shift the centroid to the amenity's location
                closest_amenity = amenities[nearby_amenities[0]]
                amenity_lat, amenity_lng = float(closest_amenity[2]), float(closest_amenity[3])
                suggested_location = [amenity_lat, amenity_lng, f'Vehicles Nearby: {int(count)}', int(ceil(count / 16))]
            else:
                # Otherwise, use the original centroid location
                suggested_location = [centroid[0], centroid[1], f'Vehicles Nearby: {int(count)}', int(ceil(count / 16))]
            
            suggested_stations.append(suggested_location)

# Write the suggested stations to a CSV file
with open('../CSV Files/suggested_ev_stations.csv', mode='w', newline='') as file:
    writer = csv.writer(file)
    writer.writerow(['Latitude', 'Longitude', 'Details', 'Required Chargers'])
    writer.writerows(suggested_stations)

endTime = time.time()
execution_time = endTime - startTime

# Print results
print(f"Total execution time: {execution_time:.2f} seconds")
print(f"Suggested EV station locations saved to suggested_ev_stations.csv")
