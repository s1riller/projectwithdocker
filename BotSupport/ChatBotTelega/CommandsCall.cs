using System;
using System.Collections.Generic;

namespace ChatBotTelega;

public partial class CommandsCall
{
    public string Id { get; set; } = null!;

    public string? CommandId { get; set; }

    public string? CallName { get; set; }
}
