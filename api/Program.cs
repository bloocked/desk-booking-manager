using Microsoft.EntityFrameworkCore;
using Data;
using Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<ApiDbContext>(options =>
    options.UseInMemoryDatabase("DesksDb"));

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors();

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApiDbContext>();
    await dbContext.Database.EnsureCreatedAsync();

    dbContext.Users.AddRange(
        new User { FirstName = "Demo", LastName = "User" },
        new User { FirstName = "John", LastName = "Reservationer" }
    );

    dbContext.Desks.AddRange(
        new Desk { DeskNumber = 101 },
        new Desk { DeskNumber = 102 },
        new Desk { DeskNumber = 103 },
        new Desk { DeskNumber = 104 },
        new Desk { DeskNumber = 105 }
    );
    await dbContext.SaveChangesAsync();

    dbContext.Reservations.AddRange(
        new Reservation
        {
            UserId = 1,
            DeskId = 1,
            StartDate = DateOnly.FromDateTime(DateTime.UtcNow.Date),
            EndDate = DateOnly.FromDateTime(DateTime.UtcNow.Date.AddDays(2))
        },
        new Reservation
        {
            UserId = 2,
            DeskId = 2,
            StartDate = DateOnly.FromDateTime(DateTime.UtcNow.Date.AddDays(1)),
            EndDate = DateOnly.FromDateTime(DateTime.UtcNow.Date.AddDays(3))
        },
        new Reservation
        {
            UserId = 2,
            DeskId = 2,
            StartDate = DateOnly.FromDateTime(DateTime.UtcNow.Date.AddDays(5)),
            EndDate = DateOnly.FromDateTime(DateTime.UtcNow.Date.AddDays(7))
        }
    );

    dbContext.Maintenances.AddRange(
        new Maintenance
        {
            DeskId = 3,
            StartDate = DateOnly.FromDateTime(DateTime.UtcNow.Date),
            EndDate = DateOnly.FromDateTime(DateTime.UtcNow.Date.AddDays(1))
        },
        new Maintenance
        {
            DeskId = 4,
            StartDate = DateOnly.FromDateTime(DateTime.UtcNow.Date.AddDays(2)),
            EndDate = DateOnly.FromDateTime(DateTime.UtcNow.Date.AddDays(4))
        });

    await dbContext.SaveChangesAsync();
}

app.Run();