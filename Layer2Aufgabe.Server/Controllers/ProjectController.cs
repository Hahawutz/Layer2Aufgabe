using Microsoft.AspNetCore.Authorization;
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

    /// <summary>
    /// Retrieves a list of all projects along with their associated customer and customer's projects.
    /// </summary>
    [HttpGet]
    [Authorize(Roles = "Write,Read,Admin")]
    public async Task<ActionResult<IEnumerable<Project>>> GetProject()
    {
        var projects = await _context.Projects
            .Include(p => p.Customer)
            .ThenInclude(c => c.Projects)
            .ToListAsync();

        // Filter the current project from the customer's project list
        foreach (var project in projects)
        {
            if (project.Customer != null)
            {
                project.Customer.Projects = project.Customer.Projects.Where(p => p.Id != project.Id).ToList();
            }
        }

        return Ok(projects);
    }

    /// <summary>
    /// Retrieves a specific project by ID, including its associated customer.
    /// </summary>
    /// <param name="id">The ID of the project.</param>
    /// <returns>The requested project or NotFound if the project does not exist.</returns>
    /// <remarks>
    /// Example Request:
    ///
    ///     {
    ///        "id": number
    ///     }
    ///
    /// </remarks>
    [HttpGet("{id}")]
    [Authorize(Roles = "Write,Read,Admin")]
    public async Task<ActionResult<Project>> GetProject(int id)
    {
        var project = await _context.Projects.Include(p => p.Customer).FirstOrDefaultAsync(p => p.Id == id);
        if (project == null)
        {
            return NotFound();
        }
        return project;
    }

    /// <summary>
    /// Creates a new project associated with a customer.
    /// </summary>
    /// <param name="project">The project object to be created.</param>
    /// <returns>Returns the newly created project or an error if the operation fails.</returns>
    [HttpPost]
    [Authorize(Roles = "Write,Admin")]
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

    /// <summary>
    /// Updates an existing project based on the ID.
    /// </summary>
    /// <param name="id">The ID of the project to be updated.</param>
    /// <param name="project">The updated project object.</param>
    /// <returns>NoContent if the update was successful, or an appropriate error response.</returns>
    /// <remarks>
    /// Example Request:
    ///
    ///     {
    ///        "id": number,
    ///        "description": "Description",
    ///        "startDate": "2024-09-08",
    ///        "endDate": "2024-09-08",
    ///        "responsiblePerson": "Mustermann Max",
    ///         "customerId": 0
    ///     }
    ///
    /// </remarks>
    [HttpPut("{id}")]
    [Authorize(Roles = "Write,Admin")]
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

    /// <summary>
    /// Deletes a project based on the ID.
    /// </summary>
    /// <param name="id">The ID of the project to be deleted.</param>
    /// <returns>NoContent if the project was successfully deleted, or NotFound if the project does not exist.</returns>
    /// <remarks>
    /// Example Request:
    ///
    ///     {
    ///        "id": number
    ///     }
    ///
    /// </remarks>
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
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

    /// <summary>
    /// Checks if a project with the given ID exists.
    /// </summary>
    /// <param name="id">The ID of the project.</param>
    /// <returns>True if the project exists, otherwise False.</returns>
    private bool ProjectExists(int id)
    {
        return _context.Projects.Any(p => p.Id == id);
    }
}
