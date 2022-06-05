# Generated by Django 4.0.4 on 2022-06-04 23:44

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('o2', '0038_alter_datasettablecolumn_foreign_key_column_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='datasettablecolumn',
            name='foreign_key_column',
        ),
        migrations.RemoveField(
            model_name='datasettablecolumn',
            name='foreign_key_table',
        ),
        migrations.AddField(
            model_name='datasettablecolumn',
            name='foreign_key',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='relationships', to='o2.datasettablecolumn'),
        ),
    ]
