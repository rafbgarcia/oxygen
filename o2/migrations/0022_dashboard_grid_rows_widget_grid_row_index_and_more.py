# Generated by Django 4.0.4 on 2022-05-30 19:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('o2', '0021_remove_dataset_totalrecords_dataset_total_records'),
    ]

    operations = [
        migrations.AddField(
            model_name='dashboard',
            name='grid_rows',
            field=models.JSONField(default=None),
        ),
        migrations.AddField(
            model_name='widget',
            name='grid_row_index',
            field=models.SmallIntegerField(default=None),
        ),
        migrations.DeleteModel(
            name='DashboardRow',
        ),
    ]
