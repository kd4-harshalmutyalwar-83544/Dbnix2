using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using Task1.Models;

namespace Task1.Controllers
{



    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly Task1Context context;

        public EmployeeController(Task1Context context)
        {
            this.context = context;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Employee>> GetEmployee(int id)
        {
            var emp = await context.Employee.FindAsync(id);
            if (emp == null)
            {
                return NotFound();
            }
            return Ok(emp);
        }

        //[HttpPost("register")]
        //public async Task<ActionResult<Employee>> RegisterEmployee([FromBody] Employee employee)
        //{
        //    context.Employee.Add(employee);
        //    await context.SaveChangesAsync();
        //    return Ok(new { message = "Employee registered successfully!" });
        //}


        [HttpPost("Register")]
        public async Task<ActionResult<Employee>> RegisterEmployee([FromBody] Employee emp)
        {
            if (emp == null) 
                return BadRequest("Invalid data.");

            try
            {
                var employee = context.Employee.FirstOrDefault(e => e.EmployeeId == emp.EmployeeId);
                if (employee == null)
                {
                    return NotFound("Employee not found.");
                }

                if (emp.Action == "Create")
                {
                    employee.Role = emp.Role;
                    context.SaveChanges();
                    return Ok(new { message = "Employee registered successfully" });
                }
                else if (emp.Action == "Delete")
                {
                    context.Employee.Remove(employee);
                    context.SaveChanges();
                    return Ok(new { message = "Employee deleted successfully" });
                }

                return BadRequest("Invalid action.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

    }

}
