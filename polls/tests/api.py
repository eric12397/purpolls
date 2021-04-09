import datetime
from django.test import TestCase
from django.utils import timezone
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from polls.models import Poll, Vote, Like, Dislike
from enums.signal import Signal

User = get_user_model()

# Create your tests here.
class PollsTestCase(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create_user(
            username="BodegaCat", 
            password="IAmBodegaCat", 
            email="bodegacat@company.com"
        )
        cls.poll = Poll.objects.create(
            author=cls.user,
            question_text="Who's winning NBA MVP this year?"
        )

        choices = [
            { 'choice_text':'Giannis' },
            { 'choice_text':'Lebron' }, 
            { 'choice_text':'Embiid' }, 
            { 'choice_text':'Jokic' }, 
            { 'choice_text':'Harden' }
        ]

        for choice in choices:
            cls.poll.choice_set.create(choice_text=choice["choice_text"])

    def test_should_get_all_polls(self):
        response = self.client.get('/api/polls/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_should_create_new_poll(self):
        data = {
            "question_text": "What's your favorite sport?",
            "author": 1,
            "choices": [
                { "choice_text": "Basketball" },
                { "choice_text": "Football" },
                { "choice_text": "Baseball" },
                { "choice_text": "Soccer" }
            ]
        }
        response = self.client.post('/api/polls/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Poll.objects.count(), 2)

    def test_should_delete_poll(self):
        response = self.client.delete('/api/polls/1/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_should_vote_on_poll(self):
        data = {
            "selected_choice_id": 1,
            "user_id": 1
        }
        response = self.client.post('/api/polls/1/votes/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Vote.objects.count(), 1)

    def test_should_get_all_votes_for_specific_user(self):
        response = self.client.get('/api/users/1/votes/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_should_like_poll(self):
        data = {
            "signal": Signal.ADD_LIKE,
            "user_id": 1
        }
        response = self.client.patch('/api/polls/1/likes/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Like.objects.count(), 1)

    def test_should_get_all_likes_for_specific_user(self):
        response = self.client.get('/api/users/1/likes/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_should_dislike_poll(self):
        data = {
            "signal": Signal.ADD_DISLIKE,
            "user_id": 1
        }
        response = self.client.patch('/api/polls/1/likes/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Dislike.objects.count(), 1)

    def test_should_get_all_dislikes_for_specific_user(self):
        response = self.client.get('/api/users/1/dislikes/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        

