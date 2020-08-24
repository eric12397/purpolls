from django.db import models
from django.contrib.auth.models import User
from PIL import Image

# Create your models here.
class Profile(models.Model):
	user = models.OneToOneField(User, on_delete=models.CASCADE, null=True) # if user deleted, delete profile too (can't be other way around)
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





