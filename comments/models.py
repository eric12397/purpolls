import datetime
from django.db import models
from django.conf import settings
from django.utils import timezone
from polls.models import Poll 

# Create your models here.
class Comment(models.Model):
	comment_text = models.TextField(max_length=255)
	poll = models.ForeignKey(Poll, on_delete=models.CASCADE, null=True)
	author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
	date_posted = models.DateTimeField(default=timezone.now)
	likes = models.IntegerField(default=0)
	dislikes = models.IntegerField(default=0)

	def increment_likes(self):
		self.likes += 1
		self.save()

	def decrement_likes(self):
		self.likes -= 1
		self.save()

	def increment_dislikes(self):
		self.dislikes += 1
		self.save()

	def decrement_dislikes(self):
		self.dislikes -= 1
		self.save()

	def increment_likes_and_decrement_dislikes(self):
		self.likes += 1
		self.dislikes -= 1
		self.save()

	def increment_dislikes_and_decrement_likes(self):
		self.dislikes += 1
		self.likes -= 1
		self.save()

	def __str__(self):
		return self.comment_text


class CommentLike(models.Model):
	comment = models.ForeignKey(Comment, on_delete=models.CASCADE, null=True)
	poll = models.ForeignKey(Poll, on_delete=models.CASCADE, null=True)
	user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True)

	class Meta:
		unique_together = ("comment", "poll", "user")

	def __str__(self):
		return self.user.username + " liked Comment: " + str(self.comment.comment_text)


class CommentDislike(models.Model):
	comment = models.ForeignKey(Comment, on_delete=models.CASCADE, null=True)
	poll = models.ForeignKey(Poll, on_delete=models.CASCADE, null=True)
	user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True)

	class Meta:
		unique_together = ("comment", "poll", "user")

	def __str__(self):
		return self.user.username + " disliked Comment: " + str(self.comment.comment_text)

