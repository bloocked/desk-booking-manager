using Models;
using Microsoft.EntityFrameworkCore;

namespace Data;

public class ApiDbContext : DbContext
{
    public ApiDbContext(DbContextOptions<ApiDbContext> options) : base(options)
    {
    }
}