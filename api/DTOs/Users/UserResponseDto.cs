using DTOs.Reservations;
using Models;

namespace DTOs.Users;

public class UserResponseDto
{
    public int Id { get; set; }
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
}