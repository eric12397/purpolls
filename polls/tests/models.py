from django.test import TestCase
from polls.models import Poll, Choice, Vote, Like, Dislike
from django.contrib.auth import get_user_model

User = get_user_model()

class PollModelTest(TestCase):
    def test_model_str(self):
        user = User.objects.create(
            username="BodegaCat", 
            password="IAmBodegaCat", 
            email="bodegacat@company.com"
        )
        poll = Poll.objects.create(question_text="Who is the GOAT?", author=user)
        self.assertEqual(str(poll), "Who is the GOAT?")
