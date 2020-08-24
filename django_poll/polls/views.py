from django.shortcuts import render, get_object_or_404
from django.template.loader import render_to_string
from .models import Poll, Choice, Vote, Like, Dislike
from django.contrib.auth.models import User
from .serializers import PollAndChoicesSerializer, ChoiceSerializer, VoteSerializer, LikeSerializer, DislikeSerializer
from django.contrib.auth.decorators import login_required
from rest_framework import permissions, status, generics
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated


class PollListAPI(generics.ListCreateAPIView):
	queryset = Poll.objects.order_by('-date_posted')
	serializer_class = PollAndChoicesSerializer


class PollDetailAPI(generics.DestroyAPIView):
	queryset = Poll.objects.all()
	serializer_class = PollAndChoicesSerializer
	lookup_url_kwarg = "poll_id"
	permission_classes = (IsAuthenticated, )


class PollVotesAPI(generics.ListAPIView):
	serializer_class = VoteSerializer

	def get_queryset(self):
		user_id = self.kwargs['user_id']
		return Vote.objects.filter(user=user_id)


class PollLikesAPI(generics.ListAPIView):
	serializer_class = LikeSerializer

	def get_queryset(self):
		user_id = self.kwargs['user_id']
		return Like.objects.filter(user=user_id)


class PollDislikesAPI(generics.ListAPIView):
	serializer_class = DislikeSerializer

	def get_queryset(self):
		user_id = self.kwargs['user_id']
		return Dislike.objects.filter(user=user_id)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def vote_poll(request, poll_id): 
	if request.method == 'POST':
		poll = Poll.objects.get(pk=poll_id)
		user = User.objects.get(pk=request.data['user_id'])

		if Vote.objects.filter(poll=poll, user=user).exists():
			return Response({ 'error': "You already voted on this poll!" })

		else: 
			selected_choice = Choice.objects.get(pk=request.data['selected_choice_id'])
			selected_choice.votes += 1
			selected_choice.save()
			vote = Vote.objects.create(poll=poll, choice=selected_choice, user=user)
			poll_serializer = PollAndChoicesSerializer(poll)
			vote_serializer = VoteSerializer(vote)
			return Response({
				'poll': poll_serializer.data,
				'vote': vote_serializer.data
			})
	
		
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def like_poll(request, poll_id):
	user = User.objects.get(pk=request.data['user_id'])
	poll = Poll.objects.get(pk=poll_id)

	if request.method == 'PATCH':
		if request.data['signal'] == 'add like':
			if not Like.objects.filter(user=user, poll=poll).exists():
				Like.objects.create(user=user, poll=poll)
				response = "Added like on Poll: " + str(poll.question_text)
			
		if request.data['signal'] == 'add like, remove dislike':
			if not Like.objects.filter(user=user, poll=poll).exists():
				Like.objects.create(user=user, poll=poll)
				Dislike.objects.get(user=user, poll=poll).delete()
				response = "Added like and removed dislike on Poll: " + str(poll.question_text)

		if request.data['signal'] == 'remove like':
			Like.objects.get(user=user, poll=poll).delete()
			response = "Removed like on Poll: " + str(poll.question_text)


		poll_serializer = PollAndChoicesSerializer(poll, data=request.data, partial=True) # set partial=True to update a data partially
		if poll_serializer.is_valid():
		    poll_serializer.save()
		    return Response({ 
		    	'response': response,
		    	'updated_likes': poll_serializer.data['likes'],
		    	'updated_dislikes': poll_serializer.data['dislikes']
		    })
		else:
			return Response(poll_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def dislike_poll(request, poll_id):
	user = User.objects.get(pk=request.data['user_id'])
	poll = Poll.objects.get(pk=poll_id)

	if request.method == 'PATCH':
		if request.data['signal'] == 'add dislike':
			if not Dislike.objects.filter(user=user, poll=poll).exists():
				Dislike.objects.create(user=user, poll=poll)
				response = "Added dislike on Poll: " + str(poll.question_text)

		if request.data['signal'] == 'add dislike, remove like':
			if not Dislike.objects.filter(user=user, poll=poll).exists():
				Dislike.objects.create(user=user, poll=poll)
				Like.objects.get(user=user, poll=poll).delete()
				response = "Added dislike and removed like on Poll: " + str(poll.question_text)

		if request.data['signal'] == 'remove dislike':
			Dislike.objects.get(user=user, poll=poll).delete()
			response = "Removed dislike on Poll: " + str(poll.question_text)


		poll_serializer = PollAndChoicesSerializer(poll, data=request.data, partial=True) # set partial=True to update a data partially
		if poll_serializer.is_valid():
			poll_serializer.save()
			return Response({
				"response": response,
				'updated_likes': poll_serializer.data['likes'],
				'updated_dislikes': poll_serializer.data['dislikes']
			})	
		else:
			return Response(poll_serializer.errors, status=status.HTTP_400_BAD_REQUEST)



	

