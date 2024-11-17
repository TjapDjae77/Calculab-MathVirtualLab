# Generated by Django 4.2.16 on 2024-11-17 06:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('levels', '0001_initial'),
        ('accounts', '0002_profile_level_completed'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='profile',
            name='level_completed',
        ),
        migrations.AddField(
            model_name='profile',
            name='completed_levels',
            field=models.ManyToManyField(blank=True, to='levels.level'),
        ),
    ]