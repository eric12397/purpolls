# Generated by Django 3.0.6 on 2020-08-02 20:51

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('polls', '0007_auto_20200802_1651'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('comments', '0005_auto_20200711_1348'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='commentdislike',
            unique_together={('comment', 'poll', 'user')},
        ),
        migrations.AlterUniqueTogether(
            name='commentlike',
            unique_together={('comment', 'poll', 'user')},
        ),
    ]
