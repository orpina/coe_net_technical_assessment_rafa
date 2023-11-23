using AssessmentAPI.DTO;
using AssessmentAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AssessmentAPI.Controllers
{
    [Route("api/auth"),ApiController, Authorize]
    public class AuthController : ControllerBase
    {
        [HttpGet("test")]
        public ActionResult Test()
        {
            return Ok(new { Message = "Token is valid and working", Time = DateTime.Now.ToString("s") });
        }

        [HttpPost("login"), AllowAnonymous]
        public async Task<ActionResult<LoginResponse>> Login(LoginRequest request, [FromServices] AuthenticationService authenticationService)
        {
            if (!ModelState.IsValid) { return BadRequest(ModelState); }
            var (success, username) = await authenticationService.LoginAsync(request);
            if (success == true)
            {
                var response = new LoginResponse()
                {
                    Username = username,
                    Message = "Login successful"
                };
                var token = authenticationService.GenerateToken(username);
                // Set JWT token as an HTTP cookie
                var cookieOptions = new CookieOptions
                {
                    HttpOnly = true,
                    SameSite = SameSiteMode.Strict,
                    Secure = true
                };
                Response.Cookies.Append("X-Access-Token", token, cookieOptions);
                return Ok(response);
            }
            return Unauthorized();
        }
    }
}
