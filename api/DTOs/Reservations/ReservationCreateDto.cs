namespace DTOs.Reservations;

public class ReservationCreateDto
{
    public int DeskId { get; set; }
    public int UserId { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
}