from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Poll, Choice, Vote, Like, Dislike

class VoteSerializer(serializers.ModelSerializer):
	choice_text = serializers.SerializerMethodField()

	def get_choice_text(self, obj):
		return obj.choice.choice_text

	class Meta: 
		model = Vote
		fields = ['poll', 'choice_text', 'user']


class LikeSerializer(serializers.ModelSerializer):

	class Meta:
		model = Like
		fields = ['poll', 'user']


class DislikeSerializer(serializers.ModelSerializer):
	
	class Meta: 
		model = Dislike
		fields = ['poll', 'user']

		
class ChoiceSerializer(serializers.ModelSerializer):
	percent = serializers.ReadOnlyField(source="get_percent")

	class Meta: 
		model = Choice
		fields = ['id', 'choice_text', 'votes', 'percent']


class PollAndChoicesSerializer(serializers.ModelSerializer):
	choices = ChoiceSerializer(source="choice_set", many=True, required=True)
	author = serializers.CharField()
	total_comments = serializers.SerializerMethodField()

	def create(self, validated_data):
		choices_data = validated_data.pop('choice_set')
		author = User.objects.get(pk=validated_data['author'])
		poll = Poll.objects.create(question_text=validated_data['question_text'],
								   author=author
								   ) 
		for choice_data in choices_data:
			poll.choice_set.create(choice_text=choice_data['choice_text'])
		
		return poll

	def get_total_comments(self, obj):
		return obj.comment_set.all().count() 


	class Meta:
		model = Poll
		fields = ['id', 'question_text', 'date_posted', 'author', 'likes', 'dislikes', 'choices', 'total_comments']


