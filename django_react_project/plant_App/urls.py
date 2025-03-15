from django.urls import path
from django.views.generic import TemplateView
from .views import signup, login, me, predict, update_password, update_email, update_mobile

urlpatterns = [
    #path('', TemplateView.as_view(template_name='index.html')),
    path('signup/', signup, name='signup'),
    path('login/', login, name='login'),
    path('me', me, name='me'),
    path('predict/', predict, name='predict'),
    path('update-password/', update_password, name='update-password'),
    path('update-email/', update_email, name='update-email'),
    path('update-mobile/', update_mobile, name='update-mobile'),
]