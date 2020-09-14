from django.db import models
from django.conf import settings
from django.utils import timezone
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from PIL import Image

class CustomUserManager(BaseUserManager):
	def create_user(self, email, username, confirmed_password, password=None):
		if not email:
			raise ValueError('Users must have an email address')

		email = self.normalize_email(email)
		user = self.model(email=email, username=username)
		user.set_password(password)
		user.save()
		return user

	def create_superuser(self, email, username, confirmed_password, password=None):
		superuser = self.create_user(email=email, username=username, password=password)
		superuser.is_staff = True
		superuser.is_superuser = True 
		superuser.save()
		return superuser


class CustomUser(AbstractBaseUser, PermissionsMixin):
	email = models.EmailField(max_length=255, unique=True, error_messages={'unique':"This email already exists."})
	username = models.CharField(max_length=255, unique=True, error_messages={'unique':"This username already exists."})
	is_active = models.BooleanField(default=True)
	is_staff = models.BooleanField(default=False) # admin, non-superuser
	is_superuser = models.BooleanField(default=False) # superuser
	date_joined = models.DateTimeField(default=timezone.now)

	objects = CustomUserManager()

	USERNAME_FIELD = 'email'
	REQUIRED_FIELDS = ['username']

	def get_full_name(self):
		return self.email

	def get_short_name(self):
		return self.email

	def __str__(self):
		return self.username


class Profile(models.Model):
	user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True) # if user deleted, delete profile too (can't be other way around)
	image = models.ImageField(default='default_img.jpg', upload_to='profile_pics', null=True)

	def __str__(self):
		return f'{self.user} Profile'

	def save(self, *args, **kwargs): 
		super(Profile, self).save(*args, **kwargs)

		img = Image.open(self.image.path)
		if img.height > 300 or img.width > 300: # resize large profile pics 
			output_size = (300,300)
			img.thumbnail(output_size)
			img.save(self.image.path)





