# Generated by Django 4.0.4 on 2022-05-26 18:14

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('o2', '0004_alter_dataset_size'),
    ]

    operations = [
        migrations.RenameField(
            model_name='dataset',
            old_name='size',
            new_name='size_mb',
        ),
    ]