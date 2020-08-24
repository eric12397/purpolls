from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
	CurrentUserAPI, 
	UserListAPI,
	UserProfilePicAPI,
	RegistrationAPI, 
	CustomTokenObtainPairView
)
from . import views

urlpatterns = [
	path('api/users/', UserListAPI.as_view()),
	path('api/users/<username>/profile-pic-upload/', UserProfilePicAPI.as_view()),
	path('api/current_user/', CurrentUserAPI.as_view()),
    path('api/register/', RegistrationAPI.as_view()),
	path('api/token/obtain/', CustomTokenObtainPairView.as_view()),
    path('api/token/refresh/', TokenRefreshView.as_view()),

]