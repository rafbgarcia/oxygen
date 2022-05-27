# Generated by Django 4.0.4 on 2022-05-27 00:27

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('o2', '0012_rename_dashboardrows_dashboardrow'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='dashboardrow',
            name='widget',
        ),
        migrations.AddField(
            model_name='dashboardrow',
            name='index',
            field=models.SmallIntegerField(default=None),
        ),
        migrations.AddField(
            model_name='widget',
            name='dashboard_row',
            field=models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, to='o2.dashboardrow'),
        ),
        migrations.AlterField(
            model_name='widget',
            name='type',
            field=models.CharField(choices=[('pivot_table', 'Pivot Table'), ('line_chart', 'Line Chart'), ('vertical_bar_chart', 'Vertical Bar Chart')], default='pivot_table', max_length=20),
        ),
    ]
