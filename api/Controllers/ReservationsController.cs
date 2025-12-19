using Data;
using Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReservationsController : ControllerBase
{
    private readonly ApiDbContext _context;

    public ReservationsController(ApiDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetReservations()
    {
        var reservations = await _context.Reservations.ToListAsync();
        return Ok(reservations); // map to dto later
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetReservation(int id)
    {
        var reservation = await _context.Reservations.FindAsync(id);
        if (reservation == null)
        {
            return NotFound();
        }
        return Ok(reservation); // map to dto later
    }

    [HttpPost]
    public async Task<IActionResult> CreateReservation(Reservation reservation) // sanitize input via dto later
    {
        if (await _context.Desks.FindAsync(reservation.DeskId) == null)
        {
            return BadRequest("Invalid DeskId");
        }

        if (await _context.Users.FindAsync(reservation.UserId) == null)
        {
            return BadRequest("Invalid UserId");
        }

        if (reservation.StartDate >= reservation.EndDate)
        {
            return BadRequest("StartDate must be before EndDate");
        }

        if (await _context.Reservations.AnyAsync(r => r.DeskId == reservation.DeskId &&
                                                       r.EndDate > reservation.StartDate &&
                                                       r.StartDate < reservation.EndDate))
        {
            return Conflict("Desk is already reserved for the selected dates");
        }

        _context.Reservations.Add(reservation);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetReservation), new { id = reservation.Id }, reservation);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> CancelReservation(int id)
    {
        var reservation = await _context.Reservations.FindAsync(id);
        if (reservation == null)
        {
            return NotFound();
        }

        _context.Reservations.Remove(reservation);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}