import { Request, Response } from "express";
import { CreateAnuncioUseCase } from "../../application/use_cases/create-anuncio.use-case";
import { SearchAnunciosUseCase } from "../../application/use_cases/search-anuncios.use-case";

export class AnuncioController {
  constructor(
    private readonly createAnuncioUseCase: CreateAnuncioUseCase,
    private readonly searchAnunciosUseCase: SearchAnunciosUseCase
  ) {}

  async create(req: Request, res: Response): Promise<Response> {
    const anuncio = await this.createAnuncioUseCase.execute(req.body);
    return res.status(201).json(anuncio);
  }

  async search(req: Request, res: Response): Promise<Response> {
    const anuncios = await this.searchAnunciosUseCase.execute({
      precoMin: req.query.precoMin ? Number(req.query.precoMin) : undefined,
      precoMax: req.query.precoMax ? Number(req.query.precoMax) : undefined,
      bairro: req.query.bairro ? String(req.query.bairro) : undefined,
      quartos: req.query.quartos ? Number(req.query.quartos) : undefined
    });

    return res.status(200).json(anuncios);
  }
}
