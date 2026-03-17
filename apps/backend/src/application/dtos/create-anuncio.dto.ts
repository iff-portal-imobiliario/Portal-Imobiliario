export type CreateAnuncioInput = {
  titulo: string;
  descricao: string;
  preco: number;
  bairro: string;
  quartos: number;
  fotos: string[];
  corretorId: string;
  role: string;
};
