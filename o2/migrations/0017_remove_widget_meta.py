# Generated by Django 4.0.4 on 2022-05-28 02:12

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('o2', '0016_widget_title'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='widget',
            name='meta',
        ),
    ]
