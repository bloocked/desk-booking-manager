namespace Models;

public class Reservation
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int DeskId { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }

    // navigation properties
    
    public User User { get; set; }
    public Desk Desk { get; set; }
}