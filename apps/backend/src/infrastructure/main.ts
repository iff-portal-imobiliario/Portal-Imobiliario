import express from 'express';

// Infrastructure - In-Memory Repositories
import { InMemoryUserRepository } from './database/InMemoryUserRepository';
import { InMemoryAnuncioRepository } from './database/InMemoryAnuncioRepository';
import { InMemoryMensagemRepository } from './database/InMemoryMensagemRepository';
import { InMemoryFavoritoRepository } from './database/InMemoryFavoritoRepository';

// Application - Use Cases
import { CreateUser } from '../application/use_cases/CreateUser';
import { ListUsers } from '../application/use_cases/ListUsers';
import { CreateAnuncio } from '../application/use_cases/CreateAnuncio';
import { UpdateAnuncio } from '../application/use_cases/UpdateAnuncio';
import { DeleteAnuncio } from '../application/use_cases/DeleteAnuncio';
import { ListAnuncios } from '../application/use_cases/ListAnuncios';
import { FindAnuncioById } from '../application/use_cases/FindAnuncioById';
import { AddFavorito } from '../application/use_cases/AddFavorito';
import { RemoveFavorito } from '../application/use_cases/RemoveFavorito';
import { ListFavoritos } from '../application/use_cases/ListFavoritos';
import { SendMensagem } from '../application/use_cases/SendMensagem';
import { ListMensagens } from '../application/use_cases/ListMensagens';

// Interfaces - Controllers
import { UserController } from '../interfaces/controllers/UserController';
import { AnuncioController } from '../interfaces/controllers/AnuncioController';
import { FavoritoController } from '../interfaces/controllers/FavoritoController';
import { MensagemController } from '../interfaces/controllers/MensagemController';

// Infrastructure - Routes
import { createUserRoutes } from './api/userRoutes';
import { createAnuncioRoutes } from './api/anuncioRoutes';
import { createFavoritoRoutes } from './api/favoritoRoutes';
import { createMensagemRoutes } from './api/mensagemRoutes';

// ============================================
// Dependency Injection (Composição Manual)
// ============================================

// Repositories
const userRepository = new InMemoryUserRepository();
const anuncioRepository = new InMemoryAnuncioRepository();
const mensagemRepository = new InMemoryMensagemRepository();
const favoritoRepository = new InMemoryFavoritoRepository();

// Use Cases - User
const createUser = new CreateUser(userRepository);
const listUsers = new ListUsers(userRepository);

// Use Cases - Anuncio
const createAnuncio = new CreateAnuncio(anuncioRepository, userRepository);
const updateAnuncio = new UpdateAnuncio(anuncioRepository, userRepository);
const deleteAnuncio = new DeleteAnuncio(anuncioRepository);
const listAnuncios = new ListAnuncios(anuncioRepository);
const findAnuncioById = new FindAnuncioById(anuncioRepository);

// Use Cases - Favorito
const addFavorito = new AddFavorito(favoritoRepository, anuncioRepository);
const removeFavorito = new RemoveFavorito(favoritoRepository);
const listFavoritos = new ListFavoritos(favoritoRepository, anuncioRepository);

// Use Cases - Mensagem
const sendMensagem = new SendMensagem(mensagemRepository, anuncioRepository);
const listMensagens = new ListMensagens(mensagemRepository);

// Controllers
const userController = new UserController(createUser, listUsers);
const anuncioController = new AnuncioController(
    createAnuncio, updateAnuncio, deleteAnuncio, listAnuncios, findAnuncioById
);
const favoritoController = new FavoritoController(addFavorito, removeFavorito, listFavoritos);
const mensagemController = new MensagemController(sendMensagem, listMensagens);

// ============================================
// Express App Setup
// ============================================

const app = express();
app.use(express.json());

// Routes
app.use('/api/users', createUserRoutes(userController));
app.use('/api/anuncios', createAnuncioRoutes(anuncioController));
app.use('/api/favoritos', createFavoritoRoutes(favoritoController));
app.use('/api/mensagens', createMensagemRoutes(mensagemController));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🏠 Portal Imobiliário - Backend running on http://localhost:${PORT}`);
});
