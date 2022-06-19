# Generated by Django 4.0.4 on 2022-06-19 20:06

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import model_utils.fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Dashboard',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created')),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified')),
                ('name', models.CharField(max_length=100)),
                ('layout', models.JSONField(default=list)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Dataset',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created')),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified')),
                ('name', models.CharField(max_length=100, unique=True)),
                ('is_building', models.BooleanField(default=False, null=True)),
                ('size_mb', models.DecimalField(decimal_places=1, max_digits=10, null=True)),
                ('last_built_at', models.DateTimeField(null=True)),
                ('build_duration_seconds', models.SmallIntegerField(null=True)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='DatasetTable',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('title', models.CharField(max_length=50)),
                ('query', models.TextField()),
                ('total_records', models.IntegerField(null=True)),
                ('html_preview', models.TextField(null=True)),
                ('dataset', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='tables', to='oracle.dataset')),
            ],
        ),
        migrations.CreateModel(
            name='Widget',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created')),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified')),
                ('type', models.CharField(choices=[('Text', 'Text'), ('Pivot Table', 'Pivot Table'), ('Vertical Bar Chart', 'Vertical Bar Chart')], max_length=20)),
                ('build_info', models.JSONField(default=dict)),
                ('dashboard', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='widgets', to='oracle.dashboard')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='DatasetTableColumn',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('type', models.CharField(choices=[('Text', 'Text'), ('Integer', 'Integer'), ('Float', 'Float'), ('DateTime', 'Datetime')], max_length=20)),
                ('table', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='columns', to='oracle.datasettable')),
            ],
        ),
        migrations.CreateModel(
            name='DatasetRelation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('source_table', models.CharField(max_length=50)),
                ('source_column', models.CharField(max_length=50)),
                ('reference_table', models.CharField(max_length=50)),
                ('reference_column', models.CharField(max_length=50)),
                ('dataset', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='relations', to='oracle.dataset')),
            ],
        ),
        migrations.AddField(
            model_name='dashboard',
            name='dataset',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='dashboards', to='oracle.dataset'),
        ),
    ]