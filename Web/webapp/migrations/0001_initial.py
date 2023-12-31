# Generated by Django 4.2.5 on 2023-10-01 07:42

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('password', models.CharField(max_length=255)),
                ('email', models.EmailField(max_length=254)),
            ],
        ),
        migrations.CreateModel(
            name='UserCredentials',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=255)),
                ('keytoken', models.CharField(max_length=64)),
                ('reference_id', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='webapp.user')),
            ],
        ),
        migrations.CreateModel(
            name='Entity',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('folder_path', models.TextField()),
                ('name', models.CharField(max_length=255)),
                ('content_type', models.CharField(max_length=255)),
                ('hashpath', models.CharField(max_length=255)),
                ('is_folder', models.BooleanField(default=True)),
                ('user_id', models.IntegerField(default=0)),
                ('url', models.URLField()),
                ('parent_folder', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='webapp.entity')),
            ],
        ),
    ]
