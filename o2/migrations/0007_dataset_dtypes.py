# Generated by Django 4.0.4 on 2022-05-26 19:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('o2', '0006_dataset_build_duration_seconds'),
    ]

    operations = [
        migrations.AddField(
            model_name='dataset',
            name='dtypes',
            field=models.JSONField(default=None),
        ),
    ]