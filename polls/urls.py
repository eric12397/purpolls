from django.urls import path
from .views import (
	PollListAPI, 
	PollDetailAPI,
	PollVotesAPI,
	PollLikesAPI,
	PollDislikesAPI
)
from . import views

urlpatterns = [
	# API Endpoints
	path('api/polls/', PollListAPI.as_view()),
	path('api/polls/<poll_id>/', PollDetailAPI.as_view()),

	path('api/users/<user_id>/votes/', PollVotesAPI.as_view()),
	path('api/users/<user_id>/likes/', PollLikesAPI.as_view()),
	path('api/users/<user_id>/dislikes/', PollDislikesAPI.as_view()),


	path('api/polls/<poll_id>/votes/', views.vote_poll),
	path('api/polls/<poll_id>/likes/', views.like_poll)
]