using Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Controllers;

[ApiController]
[Route("api/[controller]")]
public class MaintenancesController : ControllerBase
{
    private readonly ApiDbContext _context;

    public MaintenancesController(ApiDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetMaintenances()
    {
        var maintenances = await _context.Maintenances.ToListAsync();
        return Ok(maintenances); // map to dto later
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetMaintenance(int id)
    {
        var maintenance = await _context.Maintenances.FindAsync(id);
        if (maintenance == null)
        {
            return NotFound();
        }
        return Ok(maintenance); // map to dto later
    }
}