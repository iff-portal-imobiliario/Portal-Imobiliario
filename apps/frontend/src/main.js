/* ─────────────────────────────────────────
   Portal Imobiliário — SPA  (Vanilla JS)
   ───────────────────────────────────────── */

const API = "";          // Vite proxy handles /anuncios → localhost:3000
const $  = (s) => document.querySelector(s);
const app = () => $("#app");

// ── Helpers ──────────────────────────────

function formatPrice(v) {
  return Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function showToast(msg, type = "success") {
  let toast = $(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.className = `toast toast--${type}`;
  toast.innerHTML = `<span>${type === "success" ? "✓" : "✕"}</span><span>${msg}</span>`;
  requestAnimationFrame(() => toast.classList.add("toast--visible"));
  setTimeout(() => toast.classList.remove("toast--visible"), 3200);
}

// ── API ──────────────────────────────────

async function fetchAnuncios(params = {}) {
  const qs = new URLSearchParams();
  if (params.bairro) qs.set("bairro", params.bairro);
  if (params.quartos) qs.set("quartos", params.quartos);
  if (params.precoMin) qs.set("precoMin", params.precoMin);
  if (params.precoMax) qs.set("precoMax", params.precoMax);
  const res = await fetch(`${API}/anuncios?${qs.toString()}`);
  if (!res.ok) throw new Error("Erro ao buscar anúncios");
  return res.json();
}

async function fetchAnuncio(id) {
  const res = await fetch(`${API}/anuncios/${id}`);
  if (!res.ok) throw new Error("Anúncio não encontrado");
  return res.json();
}

async function createAnuncio(data) {
  const res = await fetch(`${API}/anuncios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Erro ao criar anúncio");
  }
  return res.json();
}

async function deleteAnuncio(id) {
  const res = await fetch(`${API}/anuncios/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Erro ao excluir anúncio");
}

async function enviarMensagem(anuncioId, clienteId, texto) {
  const res = await fetch(`${API}/anuncios/${anuncioId}/mensagens`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ clienteId, texto }),
  });
  if (!res.ok) throw new Error("Erro ao enviar mensagem");
  return res.json();
}

// ── Router ───────────────────────────────

function navigate(path) {
  history.pushState(null, "", path);
  route();
}

function route() {
  const path = location.pathname;
  if (path.startsWith("/anuncios/criar")) return renderCreatePage();
  const match = path.match(/^\/anuncios\/([^/]+)$/);
  if (match) return renderDetailPage(match[1]);
  return renderHomePage();
}

window.addEventListener("popstate", route);

document.addEventListener("click", (e) => {
  const link = e.target.closest("[data-link]");
  if (link) {
    e.preventDefault();
    navigate(link.getAttribute("href") || link.dataset.link);
  }
});

// ── Navbar ───────────────────────────────

function navbar() {
  return `
  <nav class="navbar" id="navbar">
    <div class="container">
      <div class="navbar__logo" data-link="/" style="cursor:pointer">
        <div class="navbar__logo-icon">🏠</div>
        Portal<span style="color:var(--text-accent)">.</span>Imob
      </div>
      <ul class="navbar__links">
        <li><span class="navbar__link navbar__link--active" data-link="/">Explorar</span></li>
        <li><span class="navbar__link" data-link="/anuncios/criar">Anunciar</span></li>
      </ul>
    </div>
  </nav>`;
}

function footer() {
  return `
  <footer class="footer">
    <div class="container">
      © 2026 Portal Imobiliário
    </div>
  </footer>`;
}

// ── Home Page ────────────────────────────

async function renderHomePage() {
  app().innerHTML = `
    ${navbar()}
    <div class="container">
      <section class="hero">
        <h1 class="hero__title">Encontre seu <span>imóvel ideal</span></h1>
        <p class="hero__subtitle">Explore as melhores oportunidades imobiliárias com busca inteligente e detalhes completos.</p>
      </section>

      <section class="filters" id="filters">
        <div class="filter-group">
          <label for="f-bairro">Bairro</label>
          <input class="filter-input" id="f-bairro" placeholder="Ex: Copacabana" />
        </div>
        <div class="filter-group">
          <label for="f-quartos">Quartos</label>
          <select class="filter-select" id="f-quartos">
            <option value="">Todos</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
          </select>
        </div>
        <div class="filter-group">
          <label for="f-min">Preço mín.</label>
          <input class="filter-input" id="f-min" type="number" placeholder="R$ 0" />
        </div>
        <div class="filter-group">
          <label for="f-max">Preço máx.</label>
          <input class="filter-input" id="f-max" type="number" placeholder="Sem limite" />
        </div>
        <button class="btn btn--primary" id="btn-search">🔍 Buscar</button>
      </section>

      <section class="property-grid" id="grid">
        <div class="skeleton skeleton-card"></div>
        <div class="skeleton skeleton-card"></div>
        <div class="skeleton skeleton-card"></div>
      </section>
    </div>
    ${footer()}
  `;

  const grid = $("#grid");
  const btnSearch = $("#btn-search");

  async function loadData(params = {}) {
    grid.innerHTML = `
      <div class="skeleton skeleton-card"></div>
      <div class="skeleton skeleton-card"></div>
      <div class="skeleton skeleton-card"></div>`;

    try {
      const anuncios = await fetchAnuncios(params);
      if (!anuncios.length) {
        grid.innerHTML = `
          <div class="empty" style="grid-column:1/-1">
            <div class="empty__icon">🏚️</div>
            <p class="empty__text">Nenhum imóvel encontrado. Tente outros filtros.</p>
          </div>`;
        return;
      }
      grid.innerHTML = anuncios.map(cardHTML).join("");
    } catch {
      grid.innerHTML = `
        <div class="empty" style="grid-column:1/-1">
          <div class="empty__icon">⚠️</div>
          <p class="empty__text">Erro ao carregar imóveis. O backend está rodando?</p>
        </div>`;
    }
  }

  btnSearch.addEventListener("click", () => {
    loadData({
      bairro: $("#f-bairro").value.trim(),
      quartos: $("#f-quartos").value,
      precoMin: $("#f-min").value,
      precoMax: $("#f-max").value,
    });
  });

  // Also search on Enter key in any filter input
  document.querySelectorAll(".filter-input, .filter-select").forEach(el => {
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter") btnSearch.click();
    });
  });

  loadData();
}

function cardHTML(a) {
  const img = a.fotos?.[0]?.url || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800";
  return `
  <article class="card" data-link="/anuncios/${a.id}">
    <div class="card__image-wrap">
      <img class="card__image" src="${img}" alt="${a.titulo}" loading="lazy" />
      <span class="card__badge">📍 ${a.bairro}</span>
    </div>
    <div class="card__body">
      <div class="card__bairro">${a.bairro}</div>
      <h3 class="card__title">${a.titulo}</h3>
      <div class="card__meta">
        <span class="card__meta-item">🛏️ ${a.quartos} quartos</span>
      </div>
      <div class="card__price">${formatPrice(a.preco)}</div>
    </div>
  </article>`;
}

// ── Detail Page ──────────────────────────

async function renderDetailPage(id) {
  app().innerHTML = `
    ${navbar()}
    <div class="container detail">
      <div class="skeleton" style="height:400px;border-radius:var(--radius-xl)"></div>
    </div>
    ${footer()}
  `;

  try {
    const a = await fetchAnuncio(id);
    const img = a.fotos?.[0]?.url || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800";

    app().innerHTML = `
      ${navbar()}
      <div class="container detail">
        <span class="detail__back" data-link="/">← Voltar para listagem</span>
        <div style="margin-top: 1rem; margin-bottom: 2rem;">
          <button class="btn" style="border: 1px solid #ef4444; color: #ef4444; background: transparent;" id="btn-delete">❌ Excluir Anúncio</button>
        </div>
        <img class="detail__hero-image" src="${img}" alt="${a.titulo}" />

        <div class="detail__grid">
          <div class="detail__info">
            <h1>${a.titulo}</h1>
            <div class="detail__bairro">📍 ${a.bairro}</div>
            <div class="detail__price">${formatPrice(a.preco)}</div>

            <div class="detail__stats">
              <div class="detail__stat">
                <div class="detail__stat-value">${a.quartos}</div>
                <div class="detail__stat-label">Quartos</div>
              </div>
              <div class="detail__stat">
                <div class="detail__stat-value">ID</div>
                <div class="detail__stat-label">${a.id?.slice(0, 8) ?? "—"}…</div>
              </div>
            </div>

            <div class="detail__description">
              <h2>Sobre o imóvel</h2>
              <p>${a.descricao}</p>
            </div>
          </div>

          <aside class="contact-card">
            <h3>Enviar mensagem ao corretor</h3>
            <form id="msg-form">
              <div class="form-group">
                <label for="msg-name">Seu nome</label>
                <input class="form-input" id="msg-name" required placeholder="João Silva" />
              </div>
              <div class="form-group">
                <label for="msg-text">Mensagem</label>
                <textarea class="form-textarea" id="msg-text" required placeholder="Olá, tenho interesse neste imóvel…"></textarea>
              </div>
              <button type="submit" class="btn btn--primary" style="width:100%">Enviar mensagem</button>
            </form>
          </aside>
        </div>
      </div>
      ${footer()}
    `;

    $("#msg-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const texto = $("#msg-text").value.trim();
      const clienteNome = $("#msg-name").value.trim();
      if (!texto || !clienteNome) return;
      try {
        await enviarMensagem(a.id, `cliente-${clienteNome.toLowerCase().replace(/\s/g, "-")}`, texto);
        showToast("Mensagem enviada com sucesso!");
        $("#msg-form").reset();
      } catch {
        showToast("Erro ao enviar mensagem.", "error");
      }
    });

    $("#btn-delete").addEventListener("click", async () => {
      if(!confirm("Tem certeza que deseja excluir esse anúncio?")) return;
      try {
        await deleteAnuncio(a.id);
        showToast("Anúncio excluído com sucesso!");
        navigate("/");
      } catch(err) {
        showToast(err.message || "Erro ao excluir.", "error");
      }
    });
  } catch {
    app().innerHTML = `
      ${navbar()}
      <div class="container detail">
        <div class="empty">
          <div class="empty__icon">😕</div>
          <p class="empty__text">Anúncio não encontrado.</p>
          <br/><span class="detail__back" data-link="/">← Voltar</span>
        </div>
      </div>
      ${footer()}
    `;
  }
}

// ── Create Page ──────────────────────────

function renderCreatePage() {
  app().innerHTML = `
    ${navbar()}
    <div class="container create-page">
      <h1>Publicar novo <span style="color:var(--text-accent)">anúncio</span></h1>
      <p>Preencha os dados do imóvel para criar um novo anúncio.</p>

      <form class="create-form" id="create-form">
        <div class="form-group">
          <label for="c-titulo">Título</label>
          <input class="form-input" id="c-titulo" required placeholder="Ex: Apartamento 3 quartos em Copacabana" />
        </div>
        <div class="form-group">
          <label for="c-desc">Descrição</label>
          <textarea class="form-textarea" id="c-desc" required placeholder="Descreva o imóvel…"></textarea>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="c-preco">Preço (R$)</label>
            <input class="form-input" id="c-preco" type="number" required placeholder="750000" />
          </div>
          <div class="form-group">
            <label for="c-quartos">Quartos</label>
            <input class="form-input" id="c-quartos" type="number" required min="1" placeholder="3" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="c-bairro">Bairro</label>
            <input class="form-input" id="c-bairro" required placeholder="Copacabana" />
          </div>
          <div class="form-group">
            <label for="c-foto">URL da foto</label>
            <input class="form-input" id="c-foto" placeholder="https://…" />
          </div>
        </div>
        <button type="submit" class="btn btn--primary" style="width:100%;margin-top:var(--space-4)">Publicar anúncio</button>
      </form>
    </div>
    ${footer()}
  `;

  $("#create-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const foto = $("#c-foto").value.trim();
    const data = {
      titulo: $("#c-titulo").value.trim(),
      descricao: $("#c-desc").value.trim(),
      preco: Number($("#c-preco").value),
      quartos: Number($("#c-quartos").value),
      bairro: $("#c-bairro").value.trim(),
      corretorId: "user-web",
      role: "ROLE_CORRETOR",
      fotos: foto ? [foto] : [],
    };

    try {
      const created = await createAnuncio(data);
      showToast("Anúncio criado com sucesso!");
      navigate(`/anuncios/${created.id}`);
    } catch (err) {
      showToast(err.message || "Erro ao criar anúncio.", "error");
    }
  });
}

// ── Boot ─────────────────────────────────
route();
