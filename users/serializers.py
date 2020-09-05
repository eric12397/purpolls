from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


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


class CreateUserSerializer(serializers.ModelSerializer): 
    password = serializers.CharField(write_only=True) # not included in JSON response
    email = serializers.EmailField(validators=[required])

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'date_joined', 'password')

    def create(self, validated_data):
        user = User.objects.create(email=validated_data['email'], 
                                   username=validated_data['username'])
        user.set_password(validated_data['password']) # password gets hashed
        user.save()
        return user


class ProfilePicSerializer(serializers.ModelSerializer):

    class Meta: 
        model = Profile
        fields = ('image',)

    

    