from django.contrib.auth.models import User
from django.db.models.signals import post_migrate
from django.dispatch import receiver


@receiver(post_migrate)
def create_superuser(sender, **kwargs):
    if User.objects.filter(username='admin').exists():
        return
    User.objects.create_superuser('admin', 'admin@example.com', 'password')
