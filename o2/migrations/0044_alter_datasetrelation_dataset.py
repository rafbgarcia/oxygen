# Generated by Django 4.0.4 on 2022-06-19 17:51

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('o2', '0043_rename_table_name_datasettable_title'),
    ]

    operations = [
        migrations.AlterField(
            model_name='datasetrelation',
            name='dataset',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='relations', to='o2.dataset'),
        ),
    ]
