from .models import Comment, CommentLike, CommentDislike
from polls.models import Poll
from enums.signal import Signal
from .serializers import CommentSerializer, CommentLikeSerializer, CommentDislikeSerializer
from rest_framework import generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model

User = get_user_model()

class CommentListAPI(generics.ListCreateAPIView):
	serializer_class = CommentSerializer

	def get_queryset(self):
		poll_id = self.kwargs['pk']
		return Comment.objects.filter(poll=poll_id).order_by('-date_posted')


class GetCommentLikesAPI(generics.ListAPIView):
	serializer_class = CommentLikeSerializer

	def get_queryset(self):
		user_id = self.kwargs['user_id']
		poll_id = self.kwargs['poll_id']
		return CommentLike.objects.filter(user=user_id, poll=poll_id)


class GetCommentDislikesAPI(generics.ListAPIView):
	serializer_class = CommentDislikeSerializer

	def get_queryset(self):
		user_id = self.kwargs['user_id']
		poll_id = self.kwargs['poll_id']
		return CommentDislike.objects.filter(user=user_id, poll=poll_id)


@api_view(['PATCH'])
#@permission_classes([IsAuthenticated])
def like_comment(request, comment_id):
	user = User.objects.get(pk=request.data['user_id'])
	poll = Poll.objects.get(pk=request.data['poll_id'])
	comment = Comment.objects.get(pk=comment_id)

	
	if request.data['signal'] == Signal.ADD_LIKE:
		if not CommentLike.objects.filter(user=user, poll=poll, comment=comment).exists():
			CommentLike.objects.create(user=user, poll=poll, comment=comment)
			response = "Added like on Comment: " + str(comment.comment_text)

	if request.data['signal'] == Signal.ADD_LIKE_AND_REMOVE_DISLIKE:
		if not CommentLike.objects.filter(user=user, poll=poll, comment=comment).exists():
			CommentLike.objects.create(user=user, poll=poll, comment=comment)
			CommentDislike.objects.get(user=user, poll=poll, comment=comment).delete()
			response = "Added like, removed dislike on Comment: " + str(comment.comment_text) 

	if request.data['signal'] == Signal.REMOVE_LIKE:
		CommentLike.objects.get(user=user, poll=poll, comment=comment).delete()
		response = "Removed liked on Comment: " + str(comment.comment_text)

	comment_serializer = CommentSerializer(comment, data=request.data, partial=True) # set partial=True to update a data partially
	if comment_serializer.is_valid():
	    comment_serializer.save()
	    return Response({ 
	    	'response': response,
	    	'updated_likes': comment_serializer.data['likes'],
	    	'updated_dislikes': comment_serializer.data['dislikes']
	    })
	else:
		return Response(comment_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PATCH'])
#@permission_classes([IsAuthenticated])
def dislike_comment(request, comment_id):
	user = User.objects.get(pk=request.data['user_id'])
	poll = Poll.objects.get(pk=request.data['poll_id'])
	comment = Comment.objects.get(pk=comment_id)

	
	if request.data['signal'] == Signal.ADD_DISLIKE:
		if not CommentDislike.objects.filter(user=user, poll=poll, comment=comment).exists():
			CommentDislike.objects.create(user=user, poll=poll, comment=comment)
			response = "Added dislike on Comment: " + str(comment.comment_text) 

	elif request.data['signal'] == Signal.ADD_DISLIKE_AND_REMOVE_LIKE:
		if not CommentDislike.objects.filter(user=user, poll=poll, comment=comment).exists():
			CommentDislike.objects.create(user=user, poll=poll, comment=comment)
			CommentLike.objects.get(user=user, poll=poll, comment=comment).delete()
			response = "Added dislike, removed like on Comment: " + str(comment.comment_text) 

	elif request.data['signal'] == Signal.REMOVE_DISLIKE:
		CommentDislike.objects.get(user=user, poll=poll, comment=comment).delete()
		response = "Removed dislike on Comment: " + str(comment.comment_text) 

	comment_serializer = CommentSerializer(comment, data=request.data, partial=True) # set partial=True to update a data partially
	if comment_serializer.is_valid():
		comment_serializer.save()
		return Response({
			"response": response,
			'updated_likes': comment_serializer.data['likes'],
			'updated_dislikes': comment_serializer.data['dislikes']
		})	
	else:
		return Response(comment_serializer.errors, status=status.HTTP_400_BAD_REQUEST)




#####################################################################################################################




