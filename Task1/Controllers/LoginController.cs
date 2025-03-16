using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Task1.DTO;
using Task1.Models;

namespace Task1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        IConfiguration _config;

        Task1Context context = null;
        public LoginController(IConfiguration config, Task1Context _context)
        {
            _config = config;
            context = _context;
        }

        [HttpPost]
        public IActionResult Login([FromBody] LoginRequestDTO loginRequest)
        {

            var user = context.Login.Where(u => u.username == loginRequest.username).FirstOrDefault();

            if (user != null)
            {

                var userPassword = context.Login.Where(u => u.password == loginRequest.password).FirstOrDefault();

                if (userPassword != null)
                {
                    var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
                    var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

                    var Sectoken = new JwtSecurityToken(_config["Jwt:Issuer"],
                      _config["Jwt:Issuer"],
                      null,
                      expires: DateTime.Now.AddMinutes(120),
                      signingCredentials: credentials);

                    var token = new JwtSecurityTokenHandler().WriteToken(Sectoken);

                    var value = new { name = user.username, token };

                    return base.Ok(value);



                }
                else
                {
                    return Ok("Invalid Password...");
                }

            }
            else
            {
                return Ok("Invalid username...");
            }
        }
    
}
}
