from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from comments.models import Comment, CommentLike, CommentDislike
from polls.models import Poll
from enums.signal import Signal

User = get_user_model()

class GetAllCommentsForPollTest(APITestCase):
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

        cls.comment = Comment.objects.create(
            comment_text="Joel Embiid deserves it!",
            author=cls.user,
            poll=cls.poll
        )
    
    def test_should_get_all_comments_for_specific_poll(self):
        response = self.client.get('/api/polls/1/comments/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Comment.objects.count(), 1)


class CreateCommentTest(APITestCase):
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
            "comment_text": "Joel Embiid deserves it!",
            "author": 1,
            "poll_id": 1
        }

        cls.invalid_data = {
            "comment_text": "",
            "author": 1,
            "poll_id": 1
        }
    
    def test_should_create_comment_for_specific_poll(self):
        response = self.client.post('/api/polls/1/comments/', self.valid_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Comment.objects.count(), 1)

    def test_should_fail_to_create_comment_for_specific_poll(self):
        response = self.client.post('/api/polls/1/comments/', self.invalid_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Comment.objects.count(), 0)


class GetAllCommentLikesForUserTest(APITestCase):
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

        cls.comment = Comment.objects.create(
            comment_text="Joel Embiid deserves it!",
            author=cls.user,
            poll=cls.poll
        )

        cls.comment_like = CommentLike.objects.create(
            comment=cls.comment,
            poll=cls.poll,
            user=cls.user
        )

    def test_should_get_all_comment_likes_for_specific_user(self):
        response = self.client.get('/api/users/1/polls/1/comment-likes/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(CommentLike.objects.count(), 1)


class CreateCommentLikeTest(APITestCase):
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

        cls.comment = Comment.objects.create(
            comment_text="Joel Embiid deserves it!",
            author=cls.user,
            poll=cls.poll,
            likes=100
        )

        cls.valid_data = {
            "signal": Signal.ADD_LIKE,
            "user_id": 1,
            "poll_id": 1
        }

        cls.invalid_data_poll_id = {
            "signal": Signal.ADD_LIKE,
            "user_id": 1,
            "poll_id": 30
        }

        cls.invalid_data_user_id = {
            "signal": Signal.ADD_LIKE,
            "user_id": 30,
            "poll_id": 1
        }

    def test_should_create_like_and_increment_like_counter(self):
        response = self.client.post('/api/comments/1/likes/', self.valid_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(CommentLike.objects.count(), 1)
        self.assertEqual(Comment.objects.get(pk=1).likes, 101)

    def test_should_fail_to_create_like_with_invalid_comment_id(self):
        response = self.client.post('/api/comments/1000/likes/', self.valid_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(CommentLike.objects.count(), 0)
        self.assertEqual(Comment.objects.get(pk=1).likes, 100)

    def test_should_fail_to_create_like_with_invalid_poll_id(self):
        response = self.client.post('/api/comments/1/likes/', self.invalid_data_poll_id, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(CommentLike.objects.count(), 0)
        self.assertEqual(Comment.objects.get(pk=1).likes, 100)

    def test_should_fail_to_create_like_with_invalid_user_id(self):
        response = self.client.post('/api/comments/1/likes/', self.invalid_data_user_id, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(CommentLike.objects.count(), 0)
        self.assertEqual(Comment.objects.get(pk=1).likes, 100)


class DeleteCommentLikeTest(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create_user(
            username="BodegaCat", 
            password="IAmBodegaCat", 
            email="bodegacat@company.com"
        )

        cls.poll = Poll.objects.create(
            author=cls.user,
            question_text="Who's winning NBA MVP this year?",
        )

        cls.comment = Comment.objects.create(
            comment_text="Joel Embiid deserves it!",
            author=cls.user,
            poll=cls.poll,
            likes=100,
            dislikes=100
        )

        cls.comment_like = CommentLike.objects.create(
            comment=cls.comment,
            poll=cls.poll,
            user=cls.user,
        )

        cls.remove_like_data = {
            "signal": Signal.REMOVE_LIKE,
            "user_id": 1,
            "poll_id": 1,
        }

        cls.add_dislike_and_remove_like_data = {
            "signal": Signal.ADD_DISLIKE_AND_REMOVE_LIKE,
            "user_id": 1,
            "poll_id": 1
        }

    def test_should_delete_existing_like_and_decrement_like_counter(self):
        response = self.client.post('/api/comments/1/likes/', self.remove_like_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        comment = Comment.objects.get(pk=1)
        self.assertEqual(CommentLike.objects.count(), 0)
        self.assertEqual(comment.likes, 99)
        self.assertEqual(CommentDislike.objects.count(), 0)
        self.assertEqual(comment.dislikes, 100)

    def test_should_delete_existing_like_and_decrement_like_counter_by_creating_dislike(self):
        response = self.client.post('/api/comments/1/likes/', self.add_dislike_and_remove_like_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        comment = Comment.objects.get(pk=1)
        self.assertEqual(CommentLike.objects.count(), 0)
        self.assertEqual(comment.likes, 99)
        self.assertEqual(CommentDislike.objects.count(), 1)
        self.assertEqual(comment.dislikes, 101)


class GetAllCommentDislikesForUserTest(APITestCase):
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

        cls.comment = Comment.objects.create(
            comment_text="Joel Embiid deserves it!",
            author=cls.user,
            poll=cls.poll
        )

        cls.comment_dislike = CommentDislike.objects.create(
            comment=cls.comment,
            poll=cls.poll,
            user=cls.user
        )

    def test_should_get_all_comment_likes_for_specific_user(self):
        response = self.client.get('/api/users/1/polls/1/comment-dislikes/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(CommentDislike.objects.count(), 1)


class CreateCommentDislikeTest(APITestCase):
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

        cls.comment = Comment.objects.create(
            comment_text="Joel Embiid deserves it!",
            author=cls.user,
            poll=cls.poll,
            dislikes=100
        )

        cls.valid_data = {
            "signal": Signal.ADD_DISLIKE,
            "user_id": 1,
            "poll_id": 1
        }

        cls.invalid_data_poll_id = {
            "signal": Signal.ADD_DISLIKE,
            "user_id": 1,
            "poll_id": 30
        }

        cls.invalid_data_user_id = {
            "signal": Signal.ADD_DISLIKE,
            "user_id": 30,
            "poll_id": 1
        }

    def test_should_create_dislike_and_increment_dislike_counter(self):
        response = self.client.post('/api/comments/1/likes/', self.valid_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(CommentDislike.objects.count(), 1)
        self.assertEqual(Comment.objects.get(pk=1).dislikes, 101)
    
    def test_should_fail_to_create_dislike_with_invalid_comment_id(self):
        response = self.client.post('/api/comments/1000/likes/', self.valid_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(CommentDislike.objects.count(), 0)
        self.assertEqual(Comment.objects.get(pk=1).dislikes, 100)

    def test_should_fail_to_create_dislike_with_invalid_poll_id(self):
        response = self.client.post('/api/comments/1/likes/', self.invalid_data_poll_id, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(CommentDislike.objects.count(), 0)
        self.assertEqual(Comment.objects.get(pk=1).dislikes, 100)

    def test_should_fail_to_create_dislike_with_invalid_user_id(self):
        response = self.client.post('/api/comments/1/likes/', self.invalid_data_user_id, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(CommentDislike.objects.count(), 0)
        self.assertEqual(Comment.objects.get(pk=1).dislikes, 100)


class DeleteCommentDislikeTest(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create_user(
            username="BodegaCat", 
            password="IAmBodegaCat", 
            email="bodegacat@company.com"
        )

        cls.poll = Poll.objects.create(
            author=cls.user,
            question_text="Who's winning NBA MVP this year?",
        )

        cls.comment = Comment.objects.create(
            comment_text="Joel Embiid deserves it!",
            author=cls.user,
            poll=cls.poll,
            likes=100,
            dislikes=100
        )

        cls.comment_dislike = CommentDislike.objects.create(
            comment=cls.comment,
            poll=cls.poll,
            user=cls.user,
        )

        cls.remove_dislike_data = {
            "signal": Signal.REMOVE_DISLIKE,
            "user_id": 1,
            "poll_id": 1,
        }

        cls.add_like_and_remove_dislike_data = {
            "signal": Signal.ADD_LIKE_AND_REMOVE_DISLIKE,
            "user_id": 1,
            "poll_id": 1
        }

    def test_should_delete_existing_dislike_and_decrement_dislike_counter(self):
        response = self.client.post('/api/comments/1/likes/', self.remove_dislike_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        comment = Comment.objects.get(pk=1)
        self.assertEqual(CommentDislike.objects.count(), 0)
        self.assertEqual(comment.dislikes, 99)
        self.assertEqual(CommentLike.objects.count(), 0)
        self.assertEqual(comment.likes, 100)

    def test_should_delete_existing_dislike_and_decrement_dislike_counter_by_creating_like(self):
        response = self.client.post('/api/comments/1/likes/', self.add_like_and_remove_dislike_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        comment = Comment.objects.get(pk=1)
        self.assertEqual(CommentDislike.objects.count(), 0)
        self.assertEqual(comment.dislikes, 99)
        self.assertEqual(CommentLike.objects.count(), 1)
        self.assertEqual(comment.likes, 101)