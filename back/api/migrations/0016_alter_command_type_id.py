# Generated by Django 4.2.1 on 2023-05-18 12:56

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0015_alter_command_type_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='command',
            name='type_id',
            field=models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.CASCADE, to='api.typecommand'),
        ),
    ]