namespace Models;

public class Maintenance
{
    public int Id { get; set; }
    public int DeskId { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }

    // navigation properties

    public Desk Desk { get; set; } = null!;
}