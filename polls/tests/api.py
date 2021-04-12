import datetime
from django.test import TestCase
from django.utils import timezone
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from polls.models import Poll, Choice, Vote, Like, Dislike
from enums.signal import Signal

User = get_user_model()

# Create your tests here.
class GetAllPollsTest(APITestCase):
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

        choices = [{ 'choice_text':'Giannis' },{ 'choice_text':'Lebron' }]
        for choice in choices:
            cls.poll.choice_set.create(choice_text=choice["choice_text"])

    def test_should_get_all_polls(self):
        response = self.client.get('/api/polls/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Poll.objects.count(), 1)


class CreatePollTest(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create_user(
            username="BodegaCat", 
            password="IAmBodegaCat", 
            email="bodegacat@company.com"
        )

        cls.valid_data = {
            "question_text": "What's your favorite sport?",
            "author": 1,
            "choices": [
                { "choice_text": "Basketball" },
                { "choice_text": "Football" },
                { "choice_text": "Baseball" },
                { "choice_text": "Soccer" }
            ]
        }

        cls.invalid_data = {
            "question_text": "",
            "author": 1,
            "choices": [
                { "choice_text": "Basketball" },
                { "choice_text": "Football" },
                { "choice_text": "Baseball" },
                { "choice_text": "Soccer" }
            ]
        }

    def test_should_create_new_poll_and_choices(self):
        response = self.client.post('/api/polls/', self.valid_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Poll.objects.count(), 1)
        self.assertEqual(Choice.objects.count(), 4)

    def test_should_fail_to_create_new_poll_and_choices(self):
        response = self.client.post('/api/polls/', self.invalid_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Poll.objects.count(), 0)
        self.assertEqual(Choice.objects.count(), 0)


class DeletePollTest(APITestCase):
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

        choices = [{ 'choice_text':'Giannis' },{ 'choice_text':'Lebron' }]
        for choice in choices:
            cls.poll.choice_set.create(choice_text=choice["choice_text"])
    
    def test_should_delete_poll(self):
        response = self.client.delete('/api/polls/1/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Poll.objects.count(), 0)

    def test_should_fail_to_delete_poll(self):
        response = self.client.delete('/api/polls/1000/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(Poll.objects.count(), 1)


class GetAllVotesForUserTest(APITestCase):
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

        choices = [{ 'choice_text':'Giannis' },{ 'choice_text':'Lebron' }]
        for choice in choices:
            cls.poll.choice_set.create(choice_text=choice["choice_text"])

        cls.giannis_vote = Vote.objects.create(
            poll=cls.poll,
            user=cls.user,
            choice=cls.poll.choice_set.all()[0]
        )
    
    def test_should_get_all_votes_for_specific_user(self):
        response = self.client.get('/api/users/1/votes/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Vote.objects.count(), 1)


class CreateVoteTest(APITestCase):
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

        choices = [{ 'choice_text':'Giannis' },{ 'choice_text':'Lebron' }]
        for choice in choices:
            cls.poll.choice_set.create(choice_text=choice["choice_text"])

        cls.valid_data = { "selected_choice_id": 1, "user_id": 1 }

        cls.invalid_data_user = { "selected_choice_id": 1, "user_id": 30 }

        cls.invalid_data_choice = { "selected_choice_id": 30, "user_id": 1 }
    
    def test_should_create_vote(self):
        response = self.client.post('/api/polls/1/votes/', self.valid_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Vote.objects.count(), 1)
        self.assertEqual(Choice.objects.get(choice_text="Giannis").votes, 1)

    def test_should_fail_to_create_vote_with_invalid_poll_id(self):
        response = self.client.post('/api/polls/1000/votes/', self.valid_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(Vote.objects.count(), 0)

    def test_should_fail_to_create_vote_with_invalid_user_id(self):
        response = self.client.post('/api/polls/1/votes/', self.invalid_data_user, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(Vote.objects.count(), 0)

    def test_should_fail_to_create_vote_with_invalid_choice_id(self):
        response = self.client.post('/api/polls/1/votes/', self.invalid_data_choice, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(Vote.objects.count(), 0)


class DuplicateVoteTest(APITestCase):
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

        choices = [{ 'choice_text':'Giannis' },{ 'choice_text':'Lebron' }]
        for choice in choices:
            cls.poll.choice_set.create(choice_text=choice["choice_text"])

        cls.giannis_vote = Vote.objects.create(
            poll=cls.poll,
            user=cls.user,
            choice=cls.poll.choice_set.all()[0]
        )

        cls.data = { "selected_choice_id": 1, "user_id": 1 }

    def test_should_fail_to_create_vote_for_same_choice(self):
        response = self.client.post('/api/polls/1/votes/', self.data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        

class GetAllLikesForUserTest(APITestCase):
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

        cls.like = Like.objects.create(
            poll=cls.poll,
            user=cls.user
        )

    def test_should_get_all_likes_for_specific_user(self):
        response = self.client.get('/api/users/1/likes/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Like.objects.count(), 1)


class CreateLikeTest(APITestCase):
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

        cls.valid_data = {
            "signal": Signal.ADD_LIKE,
            "user_id": 1
        }

        cls.invalid_data = {
            "signal": Signal.ADD_LIKE,
            "user_id": 30
        }

    def test_should_create_like(self):
        response = self.client.patch('/api/polls/1/likes/', self.valid_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Like.objects.count(), 1)
        self.assertEqual(Poll.objects.get(pk=1).likes, 1)

    def test_should_fail_to_create_like_with_invalid_poll_id(self):
        response = self.client.patch('/api/polls/1000/likes/', self.valid_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(Like.objects.count(), 0)

    def test_should_fail_to_create_like_with_invalid_user_id(self):
        response = self.client.patch('/api/polls/1/likes/', self.invalid_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(Like.objects.count(), 0)


class GetAllDislikesForUserTest(APITestCase):
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

        cls.dislike = Dislike.objects.create(
            poll=cls.poll,
            user=cls.user
        )

    def test_should_get_all_dislikes_for_specific_user(self):
        response = self.client.get('/api/users/1/dislikes/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Dislike.objects.count(), 1)


class CreateDislikeTest(APITestCase):
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

        cls.valid_data = {
            "signal": Signal.ADD_DISLIKE,
            "user_id": 1
        }

        cls.invalid_data = {
            "signal": Signal.ADD_DISLIKE,
            "user_id": 30
        }

    def test_should_create_dislike(self):
        response = self.client.patch('/api/polls/1/likes/', self.valid_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Dislike.objects.count(), 1)

    def test_should_fail_to_create_dislike_with_invalid_poll_id(self):
        response = self.client.patch('/api/polls/1000/likes/', self.valid_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(Like.objects.count(), 0)

    def test_should_fail_to_create_dislike_with_invalid_user_id(self):
        response = self.client.patch('/api/polls/1/likes/', self.invalid_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(Like.objects.count(), 0)


# class LikeAndDislikeCountersTest(self):