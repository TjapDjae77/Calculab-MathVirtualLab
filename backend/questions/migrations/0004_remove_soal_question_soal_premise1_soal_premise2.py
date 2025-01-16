# Generated by Django 4.2.16 on 2025-01-16 10:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('questions', '0003_alter_soal_input_function_checker'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='soal',
            name='question',
        ),
        migrations.AddField(
            model_name='soal',
            name='premise1',
            field=models.TextField(default=''),
        ),
        migrations.AddField(
            model_name='soal',
            name='premise2',
            field=models.TextField(default=''),
        ),
    ]
