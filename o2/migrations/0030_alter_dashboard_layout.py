# Generated by Django 4.0.4 on 2022-06-02 17:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('o2', '0029_remove_widget_grid_row_index_alter_widget_build_info_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='dashboard',
            name='layout',
            field=models.JSONField(default=[]),
        ),
    ]
