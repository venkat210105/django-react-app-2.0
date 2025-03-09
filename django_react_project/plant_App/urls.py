from django.urls import path

from .views import signup

#LoginView

urlpatterns = [

    path('plant/signup/', signup, name='signup'),
    #path('login/', LoginView.as_view(), name='login'),
]
