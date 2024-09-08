public class Customer
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Code { get; set; }
    public string ResponsiblePerson { get; set; }
    public DateTime StartDate { get; set; }

    /// <example>"[]"</example>
    public virtual ICollection<Project>? Projects { get; set; }
}
