from django.urls import path, include, re_path
from django.views.generic import TemplateView

urlpatterns = [
    # Include the URLs from plant_App
    path('', include('plant_App.urls')),

    # Serve index.html for all other routes (must be last)
    re_path(r'^.*$', TemplateView.as_view(template_name='index.html')),
]