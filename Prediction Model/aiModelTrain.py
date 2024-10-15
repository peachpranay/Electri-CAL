import pandas as pd
import torch
from torch.utils.data import Dataset, DataLoader
from transformers import BertTokenizer, BertForSequenceClassification, AdamW
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

data = pd.read_csv(r'../CSV Files/evStationTrainData.csv')

tokenizer = BertTokenizer.from_pretrained('Intel/dynamic_tinybert')

class EVChargingDataset(Dataset):
    def __init__(self, texts, labels):
        self.texts = texts
        self.labels = labels

    def __len__(self):
        return len(self.texts)

    def __getitem__(self, idx):
        text = self.texts[idx]
        label = self.labels[idx]
        encoding = tokenizer(text, padding='max_length', truncation=True, return_tensors='pt', max_length=512)
        return {
            'input_ids': encoding['input_ids'].flatten(),
            'attention_mask': encoding['attention_mask'].flatten(),
            'labels': torch.tensor(label, dtype=torch.long)
        }

X = data['Utilization Rate'].apply(lambda x: f'The utilization rate is {x}%.').tolist() 
y = data['label'].tolist()

xTrain, xTest, yTrain, yTest = train_test_split(X, y, test_size=0.2, random_state=42)

trainDataset = EVChargingDataset(xTrain, yTrain)
testDataset = EVChargingDataset(xTest, yTest)
trainLoader = DataLoader(trainDataset, batch_size=16, shuffle=True)
testLoader = DataLoader(testDataset, batch_size=16)

model = BertForSequenceClassification.from_pretrained('Intel/dynamic_tinybert', num_labels=5)

optimizer = AdamW(model.parameters(), lr=2e-5)

model.train()
for epoch in range(5): 
    for batch in trainLoader:
        optimizer.zero_grad()
        input_ids = batch['input_ids']
        attention_mask = batch['attention_mask']
        labels = batch['labels']
        
        outputs = model(input_ids=input_ids, attention_mask=attention_mask, labels=labels)
        loss = outputs.loss
        loss.backward()
        optimizer.step()
    print(f'Epoch {epoch + 1}/{5}, Loss: {loss.item()}')

model.eval()
predictions, true_labels = [], []
with torch.no_grad():
    for batch in testLoader:
        input_ids = batch['input_ids']
        attention_mask = batch['attention_mask']
        
        outputs = model(input_ids=input_ids, attention_mask=attention_mask)
        preds = torch.argmax(outputs.logits, dim=1)
        predictions.extend(preds.cpu().numpy())
        true_labels.extend(batch['labels'].cpu().numpy())
        
print(classification_report(true_labels, predictions))

model.save_pretrained('../AiModel/trainedIntelModel')
tokenizer.save_pretrained('../AiModel/trainedIntelModel')
