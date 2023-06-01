using System;
using System.Collections.Generic;

namespace ChatBotTelega;

public partial class MailCommand
{
    public string Id { get; set; } = null!;

    public string? CommandId { get; set; }

    public string? Message { get; set; }

    public DateTime? Date { get; set; }

    public TimeSpan? Time { get; set; }
}
