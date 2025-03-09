from django.urls import path
from django.views.generic import TemplateView
from .views import signup

#LoginView

urlpatterns = [
    path('', TemplateView.as_view(template_name='index.html')),
    path('signup/', signup, name='signup'),
    #path('login/', LoginView.as_view(), name='login'),
]
