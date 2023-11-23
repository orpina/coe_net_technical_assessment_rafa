using AssessmentAPI.Models;
using AssessmentAPI.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
const string CORS_DEFAULT_POLICY = "DefaultCORSPolicy";

var builder = WebApplication.CreateBuilder(args);
{
    builder.Services.Configure<AuthenticationSettings>(builder.Configuration.GetSection(nameof(AuthenticationSettings)));
    builder.Services.AddSingleton<AuthenticationService>();

    builder.Services.AddDbContext<DatabaseContext>(options => options.UseInMemoryDatabase("TechnicalAssessment"));

    var authenticationSettings = new AuthenticationSettings();
    builder.Configuration.Bind(key: nameof(AuthenticationSettings), instance: authenticationSettings);
    builder.Services.AddAuthentication(i =>
    {
        i.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        i.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        i.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
        i.DefaultSignInScheme = JwtBearerDefaults.AuthenticationScheme;
    })
              .AddJwtBearer(options =>
              {
                  options.TokenValidationParameters = new TokenValidationParameters
                  {
                      ValidateIssuer = true,
                      ValidateAudience = true,
                      ValidateLifetime = true,
                      ValidateIssuerSigningKey = true,
                      ValidIssuer = authenticationSettings.Issuer,
                      ValidAudience = authenticationSettings.Audience,
                      IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(authenticationSettings.SecretKey)),
                      ClockSkew = authenticationSettings.Expire
                  };
                  options.SaveToken = true;
                  options.Events = new JwtBearerEvents();
                  options.Events.OnMessageReceived = context =>
                  {

                      if (context.Request.Cookies.ContainsKey("X-Access-Token"))
                      {
                          context.Token = context.Request.Cookies["X-Access-Token"];
                      }

                      return Task.CompletedTask;
                  };
              })
              .AddCookie(options =>
              {
                  options.Cookie.SameSite = SameSiteMode.Strict;
                  options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
                  options.Cookie.IsEssential = true;
              });
    
    builder.Services.AddCors(options =>
    {
        options.AddPolicy(CORS_DEFAULT_POLICY, configurePolicy =>
        {
            configurePolicy.WithOrigins("http://localhost", "http://localhost:4200", "https://localhost:7145")
            .AllowAnyHeader()
            .WithMethods("GET", "POST", "OPTIONS");

        });
    });

    builder.Services.AddControllers();
}
var app = builder.Build();
{
    app.UseCors(CORS_DEFAULT_POLICY);
    app.UseAuthentication();
    app.UseAuthorization();
    
    app.MapGet("/", () => "AssessmentAPI");

    app.MapControllers();
}
app.Run();
