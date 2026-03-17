import { describe, expect, it } from "vitest";
import { makeUseCases } from "../../src/infrastructure/factories/use-cases-factory";

describe("Portal Imobiliario Use Cases", () => {
  it("deve permitir corretor criar anuncio com multiplas fotos", async () => {
    const { createAnuncioUseCase } = makeUseCases();

    const anuncio = await createAnuncioUseCase.execute({
      titulo: "Casa ampla",
      descricao: "Casa com quintal",
      preco: 350000,
      bairro: "Centro",
      quartos: 3,
      fotos: ["foto-1.jpg", "foto-2.jpg"],
      corretorId: "corretor-1",
      role: "ROLE_CORRETOR"
    });

    expect(anuncio.id).toBeTypeOf("string");
    expect(anuncio.fotos).toHaveLength(2);
    expect(anuncio.corretorId).toBe("corretor-1");
  });

  it("nao deve permitir cliente criar anuncio", async () => {
    const { createAnuncioUseCase } = makeUseCases();

    await expect(
      createAnuncioUseCase.execute({
        titulo: "Apartamento",
        descricao: "Descricao",
        preco: 200000,
        bairro: "Bairro A",
        quartos: 2,
        fotos: ["f1.jpg"],
        corretorId: "corretor-1",
        role: "ROLE_CLIENTE"
      })
    ).rejects.toThrow("Somente corretor pode criar anuncio");
  });

  it("deve filtrar anuncios por preco, bairro e quartos", async () => {
    const { createAnuncioUseCase, searchAnunciosUseCase } = makeUseCases();

    await createAnuncioUseCase.execute({
      titulo: "Casa 1",
      descricao: "Descricao 1",
      preco: 500000,
      bairro: "Centro",
      quartos: 3,
      fotos: ["a.jpg"],
      corretorId: "corretor-1",
      role: "ROLE_CORRETOR"
    });

    await createAnuncioUseCase.execute({
      titulo: "Casa 2",
      descricao: "Descricao 2",
      preco: 250000,
      bairro: "Jardim",
      quartos: 2,
      fotos: ["b.jpg"],
      corretorId: "corretor-2",
      role: "ROLE_CORRETOR"
    });

    const resultado = await searchAnunciosUseCase.execute({
      precoMax: 300000,
      bairro: "Jardim",
      quartos: 2
    });

    expect(resultado).toHaveLength(1);
    expect(resultado[0].titulo).toBe("Casa 2");
  });

  it("deve favoritar anuncio e impedir duplicidade", async () => {
    const { createAnuncioUseCase, favoritarAnuncioUseCase, favoritoRepository } = makeUseCases();

    const anuncio = await createAnuncioUseCase.execute({
      titulo: "Cobertura",
      descricao: "Cobertura top",
      preco: 900000,
      bairro: "Centro",
      quartos: 4,
      fotos: ["c.jpg"],
      corretorId: "corretor-8",
      role: "ROLE_CORRETOR"
    });

    await favoritarAnuncioUseCase.execute("cliente-1", anuncio.id);

    const favoritos = await favoritoRepository.listByUsuario("cliente-1");
    expect(favoritos).toHaveLength(1);
    expect(favoritos[0].anuncioId).toBe(anuncio.id);

    await expect(favoritarAnuncioUseCase.execute("cliente-1", anuncio.id)).rejects.toThrow(
      "Anuncio ja favoritado"
    );
  });

  it("deve enviar mensagem de interesse para o corretor do anuncio", async () => {
    const { createAnuncioUseCase, enviarMensagemInteresseUseCase, mensagemRepository } = makeUseCases();

    const anuncio = await createAnuncioUseCase.execute({
      titulo: "Apartamento central",
      descricao: "Perto de tudo",
      preco: 450000,
      bairro: "Centro",
      quartos: 2,
      fotos: ["d.jpg"],
      corretorId: "corretor-99",
      role: "ROLE_CORRETOR"
    });

    const mensagem = await enviarMensagemInteresseUseCase.execute(
      anuncio.id,
      "cliente-77",
      "Tenho interesse e gostaria de agendar visita"
    );

    expect(mensagem.corretorId).toBe("corretor-99");
    expect(mensagem.anuncioId).toBe(anuncio.id);

    const caixaDoCorretor = await mensagemRepository.listByCorretor("corretor-99");
    expect(caixaDoCorretor).toHaveLength(1);
    expect(caixaDoCorretor[0].texto).toContain("agendar visita");
  });
});
