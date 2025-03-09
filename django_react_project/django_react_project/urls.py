from django.urls import path, include

urlpatterns = [
    path('', include('plant_App.urls')),
    path('plant/', include('plant_App.urls')),
]
