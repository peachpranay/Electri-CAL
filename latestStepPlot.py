import csv
import pandas as pd
import numpy as np
import folium
from sklearn.cluster import KMeans
from scipy.spatial import cKDTree
from math import ceil
import time

def load_amenities(filename):
    with open(filename, 'r', encoding='utf-8') as locationFile:
        return list(csv.reader(locationFile))[1:]

def add_amenities_to_map(map_obj, amenities):
    for row in amenities:
        if row[2] != 'school':
            location = (float(row[2]), float(row[3]))
            folium.CircleMarker(location, popup=row[0], radius=3, color='blue').add_to(map_obj)

startTime = time.time()

# Load the dataset
vehicle_data = pd.read_csv('merged_evDatawithZip.csv')
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
    ev_stations = pd.read_csv('dc_fast_charger_data.csv')
    existing_stations = ev_stations[['Latitude', 'Longitude']].dropna().values
    station_tree = cKDTree(existing_stations)
except FileNotFoundError:
    print("EV stations file not found. Continuing without EV station data.")

# Load amenities data and build KDTree
amenities = load_amenities('filtered_parking_locations.csv')
amenity_locations = np.array([[float(row[2]), float(row[3])] for row in amenities])
amenity_tree = cKDTree(amenity_locations)
amenity_radius_deg = 2 / 111.32  # 2 km radius for amenities

# Create the map
base_location = [np.mean(vehicle_data['LAT']), np.mean(vehicle_data['LNG'])]
my_map = folium.Map(location=base_location, zoom_start=10)

# Add amenities to the map
add_amenities_to_map(my_map, amenities)

# Precompute centroids near existing stations
if station_tree is not None:
    nearby_stations_per_centroid = station_tree.query_ball_point(kmeans.cluster_centers_, exclusion_radius_deg)
else:
    nearby_stations_per_centroid = [[] for _ in range(len(kmeans.cluster_centers_))]

# Add cluster centroid markers (suggested EV stations shifted to amenities)
successful_recommendations = 0
for centroid, count, nearby_stations in zip(kmeans.cluster_centers_, centroid_vehicle_counts, nearby_stations_per_centroid):
    if count > 5:
        if len(nearby_stations) == 0 and not np.isnan(centroid[0]) and not np.isnan(centroid[1]):
            # Find nearest amenity within 2 km radius
            nearby_amenities = amenity_tree.query_ball_point(centroid, amenity_radius_deg)
            if nearby_amenities:
                # Shift the suggested EV station to the nearest amenity
                nearest_amenity = amenity_locations[nearby_amenities[0]]
                shifted_location = (nearest_amenity[0], nearest_amenity[1])
            else:
                # No nearby amenity, use the original centroid location
                shifted_location = (centroid[0], centroid[1])
            
            folium.CircleMarker(
                location=shifted_location,
                radius=3,
                color='red',
                popup=f'Vehicles Nearby: {int(count)}\n\nRequired Chargers: {int(ceil(count / 16))}',
                icon=folium.Icon(color='red')
            ).add_to(my_map)
            successful_recommendations += 1

# Add existing EV station markers
if existing_stations is not None:
    for _, station in ev_stations.iterrows():
        if not pd.isna(station['Latitude']) and not pd.isna(station['Longitude']):
            folium.CircleMarker(
                location=(station['Latitude'], station['Longitude']),
                radius=5,
                color='green',
                fill=True,
                icon=folium.Icon(color='green')
            ).add_to(my_map)
    print("EV stations added to the map.")

# Save the map
my_map.save("latestEvPlot.html")
print("Map has been saved as latestEvPlot.html")

endTime = time.time()
execution_time = endTime - startTime

# Print results
print(f"Total execution time: {execution_time:.2f} seconds")
print(f"Successful EV station recommendations made: {successful_recommendations}")
