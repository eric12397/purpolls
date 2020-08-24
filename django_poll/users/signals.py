from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.dispatch import receiver 
from .models import Profile

# User(sender) sends post_save signal to create_profile(receiver)
@receiver(post_save, sender=User) 
def create_profile(sender, instance, created, **kwargs):
	# creates profile every time a new User is registered
	if created:
		Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_profile(sender, instance, **kwargs):
	# saves User's profile into database
	instance.profile.save()