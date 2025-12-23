using Data;
using Models;

namespace utils;

public class Seeder
{
    public async static void Seed(ApiDbContext context)
    {
        context.Users.AddRange(
        new User { FirstName = "Demo", LastName = "User" },
        new User { FirstName = "John", LastName = "Reservationer" }
);

        context.Desks.AddRange(
            new Desk { Number = 101 },
            new Desk { Number = 102 },
            new Desk { Number = 103 },
            new Desk { Number = 104 }
        );
        await context.SaveChangesAsync();

        context.Reservations.AddRange(
            new Reservation
            {
                UserId = 1,
                DeskId = 1,
                StartDate = DateOnly.FromDateTime(DateTime.UtcNow.Date.AddDays(-10)),
                EndDate = DateOnly.FromDateTime(DateTime.UtcNow.Date.AddDays(-8))
            },
            new Reservation
            {
                UserId = 1,
                DeskId = 2,
                StartDate = DateOnly.FromDateTime(DateTime.UtcNow.Date.AddDays(-5)),
                EndDate = DateOnly.FromDateTime(DateTime.UtcNow.Date.AddDays(-3))
            },
            new Reservation
            {
                UserId = 1,
                DeskId = 3,
                StartDate = DateOnly.FromDateTime(DateTime.UtcNow.Date.AddDays(-2)),
                EndDate = DateOnly.FromDateTime(DateTime.UtcNow.Date.AddDays(-1))
            },
            new Reservation
            {
                UserId = 1,
                DeskId = 1,
                StartDate = DateOnly.FromDateTime(DateTime.UtcNow.Date),
                EndDate = DateOnly.FromDateTime(DateTime.UtcNow.Date)
            },
            new Reservation
            {
                UserId = 2,
                DeskId = 2,
                StartDate = DateOnly.FromDateTime(DateTime.UtcNow.Date),
                EndDate = DateOnly.FromDateTime(DateTime.UtcNow.Date)
            }
        );

        context.Maintenances.AddRange(
            new Maintenance
            {
                DeskId = 3,
                StartDate = DateOnly.FromDateTime(DateTime.UtcNow.Date),
                EndDate = DateOnly.FromDateTime(DateTime.UtcNow.Date)
            }
        );

        await context.SaveChangesAsync();
    }
}