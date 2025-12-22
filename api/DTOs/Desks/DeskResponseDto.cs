using DTOs.Reservations;

namespace DTOs.Desks;

public class DeskResponseDto
{
    public int Id { get; set; }
    public int Number { get; set; }
    public List<ReservationResponseDto> Reservations { get; set; } = new();
    public List<MaintenanceResponseDto> Maintenances { get; set; } = new();
}