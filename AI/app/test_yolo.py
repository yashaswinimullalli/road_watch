from ultralytics import YOLO

# Load trained model
model = YOLO("models/pothole.pt")

# Run prediction
results = model("test_images/proper1.webp")

# Extract prediction info
result = results[0]

# Class names
names = result.names

# Top prediction index
top_class = result.probs.top1

# Confidence score
confidence = result.probs.top1conf.item()

# Convert class index to class name
prediction = names[top_class]

print("\n===== PREDICTION =====")
print(f"Damage Type: {prediction}")
print(f"Confidence: {confidence:.2f}")