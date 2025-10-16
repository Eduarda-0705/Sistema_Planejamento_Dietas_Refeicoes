using Microsoft.EntityFrameworkCore;
using Sistema_Planejamento_Dietas_Refeicoes.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDataContext>();

var app = builder.Build();


// CRIAR USUÁRIO 
app.MapPost("/usuarios", async (Usuario usuario, AppDataContext context) =>
{
    // Validações simples
    if (string.IsNullOrEmpty(usuario.nome))
        return Results.BadRequest("Nome é obrigatório");

    if (string.IsNullOrEmpty(usuario.email))
        return Results.BadRequest("Email é obrigatório");

    if (usuario.Altura <= 0)
        return Results.BadRequest("Altura deve ser maior que zero");

    if (usuario.Peso <= 0)
        return Results.BadRequest("Peso deve ser maior que zero");

    if (string.IsNullOrEmpty(usuario.Objetivo))
        return Results.BadRequest("Objetivo é obrigatório");

    // Verificar se email já existe
    var emailExiste = await context.Usuarios!
        .AnyAsync(u => u.email == usuario.email);
    
    if (emailExiste)
        return Results.BadRequest("Email já cadastrado");

    // Inicializar lista de refeições
    usuario.Refeicoes = new List<Refeicao>();

    // Salvar no banco
    context.Usuarios!.Add(usuario);
    await context.SaveChangesAsync();

    return Results.Ok(new
    {
        message = "Usuário criado com sucesso!",
        usuario = usuario
    });
});


// LISTAR USUÁRIOS 
app.MapGet("/usuarios", async (AppDataContext context) =>
{
    var usuarios = await context.Usuarios!.ToListAsync();
    return Results.Ok(usuarios);
});


//   EDITAR USUÁRIO 

app.MapPut("/usuarios/{id}", async (int id, Usuario usuarioAtualizado, AppDataContext context) =>
{
    var usuario = await context.Usuarios!.FindAsync(id);
    if (usuario == null)
        return Results.NotFound("Usuário não encontrado");

    // Validações básicas
    if (string.IsNullOrEmpty(usuarioAtualizado.nome))
        return Results.BadRequest("Nome é obrigatório");

    if (string.IsNullOrEmpty(usuarioAtualizado.email))
        return Results.BadRequest("Email é obrigatório");

    // Atualizar dados
    usuario.nome = usuarioAtualizado.nome;
    usuario.email = usuarioAtualizado.email;
    usuario.Altura = usuarioAtualizado.Altura;
    usuario.Peso = usuarioAtualizado.Peso;
    usuario.Objetivo = usuarioAtualizado.Objetivo;

    // Salvar
    await context.SaveChangesAsync();

    return Results.Ok(new
    {
        message = "Usuário atualizado com sucesso!",
        usuario = usuario
    });
});


// EXCLUIR USUÁRIO - DELETE /usuarios/{id}

app.MapDelete("/usuarios/{id}", async (int id, AppDataContext context) =>
{
    var usuario = await context.Usuarios!
        .Include(u => u.Refeicoes)
        .FirstOrDefaultAsync(u => u.id == id);

    if (usuario == null)
        return Results.NotFound("Usuário não encontrado");

    // Verificar se tem refeições
    if (usuario.Refeicoes != null && usuario.Refeicoes.Any())
        return Results.BadRequest("Não é possível excluir usuário com refeições cadastradas");

    // Excluir
    context.Usuarios!.Remove(usuario);
    await context.SaveChangesAsync();

    return Results.Ok("Usuário excluído com sucesso!");
});


app.Run();
