# Generated by Django 4.0.4 on 2022-06-08 01:21

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('o2', '0042_datasettable_table_name'),
    ]

    operations = [
        migrations.RenameField(
            model_name='datasettable',
            old_name='table_name',
            new_name='title',
        ),
    ]