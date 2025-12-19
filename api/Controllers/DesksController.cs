using Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
        var desks = await _context.Desks.ToListAsync();
        return Ok(desks); // map to dto later
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetDesk(int id)
    {
        var desk = await _context.Desks.FindAsync(id);
        if (desk == null)
        {
            return NotFound();
        }
        return Ok(desk); // map to dto later
    }
}