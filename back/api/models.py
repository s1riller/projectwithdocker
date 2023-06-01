import uuid

from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_migrate
from django.dispatch import receiver
from rest_framework.exceptions import ValidationError


class Bot(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    login_id = models.ForeignKey(User, max_length=255, default=None, on_delete=models.CASCADE)
    unique_name = models.CharField(max_length=255, default=None)
    name = models.CharField(max_length=255, default=None)
    token = models.CharField(max_length=255, default=None)
    url = models.CharField(max_length=255, default="")
    launch_status = models.BooleanField(max_length=255,default=None)

    def __str__(self):
        return self.name

class TypeCommand(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name =  models.CharField(max_length=255, default=None)

    def __str__(self):
        return self.name


    def save(self, *args, **kwargs):
        if self.pk is None:  # Проверяем, что объект не имеет первичного ключа (т.е. новый объект)
            raise ValidationError("Нельзя добавлять новые объекты TypeCommand.")
        super().save(*args, **kwargs)

@receiver(post_migrate)
def create_default_type_commands(sender, **kwargs):
    if sender.name == 'api':
        TypeCommand.objects.get_or_create(name='mail')
        TypeCommand.objects.get_or_create(name='message')

class Command(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    bot_id = models.ForeignKey(Bot, on_delete=models.CASCADE)
    type_id = models.ForeignKey(TypeCommand, on_delete=models.CASCADE, null=False, default=None)
    name = models.CharField(max_length=255,default=None)
    link_status = models.BooleanField(default=False)

    def __str__(self):
        return self.name

class CommandCall(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    command_id = models.ForeignKey(Command, on_delete=models.CASCADE,related_name='calls')
    name = models.CharField(max_length=255,default=None)

class Media(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    command_id = models.OneToOneField(Command, on_delete=models.CASCADE,related_name='media')
    name = models.CharField(max_length=255,default=None)
    type = models.CharField(max_length=255,default=None)
    file = models.TextField()

class MessageCommand(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    command_id = models.OneToOneField(Command, on_delete=models.CASCADE,related_name='messageCommand')
    message = models.TextField()

class MailCommand(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    command_id = models.OneToOneField(Command, on_delete=models.CASCADE,related_name='mailCommand')
    message = models.TextField()
    datetime = models.DateTimeField()

class BotChat(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    bot_id = models.ForeignKey(Bot, on_delete=models.CASCADE)
    chat_id = models.CharField(max_length=32)

class LinkCommand(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    current = models.ForeignKey(Command, on_delete=models.CASCADE, related_name='current')
    follow = models.ManyToManyField(Command,  related_name='follow')
