from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django_react_project.settings import db
import json
from django.contrib.auth.hashers import make_password, check_password
import jwt
from datetime import datetime, timedelta
import os
import re

# Secret key for JWT (use environment variable in production)
SECRET_KEY = os.getenv("SECRET_KEY", "django-insecure-fallback-key")

# Email validation regex
EMAIL_REGEX = r"[^@]+@[^@]+\.[^@]+"

# Phone number validation regex
PHONE_REGEX = r"^\d{10}$"

@csrf_exempt
def signup(request):
    if request.method == "POST":
        try:
            # Parse the request body
            data = json.loads(request.body)
            name = data.get("name")
            email = data.get("email")
            phone = data.get("phone")
            password = data.get("password")
            confirm_password = data.get("confirm_password")

            # Validate input
            if not name or not email or not phone or not password or not confirm_password:
                return JsonResponse({"error": "All fields are required."}, status=400)
            if password != confirm_password:
                return JsonResponse({"error": "Passwords do not match."}, status=400)
            if not re.match(EMAIL_REGEX, email):
                return JsonResponse({"error": "Invalid email address."}, status=400)
            if not re.match(PHONE_REGEX, phone):
                return JsonResponse({"error": "Invalid phone number. Must be 10 digits."}, status=400)

            # Access the 'users' collection
            users_collection = db.users

            # Check if the email or phone already exists
            if users_collection.find_one({"email": email}):
                return JsonResponse({"error": "Email already exists."}, status=400)
            if users_collection.find_one({"phone": phone}):
                return JsonResponse({"error": "Phone number already exists."}, status=400)

            # Hash the password and create a new user document
            user = {
                "name": name,
                "email": email,
                "phone": phone,
                "password": make_password(password),
            }
            users_collection.insert_one(user)

            return JsonResponse({"message": "User created successfully!"}, status=201)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON."}, status=400)
        except Exception as e:
            print(f"Error during signup: {e}")
            return JsonResponse({"error": "An internal error occurred."}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method."}, status=405)

@csrf_exempt
def login(request):
    if request.method == "POST":
        try:
            # Parse the request body
            data = json.loads(request.body)
            username = data.get("username")
            password = data.get("password")

            # Validate input
            if not username or not password:
                return JsonResponse({"error": "Username and password are required."}, status=400)

            # Access the 'users' collection
            users_collection = db.users

            # Find the user by username (email or phone)
            user = users_collection.find_one({"$or": [{"email": username}, {"phone": username}]})
            if not user:
                return JsonResponse({"error": "Invalid username or password."}, status=400)

            # Verify the password
            if not check_password(password, user["password"]):
                return JsonResponse({"error": "Invalid username or password."}, status=400)

            # Generate a JWT token
            token = jwt.encode(
                {"email": user["email"], "exp": datetime.utcnow() + timedelta(hours=1)},
                SECRET_KEY,
                algorithm="HS256",
            )

            return JsonResponse({"message": "Login successful!", "token": token}, status=200)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON."}, status=400)
        except Exception as e:
            print(f"Error during login: {e}")
            return JsonResponse({"error": "An internal error occurred."}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method."}, status=405)

@csrf_exempt
def me(request):
    if request.method == "GET":
        try:
            # Get the Authorization header
            auth_header = request.headers.get("Authorization")
            if not auth_header or not auth_header.startswith("Bearer "):
                return JsonResponse({"error": "Invalid or missing token."}, status=400)

            # Extract the token
            token = auth_header.split(" ")[1]
            if not token:
                return JsonResponse({"error": "Token is required."}, status=400)

            # Decode the token
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            email = payload.get("email")

            # Access the 'users' collection
            users_collection = db.users

            # Find the user by email
            user = users_collection.find_one({"email": email})
            if not user:
                return JsonResponse({"error": "User not found."}, status=404)

            # Return user data (excluding the password)
            user_data = {
                "username": user.get("name"),  # Assuming 'name' is the field for the username
                "email": user.get("email"),
                "phone": user.get("phone"),
            }
            return JsonResponse(user_data, status=200)
        except jwt.ExpiredSignatureError:
            return JsonResponse({"error": "Token has expired. Please log in again."}, status=401)
        except jwt.InvalidTokenError:
            return JsonResponse({"error": "Invalid token."}, status=401)
        except Exception as e:
            print(f"Error fetching user data: {e}")
            return JsonResponse({"error": "An internal error occurred."}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method."}, status=405)
    
    
@csrf_exempt
def predict(request):
    if request.method == "POST":
        try:
            # Handle file upload and prediction logic here
            # For now, return a dummy prediction
            return JsonResponse({"prediction": "Disease Detected"}, status=200)
        except Exception as e:
            print(f"Error during prediction: {e}")
            return JsonResponse({"error": "An internal error occurred."}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method."}, status=405)

@csrf_exempt
def update_password(request):
    if request.method == "POST":
        try:
            # Parse the request body
            data = json.loads(request.body)
            current_password = data.get("currentPassword")
            new_password = data.get("newPassword")

            # Validate input
            if not current_password or not new_password:
                return JsonResponse({"error": "Current and new passwords are required."}, status=400)

            # Access the 'users' collection
            users_collection = db.users

            # Find the user by token (email)
            token = request.headers.get("Authorization").split(" ")[1]
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            email = payload.get("email")
            user = users_collection.find_one({"email": email})
            if not user:
                return JsonResponse({"error": "User not found."}, status=404)

            # Verify the current password
            if not check_password(current_password, user["password"]):
                return JsonResponse({"error": "Current password is incorrect."}, status=400)

            # Update the password
            users_collection.update_one(
                {"email": email},
                {"$set": {"password": make_password(new_password)}},
            )

            return JsonResponse({"message": "Password updated successfully!"}, status=200)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON."}, status=400)
        except Exception as e:
            print(f"Error updating password: {e}")
            return JsonResponse({"error": "An internal error occurred."}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method."}, status=405)

@csrf_exempt
def update_email(request):
    if request.method == "POST":
        try:
            # Parse the request body
            data = json.loads(request.body)
            new_email = data.get("newEmail")

            # Validate input
            if not new_email or not re.match(EMAIL_REGEX, new_email):
                return JsonResponse({"error": "Please enter a valid email address."}, status=400)

            # Access the 'users' collection
            users_collection = db.users

            # Find the user by token (email)
            token = request.headers.get("Authorization").split(" ")[1]
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            email = payload.get("email")
            user = users_collection.find_one({"email": email})
            if not user:
                return JsonResponse({"error": "User not found."}, status=404)

            # Check if the new email already exists
            if users_collection.find_one({"email": new_email}):
                return JsonResponse({"error": "Email already exists."}, status=400)

            # Update the email
            users_collection.update_one(
                {"email": email},
                {"$set": {"email": new_email}},
            )

            return JsonResponse({"message": "Email updated successfully!"}, status=200)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON."}, status=400)
        except Exception as e:
            print(f"Error updating email: {e}")
            return JsonResponse({"error": "An internal error occurred."}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method."}, status=405)

@csrf_exempt
def update_mobile(request):
    if request.method == "POST":
        try:
            # Parse the request body
            data = json.loads(request.body)
            new_mobile = data.get("newMobile")

            # Validate input
            if not new_mobile or not re.match(PHONE_REGEX, new_mobile):
                return JsonResponse({"error": "Please enter a valid 10-digit mobile number."}, status=400)

            # Access the 'users' collection
            users_collection = db.users

            # Find the user by token (email)
            token = request.headers.get("Authorization").split(" ")[1]
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            email = payload.get("email")
            user = users_collection.find_one({"email": email})
            if not user:
                return JsonResponse({"error": "User not found."}, status=404)

            # Check if the new mobile number already exists
            if users_collection.find_one({"phone": new_mobile}):
                return JsonResponse({"error": "Mobile number already exists."}, status=400)

            # Update the mobile number
            users_collection.update_one(
                {"email": email},
                {"$set": {"phone": new_mobile}},
            )

            return JsonResponse({"message": "Mobile number updated successfully!"}, status=200)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON."}, status=400)
        except Exception as e:
            print(f"Error updating mobile number: {e}")
            return JsonResponse({"error": "An internal error occurred."}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method."}, status=405)