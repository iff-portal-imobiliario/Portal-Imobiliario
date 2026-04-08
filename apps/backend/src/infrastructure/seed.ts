import { useCases } from "./api/routes";

export async function seedData(): Promise<void> {
  const sampleAnuncios = [
    {
      titulo: "Cobertura duplex com vista para o mar",
      descricao: "Cobertura espetacular de 280m² com terraço panorâmico, piscina privativa e acabamento de alto padrão. Localizada no melhor ponto do bairro, com vista permanente para o mar.",
      preco: 2850000,
      bairro: "Copacabana",
      quartos: 4,
      corretorId: "corretor-001",
      role: "ROLE_CORRETOR",
      fotos: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"]
    },
    {
      titulo: "Apartamento moderno no centro",
      descricao: "Apartamento reformado de 95m² com conceito aberto, varanda gourmet e 2 vagas de garagem. Prédio com academia, piscina e salão de festas.",
      preco: 720000,
      bairro: "Centro",
      quartos: 3,
      corretorId: "corretor-002",
      role: "ROLE_CORRETOR",
      fotos: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"]
    },
    {
      titulo: "Casa em condomínio fechado",
      descricao: "Casa ampla de 350m² em condomínio com segurança 24h. Jardim, churrasqueira, 4 suítes e área de lazer completa.",
      preco: 1950000,
      bairro: "Barra da Tijuca",
      quartos: 4,
      corretorId: "corretor-001",
      role: "ROLE_CORRETOR",
      fotos: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"]
    },
    {
      titulo: "Studio compacto e funcional",
      descricao: "Studio de 38m² totalmente mobiliado, ideal para investimento ou moradia. Próximo ao metrô e comércio local.",
      preco: 385000,
      bairro: "Botafogo",
      quartos: 1,
      corretorId: "corretor-003",
      role: "ROLE_CORRETOR",
      fotos: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"]
    },
    {
      titulo: "Apartamento familiar em Ipanema",
      descricao: "Amplo apartamento de 150m² com 3 suítes, sala em L e varanda. Localização privilegiada a 2 quadras da praia.",
      preco: 3200000,
      bairro: "Ipanema",
      quartos: 3,
      corretorId: "corretor-002",
      role: "ROLE_CORRETOR",
      fotos: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"]
    },
    {
      titulo: "Loft industrial reformado",
      descricao: "Loft de 120m² com pé direito duplo, tijolos aparentes e iluminação natural abundante. Espaço versátil no coração da Lapa.",
      preco: 890000,
      bairro: "Lapa",
      quartos: 2,
      corretorId: "corretor-003",
      role: "ROLE_CORRETOR",
      fotos: ["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800"]
    }
  ];

  for (const data of sampleAnuncios) {
    await useCases.createAnuncioUseCase.execute(data);
  }

  process.stdout.write(`Seeded ${sampleAnuncios.length} anuncios\n`);
}
