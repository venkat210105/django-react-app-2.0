from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django_react_project.settings import db  # Import the MongoDB connection
import json
from django.contrib.auth.hashers import make_password

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
            if not name:
                return JsonResponse({"error": "Name is required."}, status=400)
            if not email:
                return JsonResponse({"error": "Email is required."}, status=400)
            if not phone:
                return JsonResponse({"error": "Phone number is required."}, status=400)
            if not password:
                return JsonResponse({"error": "Password is required."}, status=400)
            if not confirm_password:
                return JsonResponse({"error": "Confirm password is required."}, status=400)
            if password != confirm_password:
                return JsonResponse({"error": "Passwords do not match."}, status=400)

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
                "password": make_password(password),  # Hash the password
            }
            users_collection.insert_one(user)

            return JsonResponse({"message": "User created successfully!"}, status=201)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON."}, status=400)
        except Exception as e:
            # Log the exception for debugging
            print(f"Error during signup: {e}")
            return JsonResponse({"error": "An internal error occurred."}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method."}, status=405)