from pymongo import MongoClient

# Replace with your MongoDB Atlas connection string
MONGO_URI = "mongodb+srv://venkatmariserla21:ganesha1%40@cluster0.zrl05.mongodb.net/?retryWrites=true&w=majority&appName=cluster0"

# Connect to MongoDB Atlas
client = MongoClient(MONGO_URI)

# Access your database
db = client.myFirstDatabase  # Replace "myFirstDatabase" with your database name