from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model

User = get_user_model()

class GetAllUsersTest(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create_user(
            username="BodegaCat", 
            password="IAmBodegaCat", 
            email="bodegacat@company.com"
        )

    def test_should_get_all_users(self):
        response = self.client.get('/api/users/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(User.objects.count(), 1)


class LoginUserTest(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create_user(
            username="BodegaCat", 
            password="IAmBodegaCat", 
            email="bodegacat@company.com"
        )

        cls.valid_credentials = {
            "email": "bodegacat@company.com",
            "password": "IAmBodegaCat"
        }

        cls.invalid_credentials_email = {
            "email": "INVALID",
            "password": "IAmBodegaCat"
        }

        cls.invalid_credentials_password = {
            "email": "bodegacat@company.com",
            "password": "INVALID"
        }

    def test_should_login_user(self):
        response = self.client.post('/api/auth/token/obtain/', self.valid_credentials, format="json")
        print(response.data['access'])
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_should_fail_to_login_user_without_valid_email(self):
        response = self.client.post('/api/auth/token/obtain/', self.invalid_credentials_email, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_should_fail_to_login_user_without_valid_password(self):
        response = self.client.post('/api/auth/token/obtain/', self.invalid_credentials_password, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class RegisterNewUserTest(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.valid_credentials = {
            "username": "BodegaCat", 
            "email": "bodegacat@company.com",
            "password": "password321",
            "confirmed_password": "password321"
        }

        cls.invalid_credentials_username = {
            "username": "", 
            "email": "bodegacat@company.com",
            "password": "password321",
            "confirmed_password": "password321"
        }

        cls.invalid_credentials_email = {
            "username": "BodegaCat", 
            "email": "",
            "password": "password321",
            "confirmed_password": "password321"
        }

        cls.invalid_credentials_password = {
            "username": "BodegaCat", 
            "email": "bodegacat@company.com",
            "password": "",
            "confirmed_password": ""
        }

    def test_should_register_new_user(self):
        response = self.client.post('/api/auth/users/', self.valid_credentials, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)

    def test_should_fail_to_register_new_user_without_username(self):
        response = self.client.post('/api/auth/users/', self.invalid_credentials_username, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(), 0)

    def test_should_fail_to_register_new_user_without_email(self):
        response = self.client.post('/api/auth/users/', self.invalid_credentials_email, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(), 0)

    def test_should_fail_to_register_new_user_without_passwords(self):
        response = self.client.post('/api/auth/users/', self.invalid_credentials_password, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(), 0)

    
