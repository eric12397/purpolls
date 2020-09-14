from rest_framework import serializers
from polls.models import Poll
from .models import Comment, CommentLike, CommentDislike
from django.contrib.auth import get_user_model

User = get_user_model()

class CommentSerializer(serializers.ModelSerializer):
	author = serializers.CharField()
	poll_id = serializers.IntegerField()

	def create(self, validated_data):
		author = User.objects.get(pk=validated_data['author'])
		poll = Poll.objects.get(id=validated_data['poll_id'])
		comment = Comment.objects.create(comment_text=validated_data['comment_text'],
										 poll=poll,
										 author=author 
										 )
		return comment 

	class Meta: 
		model = Comment
		fields = ['id', 'comment_text', 'date_posted', 'author', 'poll_id', 'likes', 'dislikes']


class CommentLikeSerializer(serializers.ModelSerializer):

	class Meta:
		model = CommentLike
		fields = ['comment', 'user']


class CommentDislikeSerializer(serializers.ModelSerializer):
	
	class Meta: 
		model = CommentDislike
		fields = ['comment', 'user']