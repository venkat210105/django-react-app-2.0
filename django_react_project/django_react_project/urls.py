from django.urls import path, include

urlpatterns = [
    path('', home, name='home'),
    path('', include('plant_App.urls')),
    
]
