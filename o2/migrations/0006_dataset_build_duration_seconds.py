# Generated by Django 4.0.4 on 2022-05-26 18:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('o2', '0005_rename_size_dataset_size_mb'),
    ]

    operations = [
        migrations.AddField(
            model_name='dataset',
            name='build_duration_seconds',
            field=models.SmallIntegerField(null=True),
        ),
    ]
