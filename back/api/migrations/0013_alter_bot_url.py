# Generated by Django 4.2.1 on 2023-05-18 12:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0012_remove_linkcommand_follow_linkcommand_follow'),
    ]

    operations = [
        migrations.AlterField(
            model_name='bot',
            name='url',
            field=models.CharField(default='', max_length=255),
        ),
    ]
