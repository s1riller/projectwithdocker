using System;
using System.Collections.Generic;

namespace ChatBotTelega;

public partial class LinkCommand
{
    public string Id { get; set; } = null!;

    public string? CurrentCommand { get; set; }

    public string? FollowingCommand { get; set; }
}
