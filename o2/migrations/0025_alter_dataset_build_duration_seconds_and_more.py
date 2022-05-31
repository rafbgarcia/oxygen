# Generated by Django 4.0.4 on 2022-05-31 01:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('o2', '0024_remove_dataset_fields_remove_dataset_query_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='dataset',
            name='build_duration_seconds',
            field=models.SmallIntegerField(null=True),
        ),
        migrations.AlterField(
            model_name='dataset',
            name='is_building',
            field=models.BooleanField(default=False, null=True),
        ),
        migrations.AlterField(
            model_name='dataset',
            name='last_built_at',
            field=models.DateTimeField(null=True),
        ),
        migrations.AlterField(
            model_name='dataset',
            name='size_mb',
            field=models.DecimalField(decimal_places=1, max_digits=10, null=True),
        ),
    ]
