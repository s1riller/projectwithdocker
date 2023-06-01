using System;
using System.Collections.Generic;

namespace ChatBotTelega;

public partial class Command
{
    public string Id { get; set; } = null!;

    public string? BotId { get; set; }

    public string? CommandName { get; set; }

    public string? TypeId { get; set; }

    public bool? LinkStatus { get; set; }
}
