# Generated by Django 5.1.5 on 2025-02-08 18:04

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('devices', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='devicedatapoints',
            options={'verbose_name': 'Device Data Point', 'verbose_name_plural': 'Device Data Points'},
        ),
    ]
