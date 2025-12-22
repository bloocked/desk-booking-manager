public class MaintenanceResponseDto
{
    public int Id { get; set; }
    public int DeskId { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public string? Description { get; set; }
}