# Generated by Django 4.0.4 on 2022-05-27 16:52

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('o2', '0014_rename_dtypes_dataset_columns'),
    ]

    operations = [
        migrations.RenameField(
            model_name='dataset',
            old_name='columns',
            new_name='fields',
        ),
    ]