namespace Models;

public class User
{
    public int Id { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }

    // navigation properties

    public ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
}