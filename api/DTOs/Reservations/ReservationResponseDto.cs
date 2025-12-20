using Enums;

namespace DTOs.Reservations;

public class ReservationResponseDto
{
    public int UserId { get; set; }
    public int DeskId { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public ReservationStatus Status { get; set; }
}