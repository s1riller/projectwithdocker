using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace ChatBotTelega;

public partial class ChatBotDbContext : DbContext
{
    public ChatBotDbContext()
    {
    }

    public ChatBotDbContext(DbContextOptions<ChatBotDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Bot> Bots { get; set; }

    public virtual DbSet<BotsChat> BotsChats { get; set; }

    public virtual DbSet<Command> Commands { get; set; }

    public virtual DbSet<CommandsCall> CommandsCalls { get; set; }

    public virtual DbSet<LinkCommand> LinkCommands { get; set; }

    public virtual DbSet<Login> Logins { get; set; }

    public virtual DbSet<MailCommand> MailCommands { get; set; }

    public virtual DbSet<Medium> Media { get; set; }

    public virtual DbSet<QuestionCommand> QuestionCommands { get; set; }

    public virtual DbSet<TypesCommand> TypesCommands { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Data Source=WIN-6Q4J29POE5E\\SQLEXPRESS; Initial Catalog=ChatBotDB; Integrated Security=True;TrustServerCertificate=True");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.UseCollation("Cyrillic_General_CI_AS");

        modelBuilder.Entity<Bot>(entity =>
        {
            entity.ToTable("bots");

            entity.Property(e => e.Id)
                .HasMaxLength(70)
                .HasColumnName("id");
            entity.Property(e => e.AppName)
                .HasMaxLength(50)
                .HasColumnName("app_name");
            entity.Property(e => e.LaunchStatus).HasColumnName("launch_status");
            entity.Property(e => e.LoginId).HasColumnName("login_id");
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .HasColumnName("name");
            entity.Property(e => e.Token)
                .HasMaxLength(100)
                .HasColumnName("token");
            entity.Property(e => e.Url)
                .HasMaxLength(100)
                .HasColumnName("url");
        });

        modelBuilder.Entity<BotsChat>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_bots_users");

            entity.ToTable("bots_chats");

            entity.Property(e => e.Id)
                .HasMaxLength(70)
                .HasColumnName("id");
            entity.Property(e => e.BotId)
                .HasMaxLength(70)
                .HasColumnName("bot_id");
            entity.Property(e => e.ChatId)
                .HasMaxLength(70)
                .HasColumnName("chat_id");
        });

        modelBuilder.Entity<Command>(entity =>
        {
            entity.ToTable("commands");

            entity.Property(e => e.Id)
                .HasMaxLength(70)
                .HasColumnName("id");
            entity.Property(e => e.BotId)
                .HasMaxLength(70)
                .HasColumnName("bot_id");
            entity.Property(e => e.CommandName)
                .HasMaxLength(100)
                .HasColumnName("command_name");
            entity.Property(e => e.LinkStatus).HasColumnName("link_status");
            entity.Property(e => e.TypeId)
                .HasMaxLength(70)
                .HasColumnName("type_id");
        });

        modelBuilder.Entity<CommandsCall>(entity =>
        {
            entity.ToTable("commands_calls");

            entity.Property(e => e.Id)
                .HasMaxLength(70)
                .HasColumnName("id");
            entity.Property(e => e.CallName)
                .HasMaxLength(70)
                .HasColumnName("call_name");
            entity.Property(e => e.CommandId)
                .HasMaxLength(70)
                .HasColumnName("command_id");
        });

        modelBuilder.Entity<LinkCommand>(entity =>
        {
            entity.ToTable("link_commands");

            entity.Property(e => e.Id)
                .HasMaxLength(70)
                .HasColumnName("id");
            entity.Property(e => e.CurrentCommand)
                .HasMaxLength(70)
                .HasColumnName("current_command");
            entity.Property(e => e.FollowingCommand)
                .HasMaxLength(70)
                .HasColumnName("following_command");
        });

        modelBuilder.Entity<Login>(entity =>
        {
            entity.ToTable("logins");

            entity.Property(e => e.Id)
                .HasMaxLength(70)
                .HasColumnName("id");
            entity.Property(e => e.Email)
                .HasMaxLength(50)
                .HasColumnName("email");
            entity.Property(e => e.Password)
                .HasMaxLength(128)
                .HasColumnName("password");
            entity.Property(e => e.UserName)
                .HasMaxLength(64)
                .HasColumnName("user_name");
        });

        modelBuilder.Entity<MailCommand>(entity =>
        {
            entity.ToTable("mail_command");

            entity.Property(e => e.Id)
                .HasMaxLength(70)
                .HasColumnName("id");
            entity.Property(e => e.CommandId)
                .HasMaxLength(70)
                .HasColumnName("command_id");
            entity.Property(e => e.Date)
                .HasColumnType("date")
                .HasColumnName("date");
            entity.Property(e => e.Message)
                .HasMaxLength(100)
                .HasColumnName("message");
            entity.Property(e => e.Time).HasColumnName("time");
        });

        modelBuilder.Entity<Medium>(entity =>
        {
            entity.ToTable("media");

            entity.Property(e => e.Id)
                .HasMaxLength(70)
                .HasColumnName("id");
            entity.Property(e => e.CommandId)
                .HasMaxLength(70)
                .HasColumnName("command_id");
            entity.Property(e => e.File).HasColumnName("file");
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .HasColumnName("name");
            entity.Property(e => e.Type)
                .HasMaxLength(50)
                .HasColumnName("type");
        });

        modelBuilder.Entity<QuestionCommand>(entity =>
        {
            entity.HasKey(e => e.QuestionId).HasName("PK_question_commands");

            entity.ToTable("question_command");

            entity.Property(e => e.QuestionId)
                .HasMaxLength(70)
                .HasColumnName("question_id");
            entity.Property(e => e.CommandId)
                .HasMaxLength(70)
                .HasColumnName("command_id");
            entity.Property(e => e.Message)
                .HasMaxLength(2000)
                .HasColumnName("message");
        });

        modelBuilder.Entity<TypesCommand>(entity =>
        {
            entity.ToTable("types_command");

            entity.Property(e => e.Id)
                .HasMaxLength(70)
                .HasColumnName("id");
            entity.Property(e => e.TypeName)
                .HasMaxLength(30)
                .HasColumnName("type_name");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
