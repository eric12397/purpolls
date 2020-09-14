from django.db.models.signals import post_save
from django.dispatch import receiver 
from .models import Profile
from django.contrib.auth import get_user_model

User = get_user_model()

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