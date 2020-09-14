import datetime
from django.db import models
from django.utils import timezone
from django.conf import settings

# Create your models here.
class Poll(models.Model): # each class is its own table, each attribute is its own column within table 
	question_text = models.CharField(max_length=200, verbose_name=('Question')) # verbose_name is what appears on the website
	date_posted = models.DateTimeField(default=timezone.now)
	author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
	likes = models.IntegerField(default=0)
	dislikes = models.IntegerField(default=0)

	def __str__(self):
		return self.question_text


class Choice(models.Model):
	poll = models.ForeignKey(Poll, on_delete=models.CASCADE, null=True)
	choice_text = models.CharField(max_length=200, verbose_name=('Choice'))
	votes = models.IntegerField(default=0)

	@property
	def get_percent(self):
		choices = Choice.objects.filter(poll=self.poll) # filters all related choices by poll 
		votes = []
		for choice in choices:
			votes.append(choice.votes)
		total_votes = sum(votes)
		try:
			return round((self.votes/total_votes) * 100) # rounds percent to 2 decimal places
		except ZeroDivisionError:
			return '0'

	def __str__(self):
		return self.choice_text


class Vote(models.Model):
	poll = models.ForeignKey(Poll, on_delete=models.CASCADE, null=True)
	choice = models.ForeignKey(Choice, on_delete=models.CASCADE, null=True)
	user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True)

	class Meta:
		unique_together = ("poll", "choice", "user")

	def __str__(self):
		return self.user.username + " voted on Poll: " + str(self.poll.question_text)


class Like(models.Model):
	poll = models.ForeignKey(Poll, on_delete=models.CASCADE, null=True)
	user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True)

	class Meta:
		unique_together = ("poll", "user")

	def __str__(self):
		return self.user.username + " liked Poll: " + str(self.poll.question_text)


class Dislike(models.Model):
	poll = models.ForeignKey(Poll, on_delete=models.CASCADE, null=True)
	user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True)

	class Meta:
		unique_together = ("poll", "user")

	def __str__(self):
		return self.user.username + " disliked Poll " + str(self.poll.id)
