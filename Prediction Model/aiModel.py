import pandas as pd
from geopy.distance import great_circle
from transformers import BertTokenizer, BertForSequenceClassification
import torch

# LOADING DATA FROM ALL THE DATASETS
suggestedStations = pd.read_csv(r'../CSV Files/evStationsDistrict.csv')
existingStations = pd.read_csv(r'../CSV Files/existingEvStationsDistrict.csv')
vehicleData = pd.read_csv(r'../CSV Files/merged_evDatawithZip.csv')
amenitiesData = pd.read_csv(r'../CSV Files/filtered_parking_locations.csv')

# LOADING THE BERT MODEL AND TOKENIZER
modelDir = "Intel/dynamic_tinybert"
tokenizer = BertTokenizer.from_pretrained(modelDir)
model = BertForSequenceClassification.from_pretrained(modelDir)

# GENERATING REPORT FOR A SPECIFIC ZIPCODE
def generate_report(district):
    reportContent = f'Recommended Charging Stations :\n'

    totalSuggestedChargers = 0
    totalExistingChargers = 0

    # SUGGESTED EV STATIONS
    suggestedChargerCounter = suggestedStations.groupby('County')['Required Chargers'].sum().reset_index()
    totalSuggestedChargers = suggestedChargerCounter[suggestedChargerCounter['County'] == district]['Required Chargers'].values[0] if not suggestedChargerCounter[suggestedChargerCounter['County'] == district].empty else 0

    # EXISTING EV STATIONS
    existingChargerCounter = existingStations.groupby('County')['DC Fast Count'].sum().reset_index()
    totalExistingChargers = existingChargerCounter[existingChargerCounter['County'] == district]['DC Fast Count'].values[0] if not existingChargerCounter[existingChargerCounter['County'] == district].empty else 0
    
    # EV COUNT
    evCounter = suggestedStations.groupby('County')['Vehicles Nearby'].sum().reset_index()
    evCount = evCounter[evCounter['County'] == district]['Vehicles Nearby'].values[0] if not evCounter[evCounter['County'] == district].empty else 0

    # TOTAL CHARGERS
    totalChargers = totalExistingChargers + totalSuggestedChargers

    reportContent += "\nAnalysis of Recommendations:\n"
    reportContent += f"- EV Density: The area has a significant number of battery electric vehicles, totaling {evCount} EVs in District: {district}.\n"
    reportContent += "- Strategic Locations: The recommended locations are strategically placed to cover underserved areas.\n"
    reportContent += "- High Demand: The high number of EVs relative to available charging points suggests potential congestion.\n"

    # TOTAL NO. OF VEHICLES POSSIBLE TO BE CHARGED IN A DAY
    totalVehiclesToBeCharged = (totalSuggestedChargers + totalExistingChargers) * 64

    # GENERATING REPORT CONTENT TO FEED INTO BERT
    reportContent += f"District: {district}\n"
    reportContent += f"\nTotal EVs in District: {district}: {evCount}\n"
    reportContent += f"Total Existing Chargers: {totalExistingChargers}\n"
    reportContent += f"Total Suggested Chargers: {totalSuggestedChargers}\n"
    reportContent += f"Total No. of Vehicles possible to be charged in a Day: {totalVehiclesToBeCharged}\n" # 64 to be approx.
    reportContent += f"Approximate Installation Price Requirement for Suggested Chargers: {round(totalSuggestedChargers * 0.005, 2)} - {round(totalSuggestedChargers * 0.015, 2)}$ M\n"
    reportContent += f"Utilization Rate: {round(totalVehiclesToBeCharged * 100 / evCount, 2)}%\n"

    # TOKENIZING REPORT CONTENT AND GENERATING MODEL OUTPUT
    inputs = tokenizer(reportContent, return_tensors='pt', truncation=True, max_length=512)

    with torch.no_grad():
        outputs = model(**inputs)

    predictions = torch.argmax(outputs.logits, dim=1)
    predictedClass = predictions.item()

    # MAPPING CLASS TO CATEGORY
    classLabels = {0: f"Model is good.\nIt has more than enough no. of chargers to satisfy the charging requirements (>110%)", 
                   1: f"Model is excellent.\nIt has approximately the required no. of chargers to meet the charging requirements (90%-110%)", 
                   2: f"Model needs improvement.\nNo. of chargers are not enough to meet the charging requirements (<90%)",
                   3: f"Model is oversaturated.\nNo. of chargers are way more than the requirement (>150%)",
                   4: f"Model is Un-optimised. \nNo. of chargers are way less than the requirement (<50%)"}
    classificationResult = classLabels[predictedClass]

    reportContent += f'\nIntel TinyBert Model\'s Analysis : {classificationResult} of the EV Vehicles at the District: {district}\n'

    return reportContent