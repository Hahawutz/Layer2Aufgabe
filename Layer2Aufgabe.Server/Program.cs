using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using System.Reflection;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigins", policyBuilder =>
    {
        policyBuilder.WithOrigins("https://localhost:5173")
               .AllowAnyMethod()
               .AllowAnyHeader();
        
    });
    
});

builder.Services.AddIdentity<IdentityUser, IdentityRole>()
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
    };
});

builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    options.JsonSerializerOptions.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
    options.JsonSerializerOptions.WriteIndented = true;
});

    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen(options =>
    {
        options.SwaggerDoc("v1", new OpenApiInfo
        {
            Version = "v1",
            Title = "Layer2 Aufgabe API",
            Description = "API Dokumentation",
        });

        var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
        options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));
        options.OperationFilter<Layer2Aufgabe.Filters.AddCustomerExampleValuesOperationFilter>();
        options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
        {
            Name = "Authorization",
            Type = SecuritySchemeType.Http,
            Scheme = "Bearer",
            BearerFormat = "JWT",
            In = ParameterLocation.Header,
            Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\""
        });

        options.AddSecurityRequirement(new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = "Bearer"
                    }
                },
                new string[] {}
            }
        });
    });

var app = builder.Build();

    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Layer2 Aufgabe API v1");
    });

app.UseHttpsRedirection();
app.UseCors(builder =>
        builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
app.UseDefaultFiles();
app.UseStaticFiles();
app.MapFallbackToFile("/index.html");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

await EnsureDatabaseCreatedAsync(app);

app.Run();

/// <summary>
/// Creates the databases at startup or, if present, they are deleted and recreated.
/// </summary>
async Task EnsureDatabaseCreatedAsync(WebApplication app)
{
    var dbPath = Path.Combine(AppContext.BaseDirectory, "app.db");

    using (var scope = app.Services.CreateScope())
    {
        var services = scope.ServiceProvider;
        var dbContext = services.GetRequiredService<AppDbContext>();
        var userManager = services.GetRequiredService<UserManager<IdentityUser>>();
        var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();

        try
        {
            if (File.Exists(dbPath))
            {
                File.Delete(dbPath);
            }

            dbContext.Database.Migrate();
            await CreateUsersAndRolesAsync(userManager, roleManager);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Fehler bei der Migration der Datenbank: {ex.Message}");
        }
    }
}
/// <summary>
/// Create three users for test purposes when loading program.
/// </summary>
async Task CreateUsersAndRolesAsync(UserManager<IdentityUser> userManager, RoleManager<IdentityRole> roleManager)
{
    string[] roleNames = { "Admin", "Read", "Write" };
    foreach (var roleName in roleNames)
    {
        if (!await roleManager.RoleExistsAsync(roleName))
        {
            await roleManager.CreateAsync(new IdentityRole(roleName));
        }
    }

    var bearerUser = await userManager.FindByNameAsync("Admin");
    if (bearerUser == null)
    {
        bearerUser = new IdentityUser { UserName = "Admin", Email = "admin@example.com" };
        var result = await userManager.CreateAsync(bearerUser, "Admin@123");

        if (result.Succeeded)
        {
            if (!await userManager.IsInRoleAsync(bearerUser, "Admin"))
            {
                await userManager.AddToRoleAsync(bearerUser, "Admin");
            }
        }
    }

    var readerUser = await userManager.FindByNameAsync("Read");
    if (readerUser == null)
    {
        readerUser = new IdentityUser { UserName = "Read", Email = "read@example.com" };
        var result = await userManager.CreateAsync(readerUser, "Read@123");

        if (result.Succeeded)
        {
            if (!await userManager.IsInRoleAsync(readerUser, "Read"))
            {
                await userManager.AddToRoleAsync(readerUser, "Read");
            }
        }
    }

    var writerUser = await userManager.FindByNameAsync("Write");
    if (writerUser == null)
    {
        writerUser = new IdentityUser { UserName = "Write", Email = "write@example.com" };
        var result = await userManager.CreateAsync(writerUser, "Write@123");

        if (result.Succeeded)
        {
            if (!await userManager.IsInRoleAsync(writerUser, "Write") || !await userManager.IsInRoleAsync(writerUser, "Read"))
            {
                await userManager.AddToRoleAsync(writerUser, "Write");
                await userManager.AddToRoleAsync(readerUser, "Read");
            }
        }
    }
}
