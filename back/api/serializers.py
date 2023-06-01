from uuid import UUID

from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from djoser.serializers import UserCreateSerializer
from django.contrib.auth import get_user_model
from djoser.serializers import TokenSerializer
from rest_framework import serializers

from api.functions import get_user_id_from_request
from api.models import *



# UserModel = get_user_model()
#
#
#
#
#

#
# class MailCommandListSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = MailCommand
#         fields = "__all__"
#
#
# class CommandListSerializer(serializers.ModelSerializer):
#     commandcall = CommandCallListSerializer(many=True, read_only=True)
#     mail_command = MailCommandListSerializer(many=True, read_only=True)
#     class Meta:
#         model = Command
#         fields = '__all__'
#
#     def to_representation(self, instance):
#         data = super().to_representation(instance)
#         data['commandcall'] = CommandCallListSerializer(instance.call.all(), many=True).data
#         # data['mail_command'] = MailCommandListSerializer(instance.mail_command.all(), many=True).data
#
#         return data
#
#
# class CommandSerializer(serializers.ModelSerializer):
#     command_calls = CommandCallListSerializer(many=True, read_only=True, source='CommandCall')
#
#     class Meta:
#         model = Command
#         fields = '__all__'


class CommandCallListSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommandCall
        fields = "__all__"

class CommandCallDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommandCall
        fields = ('id', 'name','command_id')

    def validate(self, data):
        """
        Проверяем, что все обязательные поля заполнены
        """
        if not data.get('command_id'):
            raise serializers.ValidationError("Поле commmand_id обязательно для заполнения")

        if not data.get('name'):
            raise serializers.ValidationError("Поле name обязательно для заполнения")
        return data


class BotDetailSerializer(serializers.ModelSerializer):

    # commands = CommandListSerializer(many=True, read_only=True)

    class Meta:
        model = Bot
        fields = ('id','unique_name','name','token','url','launch_status')

    def validate(self, data):
        """
        Проверяем, что все обязательные поля заполнены
        """
        if not data.get('unique_name'):
            raise serializers.ValidationError("Поле unique_name обязательно для заполнения")

        if not data.get('name'):
            raise serializers.ValidationError("Поле name обязательно для заполнения")

        if not data.get('token'):
            raise serializers.ValidationError("Поле token обязательно для заполнения")

        # if not data.get('url'):
        #     raise serializers.ValidationError("Поле url обязательно для заполнения")

        return data

class TypeCommandDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = TypeCommand
        fields = ('id', 'name')

    def validate(self, data):
        """
        Проверяем, что все обязательные поля заполнены
        """
        if not data.get('name'):
            raise serializers.ValidationError("Поле name обязательно для заполнения")
        return data


class MediaDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Media
        fields = ('id','command_id','name','type','file')


class CommandsListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Command
        fields = "__all__"

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        type_ids = representation.pop('type_id', [])
        types = TypeCommand.objects.filter(id__in=type_ids)
        type_names = TypeCommandDetailSerializer(types, many=True).data
        representation['type'] = type_names

        command_calls = instance.calls.all()
        call_data = CommandCallDetailSerializer(command_calls, many=True).data
        representation['calls'] = call_data

        media = Media.objects.filter(command_id=instance)
        media_data = MediaDetailSerializer(media, many=True).data
        representation['media'] = media_data

        message_command = MessageCommand.objects.filter(command_id=instance)
        message_command_data = MessageCommandDetailSerializer(message_command, many=True).data
        representation['message_command'] = message_command_data

        mail_command = MailCommand.objects.filter(command_id=instance)
        mail_command_data = MailCommandDetailSerializer(mail_command, many=True).data
        representation['mail_command'] = mail_command_data

        link = LinkCommand.objects.filter(current=instance)
        link_data = LinkDetailSerializer(link, many=True).data
        representation['link'] = link_data

        return representation





class BotsListSerializer(serializers.ModelSerializer):
    commands = serializers.SerializerMethodField()
    chat = serializers.SerializerMethodField()
    class Meta:
        model = Bot
        fields = "__all__"


    def get_chat(self, bot):
        chats = BotChat.objects.filter(bot_id=bot.id)
        return BotChatDetailSerializer(chats, many=True).data

    def get_commands(self, bot):
        commands = Command.objects.filter(bot_id=bot.id)

        return CommandDetailSerializer(commands, many=True).data


    def __init__(self, *args, **kwargs):
        request = kwargs['context']['request']
        userid = get_user_id_from_request(request)
        user = User.objects.get(id=userid)
        super().__init__(*args, **kwargs)

        self.Meta.queryset = Bot.objects.filter(login_id=user.id)



class TypeCommandListSerializer(serializers.ModelSerializer):
    class Meta:
        model = TypeCommand
        fields = ('id', 'name')


class CommandDetailSerializer(serializers.ModelSerializer):
    message_commands = serializers.SerializerMethodField()
    mail_commands = serializers.SerializerMethodField()
    calls = serializers.SerializerMethodField()
    media = serializers.SerializerMethodField()
    links = serializers.SerializerMethodField()
    class Meta:
        model = Command
        fields = ('id', 'name', 'link_status', 'bot_id', 'type_id','message_commands','mail_commands','calls', 'media','links')

    def get_message_commands(self, obj):
        message_commands = MessageCommand.objects.filter(command_id=obj.id)
        return MessageCommandDetailSerializer(message_commands, many=True).data

    def get_mail_commands(self,obj):
        mail_commands = MailCommand.objects.filter(command_id=obj.id)
        return MailCommandDetailSerializer(mail_commands, many=True).data

    def get_calls(self,obj):
        calls = CommandCall.objects.filter(command_id=obj.id)
        return CommandCallDetailSerializer(calls, many=True).data

    def get_media(self, obj):
        calls = Media.objects.filter(command_id=obj.id)
        return MediaDetailSerializer(calls, many=True).data

    def get_links(self,obj):
        links = LinkCommand.objects.filter(current_id=obj.id)
        return  LinkDetailSerializer(links, many=True).data

class  MessageCommandDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = MessageCommand
        fields = ('id','command_id', 'message')


class MailCommandDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = MailCommand
        fields = ('id','command_id','message','datetime')

class BotChatDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = BotChat
        fields = ("id","bot_id","chat_id")

class LinkDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = LinkCommand
        fields = ("id","current","follow")
#
#
# # class CommandLinkDetailSerializer(serializers.ModelSerializer):
# #     class Meta:
# #         model = Link_command
# #         fields = '__all__'
# #
# #
# # class CommandLinksListView(serializers.ModelSerializer):
# #     class Meta:
# #         model = Link_command
# #         fields = "__all__"
# #
# #

# #
# #
# # class CommandTypesListView(serializers.ModelSerializer):
# #     class Meta:
# #         model = Type_command
# #         fields = "__all__"
# #
# #
# # User = get_user_model()
# #
# #
class CustomUserCreateSerializer(UserCreateSerializer):
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError('Email already exists')
        return value

    class Meta:
        model = User
        fields = ('id', 'email', 'password','username')

class CustomTokenSerializer(TokenSerializer):
    user_id = serializers.IntegerField(source='user.id')

    class Meta(TokenSerializer.Meta):
        fields = TokenSerializer.Meta.fields + ('user_id',)




class BotUUIDSerializer(serializers.Serializer):
    uuid = serializers.UUIDField()

    def validate_uuid(self, value):
        try:
            uuid_obj = UUID(value)
        except (TypeError, ValueError):
            raise serializers.ValidationError("Invalid UUID format")

        return value