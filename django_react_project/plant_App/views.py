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

# Existing endpoints (signup, login, me, predict, update_password, update_email, update_mobile)
# ...

# New Endpoints

@csrf_exempt
def update_profile_picture(request):
    if request.method == "POST":
        try:
            file = request.FILES.get("file")
            if not file:
                return JsonResponse({"error": "No file uploaded."}, status=400)

            token = request.headers.get("Authorization").split(" ")[1]
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            email = payload.get("email")

            file_path = f"profile_pictures/{email}_{file.name}"
            with open(file_path, "wb+") as destination:
                for chunk in file.chunks():
                    destination.write(chunk)

            users_collection = db.users
            users_collection.update_one(
                {"email": email},
                {"$set": {"profile_picture": file_path}},
            )

            return JsonResponse({"message": "Profile picture updated successfully!"}, status=200)
        except Exception as e:
            print(f"Error updating profile picture: {e}")
            return JsonResponse({"error": "An internal error occurred."}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method."}, status=405)

@csrf_exempt
def prediction_history(request):
    if request.method == "GET":
        try:
            token = request.headers.get("Authorization").split(" ")[1]
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            email = payload.get("email")

            predictions_collection = db.predictions
            predictions = list(predictions_collection.find({"email": email}))

            return JsonResponse({"predictions": predictions}, status=200)
        except Exception as e:
            print(f"Error fetching prediction history: {e}")
            return JsonResponse({"error": "An internal error occurred."}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method."}, status=405)

@csrf_exempt
def dashboard_stats(request):
    if request.method == "GET":
        try:
            token = request.headers.get("Authorization").split(" ")[1]
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            email = payload.get("email")

            predictions_collection = db.predictions
            total_predictions = predictions_collection.count_documents({"email": email})
            successful_predictions = predictions_collection.count_documents({"email": email, "result": "Healthy"})

            return JsonResponse({
                "total_predictions": total_predictions,
                "successful_predictions": successful_predictions,
            }, status=200)
        except Exception as e:
            print(f"Error fetching dashboard stats: {e}")
            return JsonResponse({"error": "An internal error occurred."}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method."}, status=405)

@csrf_exempt
def notifications(request):
    if request.method == "GET":
        try:
            token = request.headers.get("Authorization").split(" ")[1]
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            email = payload.get("email")

            notifications_collection = db.notifications
            notifications = list(notifications_collection.find({"email": email}))

            return JsonResponse({"notifications": notifications}, status=200)
        except Exception as e:
            print(f"Error fetching notifications: {e}")
            return JsonResponse({"error": "An internal error occurred."}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method."}, status=405)

@csrf_exempt
def support(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            message = data.get("message")

            if not message:
                return JsonResponse({"error": "Message is required."}, status=400)

            support_collection = db.support
            support_collection.insert_one({"message": message})

            return JsonResponse({"message": "Support request submitted successfully!"}, status=200)
        except Exception as e:
            print(f"Error submitting support request: {e}")
            return JsonResponse({"error": "An internal error occurred."}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method."}, status=405)

@csrf_exempt
def feedback(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            feedback = data.get("feedback")
            rating = data.get("rating")

            if not feedback or not rating:
                return JsonResponse({"error": "Feedback and rating are required."}, status=400)

            feedback_collection = db.feedback
            feedback_collection.insert_one({"feedback": feedback, "rating": rating})

            return JsonResponse({"message": "Feedback submitted successfully!"}, status=200)
        except Exception as e:
            print(f"Error submitting feedback: {e}")
            return JsonResponse({"error": "An internal error occurred."}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method."}, status=405)

@csrf_exempt
def create_post(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            title = data.get("title")
            content = data.get("content")

            if not title or not content:
                return JsonResponse({"error": "Title and content are required."}, status=400)

            posts_collection = db.posts
            posts_collection.insert_one({"title": title, "content": content})

            return JsonResponse({"message": "Post created successfully!"}, status=200)
        except Exception as e:
            print(f"Error creating post: {e}")
            return JsonResponse({"error": "An internal error occurred."}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method."}, status=405)

@csrf_exempt
def get_posts(request):
    if request.method == "GET":
        try:
            posts_collection = db.posts
            posts = list(posts_collection.find({}))

            return JsonResponse({"posts": posts}, status=200)
        except Exception as e:
            print(f"Error fetching posts: {e}")
            return JsonResponse({"error": "An internal error occurred."}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method."}, status=405)

@csrf_exempt
def educational_content(request):
    if request.method == "GET":
        try:
            content_collection = db.educational_content
            content = list(content_collection.find({}))

            return JsonResponse({"content": content}, status=200)
        except Exception as e:
            print(f"Error fetching educational content: {e}")
            return JsonResponse({"error": "An internal error occurred."}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method."}, status=405)

@csrf_exempt
def update_theme(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            theme = data.get("theme")

            if not theme:
                return JsonResponse({"error": "Theme is required."}, status=400)

            users_collection = db.users
            users_collection.update_one(
                {"email": request.user.email},
                {"$set": {"theme": theme}},
            )

            return JsonResponse({"message": "Theme updated successfully!"}, status=200)
        except Exception as e:
            print(f"Error updating theme: {e}")
            return JsonResponse({"error": "An internal error occurred."}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method."}, status=405)

@csrf_exempt
def update_language(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            language = data.get("language")

            if not language:
                return JsonResponse({"error": "Language is required."}, status=400)

            users_collection = db.users
            users_collection.update_one(
                {"email": request.user.email},
                {"$set": {"language": language}},
            )

            return JsonResponse({"message": "Language updated successfully!"}, status=200)
        except Exception as e:
            print(f"Error updating language: {e}")
            return JsonResponse({"error": "An internal error occurred."}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method."}, status=405)