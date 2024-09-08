using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class ProjectController : ControllerBase
{
    private readonly AppDbContext _context;

    public ProjectController(AppDbContext context)
    {
        _context = context;
    }

[HttpGet]
public async Task<ActionResult<IEnumerable<Project>>> GetProject()
{
    var projects = await _context.Projects
        .Include(p => p.Customer)
        .ThenInclude(c => c.Projects)
        .ToListAsync();

    foreach (var project in projects)
    {
        if (project.Customer != null)
        {
            project.Customer.Projects = project.Customer.Projects.Where(p => p.Id != project.Id).ToList();
        }
    }

    return Ok(projects);
}

    [HttpPost]
    public async Task<IActionResult> CreateProject([FromBody] Project project)
    {
        var customer = await _context.Customers.FindAsync(project.CustomerId);

        if (customer == null)
        {
            return NotFound($"Customer with Id {project.CustomerId} not found.");
        }

        
        project.Customer = customer;

        _context.Projects.Add(project);

        try
        {
            await _context.SaveChangesAsync();
            return Ok(project);
        }
        catch (DbUpdateException ex)
        {
            return StatusCode(500, $"An error occurred while saving the project: {ex.Message}");
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProject(int id, [FromBody] Project project)
    {
        if (id != project.Id)
        {
            return BadRequest("Project ID mismatch.");
        }

        _context.Entry(project).State = EntityState.Modified;


            var customerExists = await _context.Customers.AnyAsync(c => c.Id == project.CustomerId);
            if (!customerExists)
            {
                return BadRequest("Invalid CustomerId.");
            }

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!ProjectExists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProject(int id)
    {
        var project = await _context.Projects.FindAsync(id);
        if (project == null)
        {
            return NotFound();
        }

        _context.Projects.Remove(project);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool ProjectExists(int id)
    {
        return _context.Projects.Any(p => p.Id == id);
    }
}
