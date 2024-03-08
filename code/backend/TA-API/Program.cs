var builder = WebApplication.CreateBuilder(args);
{

}
var app = builder.Build();
{
    app.MapGet("/", () => "Technical Assessment API");
}
app.Run();
