# Generated by Django 4.0.4 on 2022-05-30 19:00

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('o2', '0018_remove_widget_dataset_dashboard_dataset'),
    ]

    operations = [
        migrations.RenameField(
            model_name='dataset',
            old_name='count',
            new_name='totalRecords',
        ),
    ]
