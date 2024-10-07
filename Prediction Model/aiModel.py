import pandas as pd
from geopy.distance import great_circle
from transformers import BertTokenizer, BertForSequenceClassification
import torch

# Load CSV data
suggested_stations = pd.read_csv(r'../CSV Files/suggested_ev_stations.csv')
vehicle_data = pd.read_csv(r'../CSV Files/merged_evDatawithZip.csv')
amenities_data = pd.read_csv(r'../CSV Files/filtered_parking_locations.csv')
existing_stations = pd.read_csv(r'../CSV Files/dc_fast_charger_data.csv')

# Load the BERT model and tokenizer
# model_dir = r'D:\huggingface\hub\models--Intel--dynamic_tinybert\snapshots\cd8fba8ea22eb32272ec4d03679d49ab1bbf6504'
model_dir = "Intel/dynamic_tinybert"
tokenizer = BertTokenizer.from_pretrained(model_dir)
model = BertForSequenceClassification.from_pretrained(model_dir)

# Generate report for a specific ZIP code
def generate_report(zip_code):
    report_content = 'Recommended Charging Stations:\n'
    zip_lat, zip_lon = -1, -1

    if int(zip_code) not in list(vehicle_data['ZIP'].values):
        print(f"No entry found for ZIP code {zip_code}.")
    else:
        # Loop through each row in the DataFrame
        for index, row in vehicle_data.iterrows():
            if int(row['ZIP']) == int(zip_code):
                zip_lat = row['LAT']
                zip_lon = row['LNG']
    
    # Initialize total charger counts
    total_suggested_chargers = 0
    total_existing_chargers = 0

    # Recommended Charging Stations
    for index, row in suggested_stations.iterrows():
        station_location = (row['Latitude'], row['Longitude'])
        if great_circle((zip_lat, zip_lon), station_location).km <= 5:  # 5 km radius
            total_suggested_chargers += row['Required Chargers']  # Accumulate total suggested chargers
            report_content += f"- Suggested Station ID {index}: Located at latitude {row['Latitude']} and longitude {row['Longitude']} with a recommendation for {row['Required Chargers']} chargers.\n"


    # Existing Charging Stations
    for index, row in existing_stations.iterrows():
        station_location = (row['Latitude'], row['Longitude'])
        if great_circle((zip_lat, zip_lon), station_location).km <= 5:  # 5 km radius
            total_existing_chargers += row['DC Fast Count']  # Accumulate total existing chargers
            report_content += f"- Station ID {index}: Located at latitude {row['Latitude']} and longitude {row['Longitude']} with {row['DC Fast Count']} chargers.\n"

    # Amenities
    report_content += "\nNearby Amenities:\n"
    for index, row in amenities_data.iterrows():
        amenity_location = (row['latitude'], row['longitude'])
        if great_circle((zip_lat, zip_lon), amenity_location).km <= 5:  # 5 km radius
            report_content += f"- {row['category']} at latitude {row['latitude']} and longitude {row['longitude']}\n"

    # Vehicle Count
    vehicle_counts = vehicle_data.groupby('ZIP')['Vehicles'].sum().reset_index()
    ev_count = vehicle_counts[vehicle_counts['ZIP'] == zip_code]['Vehicles'].values[0] if not vehicle_counts[vehicle_counts['ZIP'] == zip_code].empty else 0
    

    # Analysis of Recommendations
    report_content += "\nAnalysis of Recommendations:\n"
    report_content += f"- EV Density: The area has a significant number of battery electric vehicles, totaling {ev_count} EVs in ZIP code {zip_code}.\n"
    report_content += "- Strategic Locations: The recommended locations are strategically placed to cover underserved areas.\n"
    report_content += "- High Demand: The high number of EVs relative to available charging points suggests potential congestion.\n"

    # # Ensure 'Vehicles' is numeric
    # vehicle_data['Vehicles'] = pd.to_numeric(vehicle_data['Vehicles'], errors='coerce')

    # # Initialize the vehicle count
    # ev_count = 0

    # # Check if the specified ZIP code exists in the DataFrame
    # if int(zip_code) not in list(vehicle_data['ZIP'].values):
    #     print(f"No entries found for ZIP code {zip_code}.")
    # else:
    #     # Loop through each row in the DataFrame
    #     for index, row in vehicle_data.iterrows():
    #         if int(row['ZIP']) == int(zip_code):
    #             if pd.notnull(row['Vehicles']):  # Check for NaN
    #                 ev_count += int(row['Vehicles'])  # Add to count if ZIP matches

    # # Handle NaN values by checking if ev_count is still zero and displaying appropriately
    # ev_count_display = ev_count if ev_count > 0 else 0  

    # Convert ZIP columns to integers for proper comparison
    vehicle_data['ZIP'] = pd.to_numeric(vehicle_data['ZIP'], errors='coerce', downcast='integer')
    vehicle_counts = vehicle_data.groupby('ZIP')['Vehicles'].sum().reset_index()

    # Ensure the comparison is between the same data types
    zip_code_int = int(zip_code)

    # Retrieve EV count for the specified ZIP code
    if zip_code_int in vehicle_counts['ZIP'].values:
        ev_count = vehicle_counts[vehicle_counts['ZIP'] == zip_code_int]['Vehicles'].values[0]
    else:
        ev_count = 0  # Default to 0 if no entry is found for the ZIP code


    # Total chargers
    total_chargers = (total_suggested_chargers + total_existing_chargers) * 64

    # Generate report content to feed into BERT
    report_content += f"ZIP Code: {zip_code}\n"
    report_content += f"\nTotal EVs in ZIP code {zip_code}: {ev_count}\n"
    report_content += f"Total Existing Chargers: {total_existing_chargers}\n"
    report_content += f"Total Suggested Chargers: {total_suggested_chargers}\n"
    report_content += f"Total No. of Vehicles possible to be charged in a Day: {total_chargers}\n"
    report_content += f"Approximate Installation Price Requirement for Suggested Chargers: {round(total_suggested_chargers * 0.005, 2)} - {round(total_suggested_chargers * 0.015, 2)}$ M\n"

    # Tokenize the report content
    inputs = tokenizer(report_content, return_tensors='pt', truncation=True, max_length=512)

    # Perform inference (classification) with BERT
    with torch.no_grad():
        outputs = model(**inputs)

    # Get predicted class
    predictions = torch.argmax(outputs.logits, dim=1)
    predicted_class = predictions.item()

    # Map class to a category (this depends on your model's classification task)
    class_labels = {0: f"Model is good.\nIt has more than enough no. of chargers to satisfy the charging requirements", 
                    1: f"Model is excellent.\nIt has approximately the required no. of chargers to meet the charging requirements", 
                    2: f"Model needs improvement.\nNo. of chargers are not enough to meet the charging requirements"}
    classification_result = class_labels[predicted_class]

    report_content += f'\nIntel TinyBert Model\'s Analysis : {classification_result} of the EV Vehicles at the zipcode : {zip_code}\n'
    
    with open(f"ev_report_zip_{zip_code}.txt", "w") as f:
        f.write(report_content)
    return report_content



