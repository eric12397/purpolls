from rest_framework import serializers
from django.contrib.auth.models import User
from djoser.serializers import UserCreateSerializer as BaseUserRegistrationSerializer
from .models import Profile
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model

User = get_user_model()


class UserRegistrationSerializer(BaseUserRegistrationSerializer):
    password = serializers.CharField(write_only=True) # not included in JSON response
    confirmed_password = serializers.CharField(write_only=True)

    class Meta(BaseUserRegistrationSerializer.Meta):
        model = User
        fields = ('id', 'email', 'username', 'password', 'confirmed_password')

    def validate(self, data):
        if data['password'] != data['confirmed_password']:
            raise serializers.ValidationError("The two password fields didn't match.")
        return data


def required(value):
    if value is None:
        raise serializers.ValidationError('This field is required')

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

    

    