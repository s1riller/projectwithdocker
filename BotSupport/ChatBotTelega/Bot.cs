using System;
using System.Collections.Generic;

namespace ChatBotTelega;

public partial class Bot
{
    public string Id { get; set; } = null!;

    public int? LoginId { get; set; }

    public string? AppName { get; set; }

    public string? Token { get; set; }

    public string? Url { get; set; }

    public string? Name { get; set; }

    public bool? LaunchStatus { get; set; }
}
