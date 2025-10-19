using Microsoft.EntityFrameworkCore;
using Sistema_Planejamento_Dietas_Refeicoes.Models;
using System.Globalization;
using System.IO;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Http.Json;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDataContext>();

builder.Services.Configure<Microsoft.AspNetCore.Http.Json.JsonOptions>(options =>
{
    options.SerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
});

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



// ========== ENDPOINTS DE REFEIÇÃO ==========

app.MapPost("/refeicoes", async (Refeicao refeicao, AppDataContext context) =>
{
    // 1. Validar se o usuário associado à refeição existe
    var usuario = await context.Usuarios.FindAsync(refeicao.usuarioId);
    if (usuario == null)
    {
        return Results.NotFound("Usuário não encontrado.");
    }

    // Anexa o usuário encontrado ao objeto da refeição
    refeicao.usuario = usuario;

    // 2. Iterar sobre os alimentos recebidos para validar e carregar os dados completos
    if (refeicao.RefeicaoAlimentos != null && refeicao.RefeicaoAlimentos.Any())
    {
        foreach (var refeicaoAlimento in refeicao.RefeicaoAlimentos)
        {
            // O cliente enviou apenas o AlimentoId. Precisamos buscar o objeto Alimento completo.
            var alimento = await context.Alimentos.FindAsync(refeicaoAlimento.AlimentoId);
            if (alimento == null)
            {
                return Results.BadRequest($"Alimento com ID {refeicaoAlimento.AlimentoId} não encontrado.");
            }
            // "Completa" o objeto com a entidade Alimento que buscamos do banco
            refeicaoAlimento.Alimento = alimento;
        }
    }

    // 3. Salvar a refeição (e suas associações) no banco de dados
    context.Refeicoes.Add(refeicao);
    await context.SaveChangesAsync();

    return Results.Created($"/refeicoes/{refeicao.id}", refeicao);
});

// BUSCAR REFEIÇÃO POR ID
app.MapGet("/refeicoes/{id}", async (int id, AppDataContext context) =>
{
    // Busca a refeição pelo ID, incluindo os dados da tabela de junção
    // e, em seguida, incluindo os dados de cada Alimento associado.
    var refeicao = await context.Refeicoes
        .Include(r => r.RefeicaoAlimentos)
        .ThenInclude(ra => ra.Alimento)
        .FirstOrDefaultAsync(r => r.id == id);

    if (refeicao == null)
    {
        return Results.NotFound("Refeição não encontrada.");
    }

    return Results.Ok(refeicao);
});

// DELETAR REFEIÇÃO
app.MapDelete("/refeicoes/{id}", async (int id, AppDataContext context) =>
{
    // Busca a refeição, garantindo que suas associações na tabela de junção sejam carregadas.
    var refeicao = await context.Refeicoes
        .Include(r => r.RefeicaoAlimentos)
        .FirstOrDefaultAsync(r => r.id == id);

    if (refeicao == null)
    {
        return Results.NotFound("Refeição não encontrada.");
    }

    // Ao remover a refeição, o EF entende que também deve remover os registros dependentes
    // em RefeicaoAlimentos que foram carregados pelo .Include().
    context.Refeicoes.Remove(refeicao);
    await context.SaveChangesAsync();

    return Results.Ok("Refeição deletada com sucesso.");
});

// LISTAR TODAS AS REFEIÇÕES DE UM USUÁRIO
app.MapGet("/usuarios/{usuarioId}/refeicoes", async (int usuarioId, AppDataContext context) =>
{
    // 1. Valida se o usuário existe.
    var usuario = await context.Usuarios.FindAsync(usuarioId);
    if (usuario == null)
    {
        return Results.NotFound("Usuário não encontrado.");
    }

    // 2. Busca todas as refeições para o usuárioId especificado.
    //    Usamos Include e ThenInclude para carregar os detalhes dos alimentos de cada refeição.
    var refeicoes = await context.Refeicoes
        .Where(r => r.usuarioId == usuarioId)
        .Include(r => r.RefeicaoAlimentos)
        .ThenInclude(ra => ra.Alimento)
        .ToListAsync();

    // 3. Retorna a lista de refeições encontradas.
    return Results.Ok(refeicoes);
});

// CALCULAR TOTAL DE CALORIAS DE UMA REFEIÇÃO
app.MapGet("/refeicoes/{id}/total-calorias", async (int id, AppDataContext context) =>
{
    // 1. Busca a refeição e inclui todos os dados necessários para o cálculo.
    var refeicao = await context.Refeicoes
        .Include(r => r.RefeicaoAlimentos)
        .ThenInclude(ra => ra.Alimento)
        .FirstOrDefaultAsync(r => r.id == id);

    if (refeicao == null)
    {
        return Results.NotFound("Refeição não encontrada.");
    }

    // 2. Usa LINQ para calcular o total de calorias de forma eficiente.
    double totalCalorias = refeicao.RefeicaoAlimentos.Sum(ra =>
        ra.Alimento!.CaloriasPorPorcao / 100 * ra.Quantidade
    );

    // 3. Retorna o resultado em um objeto JSON simples.
    return Results.Ok(new
    {
        RefeicaoId = refeicao.id,
        NomeRefeicao = refeicao.nome,
        TotalCalorias = totalCalorias
    });
});

// RELATÓRIO DE CONSUMO DIÁRIO POR USUÁRIO
app.MapGet("/usuarios/{usuarioId}/relatorio/diario", async (int usuarioId, DateTime data, AppDataContext context) =>
{
    // 1. Valida se o usuário existe no banco de dados.
    var usuario = await context.Usuarios.FindAsync(usuarioId);
    if (usuario == null)
    {
        return Results.NotFound("Usuário não encontrado.");
    }

    // 2. Calcula o total de calorias para o dia especificado usando LINQ.
    var totalCaloriasDia = await context.Refeicoes
        // Filtra as refeições para o usuário e a data específicos.
        .Where(r => r.usuarioId == usuarioId && r.dataRefeicao.Date == data.Date)
        // Achata a lista de listas: pega todos os RefeicaoAlimentos de todas as refeições do dia.
        .SelectMany(r => r.RefeicaoAlimentos)
        // Calcula a soma das calorias para cada item da lista achatada.
        .SumAsync(ra => (ra.Alimento!.CaloriasPorPorcao / 100) * ra.Quantidade);

    // 3. Retorna o resultado.
    return Results.Ok(new
    {
        UsuarioId = usuarioId,
        Data = data.ToString("yyyy-MM-dd"),
        TotalCaloriasDoDia = totalCaloriasDia
    });
});

// RELATÓRIO DE CONSUMO SEMANAL POR USUÁRIO
app.MapGet("/usuarios/{usuarioId}/relatorio/semanal", async (int usuarioId, DateTime dataFinal, AppDataContext context) =>
{
    // 1. Valida se o usuário existe.
    var usuario = await context.Usuarios.FindAsync(usuarioId);
    if (usuario == null)
    {
        return Results.NotFound("Usuário não encontrado.");
    }

    // 2. Define o período de 7 dias para o relatório.
    var dataInicial = dataFinal.AddDays(-6).Date;
    var dataFinalAjustada = dataFinal.Date;

    // 3. Calcula o total de calorias para o período especificado.
    var totalCaloriasSemana = await context.Refeicoes
        // Filtra as refeições pelo usuário e pelo intervalo de datas.
        .Where(r => r.usuarioId == usuarioId && 
                    r.dataRefeicao.Date >= dataInicial && 
                    r.dataRefeicao.Date <= dataFinalAjustada)
        // Achata a lista de alimentos de todas as refeições encontradas.
        .SelectMany(r => r.RefeicaoAlimentos)
        // Soma as calorias de cada item.
        .SumAsync(ra => (ra.Alimento!.CaloriasPorPorcao / 100) * ra.Quantidade);

    // 4. Retorna o resultado.
    return Results.Ok(new
    {
        UsuarioId = usuarioId,
        Periodo = $"{dataInicial:yyyy-MM-dd} a {dataFinalAjustada:yyyy-MM-dd}",
        TotalCaloriasDaSemana = totalCaloriasSemana
    });
});

// LISTAR TODAS AS REFEIÇÕES DE UM USUÁRIO (COM FILTRO OPCIONAL POR TIPO/NOME)
app.MapGet("/usuarios/{usuarioId}/alimentos", async (int usuarioId, [FromQuery] string? tipo, AppDataContext context) =>
{
    // 1. Valida se o usuário existe.
    var usuario = await context.Usuarios.FindAsync(usuarioId);
    if (usuario == null)
    {
        return Results.NotFound("Usuário não encontrado.");
    }

    // 2. Inicia a consulta base para as refeições do usuário.
    var query = context.Refeicoes
        .Where(r => r.usuarioId == usuarioId)
        .Include(r => r.RefeicaoAlimentos)
        .ThenInclude(ra => ra.Alimento)
        .AsQueryable();

    // 3. Adiciona o filtro de tipo, SE ele for fornecido.
    if (!string.IsNullOrEmpty(tipo))
    {
        query = query.Where(r => r.nome!.ToLower() == tipo.ToLower());
    }

    // 4. Executa a consulta final e retorna a lista.
    var refeicoes = await query.ToListAsync();
    return Results.Ok(refeicoes);
});

app.Run();
