from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
	CurrentUserAPI, 
	UserListAPI,
	UserProfilePicAPI,
	CustomTokenObtainPairView
)
from . import views

urlpatterns = [
	path('api/users/', UserListAPI.as_view()),
	path('api/users/<username>/profile-pic-upload/', UserProfilePicAPI.as_view()),
	
	path('api/auth/current_user/', CurrentUserAPI.as_view()),
	path('api/auth/token/obtain/', CustomTokenObtainPairView.as_view()),
    path('api/auth/token/refresh/', TokenRefreshView.as_view()),

]