<h1 align="center">🏠 Portal Imobiliário</h1>
<p align="center">
  <img src="https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Autor-João%20Pedro%20Lopes%20Gonçalves-blue?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Matrícula-202121250058-purple?style=for-the-badge"/>
</p>

## 📌 Descrição
Um **portal imobiliário** onde corretores ou proprietários podem anunciar imóveis para aluguel ou venda.  
Clientes podem pesquisar, aplicar filtros avançados e salvar seus imóveis favoritos.  

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
- **RNF-01:** Busca otimizada com **Full-Text Search**.  
- **RNF-02:** Upload de múltiplas fotos com **processamento assíncrono** de thumbnails.  


## 🛠️ Tecnologias Utilizadas
- **Backend:** Java + Spring Boot  
- **Banco de Dados:** PostgreSQL  
- **Frontend:** React + TailwindCSS  
- **Autenticação:** JWT  
- **Infra:** Docker + AWS S3 (armazenamento de imagens)
