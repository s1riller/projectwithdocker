using Microsoft.Data.SqlClient;
using Microsoft.VisualBasic;
using System;
using System.Data;
using System.Threading;
using Telegram.Bot;
using Telegram.Bot.Polling;
using Telegram.Bot.Requests;
using Telegram.Bot.Types;
using Telegram.Bot.Types.Enums;
using Telegram.Bot.Types.ReplyMarkups;
using static System.Net.Mime.MediaTypeNames;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using System.Reflection;
using Microsoft.EntityFrameworkCore;
using Telegram.Bot.Exceptions;
using ChatBotTelega;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.Runtime.Intrinsics.X86;
using System.Security.Cryptography;
using System.Timers;
using System.ComponentModel.Design;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;
using System.Linq;
using System.Text.RegularExpressions;

namespace itacademy_chat_bot
{
    class Program
    {
        static List<string> tokens = new List<string>();
        static List<string> beforetokens = new List<string>();
        static readonly int checkInterval = 100000;
        static TelegramBotClient[] _bots;
        static int count = 0;
        static CancellationTokenSource cts = new CancellationTokenSource();
        static async Task Main(string[] args)
        {
            var thread = new Thread(RunBotsAsync);
            //RunBotsAsync();
            thread.Start();
            Console.WriteLine("GHbdtn");
            await Task.Delay(int.MaxValue);
        }

        static async void RunBotsAsync()
        {
            using CancellationTokenSource cts = new();
            await Task.Run(async () =>
            {
                using (var context = new ChatBotDbContext())
                {
                    if (tokens != null)
                    { tokens.Clear(); }

                    var activeBotTokens = await context.Bots
                    .Where(b => b.LaunchStatus == true)
                    .Select(b => b.Token)
                    .ToListAsync();
                    count++;
                    if (count == 1)
                    {
                        _bots = new TelegramBotClient[activeBotTokens.Count];
                        beforetokens = activeBotTokens;

                        for (int i = 0; i < activeBotTokens.Count; i++)
                        {
                            _bots[i] = new TelegramBotClient(activeBotTokens[i]);
                            _bots[i].StartReceiving(updateHandler: Update, pollingErrorHandler: Error, cancellationToken: cts.Token);
                            var bot = context.Bots.Where(b => b.Token == activeBotTokens[i]).FirstOrDefault();
                            if (bot != null)
                            {
                                var url = bot.Url;
                                if (string.IsNullOrEmpty(url))
                                {
                                    var me = await _bots[i].GetMeAsync();
                                    url = me.Id.ToString();
                                    bot.Url = url;
                                    context.SaveChanges();
                                    Console.WriteLine(url);
                                }
                            }
                            Mail(_bots[i]);
                        }
                    }
                    else
                    {
                        foreach (string token in beforetokens)
                        {
                            ITelegramBotClient bot = new TelegramBotClient(token);
                            bot.CloseAsync();
                        }

                        foreach (string token in activeBotTokens)
                        {
                            ITelegramBotClient bot = new TelegramBotClient(token);
                            bot.StartReceiving(updateHandler: Update, pollingErrorHandler: Error, cancellationToken: cts.Token);
                            var bot1 = context.Bots.Where(b => b.Token == token).FirstOrDefault();
                            if (bot1 != null)
                            {
                                var url = bot1.Url;
                                if (string.IsNullOrEmpty(url))
                                {
                                    var me = await bot.GetMeAsync();
                                    url = me.Id.ToString();
                                    bot1.Url = url;
                                    await context.SaveChangesAsync();
                                    Console.WriteLine(url);
                                }
                            }
                            Mail(bot);
                        }
                        beforetokens = activeBotTokens;
                        count = 2;
                    }
                }
                //Thread.Sleep(checkInterval);
                await Task.Delay(checkInterval);
            });

            cts.Cancel();
            if (cts.IsCancellationRequested)
            {
                RunBotsAsync();
            }
        }

        static async Task Update(ITelegramBotClient botClient, Update update, CancellationToken token)
        {

            var message = update.Message;

            if (update.Type == UpdateType.Message && update?.Message?.Text != null)
            {
                AddBotSubscriber(botClient, message);
                await HandleMessage(botClient, message);
                return;
            }

            if (update.Type == UpdateType.CallbackQuery)
            {
                await HandleCallbackQuery(botClient, update.CallbackQuery);
                return;
            }


        }

        static async Task AddBotSubscriber(ITelegramBotClient botClient, Message message)
        {
            using (var context = new ChatBotDbContext())
            {
                var me = await botClient.GetMeAsync();
                var UrlId = me.Id.ToString();

                var idchat = message.Chat.Id.ToString();
                var BotIdDB = context.Bots
                    .FirstOrDefault(b => b.Url == UrlId).Id;

                var count = await context.BotsChats.CountAsync();
                count++;

                var idchatDB = context.BotsChats.FirstOrDefault(b => b.ChatId == idchat);
                if (idchatDB != null)
                {
                    var botidDB = context.BotsChats.Where(b => b.ChatId == idchat && b.BotId == BotIdDB).Select(b => b.BotId).ToList();
                    if (botidDB.Count == 0)
                    {
                        var botschats = new BotsChat { Id = count.ToString(), BotId = BotIdDB, ChatId = idchat };
                        context.BotsChats.AddRange(new[] { botschats });
                        await context.SaveChangesAsync();
                    }
                    else return;
                }
                else {
                    var botschats = new BotsChat { Id = count.ToString(), BotId = BotIdDB, ChatId = idchat };
                    context.BotsChats.AddRange(new[] { botschats });
                    await context.SaveChangesAsync();
                }

            }
            return;
        }

        static async Task Mail(ITelegramBotClient botClient)
        {
            // Отменяем предыдущую задачу, если она существует
            cts.Cancel();
            cts = new CancellationTokenSource();

            using (var context = new ChatBotDbContext())
            {
                var me = await botClient.GetMeAsync();
                var UrlId = me.Id.ToString();
                var BotIdDB = context.Bots.FirstOrDefault(b => b.Url == UrlId).Id;
                var subscribers = context.BotsChats.Where(b => b.BotId == BotIdDB).Select(b => b.ChatId).ToList();
                var idmail = await context.TypesCommands
                    .Where(b => b.TypeName == "mail").Select(b => b.Id)
                    .FirstOrDefaultAsync();
                var idMail = await context.Commands
                .Where(b => b.TypeId == idmail && b.BotId == BotIdDB && b.LinkStatus == true).Select(b => b.Id).ToListAsync();

                List<DateTime> scheduleddates = new List<DateTime>();
                List<String> iddata = new List<String>();
                InlineKeyboardMarkup keyboards = null;
                foreach (var i in idMail)
                {

                    //var idButton = await context.LinkCommands
                    //            .Where(b => b.CurrentCommand == i)?.Select(b => b.FollowingCommand)?.ToListAsync() ?? null;
                    //// создаем список кнопок с вопросами
                    //List<InlineKeyboardButton[]> buttonRows = new List<InlineKeyboardButton[]>();
                    //foreach (var idbutton in idButton)
                    //{
                    //    var comname = await context.CommandsCalls
                    //        .Where(b => b.CommandId == idbutton && !b.CallName.StartsWith("/"))
                    //        .OrderByDescending(b => b.Id)
                    //        .Select(b => b.CallName)
                    //        .FirstOrDefaultAsync();
                    //    InlineKeyboardButton button = InlineKeyboardButton.WithCallbackData(comname, comname);
                    //    buttonRows.Add(new[] { button });
                    //}

                    //// создаем клавиатуру с кнопками
                    //InlineKeyboardMarkup keyboard = new InlineKeyboardMarkup(buttonRows);
                    //keyboards = keyboard;

                    var scheduledDataDb = await context.MailCommands.Where(b => b.CommandId == i).Select(b => (DateTime)b.Date).ToListAsync();
                    var idData = await context.MailCommands.Where(b => b.CommandId == i).Select(b => b.Id).ToListAsync();
                    scheduleddates.AddRange(scheduledDataDb);
                    iddata.AddRange(idData);
                }

                int count = 0;
                foreach (var date in scheduleddates)
                {
                    var id = context.MailCommands.Where(b => b.Id == iddata[count]).Select(b => b.CommandId).FirstOrDefault();
                    var idButton = await context.LinkCommands
                                .Where(b => b.CurrentCommand == id)?.Select(b => b.FollowingCommand)?.ToListAsync() ?? null;
                    // создаем список кнопок с вопросами
                    List<InlineKeyboardButton[]> buttonRows = new List<InlineKeyboardButton[]>();
                    foreach (var idbutton in idButton)
                    {
                        var comname = await context.CommandsCalls
                            .Where(b => b.CommandId == idbutton && !b.CallName.StartsWith("/"))
                            .OrderByDescending(b => b.Id)
                            .Select(b => b.CallName)
                            .FirstOrDefaultAsync();
                        InlineKeyboardButton button = InlineKeyboardButton.WithCallbackData(comname, comname);
                        buttonRows.Add(new[] { button });
                    }

                    // создаем клавиатуру с кнопками
                    InlineKeyboardMarkup keyboard = new InlineKeyboardMarkup(buttonRows);



                    // Установка даты и времени для отправки сообщения
                    DateTime scheduledTime = date;
                    var messages = context.MailCommands.Where(b => b.Id == iddata[count])?.Select(b => b.Message)?.FirstOrDefault() ?? null;
                    // Получение текущей даты и времени
                    DateTime currentTime = DateTime.Now;
                    // Вычисление времени, которое необходимо подождать перед отправкой сообщения
                    TimeSpan timeToWait = scheduledTime - currentTime;
                    // Проверка на то, что нужно еще подождать
                    if (timeToWait.TotalSeconds > 0)
                    {
                        SendScheduledMessage(botClient, subscribers, timeToWait, messages, cts.Token, keyboard, id);
                    }
                    count++;
                }
            }
        }

        static async Task SendScheduledMessage(ITelegramBotClient botClient, List<string> subscribers, TimeSpan timeToWait, string messages, CancellationToken cancellationToken, InlineKeyboardMarkup keyboards, string id)
        {
            using (var context = new ChatBotDbContext())
            {
                // Ожидание до указанного времени
                await Task.Delay(timeToWait, cancellationToken);

                // Словарь для отслеживания статуса отправки сообщений
                Dictionary<string, bool> sentMessages = new Dictionary<string, bool>();

                // Отправка сообщения всем подписчикам
                foreach (var subscriber in subscribers)
                {
                    // Проверка, было ли уже отменено cancellationToken
                    cancellationToken.ThrowIfCancellationRequested();
                    // Проверяем, было ли уже отправлено сообщение данному подписчику
                    if (!sentMessages.ContainsKey(subscriber) || !sentMessages[subscriber])
                    {
                        messages = Regex.Replace(messages, @"\s+", " ");
                        if (messages == "" || messages == " ")
                        {
                            messages = null;
                        }
                        var base64 = context.Media
                            .FirstOrDefault(b => b.CommandId == id)?.File ?? null;
                        var base64name = context.Media
                            .FirstOrDefault(b => b.CommandId == id)?.Name ?? null;
                        if (messages != null && base64 != null) 
                        {
                            await DecodeBase64ToFileAndSend(base64, base64name, subscriber, botClient, keyboards, messages);
                        }
                        else if (messages != null)
                        {
                            await botClient.SendTextMessageAsync(subscriber, messages.Replace("\\t", "\t").Replace("\\n", "\n"), replyMarkup: keyboards);
                            // Устанавливаем флаг отправки сообщения для данного подписчика
                            sentMessages[subscriber] = true;
                        }
                        else
                        {
                            if (base64name == null) { base64name = "."; }
                            if (base64 != null)
                            {
                                await DecodeBase64ToFileAndSend(base64, base64name, subscriber, botClient, keyboards, messages);
                            }
                        }
                    }
                }
            }
        }

        public static async Task DecodeBase64ToFileAndSend(string base64String, string outputPath, string chatId, ITelegramBotClient bot, InlineKeyboardMarkup keyboard, string answer)
        {
            // Конвертируем строку Base64 обратно в байтовый массив
            byte[] fileBytes = Convert.FromBase64String(base64String);

            // Записываем байты в файл
            System.IO.File.WriteAllBytes(outputPath, fileBytes);

            // Отправляем файл через бота
            using (var stream = new FileStream(outputPath, FileMode.Open, FileAccess.Read, FileShare.Read))
            {
                string extension = System.IO.Path.GetExtension(outputPath).ToLowerInvariant();
                switch (extension)
                {
                    case ".jpg":
                    case ".jpeg":
                    case ".png":
                    case ".bmp":
                    case ".gif":
                        await bot.SendPhotoAsync(chatId: chatId, photo: new InputFileStream(stream, Path.GetFileName(outputPath)), replyMarkup: keyboard, caption: answer);
                        break;

                    case ".mp4":
                    case ".avi":
                    case ".mov":
                        await bot.SendVideoAsync(chatId: chatId, video: new InputFileStream(stream, Path.GetFileName(outputPath)), replyMarkup: keyboard, caption: answer);
                        break;

                    case ".docx":
                    case ".doc":
                        await bot.SendDocumentAsync(
                            chatId: chatId,
                            document: new InputFileStream(stream, Path.GetFileName(outputPath)), replyMarkup: keyboard, caption: answer);
                        break;

                    case ".pdf":
                        await bot.SendDocumentAsync(
                        chatId: chatId,
                        document: new InputFileStream(stream, Path.GetFileName(outputPath)), replyMarkup: keyboard, caption: answer);
                        break;
                }
                
            }

            // Удаляем файл после отправки
            System.IO.File.Delete(outputPath);
        }


        static async Task HandleMessage(ITelegramBotClient botClient, Message message)
        {
            var me = await botClient.GetMeAsync();
            var UrlId = me.Id.ToString();
            using (var context = new ChatBotDbContext())
            {
                var BotIdDB = await context.Bots
                    .Where(b => b.Url == UrlId).Select(b => b.Id).FirstOrDefaultAsync();
                var commandsId = await context.Commands
                    .Where(b => b.BotId == BotIdDB).Select(b => b.Id)
                    .ToListAsync();
                List<string> callName = new List<string>();
                foreach (var commandId in commandsId)
                {
                    var callname = await context.CommandsCalls
                                .Where(b => b.CommandId == commandId).Select(b => b.CallName).ToListAsync();
                    callName.AddRange(callname);
                }
                foreach (var callname in callName)
                {
                    //if (message.Text == callname)
                    if (message.Text.ToLower().Contains(callname.ToLower()))
                    {
                        var id = await context.CommandsCalls
                                .Where(b => b.CallName == callname).Select(b => b.CommandId).FirstOrDefaultAsync();
                        var idButton = await context.LinkCommands
                                .Where(b => b.CurrentCommand == id).Select(b => b.FollowingCommand).ToListAsync();
                        // создаем список кнопок с вопросами
                        List<InlineKeyboardButton[]> buttonRows = new List<InlineKeyboardButton[]>();
                        foreach (var idbutton in idButton)
                        {
                            var comname = await context.CommandsCalls
                                .Where(b => b.CommandId == idbutton && !b.CallName.StartsWith("/"))
                                .OrderByDescending(b => b.Id)
                                .Select(b => b.CallName)
                                .FirstOrDefaultAsync();
                            InlineKeyboardButton button = InlineKeyboardButton.WithCallbackData(comname, comname);
                            buttonRows.Add(new[] { button });
                        }

                        // создаем клавиатуру с кнопками
                        InlineKeyboardMarkup keyboard = new InlineKeyboardMarkup(buttonRows);
                        var answer = context.QuestionCommands
                            .FirstOrDefault(b => b.CommandId == id)?.Message?.Replace("\\t", "\t").Replace("\\n", "\n") ?? null;
                        var base64 = context.Media
                            .FirstOrDefault(b => b.CommandId == id)?.File ?? null;
                        var base64name = context.Media
                            .FirstOrDefault(b => b.CommandId == id)?.Name ?? null;
                        if (answer != null && base64 != null)
                        {
                            await DecodeBase64ToFileAndSend(base64, base64name, message.Chat.Id.ToString(), botClient, keyboard, answer);
                        }else if (answer != null)
                        {
                            await botClient.SendTextMessageAsync(message.Chat.Id, answer, replyMarkup: keyboard);
                        }
                        else
                        {
                            if (base64name == null) { base64name = "."; }
                            if (base64 != null)
                            {
                                await DecodeBase64ToFileAndSend(base64, base64name, message.Chat.Id.ToString(), botClient, keyboard, answer);
                            }
                        }
                        
                    }
                }
                
            }
        }

        static async Task HandleCallbackQuery(ITelegramBotClient botClient, CallbackQuery callbackQuery)
        {
            var me = await botClient.GetMeAsync();
            var UrlId = me.Id.ToString();
            using (var context = new ChatBotDbContext())
            {
                var BotIdDB = await context.Bots
                    .Where(b => b.Url == UrlId).Select(b => b.Id).FirstOrDefaultAsync();
                var commandsId = await context.Commands
                    .Where(b => b.BotId == BotIdDB).Select(b => b.Id)
                    .ToListAsync();
                var id = await context.CommandsCalls
                                .Where(b => b.CallName == callbackQuery.Data).Select(b => b.CommandId).FirstOrDefaultAsync();
                var idButton = await context.LinkCommands
                        .Where(b => b.CurrentCommand == id).Select(b => b.FollowingCommand).ToListAsync();
                foreach(var command in commandsId)
                {
                    if (command == id)
                    {
                        // создаем список кнопок с вопросами
                        List<InlineKeyboardButton[]> buttonRows = new List<InlineKeyboardButton[]>();
                        foreach (var idbutton in idButton)
                        {
                            var comname = await context.CommandsCalls
                                .Where(b => b.CommandId == idbutton && !b.CallName.StartsWith("/"))
                                .OrderByDescending(b => b.Id)
                                .Select(b => b.CallName)
                                .FirstOrDefaultAsync();
                            InlineKeyboardButton button = InlineKeyboardButton.WithCallbackData(comname, comname);
                            buttonRows.Add(new[] { button });
                        }

                        // создаем клавиатуру с кнопками
                        InlineKeyboardMarkup keyboard = new InlineKeyboardMarkup(buttonRows);

                        var answer = context.QuestionCommands
                                .FirstOrDefault(b => b.CommandId == id)?.Message?.Replace("\\t", "\t").Replace("\\n", "\n") ?? null;
                        var base64 = context.Media
                            .FirstOrDefault(b => b.CommandId == id)?.File ?? null;
                        var base64name = context.Media
                            .FirstOrDefault(b => b.CommandId == id)?.Name ?? null;
                        if (answer != null && base64 != null)
                        {
                            await DecodeBase64ToFileAndSend(base64, base64name, callbackQuery.Message.Chat.Id.ToString(), botClient, keyboard, answer);
                        }
                        else if (answer != null)
                        {
                            await botClient.SendTextMessageAsync(callbackQuery.Message.Chat.Id, answer, replyMarkup: keyboard);
                        }
                        else
                        {
                            if (base64name == null) { base64name = "."; }
                            if (base64 != null)
                            {
                                await DecodeBase64ToFileAndSend(base64, base64name, callbackQuery.Message.Chat.Id.ToString(), botClient, keyboard, answer);
                            }
                        }
                    }
                }
                
                return;
            }
        }

        private static Task Error(ITelegramBotClient client, Exception exception, CancellationToken cancellationToken)
        {
            var ErrorMessage = exception switch
            {
                ApiRequestException apiRequestException
                    => $"Ошибка телеграм АПИ:\n{apiRequestException.ErrorCode}\n{apiRequestException.Message}",
                _ => exception.ToString()
            };
            Console.WriteLine(ErrorMessage);
            return Task.CompletedTask;
            //throw new NotImplementedException();
        }
    }
}
