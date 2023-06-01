using System;
using System.Collections.Generic;

namespace ChatBotTelega;

public partial class QuestionCommand
{
    public string QuestionId { get; set; } = null!;

    public string? CommandId { get; set; }

    public string? Message { get; set; }
}
