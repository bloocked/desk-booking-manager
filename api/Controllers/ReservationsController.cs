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

        var reservationDto = new ReservationResponseDto
        {
            Id = reservation.Id,
            UserId = reservation.UserId,
            DeskId = reservation.DeskId,
            StartDate = reservation.StartDate,
            EndDate = reservation.EndDate,
            Status = GetStatus(reservation, DateOnly.FromDateTime(DateTime.UtcNow.Date))
        };

        return Ok(reservationDto);
    }

    [HttpPost]
    public async Task<IActionResult> CreateReservation(ReservationCreateDto reservationDto)
    {
        if (await _context.Desks.FindAsync(reservationDto.DeskId) == null)
        {
            return BadRequest("Invalid DeskId");
        }

        if (await _context.Users.FindAsync(reservationDto.UserId) == null)
        {
            return BadRequest("Invalid UserId");
        }

        if (reservationDto.StartDate > reservationDto.EndDate)
        {
            return BadRequest("StartDate must be before EndDate");
        }

        if (await _context.Reservations.AnyAsync(r => r.DeskId == reservationDto.DeskId &&
                                                       r.EndDate >= reservationDto.StartDate &&
                                                       r.StartDate <= reservationDto.EndDate))
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
        return CreatedAtAction(nameof(GetReservation), new { id = reservation.Id }, new ReservationResponseDto
        {
            Id = reservation.Id,
            UserId = reservation.UserId,
            DeskId = reservation.DeskId,
            StartDate = reservation.StartDate,
            EndDate = reservation.EndDate,
        });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> CancelReservation(int id, [FromQuery] DateOnly? cancelDate)
    {
        var reservation = await _context.Reservations.FindAsync(id);
        if (reservation == null)
        {
            return NotFound();
        }

        if (cancelDate != null && (cancelDate > reservation.EndDate || cancelDate < reservation.StartDate))
        {
            return BadRequest("CancelDate must be within the reservation period");
        }

        if (cancelDate != null)
        {
            await CancelSpecificDay(reservation, cancelDate.Value);
        }
        else
        {
            _context.Reservations.Remove(reservation);
        }

        await _context.SaveChangesAsync();
        return NoContent();
    }


    private static ReservationStatus GetStatus(Reservation r, DateOnly today)
    {
        if (r.EndDate < today) return ReservationStatus.Past;
        if (r.StartDate > today) return ReservationStatus.Upcoming;
        return ReservationStatus.Active;
    }

    private async Task CancelSpecificDay(Reservation reservation, DateOnly cancelDate)
    {
        if (reservation.StartDate == cancelDate && reservation.EndDate == cancelDate)
        {
            _context.Reservations.Remove(reservation);
        }
        else if (reservation.StartDate == cancelDate)
        {
            reservation.StartDate = reservation.StartDate.AddDays(1);
            _context.Reservations.Update(reservation);
        }
        else if (reservation.EndDate == cancelDate)
        {
            reservation.EndDate = reservation.EndDate.AddDays(-1);
            _context.Reservations.Update(reservation);
        }
        else
        {
            var newReservation = new Reservation
            {
                DeskId = reservation.DeskId,
                UserId = reservation.UserId,
                StartDate = cancelDate.AddDays(1),
                EndDate = reservation.EndDate
            };

            reservation.EndDate = cancelDate.AddDays(-1);
            _context.Reservations.Update(reservation);
            _context.Reservations.Add(newReservation);
        }

        await _context.SaveChangesAsync();
    }

}