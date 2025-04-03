using Serilog;
using TA_API.Automapper;
using TA_API.Constants;
using TA_API.Entities.AppSettings;
using TA_API.Repository;
using TA_API.Services;
using TA_API.Services.Data;
using TA_API.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

builder.Host.UseSerilog((ctx, lc) => lc.WriteTo.Console());

AddServicesAndRepo();

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen();

builder.Services.AddMemoryCache();

builder.Services.Configure<AppSettings>(builder.Configuration);

var configurationSettings = builder.Configuration.GetSection("Configurations").Get<AppSettingsConfigurations>();

builder.Services.AddHttpClient(HttpClientNamesContants.TypicodeClient, client =>
{
    client.BaseAddress = new Uri(configurationSettings!.TypicodeClient.BaseUrl);
    client.Timeout = TimeSpan.FromSeconds(configurationSettings!.TypicodeClient.ClientTimeoutInSeconds);
}).SetHandlerLifetime(TimeSpan.FromSeconds(configurationSettings!.TypicodeClient.HandlerLifetimetInSeconds));

var app = builder.Build();

app.UseSerilogRequestLogging();

app.UseSwagger();

app.UseSwaggerUI();

app.MapControllers();

app.UseCors(x =>
{
    x.AllowAnyOrigin();
    x.AllowAnyMethod();
    x.AllowAnyHeader();
    x.WithHeaders();
});

app.Run();

void AddServicesAndRepo()
{
    builder.Services.AddDbContext<AssessmentDbContext>();

    builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
    builder.Services.AddScoped<ITaskItemService, TaskItemService>();
    builder.Services.AddScoped<IUsersProvider, UsersProvider>();

    builder.Services.AddAutoMapper(typeof(AutomapperProfile));
}