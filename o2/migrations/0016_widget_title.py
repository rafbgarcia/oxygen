# Generated by Django 4.0.4 on 2022-05-28 02:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('o2', '0015_rename_columns_dataset_fields'),
    ]

    operations = [
        migrations.AddField(
            model_name='widget',
            name='title',
            field=models.CharField(max_length=200, null=True),
        ),
    ]