<h1 align="center">🏠 Portal Imobiliário</h1>
<p align="center">
  <img src="https://img.shields.io/badge/Status-Concluído-green?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Autor-João%20Pedro%20Lopes%20Gonçalves-blue?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Matrícula-202121250058-purple?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Testes-100%25_Coverage-success?style=for-the-badge"/>
</p>

## 📌 Descrição
Um **portal imobiliário** desenvolvido com **Clean Architecture** onde corretores podem anunciar imóveis para aluguel ou venda. Clientes podem pesquisar, aplicar filtros avançados, salvar seus imóveis favoritos e enviar mensagens de interesse.

---

## 👥 Perfis de Usuário
| Perfil        | Permissões |
|---------------|------------|
| **Corretor**  | Criar, editar e excluir seus próprios anúncios |
| **Cliente**   | Pesquisar, filtrar, favoritar imóveis e enviar mensagens de interesse |
| **Administrador** | Gerenciar usuários e todos os anúncios do sistema |


## ⚙️ Lógica de Negócio
- 🔑 **Corretor** (`ROLE_CORRETOR`) → CRUD de anúncios (com múltiplas fotos).  
- 🔍 **Cliente** (`ROLE_CLIENTE`) → Pesquisa avançada com filtros (preço, bairro, nº de quartos).  
- ⭐ **Favoritos** → Relação ManyToMany entre `Usuario` e `Anuncio`.  
- 💬 **Mensagens** → Cliente envia mensagem de interesse associada ao corretor dono do anúncio.  

## ✅ Requisitos Funcionais Implementados
- **RF-01:** Autenticação e Autorização baseada em JWT.
- **RF-02:** CRUD de anúncios com múltiplas fotos.  
- **RF-03:** Pesquisa/filtragem por preço, bairro e nº de quartos.  
- **RF-04:** Favoritar anúncios.  
- **RF-05:** Enviar mensagens de interesse (visíveis ao corretor).  

## 🛠️ Tecnologias Utilizadas (Atualizadas)
- **Backend:** Node.js + Express + TypeScript
- **Arquitetura:** Clean Architecture 
- **Banco de Dados:** SQLite (com Prisma ORM)
- **Autenticação:** JWT (JSON Web Token)
- **Testes:** Vitest + Supertest (com 100% de cobertura de código)

---

## 📦 Exemplo de Chamada (POST /anuncios)

```json
{
  "titulo": "Apartamento Moderno",
  "descricao": "Apartamento com 2 quartos, varanda e garagem.",
  "preco": 350000,
  "bairro": "Centro",
  "quartos": 2,
  "fotos": ["foto1.jpg", "foto2.jpg"],
  "corretorId": "id-do-corretor",
  "role": "ROLE_CORRETOR"
}
```

---

## 🧪 Testes de Endpoint

O arquivo de testes de endpoint (coleção Postman) está disponível em:
- [docs/Portal_Imobiliario_Collection.json](docs/Portal_Imobiliario_Collection.json)

Inclui o fluxo principal e cenários de erro para validação dos endpoints.

---

## 🎓 Requisitos para a Entrega (Professor Ronaldo)

### 1. Diagrama de Classes / Entidade-Relacionamento
O diagrama com o mapeamento completo do domínio pode ser encontrado em: 
👉 [docs/DiagramaClasses.md](./docs/DiagramaClasses.md)

### 2. Exemplo de Chamada (POST Principal)
Criação de Anúncios.  
**Endpoint:** `POST /anuncios`  
**Headers:** 
- `Content-Type: application/json`
- `Authorization: Bearer <seu_token_aqui>`

**Exemplo de Corpo (JSON):**
```json
{
  "titulo": "Apartamento com Vista Mar",
  "descricao": "Apartamento amplo no centro com duas vagas de garagem e lazer completo.",
  "preco": 350000.00,
  "bairro": "Meireles",
  "quartos": 3,
  "fotos": [
    "https://site.com/imagens/img1.jpg",
    "https://site.com/imagens/img2.jpg"
  ]
}
```
*(Obs: Identificação do corretor e validação de permissões são tratadas automaticamente pelo Token JWT no backend).*

---

## 🚀 Como Executar o Projeto

### Rodando a Aplicação
```bash
cd apps/backend
npm install
npx prisma migrate dev
npm run dev
```

### Rodando os Testes (100% Coverage)
O projeto conta com uma suíte de testes unitários e de integração utilizando **Vitest**. Para rodar:
```bash
cd apps/backend
npm install
npm run test:coverage
```

### Testes de Endpoint (Postman/Insomnia)
A coleção completa exportada contendo todas as rotas (Cadastro de usuário, Login, Criação de Anúncio, Busca, etc.) com todos os tratamentos de erro e acessos está disponível em:
👉 [docs/Portal_Imobiliario_Collection.json](./docs/Portal_Imobiliario_Collection.json)

