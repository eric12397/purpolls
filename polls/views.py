from .models import Poll, Choice, Vote, Like, Dislike
from .serializers import PollAndChoicesSerializer, ChoiceSerializer, VoteSerializer, LikeSerializer, DislikeSerializer
from enums.signal import Signal
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model

User = get_user_model()

class PollListAPI(generics.ListCreateAPIView):
	queryset = Poll.objects.order_by('-date_posted')
	serializer_class = PollAndChoicesSerializer


class PollDetailAPI(generics.DestroyAPIView):
	queryset = Poll.objects.all()
	serializer_class = PollAndChoicesSerializer
	lookup_url_kwarg = "poll_id"
	#permission_classes = (IsAuthenticated, )


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
#@permission_classes([IsAuthenticated])
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
#@permission_classes([IsAuthenticated])
def like_poll(request, poll_id):
	user = User.objects.get(pk=request.data['user_id'])
	poll = Poll.objects.get(pk=poll_id)

	if request.data['signal'] == Signal.ADD_LIKE: #enum
		Like.objects.create(user=user, poll=poll)
		poll.likes += 1
		poll.save()
		msg = "Added like on Poll: " + str(poll.question_text)
		
	elif request.data['signal'] == Signal.ADD_LIKE_AND_REMOVE_DISLIKE:
		Like.objects.create(user=user, poll=poll)
		Dislike.objects.get(user=user, poll=poll).delete()
		poll.likes += 1
		poll.dislikes -= 1
		poll.save()
		msg = "Added like and removed dislike on Poll: " + str(poll.question_text)

	elif request.data['signal'] == Signal.REMOVE_LIKE:
		Like.objects.get(user=user, poll=poll).delete()
		poll.likes -= 1
		poll.save()
		msg = "Removed like on Poll: " + str(poll.question_text)

	elif request.data['signal'] == Signal.ADD_DISLIKE:
		Dislike.objects.create(user=user, poll=poll)
		poll.dislikes += 1
		poll.save()
		msg = "Added dislike on Poll: " + str(poll.question_text)

	elif request.data['signal'] == Signal.ADD_DISLIKE_AND_REMOVE_LIKE:
		Like.objects.get(user=user, poll=poll).delete()
		Dislike.objects.create(user=user, poll=poll)
		poll.likes -= 1
		poll.dislikes += 1
		poll.save()
		msg = "Added dislike and removed like on Poll: " + str(poll.question_text)

	elif request.data['signal'] == Signal.REMOVE_DISLIKE:
		Dislike.objects.get(user=user, poll=poll).delete()
		poll.dislikes -= 1
		poll.save()
		msg = "Removed dislike on Poll: " + str(poll.question_text)

	poll_serializer = PollAndChoicesSerializer(poll)
	return Response({ 
		'response': msg,
		'poll': poll_serializer.data,
		'updated_likes': poll_serializer.data['likes'],
		'updated_dislikes': poll_serializer.data['dislikes']
	})