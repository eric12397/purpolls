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


class ChoiceModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create(
            username="BodegaCat", 
            password="IAmBodegaCat", 
            email="bodegacat@company.com"
        )

        cls.poll = Poll.objects.create(question_text="Who is the GOAT?", author=cls.user)

        cls.choice_1 = Choice.objects.create(
            poll=cls.poll,
            choice_text="Michael Jordan",
            votes=3
        )

        cls.choice_2 = Choice.objects.create(
            poll=cls.poll,
            choice_text="Lebron James",
            votes=2
        )

    def test_model_str(self):
        self.assertEqual(str(self.choice_1), "Michael Jordan")
        self.assertEqual(str(self.choice_2), "Lebron James")

    def test_get_percent(self):
        self.assertEqual(self.choice_1.get_percent(), 60)
        self.assertEqual(self.choice_2.get_percent(), 40)


class VoteModelTest(TestCase):
    def test_model_str(self):
        user = User.objects.create(
            username="BodegaCat", 
            password="IAmBodegaCat", 
            email="bodegacat@company.com"
        )

        poll = Poll.objects.create(question_text="Who is the GOAT?", author=user)

        choice_1 = Choice.objects.create(
            poll=poll,
            choice_text="Michael Jordan",
            votes=2
        )

        vote = Vote.objects.create(
            poll=poll,
            user=user,
            choice=choice_1
        )

        self.assertEqual(str(vote), "BodegaCat voted on Poll: Who is the GOAT?")


class LikeModelTest(TestCase):
    def test_model_str(self):
        user = User.objects.create(
            username="BodegaCat", 
            password="IAmBodegaCat", 
            email="bodegacat@company.com"
        )

        poll = Poll.objects.create(question_text="Who is the GOAT?", author=user)

        like = Like.objects.create(
            poll=poll,
            user=user
        )

        self.assertEqual(str(like), "BodegaCat liked Poll: Who is the GOAT?")


class DislikeModelTest(TestCase):
    def test_model_str(self):
        user = User.objects.create(
            username="BodegaCat", 
            password="IAmBodegaCat", 
            email="bodegacat@company.com"
        )

        poll = Poll.objects.create(question_text="Who is the GOAT?", author=user)

        dislike = Dislike.objects.create(
            poll=poll,
            user=user
        )

        self.assertEqual(str(dislike), "BodegaCat disliked Poll: Who is the GOAT?")

