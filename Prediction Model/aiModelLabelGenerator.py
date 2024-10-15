import pandas as pd

data = pd.read_csv(r'../CSV Files/evStationTrainData.csv')

data['Utilization Rate'] = (data['vehiclesToBeCharged'] / data['Vehicles Nearby']) * 100

def label_utilization(rate):
    if rate > 150:
        return 3 
    elif rate > 110:
        return 0 
    elif rate >= 90:
        return 1 
    elif rate >= 50:
        return 4 
    else:
        return 2 

data['label'] = data['Utilization Rate'].apply(label_utilization)

data.to_csv(r'../CSV Files/evStationTrainData.csv', index=False)
