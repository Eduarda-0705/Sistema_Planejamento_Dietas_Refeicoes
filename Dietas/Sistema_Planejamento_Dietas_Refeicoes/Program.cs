using Microsoft.EntityFrameworkCore;
using Sistema_Planejamento_Dietas_Refeicoes.Models;
using System.Globalization;
using System.IO;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDataContext>();

var app = builder.Build();

// ===== SEED DE ALIMENTOS (SOMENTE SE O BANCO ESTIVER VAZIO) =====
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDataContext>();

    // Verifica se já existem alimentos no banco
    if (!await context.Alimentos!.AnyAsync())
    {
        var csvPath = Path.Combine(builder.Environment.ContentRootPath, "Data", "alimentos.csv");

        if (File.Exists(csvPath))
        {
            var linhas = await File.ReadAllLinesAsync(csvPath);

            // Pular o cabeçalho (linha 0)
            foreach (var linha in linhas.Skip(1))
            {
                if (string.IsNullOrWhiteSpace(linha))
                    continue;

                var colunas = linha.Split(';');

                if (colunas.Length < 4)
                    continue;

                var nome = colunas[0].Trim();
                var tipo = colunas[1].Trim();
                var unidade = colunas[2].Trim();

                if (!double.TryParse(colunas[3], NumberStyles.Any, CultureInfo.InvariantCulture, out double calorias))
                    continue;

                context.Alimentos!.Add(new Alimento
                {
                    Nome = nome,
                    Tipo = tipo,
                    Unidade = unidade,
                    CaloriasPorPorcao = calorias
                });
            }

            await context.SaveChangesAsync();
            Console.WriteLine("Seed de alimentos concluído com sucesso!");
        }
        else
        {
            Console.WriteLine($"Arquivo CSV não encontrado em: {csvPath}");
        }
    }
    else
    {
        Console.WriteLine("Alimentos já cadastrados. Seed ignorado.");
    }
}
// ==============================================================


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

//////////////////////////////////////////////PARTE DO ALIMENTO/////////////////////////////////////////////////////////////////////

// CRIAR ALIMENTO
app.MapPost("/alimentos", async (Alimento alimento, AppDataContext context) =>
{
    // Validações
    if (string.IsNullOrEmpty(alimento.Nome))
        return Results.BadRequest("Nome é obrigatório");

    if (string.IsNullOrEmpty(alimento.Tipo))
        return Results.BadRequest("Tipo é obrigatório");

    if (string.IsNullOrEmpty(alimento.Unidade))
        return Results.BadRequest("Unidade é obrigatória");

    if (alimento.CaloriasPorPorcao <= 0)
        return Results.BadRequest("CaloriasPorPorcao deve ser maior que zero");

    // Salvar no banco
    context.Alimentos!.Add(alimento);
    await context.SaveChangesAsync();

    return Results.Ok(new
    {
        message = "Alimento criado com sucesso!",
        alimento = alimento
    });
});


// LISTAR TODOS OS ALIMENTOS
app.MapGet("/alimentos", async (AppDataContext context) =>
{
    var alimentos = await context.Alimentos!.ToListAsync();
    return Results.Ok(alimentos);
});


// BUSCAR ALIMENTO POR ID (opcional, mas muito útil)
app.MapGet("/alimentos/{id}", async (int id, AppDataContext context) =>
{
    var alimento = await context.Alimentos!.FindAsync(id);

    if (alimento == null)
        return Results.NotFound("Alimento não encontrado");

    return Results.Ok(alimento);
});


// ATUALIZAR ALIMENTO
app.MapPut("/alimentos/{id}", async (int id, Alimento alimentoAtualizado, AppDataContext context) =>
{
    var alimento = await context.Alimentos!.FindAsync(id);

    if (alimento == null)
        return Results.NotFound("Alimento não encontrado");

    // Validações básicas
    if (string.IsNullOrEmpty(alimentoAtualizado.Nome))
        return Results.BadRequest("Nome é obrigatório");

    if (string.IsNullOrEmpty(alimentoAtualizado.Tipo))
        return Results.BadRequest("Tipo é obrigatório");

    if (string.IsNullOrEmpty(alimentoAtualizado.Unidade))
        return Results.BadRequest("Unidade é obrigatória");

    if (alimentoAtualizado.CaloriasPorPorcao <= 0)
        return Results.BadRequest("Calorias por porção deve ser maior que zero");

    // Atualizar dados
    alimento.Nome = alimentoAtualizado.Nome;
    alimento.Tipo = alimentoAtualizado.Tipo;
    alimento.Unidade = alimentoAtualizado.Unidade;
    alimento.CaloriasPorPorcao = alimentoAtualizado.CaloriasPorPorcao;

    await context.SaveChangesAsync();

    return Results.Ok(new
    {
        message = "Alimento atualizado com sucesso!",
        alimento = alimento
    });
});


// EXCLUIR ALIMENTO
app.MapDelete("/alimentos/{id}", async (int id, AppDataContext context) =>
{
    var alimento = await context.Alimentos!.FindAsync(id);

    if (alimento == null)
        return Results.NotFound("Alimento não encontrado");

    // Verificar se alimento está sendo usado em alguma refeição depois

    context.Alimentos!.Remove(alimento);
    await context.SaveChangesAsync();

    return Results.Ok("Alimento excluído com sucesso!");
});



app.Run();
