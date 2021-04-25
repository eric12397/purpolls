from django.test import TestCase
from comments.models import Comment, CommentLike, CommentDislike
from polls.models import Poll 
from django.contrib.auth import get_user_model

User = get_user_model()

class CommentModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="BodegaCat", 
            password="IAmBodegaCat", 
            email="bodegacat@company.com"
        )

        self.poll = Poll.objects.create(question_text="Who is the GOAT?", author=self.user)

        self.comment = Comment.objects.create(
            comment_text="MJ went 6-0 in the Finals",
            author=self.user,
            poll=self.poll,
            likes=100,
            dislikes=100
        )
    
    def test_model_str(self):
        self.assertEqual(str(self.comment), "MJ went 6-0 in the Finals")

    def test_comment_text_max_length(self):
        max_length = self.comment._meta.get_field('comment_text').max_length
        self.assertEqual(max_length, 255)
    
    def test_likes_default_value(self):
        default_value = self.comment._meta.get_field('likes').default
        self.assertEqual(default_value, 0)

    def test_dislikes_default_value(self):
        default_value = self.comment._meta.get_field('dislikes').default
        self.assertEqual(default_value, 0)

    def test_deleting_poll_also_deletes_comment(self):
        self.poll.delete()
        self.assertEqual(Comment.objects.count(), 0)

    def test_deleting_user_also_deletes_comment(self):
        self.user.delete()
        self.assertEqual(Comment.objects.count(), 0)

    def test_increment_likes(self):
        self.comment.increment_likes()
        self.assertEqual(self.comment.likes, 101)

    def test_decrement_likes(self):
        self.comment.decrement_likes()
        self.assertEqual(self.comment.likes, 99)

    def test_increment_dislikes(self):
        self.comment.increment_dislikes()
        self.assertEqual(self.comment.dislikes, 101)

    def test_decrement_dislikes(self):
        self.comment.decrement_dislikes()
        self.assertEqual(self.comment.dislikes, 99)

    def test_increment_likes_and_decrement_dislikes(self):
        self.comment.increment_likes_and_decrement_dislikes()
        self.assertEqual(self.comment.likes, 101)
        self.assertEqual(self.comment.dislikes, 99)

    def test_increment_dislikes_and_decrement_likes(self):
        self.comment.increment_dislikes_and_decrement_likes()
        self.assertEqual(self.comment.likes, 99)
        self.assertEqual(self.comment.dislikes, 101)


class CommentLikeModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="BodegaCat", 
            password="IAmBodegaCat", 
            email="bodegacat@company.com"
        )

        self.poll = Poll.objects.create(question_text="Who is the GOAT?", author=self.user)

        self.comment = Comment.objects.create(
            comment_text="MJ went 6-0 in the Finals",
            author=self.user,
            poll=self.poll
        )

        self.comment_like = CommentLike.objects.create(
            comment=self.comment,
            user=self.user,
            poll=self.poll
        )
    
    def test_model_str(self):
        self.assertEqual(str(self.comment_like), "BodegaCat liked Comment: MJ went 6-0 in the Finals")

    def test_deleting_comment_also_deletes_comment_like(self):
        self.comment.delete()
        self.assertEqual(CommentLike.objects.count(), 0)

    def test_deleting_poll_also_deletes_comment_like(self):
        self.poll.delete()
        self.assertEqual(CommentLike.objects.count(), 0)

    def test_deleting_user_also_deletes_comment_like(self):
        self.user.delete()
        self.assertEqual(CommentLike.objects.count(), 0)


class CommentDislikeModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="BodegaCat", 
            password="IAmBodegaCat", 
            email="bodegacat@company.com"
        )

        self.poll = Poll.objects.create(question_text="Who is the GOAT?", author=self.user)

        self.comment = Comment.objects.create(
            comment_text="MJ went 6-0 in the Finals",
            author=self.user,
            poll=self.poll
        )

        self.comment_dislike = CommentDislike.objects.create(
            comment=self.comment,
            user=self.user,
            poll=self.poll
        )
    
    def test_model_str(self):
        self.assertEqual(str(self.comment_dislike), "BodegaCat disliked Comment: MJ went 6-0 in the Finals")
    
    def test_deleting_comment_also_deletes_comment_dislike(self):
        self.comment.delete()
        self.assertEqual(CommentDislike.objects.count(), 0)

    def test_deleting_poll_also_deletes_comment_dislike(self):
        self.poll.delete()
        self.assertEqual(CommentDislike.objects.count(), 0)

    def test_deleting_user_also_deletes_comment_dislike(self):
        self.user.delete()
        self.assertEqual(CommentDislike.objects.count(), 0)
