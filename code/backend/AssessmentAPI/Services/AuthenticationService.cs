using AssessmentAPI.DTO;
using AssessmentAPI.Models;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;

namespace AssessmentAPI.Services
{
    public class AuthenticationService
    {
        private readonly AuthenticationSettings _settings;

        public AuthenticationService(IOptionsMonitor<AuthenticationSettings> optionsMonitor)
        {
            _settings = optionsMonitor.CurrentValue;
        }

        public string GenerateToken(string username)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_settings.SecretKey));
            var signingCredentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.UtcNow.AddHours(3);

            var claims = new Claim[] {
            new Claim(JwtRegisteredClaimNames.Sub, username),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Audience = _settings.Audience,
                Issuer = _settings.Issuer,
                Subject = new ClaimsIdentity(claims),
                Expires = expires,
                SigningCredentials = signingCredentials
            };

            var tokenHandler = new JsonWebTokenHandler();
            return tokenHandler.CreateToken(tokenDescriptor);
        }

        public async Task<Tuple<bool,string>> LoginAsync(LoginRequest loginRequest)
        {
            if (loginRequest.Username == "pruebas" && loginRequest.Password == "Estadificil.1")
            {
                return await Task.FromResult(Tuple.Create(true, loginRequest.Username));
            }
            return await Task.FromResult(Tuple.Create(false, loginRequest.Username));
        }
    }
}
