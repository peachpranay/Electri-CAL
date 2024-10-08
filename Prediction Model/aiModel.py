import pandas as pd
from geopy.distance import great_circle
from transformers import BertTokenizer, BertForSequenceClassification
import torch

# LOADING DATA FROM ALL THE DATASETS
suggestedStations = pd.read_csv(r'../CSV Files/suggested_ev_stations.csv')
vehicleData = pd.read_csv(r'../CSV Files/merged_evDatawithZip.csv')
amenitiesData = pd.read_csv(r'../CSV Files/filtered_parking_locations.csv')
existingStations = pd.read_csv(r'../CSV Files/dc_fast_charger_data.csv')

# LOADING THE BERT MODEL AND TOKENIZER
modelDir = "Intel/dynamic_tinybert"
tokenizer = BertTokenizer.from_pretrained(modelDir)
model = BertForSequenceClassification.from_pretrained(modelDir)

# GENERATING REPORT FOR A SPECIFIC ZIPCODE
def generate_report(zipCode):
    reportContent = f'Recommended Charging Stations :\n'
    zipLat, zipLon = -1, -1

    # CHECKING IF ZIP CODE EXISTS IN VEHICLE DATA
    if int(zipCode) not in list(vehicleData['ZIP'].values):
        print(f"No entry found for ZIP code {zipCode}.")
    else:
        for index, row in vehicleData.iterrows():
            if int(row['ZIP']) == int(zipCode):
                zipLat = row['LAT']
                zipLon = row['LNG']

    totalSuggestedChargers = 0
    totalExistingChargers = 0

    # SUGGESTED EV STATIONS
    for index, row in suggestedStations.iterrows():
        stationLocation = (row['Latitude'], row['Longitude'])
        if great_circle((zipLat, zipLon), stationLocation).km <= 5:  # 5KM RADIUS
            totalSuggestedChargers += row['Required Chargers']
            reportContent += f"- Suggested Station ID {index}: Located at latitude {row['Latitude']} and longitude {row['Longitude']} with a recommendation for {row['Required Chargers']} chargers.\n"

    # EXISTING EV STATIONS
    for index, row in existingStations.iterrows():
        stationLocation = (row['Latitude'], row['Longitude'])
        if great_circle((zipLat, zipLon), stationLocation).km <= 5:  # 5KM RADIUS
            totalExistingChargers += row['DC Fast Count']
            reportContent += f"- Station ID {index}: Located at latitude {row['Latitude']} and longitude {row['Longitude']} with {row['DC Fast Count']} chargers.\n"

    # NEARBY AMENITIES
    reportContent += "\nNearby Amenities:\n"
    for index, row in amenitiesData.iterrows():
        amenityLocation = (row['latitude'], row['longitude'])
        if great_circle((zipLat, zipLon), amenityLocation).km <= 5:  # 5KM RADIUS
            reportContent += f"- {row['category']} at latitude {row['latitude']} and longitude {row['longitude']}\n"

    # EV COUNT
    vehicleCounts = vehicleData.groupby('ZIP')['Vehicles'].sum().reset_index()
    evCount = vehicleCounts[vehicleCounts['ZIP'] == zipCode]['Vehicles'].values[0] if not vehicleCounts[vehicleCounts['ZIP'] == zipCode].empty else 0

    reportContent += "\nAnalysis of Recommendations:\n"
    reportContent += f"- EV Density: The area has a significant number of battery electric vehicles, totaling {evCount} EVs in ZIP code {zipCode}.\n"
    reportContent += "- Strategic Locations: The recommended locations are strategically placed to cover underserved areas.\n"
    reportContent += "- High Demand: The high number of EVs relative to available charging points suggests potential congestion.\n"

    # CHECKING IF ZIP CODE EXISTS IN VEHICLE COUNTS
    vehicleData['ZIP'] = pd.to_numeric(vehicleData['ZIP'], errors='coerce', downcast='integer')
    vehicleCounts = vehicleData.groupby('ZIP')['Vehicles'].sum().reset_index()

    zipCodeInt = int(zipCode)

    if zipCodeInt in vehicleCounts['ZIP'].values:
        evCount = vehicleCounts[vehicleCounts['ZIP'] == zipCodeInt]['Vehicles'].values[0]
    else:
        evCount = 0  # DEFAULTING TO 0 IF ZIP CODE NOT FOUND

    # TOTAL NO. OF VEHICLES POSSIBLE TO BE CHARGED IN A DAY
    totalChargers = (totalSuggestedChargers + totalExistingChargers) * 64

    # GENERATING REPORT CONTENT TO FEED INTO BERT
    reportContent += f"ZIP Code: {zipCode}\n"
    reportContent += f"\nTotal EVs in ZIP code {zipCode}: {evCount}\n"
    reportContent += f"Total Existing Chargers: {totalExistingChargers}\n"
    reportContent += f"Total Suggested Chargers: {totalSuggestedChargers}\n"
    reportContent += f"Total No. of Vehicles possible to be charged in a Day: {totalChargers}\n"
    reportContent += f"Approximate Installation Price Requirement for Suggested Chargers: {round(totalSuggestedChargers * 0.005, 2)} - {round(totalSuggestedChargers * 0.015, 2)}$ M\n"

    # TOKENIZING REPORT CONTENT AND GENERATING MODEL OUTPUT
    inputs = tokenizer(reportContent, return_tensors='pt', truncation=True, max_length=512)

    with torch.no_grad():
        outputs = model(**inputs)

    predictions = torch.argmax(outputs.logits, dim=1)
    predictedClass = predictions.item()

    # MAPPING CLASS TO CATEGORY
    classLabels = {0: f"Model is good.\nIt has more than enough no. of chargers to satisfy the charging requirements", 
                   1: f"Model is excellent.\nIt has approximately the required no. of chargers to meet the charging requirements", 
                   2: f"Model needs improvement.\nNo. of chargers are not enough to meet the charging requirements"}
    classificationResult = classLabels[predictedClass]

    reportContent += f'\nIntel TinyBert Model\'s Analysis : {classificationResult} of the EV Vehicles at the zipcode : {zipCode}\n'

    return reportContent
