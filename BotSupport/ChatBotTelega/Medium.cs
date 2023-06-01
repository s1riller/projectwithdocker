using System;
using System.Collections.Generic;

namespace ChatBotTelega;

public partial class Medium
{
    public string Id { get; set; } = null!;

    public string? CommandId { get; set; }

    public string? Name { get; set; }

    public string? Type { get; set; }

    public string? File { get; set; }
}
