from django.urls import path
from .views import CommentListAPI, GetCommentLikesAPI, GetCommentDislikesAPI
from . import views

urlpatterns = [
	# API Endpoints
	path('api/polls/<pk>/comments/', CommentListAPI.as_view()),

	path('api/users/<user_id>/polls/<poll_id>/comment-likes/', GetCommentLikesAPI.as_view()),
	path('api/users/<user_id>/polls/<poll_id>/comment-dislikes/', GetCommentDislikesAPI.as_view()),

	path('api/comments/<comment_id>/likes/', views.like_comment)
]