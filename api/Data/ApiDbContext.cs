using Models;
using Microsoft.EntityFrameworkCore;

namespace Data;

public class ApiDbContext : DbContext
{
    public ApiDbContext(DbContextOptions<ApiDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Desk> Desks { get; set; } = null!;
    public DbSet<Reservation> Reservations { get; set; } = null!;
    public DbSet<Maintenance> Maintenances { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(entity =>
        {
            entity.Property(e => e.FirstName).IsRequired();
            entity.Property(e => e.LastName).IsRequired();

            entity.HasIndex(e => new { e.FirstName, e.LastName }).IsUnique();
        });

        modelBuilder.Entity<Desk>(entity =>
        {
            entity.HasIndex(e => e.Number).IsUnique();
        });

        modelBuilder.Entity<Reservation>(entity =>
        {
            entity.HasOne(e => e.User)
                  .WithMany(u => u.Reservations)
                  .HasForeignKey(e => e.UserId);

            entity.HasOne(e => e.Desk)
                  .WithMany(d => d.Reservations)
                  .HasForeignKey(e => e.DeskId);
        });

        modelBuilder.Entity<Maintenance>(entity =>
        {
            entity.HasOne(e => e.Desk)
                  .WithMany(d => d.Maintenances)
                  .HasForeignKey(e => e.DeskId);
        });
    }
}