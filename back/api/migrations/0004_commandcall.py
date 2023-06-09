# Generated by Django 4.2.1 on 2023-05-15 06:43

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_command'),
    ]

    operations = [
        migrations.CreateModel(
            name='CommandCall',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(default=None, max_length=255)),
                ('command_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.command')),
            ],
        ),
    ]
