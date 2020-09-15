from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super(CustomTokenObtainPairSerializer, self).validate(attrs)
        data.update({ 'id': self.user.id })
        data.update({ 'username': self.user.username })
        data.update({ 'email': self.user.email })
        return data 


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'date_joined')


class ProfilePicSerializer(serializers.ModelSerializer):

    class Meta: 
        model = Profile
        fields = ('image',)

    

    