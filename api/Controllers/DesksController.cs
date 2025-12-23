using Data;
using DTOs.Desks;
using DTOs.Reservations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;

namespace Controllers;

[ApiController]
[Route("api/[controller]")]
public class DesksController : ControllerBase
{
    private readonly ApiDbContext _context;

    public DesksController(ApiDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetDesks()
    {
        var desks = await _context.Desks
            .Include(d => d.Reservations)
                .ThenInclude(r => r.User)
            .Include(d => d.Maintenances)
            .ToListAsync();

        var deskDtos = desks.Select(desk => new DeskResponseDto {
            Id = desk.Id,
            Number = desk.Number,
            Reservations = desk.Reservations.Select(r => new ReservationResponseDto
            {
                Id = r.Id,
                UserId = r.UserId,
                DeskId = r.DeskId,
                StartDate = r.StartDate,
                EndDate = r.EndDate
            }).ToList(),
            Maintenances = desk.Maintenances.Select(m => new MaintenanceResponseDto
            {
                Id = m.Id,
                DeskId = m.DeskId,
                StartDate = m.StartDate,
                EndDate = m.EndDate
            }).ToList()
        }).ToList(); // apparently makes it faster?

        return Ok(deskDtos);
    }
}