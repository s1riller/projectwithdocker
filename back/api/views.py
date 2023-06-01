from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response

from .functions import get_user_id_from_request
from .serializers import *
from rest_framework import permissions, status, generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.authtoken.models import Token


class UserInfoAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        data = {
            'username': user.username,
            'email': user.email
        }
        return Response(data)

class BotCreateView(generics.CreateAPIView):
    serializer_class = BotDetailSerializer

    def perform_create(self, serializer):
        # получаем пользователя из запроса
        request = self.request
        userid = get_user_id_from_request(request)

        user = self.request.user
        print(userid)
        # добавляем пользователя в словарь данных для сохранения объекта
        serializer.validated_data['login_id'] = User.objects.get(id=userid)
        # сохраняем объект
        serializer.save()


    #    permission_classes = [permissions.IsAuthenticated]
    # def create(self, request, *args, **kwargs):
    #     serializer = self.get_serializer(data=request.data)
    #     serializer.is_valid(raise_exception=True)
    #
    #     # Получаем токен из заголовка Authorization
    #     auth_header = request.META.get('HTTP_AUTHORIZATION')
    #     token = auth_header.split()[1] if auth_header else None
    #
    #     # Выводим токен в консоль
    #     print(f"Authorization token: {token}")
    #     userid = get_user_id_from_token(token)
    #     print(f"User login: {userid}")
    #
    #     self.perform_create(serializer)
    #     headers = self.get_success_headers(serializer.data)
    #     return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


#
# # class BotsListView(generics.ListAPIView):
# #     permission_classes = [permissions.IsAuthenticated]
# #     serializer_class = BotsListSerializer
# #     queryset = Bot.objects.all()
#

class BotsListView(generics.ListAPIView):
    serializer_class = BotsListSerializer

    def get_queryset(self):
        user_id = get_user_id_from_request(self.request)
        queryset = Bot.objects.filter(login_id=user_id)
        return queryset


class TypeCommandListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = TypeCommandListSerializer
    queryset = TypeCommand.objects.all()

class CommandsListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CommandsListSerializer
    queryset = Command.objects.all()

class CommandCreateView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CommandDetailSerializer
# # class CommandTypesListView(generics.ListAPIView):
# #     permission_classes = [permissions.IsAuthenticated]
# #     serializer_class = CommandTypesListView
# #     queryset = Type_command.objects.all()


class CallsListView(generics.ListAPIView):
     queryset = CommandCall.objects.all()
     serializer_class = CommandCallListSerializer

class  CallsCreateView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CommandCallDetailSerializer

class MediaCreateView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = MediaDetailSerializer


class MediaListView(generics.ListAPIView):

    permission_classes = [permissions.IsAuthenticated]
    queryset = Media.objects.all()
    serializer_class = MediaDetailSerializer


class MessageCommandCreateView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = MessageCommandDetailSerializer

class  MessageCommandListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = MessageCommand.objects.all()
    serializer_class = MessageCommandDetailSerializer

class MailCommandCreateView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = MailCommandDetailSerializer


class MailCommandListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = MailCommand.objects.all()
    serializer_class = MailCommandDetailSerializer


class BotChatCreateView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = BotChatDetailSerializer


class BotChatListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = BotChat.objects.all()
    serializer_class = BotChatDetailSerializer


class LinkCreateView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = LinkDetailSerializer

class LinkListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = LinkCommand.objects.all()
    serializer_class = LinkDetailSerializer

class CommandDetailView(generics.RetrieveUpdateDestroyAPIView):
    #permission_classes = [permissions.IsAuthenticated]
    serializer_class = CommandDetailSerializer
    queryset = Command.objects.all()


class CommandTypeDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TypeCommandDetailSerializer
    queryset = TypeCommand.objects.all()

class CallsDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CommandCallDetailSerializer
    queryset = CommandCall.objects.all()

class MediaDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MediaDetailSerializer
    queryset = Media.objects.all()

class  MessageCommandDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MessageCommandDetailSerializer
    queryset = MessageCommand.objects.all()

class MailCommandDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MailCommandDetailSerializer
    queryset = MailCommand.objects.all()

class BotChatDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BotChatDetailSerializer
    queryset = BotChat.objects.all()

class LinkDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = LinkDetailSerializer
    queryset = LinkCommand.objects.all()
#
#
#

# #
# #

# #
# #
# #

# #
# #
# #
# # class CommandLinkCreateView(generics.CreateAPIView):
# #     permission_classes = [permissions.IsAuthenticated]
# #     serializer_class = CommandLinkDetailSerializer
# #
# #
# # class CommandLinksListView(generics.ListAPIView):
# #     permission_classes = [permissions.IsAuthenticated]
# #     serializer_class = CommandLinksListView
# #     queryset = Link_command.objects.all()
# #
# #
# #
# # class CommandLinkDetailView(generics.RetrieveUpdateDestroyAPIView):
# #     permission_classes = [permissions.IsAuthenticated]
# #     serializer_class = CommandLinkDetailSerializer
# #     queryset = Link_command.objects.all()
# #
class TypeCommandCreateView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = TypeCommandDetailSerializer
# #
# # class CommandTypesListView(generics.ListAPIView):
# #     permission_classes = [permissions.IsAuthenticated]
# #     serializer_class = CommandTypesListView
# #     queryset = Type_command.objects.all()
# #
# #
# # class CommandTypeDetailView(generics.RetrieveUpdateDestroyAPIView):
# #     permission_classes = [permissions.IsAuthenticated]
# #     serializer_class = CommandLinkDetailSerializer
# #     queryset = Type_command.objects.all()


# class BotAPIView(generics.GenericAPIView):
#     serializer_class = BotUUIDSerializer
#
#     def post(self, request):
#         # Извлечение UUID из тела запроса
#         uuid = request.data.get('uuid')
#
#         # Поиск бота по UUID
#         try:
#             bot = Bot.objects.get(id=uuid)
#             serializer = BotDetailSerializer(bot)
#             return Response(serializer.data)
#         except Bot.DoesNotExist:
#             return Response({'message': 'Bot not found'}, status=404)

class BotDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BotUUIDSerializer
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = BotDetailSerializer
    queryset = Bot.objects.all()

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({'message': 'Bot deleted successfully'})

    def put(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def patch(self, request, *args, **kwargs):
        return self.put(request, *args, **kwargs)

