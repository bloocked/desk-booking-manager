using Data;
using Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Enums;
using DTOs.Reservations;

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
    public async Task<IActionResult> GetReservations(
        [FromQuery] int? userId,
        [FromQuery] int? deskId)
    {
        var query = _context.Reservations.AsQueryable();

        if (userId != null)
        {
            query = query.Where(r => r.UserId == userId);
        }

        if (deskId != null)
        {
            query = query.Where(r => r.DeskId == deskId);
        }

        var reservations = await query.Select(r => new ReservationResponseDto
        {
            Id = r.Id,
            UserId = r.UserId,
            DeskId = r.DeskId,
            StartDate = r.StartDate,
            EndDate = r.EndDate,
            Status = GetStatus(r, DateOnly.FromDateTime(DateTime.UtcNow.Date))
        })
        .ToListAsync();

        return Ok(reservations);
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
    public async Task<IActionResult> CreateReservation(ReservationCreateDto reservationDto) // sanitize input via dto later
    {
        if (await _context.Desks.FindAsync(reservationDto.DeskId) == null)
        {
            return BadRequest("Invalid DeskId");
        }

        if (await _context.Users.FindAsync(reservationDto.UserId) == null)
        {
            return BadRequest("Invalid UserId");
        }

        if (reservationDto.StartDate >= reservationDto.EndDate)
        {
            return BadRequest("StartDate must be before EndDate");
        }

        if (await _context.Reservations.AnyAsync(r => r.DeskId == reservationDto.DeskId &&
                                                       r.EndDate > reservationDto.StartDate &&
                                                       r.StartDate < reservationDto.EndDate))
        {
            return Conflict("Desk is already reserved for the selected dates");
        }

        var reservation = new Reservation
        {
            DeskId = reservationDto.DeskId,
            UserId = reservationDto.UserId,
            StartDate = reservationDto.StartDate,
            EndDate = reservationDto.EndDate
        };

        _context.Reservations.Add(reservation);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetReservation), new { id = reservation.Id },new ReservationResponseDto
        {
            Id = reservation.Id,
            UserId = reservation.UserId,
            DeskId = reservation.DeskId,
            StartDate = reservation.StartDate,
            EndDate = reservation.EndDate,
        });
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


    private static ReservationStatus GetStatus(Reservation r, DateOnly today)
    {
        if (r.EndDate < today) return ReservationStatus.Past;
        if (r.StartDate > today) return ReservationStatus.Upcoming;
        return ReservationStatus.Active;
    }

}