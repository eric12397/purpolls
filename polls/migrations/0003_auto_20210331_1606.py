# Generated by Django 3.1 on 2021-03-31 20:06

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('polls', '0002_auto_20200912_0350'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='choice',
            options={'ordering': ['id']},
        ),
    ]
