from rest_framework import serializers
from .models import Poll, Choice, Vote, Like, Dislike
from django.contrib.auth import get_user_model

User = get_user_model()

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
	author = serializers.CharField()
	# choices = serializers.SerializerMethodField()
	choices = ChoiceSerializer(source="choice_set", many=True, required=True)
	
	total_comments = serializers.SerializerMethodField()

	def create(self, validated_data):
		print(validated_data)
		choices_data = validated_data.pop('choice_set')
		author = User.objects.get(pk=validated_data['author'])
		poll = Poll.objects.create(question_text=validated_data['question_text'],
								   author=author
								   ) 
		for choice_data in choices_data:
			poll.choice_set.create(choice_text=choice_data['choice_text'])
		
		return poll

	# def get_choices(self, instance):
	# 	choices = instance.choice_set.all().order_by('id')
	# 	return ChoiceSerializer(choices, many=True).data

	def get_total_comments(self, obj):
		return obj.comment_set.all().count()  


	class Meta:
		model = Poll
		fields = ['id', 'question_text', 'date_posted', 'author', 'likes', 'dislikes', 'choices', 'total_comments']



