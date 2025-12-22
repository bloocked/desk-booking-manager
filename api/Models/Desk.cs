namespace Models;

public class Desk
{
    public int Id { get; set; }
    public int Number { get; set; }

    //navigation property

    public ICollection<Reservation> Reservations = new List<Reservation>();

    public ICollection<Maintenance> Maintenances = new List<Maintenance>();
}