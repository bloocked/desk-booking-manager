namespace Models;

public class User
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }

    // navigation properties

    public ICollection<Reservation> Reservations { get; set; }
}