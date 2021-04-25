from django.test import TestCase
from polls.models import Poll, Choice, Vote, Like, Dislike
from django.contrib.auth import get_user_model

User = get_user_model()

class PollModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="BodegaCat", 
            password="IAmBodegaCat", 
            email="bodegacat@company.com"
        )

        self.poll = Poll.objects.create(
            question_text="Who is the GOAT?", 
            author=self.user,
            likes=100,
            dislikes=100
        )

    def test_model_str(self):
        self.assertEqual(str(self.poll), "Who is the GOAT?")

    def test_question_text_verbose_name(self):
        poll = Poll.objects.get(pk=1)
        verbose_name = poll._meta.get_field('question_text').verbose_name
        self.assertEqual(verbose_name, 'Question')

    def test_question_text_max_length(self):
        poll = Poll.objects.get(pk=1)
        max_length = poll._meta.get_field('question_text').max_length
        self.assertEqual(max_length, 200)
        
    def test_likes_default_value(self):
        poll = Poll.objects.get(pk=1)
        default_value = poll._meta.get_field('likes').default
        self.assertEqual(default_value, 0)

    def test_dislikes_default_value(self):
        poll = Poll.objects.get(pk=1)
        default_value = poll._meta.get_field('dislikes').default
        self.assertEqual(default_value, 0)

    def test_deleting_user_also_deletes_poll(self):
        self.user.delete()
        self.assertEqual(Poll.objects.count(), 0)

    def test_increment_likes(self):
        self.poll.increment_likes()
        self.assertEqual(self.poll.likes, 101)

    def test_decrement_likes(self):
        self.poll.decrement_likes()
        self.assertEqual(self.poll.likes, 99)

    def test_increment_dislikes(self):
        self.poll.increment_dislikes()
        self.assertEqual(self.poll.dislikes, 101)

    def test_decrement_dislikes(self):
        self.poll.decrement_dislikes()
        self.assertEqual(self.poll.dislikes, 99)

    def test_increment_likes_and_decrement_dislikes(self):
        self.poll.increment_likes_and_decrement_dislikes()
        self.assertEqual(self.poll.likes, 101)
        self.assertEqual(self.poll.dislikes, 99)

    def test_increment_dislikes_and_decrement_likes(self):
        self.poll.increment_dislikes_and_decrement_likes()
        self.assertEqual(self.poll.likes, 99)
        self.assertEqual(self.poll.dislikes, 101)


class ChoiceModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="BodegaCat", 
            password="IAmBodegaCat", 
            email="bodegacat@company.com"
        )

        self.poll = Poll.objects.create(question_text="Who is the GOAT?", author=self.user)

        self.choice_1 = Choice.objects.create(
            poll=self.poll,
            choice_text="Michael Jordan",
            votes=3
        )

        self.choice_2 = Choice.objects.create(
            poll=self.poll,
            choice_text="Lebron James",
            votes=2
        )

        self.choice_3 = Choice.objects.create(
            poll=self.poll,
            choice_text="Joel Embiid",
            votes=0
        )

    def test_model_str(self):
        self.assertEqual(str(self.choice_1), "Michael Jordan")
        self.assertEqual(str(self.choice_2), "Lebron James")
        self.assertNotEqual(str(self.choice_3), "Lebron James")
        
    def test_choice_text_verbose_name(self):
        verbose_name = self.choice_1._meta.get_field('choice_text').verbose_name
        self.assertEqual(verbose_name, 'Choice')

    def test_choice_text_max_length(self):
        max_length = self.choice_1._meta.get_field('choice_text').max_length
        self.assertEqual(max_length, 200)

    def test_votes_default_value(self):
        default_value = self.choice_1._meta.get_field('votes').default
        self.assertEqual(default_value, 0)

    def test_deleting_poll_also_deletes_choices(self):
        self.poll.delete()
        self.assertEqual(Choice.objects.count(), 0)

    def test_get_percent_returns_correct_values(self):
        self.assertEqual(self.choice_1.get_percent(), 60)
        self.assertEqual(self.choice_2.get_percent(), 40)
        self.assertEqual(self.choice_3.get_percent(), 0)

    def test_increment_votes(self):
        self.choice_1.increment_votes()
        self.assertEqual(self.choice_1.votes, 4)
        self.assertEqual(self.choice_2.votes, 2)
        self.assertEqual(self.choice_3.votes, 0)

        self.choice_2.increment_votes()
        self.assertEqual(self.choice_1.votes, 4)
        self.assertEqual(self.choice_2.votes, 3)
        self.assertEqual(self.choice_3.votes, 0)

        self.choice_3.increment_votes()
        self.assertEqual(self.choice_1.votes, 4)
        self.assertEqual(self.choice_2.votes, 3)
        self.assertEqual(self.choice_3.votes, 1)

        self.choice_1.increment_votes()
        self.assertEqual(self.choice_1.votes, 5)
        self.assertEqual(self.choice_2.votes, 3)
        self.assertEqual(self.choice_3.votes, 1)

        
class VoteModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create(
            username="BodegaCat", 
            password="IAmBodegaCat", 
            email="bodegacat@company.com"
        )

        self.poll = Poll.objects.create(question_text="Who is the GOAT?", author=self.user)

        self.choice_1 = Choice.objects.create(
            poll=self.poll,
            choice_text="Michael Jordan",
            votes=2
        )

        self.vote = Vote.objects.create(
            poll=self.poll,
            user=self.user,
            choice=self.choice_1
        )

    def test_model_str(self):
        self.assertEqual(str(self.vote), "BodegaCat voted on Poll: Who is the GOAT?")

    def test_deleting_poll_also_deletes_vote(self):
        self.poll.delete()
        self.assertEqual(Vote.objects.count(), 0)

    def test_deleting_choice_also_deletes_vote(self):
        self.choice_1.delete()
        self.assertEqual(Vote.objects.count(), 0)

    def test_deleting_user_also_deletes_vote(self):
        self.user.delete()
        self.assertEqual(Vote.objects.count(), 0)


class LikeModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create(
            username="BodegaCat", 
            password="IAmBodegaCat", 
            email="bodegacat@company.com"
        )

        self.poll = Poll.objects.create(question_text="Who is the GOAT?", author=self.user)

        self.like = Like.objects.create(
            poll=self.poll,
            user=self.user
        )

    def test_model_str(self):
        self.assertEqual(str(self.like), "BodegaCat liked Poll: Who is the GOAT?")

    def test_deleting_poll_also_deletes_like(self):
        self.poll.delete()
        self.assertEqual(Like.objects.count(), 0)

    def test_deleting_user_also_deletes_like(self):
        self.user.delete()
        self.assertEqual(Like.objects.count(), 0)


class DislikeModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create(
            username="BodegaCat", 
            password="IAmBodegaCat", 
            email="bodegacat@company.com"
        )

        self.poll = Poll.objects.create(question_text="Who is the GOAT?", author=self.user)

        self.dislike = Dislike.objects.create(
            poll=self.poll,
            user=self.user
        )

    def test_model_str(self):
        self.assertEqual(str(self.dislike), "BodegaCat disliked Poll: Who is the GOAT?")

    def test_deleting_poll_also_deletes_like(self):
        self.poll.delete()
        self.assertEqual(Dislike.objects.count(), 0)

    def test_deleting_user_also_deletes_like(self):
        self.user.delete()
        self.assertEqual(Dislike.objects.count(), 0)

