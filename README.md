<h1 align="center">🏠 Portal Imobiliário</h1>
<p align="center">
  <img src="https://img.shields.io/badge/Status-Avaliação%20P2-success?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Autor-João%20Pedro%20Lopes%20Gonçalves-blue?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Matrícula-202121250058-purple?style=for-the-badge"/>
</p>

## 📌 Descrição
Um **portal imobiliário** onde corretores ou proprietários podem anunciar imóveis para aluguel ou venda.  
Clientes podem pesquisar, aplicar filtros avançados e salvar seus imóveis favoritos.  
*Projeto atualizado para a Avaliação P2: Interface e Integração Front-end.*

---

## 👥 Perfis de Usuário
| Perfil        | Permissões |
|---------------|------------|
| **Corretor**  | Criar, editar e excluir seus próprios anúncios |
| **Cliente**   | Pesquisar, filtrar, favoritar imóveis e enviar mensagens de interesse |
| **Administrador** | Gerenciar usuários e anúncios |


## ⚙️ Lógica de Negócio
- 🔑 **Corretor** (`ROLE_CORRETOR`) → CRUD de anúncios (com múltiplas fotos).  
- 🔍 **Cliente** → Pesquisa avançada com filtros (preço, bairro, nº de quartos).  
- ⭐ **Favoritos** → Relação ManyToMany entre `Usuario` e `Anuncio`.  
- 💬 **Mensagens** → Cliente envia mensagem de interesse → associada ao corretor dono do anúncio.  


## ✅ Requisitos Funcionais
- **RF-01:** CRUD de anúncios com múltiplas fotos.  
- **RF-02:** Pesquisa/filtragem por preço, bairro e nº de quartos.  
- **RF-03:** Favoritar anúncios (ManyToMany).  
- **RF-04:** Enviar mensagens de interesse (visíveis ao corretor).  


## 🚀 Requisitos Não Funcionais
- **RNF-01:** Interface Single Page Application (SPA).
- **RNF-02:** Integração com o Backend via API REST (Fetch).
- **RNF-03:** Upload de múltiplas fotos e processamento associado.


## 🛠️ Tecnologias Utilizadas
*Nota: Tecnologias adaptadas para a implementação atual.*
- **Backend:** Node.js + Express + TypeScript
- **Banco de Dados:** Prisma ORM (SQLite / In-Memory)
- **Frontend:** SPA Vanilla JS + Vite
- **Estilização:** CSS3
- **Arquitetura:** Clean Architecture / Use Cases

---

## 🚀 Guia de Execução

Siga os comandos abaixo para rodar o projeto localmente:

**1. Instalar dependências e rodar o Backend:**
```bash
cd apps/backend
npm install
npm run dev
```

**2. Instalar dependências e rodar o Frontend:**
Em outro terminal:
```bash
cd apps/frontend
npm install
npm run dev
```
*Acesse no navegador através do endereço exibido no terminal (geralmente `http://localhost:5173`).*

---

## 📹 Demonstração (Vídeo do Projeto)
**Vídeo demonstrando as funcionalidades de Interface e Integração:**
- 📁 **Link:** https://youtu.be/Sv0MCHDzWRQ

---

## 🖥️ Guia de Telas
Abaixo estão as capturas das principais interfaces:

- **1. Listagem de Anúncios (Home):**
  *(Adicione a screenshot aqui: `![Home](./screenshots/home.png)`)*

- **2. Cadastro de Novo Anúncio (Create):**
  *(Adicione a screenshot aqui: `![Cadastro](./screenshots/cadastro.png)`)*

---

## 📦 Link da Release
A entrega oficial (Avaliação P2) está disponível na Release v2.0 do GitHub:
- [🔗 Acessar Release v2.0.0-p2](https://github.com/SEU_USUARIO/SEU_REPOSITORIO/releases/tag/v2.0.0-p2) *(Observação: Lembre-se de substituir o link com a URL do seu repositório após criar a release)*
