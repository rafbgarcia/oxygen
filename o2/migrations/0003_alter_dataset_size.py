# Generated by Django 4.0.4 on 2022-05-26 18:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('o2', '0002_dataset_is_building_dataset_last_built_at_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='dataset',
            name='size',
            field=models.DecimalField(decimal_places=3, max_digits=12, null=True),
        ),
    ]
