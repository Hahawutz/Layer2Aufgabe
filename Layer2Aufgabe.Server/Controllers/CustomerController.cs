using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class CustomerController : ControllerBase
{
    private readonly AppDbContext _context;

    public CustomerController(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Retrieves a list of all customers along with their associated projects.
    /// </summary>
    [HttpGet]
    [Authorize(Roles = "Write,Read,Admin")]
    public async Task<ActionResult<IEnumerable<Customer>>> GetCustomers()
    {
        return await _context.Customers.Include(c => c.Projects).ToListAsync();
    }

    /// <summary>
    /// Retrieves a specific customer by ID, including their projects.
    /// </summary>
    /// <param name="id">The ID of the customer.</param>
    /// <returns>The requested customer or NotFound if the customer does not exist.</returns>
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
    public async Task<ActionResult<Customer>> GetCustomer(int id)
    {
        var customer = await _context.Customers
                                     .Include(c => c.Projects)
                                     .FirstOrDefaultAsync(c => c.Id == id);

        if (customer == null)
        {
            return NotFound();
        }

        return customer;
    }

    /// <summary>
    /// Creates a new customer.
    /// </summary>
    /// <param name="customer">The customer object to be created.</param>
    /// <returns>Returns the newly created customer and sets the Location header to the new customer's URL.</returns>
    [HttpPost]
    [Authorize(Roles = "Write,Admin")]
    public async Task<ActionResult<Customer>> PostCustomer(Customer customer)
    {
        _context.Customers.Add(customer);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetCustomer), new { id = customer.Id }, customer);
    }

    /// <summary>
    /// Updates an existing customer based on the ID.
    /// </summary>
    /// <param name="id">The ID of the customer to be updated.</param>
    /// <param name="customer">The updated customer object.</param>
    /// <returns>NoContent if the update was successful, or the appropriate error response.</returns>
    /// <remarks>
    /// Example Request:
    ///
    ///     {
    ///        "id": number,
    ///        "name": "string",
    ///        "code": "string",
    ///        "responsiblePerson": "string",
    ///        "startDate": "2024-09-08T16:57:17.228Z"
    ///     }
    ///
    /// </remarks>
    [HttpPut("{id}")]
    [Authorize(Roles = "Write,Admin")]
    public async Task<IActionResult> PutCustomer(int id, [FromBody] Customer customer)
    {
        if (id != customer.Id)
        {
            return BadRequest("Customer ID mismatch.");
        }

        var existingCustomer = await _context.Customers.FindAsync(id);
        if (existingCustomer == null)
        {
            return NotFound();
        }

        existingCustomer.Name = customer.Name;
        existingCustomer.Code = customer.Code;
        existingCustomer.ResponsiblePerson = customer.ResponsiblePerson;
        existingCustomer.StartDate = customer.StartDate;

        _context.Entry(existingCustomer).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!CustomerExists(id))
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
    /// Deletes a customer based on the ID.
    /// </summary>
    /// <param name="id">The ID of the customer to be deleted.</param>
    /// <returns>NoContent if the customer was successfully deleted, or NotFound if the customer does not exist.</returns>
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteCustomer(int id)
    {
        var customer = await _context.Customers.FindAsync(id);
        if (customer == null)
        {
            return NotFound();
        }

        _context.Customers.Remove(customer);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    /// <summary>
    /// Checks if a customer with the given ID exists.
    /// </summary>
    /// <param name="id">The ID of the customer.</param>
    /// <returns>True if the customer exists, otherwise False.</returns>
    private bool CustomerExists(int id)
    {
        return _context.Customers.Any(e => e.Id == id);
    }
}
