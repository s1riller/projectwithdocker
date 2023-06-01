from rest_framework.authtoken.models import Token


def get_user_id_from_request(request):
    try:
        auth_header = request.META.get('HTTP_AUTHORIZATION')
        token = auth_header.split()[1] if auth_header else None
        token_obj = Token.objects.get(key=token)
        user_id = token_obj.user_id
        return user_id
    except Token.DoesNotExist:
        return None
