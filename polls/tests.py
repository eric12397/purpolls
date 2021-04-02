import datetime
from django.test import TestCase
from django.utils import timezone
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Poll

# Create your tests here.
class MyTest(TestCase):
    fixtures = ["polls/fixtures/poll.json"]

    def test_should_get_fixture(self):
        poll = Poll.objects.get(pk=1)
        self.assertEqual(poll.question_text, "Who's winning NBA MVP this year?")
        self.assertEqual(poll.author.username, "Gordigante")
