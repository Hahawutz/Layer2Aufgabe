﻿using Microsoft.AspNetCore.Authorization;
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

    [HttpGet]
    [Authorize(Roles = "Write,Read,Admin")]
    public async Task<ActionResult<IEnumerable<Customer>>> GetCustomers()
    {
        return await _context.Customers.Include(c => c.Projects).ToListAsync();
    }

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

    [HttpPost]
    [Authorize(Roles = "Write,Admin")]
    public async Task<ActionResult<Customer>> PostCustomer(Customer customer)
    {
        _context.Customers.Add(customer);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetCustomer), new { id = customer.Id }, customer);
    }

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

    private bool CustomerExists(int id)
    {
        return _context.Customers.Any(e => e.Id == id);
    }
}
