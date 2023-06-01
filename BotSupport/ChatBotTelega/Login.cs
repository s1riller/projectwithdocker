using System;
using System.Collections.Generic;

namespace ChatBotTelega;

public partial class Login
{
    public string Id { get; set; } = null!;

    public string? Email { get; set; }

    public string? Password { get; set; }

    public string? UserName { get; set; }
}
