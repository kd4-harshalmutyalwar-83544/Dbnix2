using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Task1.Models;

namespace Task1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoanController : ControllerBase
    {
        private readonly Task1Context context;

        public LoanController(Task1Context context)
        {
            this.context = context;
        }


        [HttpGet]
        public async Task<ActionResult<List<Loan>>> GetLoan()
        {
            var data = await context.Loans.ToListAsync();
            return Ok(data);
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<Loan>> GetLoanById(int id)
            {
            var loan = await context.Loans.FindAsync(id);
                
            if(loan == null)
            {
                return NotFound();
            }
            return loan;
            }




        [HttpPost]
        public async Task<ActionResult<Loan>> CreateLoan(Loan lnt)
        {
            await context.Loans.AddAsync(lnt);
            await context.SaveChangesAsync();
            return Ok(lnt);

        }


        [HttpPut("{id}")]
        public async Task<ActionResult<Loan>> UpdateLoan(int id, Loan lnt)
        {
            if(id != lnt.LoanId)
            {
                return BadRequest();
            }
            context.Entry(lnt).State = EntityState.Modified;
            await context.SaveChangesAsync();
            return Ok(lnt);

        }


        [HttpDelete("{id}")]
        public async Task<ActionResult<Loan>> DeleteLoan(int id)
        {
            var lnt = await context.Loans.FindAsync(id);
            if(lnt == null)
            {
                return NotFound();
            }
             context.Loans.Remove(lnt);
            await context.SaveChangesAsync();
            return Ok();

        }
    }
    
}
