using System.ComponentModel.DataAnnotations;

namespace DTOs.Reservations;

public class ReservationCreateDto
{
    [Required]
    public int DeskId { get; set; }
    [Required]
    public int UserId { get; set; }
    [Required]
    public DateOnly StartDate { get; set; }
    [Required]
    public DateOnly EndDate { get; set; }
}