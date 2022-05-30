# Generated by Django 4.0.4 on 2022-05-30 18:26

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('o2', '0017_remove_widget_meta'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='widget',
            name='dataset',
        ),
        migrations.AddField(
            model_name='dashboard',
            name='dataset',
            field=models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, to='o2.dataset'),
        ),
    ]
