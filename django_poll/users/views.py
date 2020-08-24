from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.decorators import login_required # decorator
from .forms import RegisterForm, ProfileUpdateForm
from .models import Profile
from django.contrib.auth.models import User
from rest_framework import permissions, status, generics
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import UserSerializer, CreateUserSerializer, CustomTokenObtainPairSerializer, ProfilePicSerializer


class CustomTokenObtainPairView(TokenObtainPairView):
	serializer_class = CustomTokenObtainPairSerializer
 
 
class CurrentUserAPI(APIView):
	permission_classes = (IsAuthenticated, )

	def get(self, request):
		serializer = UserSerializer(request.user)
		return Response(serializer.data)


class UserListAPI(generics.ListAPIView):
	serializer_class = UserSerializer
	queryset = User.objects.all()


class RegistrationAPI(APIView):

	def post(self, request, format=None):
		print(request.data)
		serializer = CreateUserSerializer(data=request.data)
		if serializer.is_valid():
			serializer.save()
			print(serializer.data)
			return Response(serializer.data, status=status.HTTP_201_CREATED)
		else:
			print(serializer.errors)
			return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserProfilePicAPI(APIView):
	parser_classes = (MultiPartParser, FormParser)
	permission_classes = (IsAuthenticated, )

	def get(self, request, *args, **kwargs):
		user = User.objects.get(username=self.kwargs['username'])
		profile_pic = Profile.objects.get(user=user)
		serializer = ProfilePicSerializer(profile_pic)
		return Response(serializer.data)

	def put(self, request,  *args, **kwargs):
		user = User.objects.get(username=self.kwargs['username'])
		profile_pic = Profile.objects.get(user=user)
		serializer = ProfilePicSerializer(profile_pic, data=request.data)
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
