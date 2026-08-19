if ("scrollRestoration" in history) history.scrollRestoration = "manual";
window.addEventListener("load", () => { if (!location.hash) window.scrollTo(0, 0); });

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
menuToggle?.addEventListener("click", () => {
  const open = mainNav?.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(Boolean(open)));
});
mainNav?.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  mainNav.classList.remove("open");
  menuToggle?.setAttribute("aria-expanded", "false");
}));

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add("visible"); });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

// Depoimento recebido diretamente pela Clínica Martins.
// Mantemos apenas o primeiro nome no site e não atribuímos nota do Google,
// pois a mensagem original não contém classificação por estrelas.
const reviewsTrack = document.querySelector(".reviews-track");
if (reviewsTrack && !reviewsTrack.querySelector('[data-review="magali"]')) {
  const magaliReview = document.createElement("blockquote");
  magaliReview.className = "review-card";
  magaliReview.dataset.review = "magali";
  magaliReview.innerHTML = `<p>“Parabéns, seu atendimento é com excelência, respeito e gratidão pelo carinho.”</p><footer><span>M</span><div><strong>Magali</strong><small>Paciente da Clínica Martins</small></div></footer>`;
  reviewsTrack.appendChild(magaliReview);
}

const track = document.querySelector(".reviews-track");
const cards = [...document.querySelectorAll(".review-card")];
const dotsWrap = document.querySelector(".review-dots");
const prev = document.querySelector(".review-prev");
const next = document.querySelector(".review-next");
if (track && cards.length && dotsWrap) {
  cards.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = "review-dot";
    dot.type = "button";
    dot.setAttribute("aria-label", `Ir para avaliação ${i + 1}`);
    dot.addEventListener("click", () => goTo(i));
    dotsWrap.appendChild(dot);
  });
  const dots = [...dotsWrap.children];
  const offset = i => cards[i].offsetLeft - track.offsetLeft;
  const activeIndex = () => {
    let active = 0, distance = Infinity;
    cards.forEach((card, i) => {
      const d = Math.abs(offset(i) - track.scrollLeft);
      if (d < distance) { distance = d; active = i; }
    });
    return active;
  };
  const updateDots = () => dots.forEach((dot, i) => dot.classList.toggle("active", i === activeIndex()));
  const goTo = i => track.scrollTo({ left: offset(Math.max(0, Math.min(cards.length - 1, i))), behavior: "smooth" });
  prev?.addEventListener("click", () => goTo(activeIndex() - 1));
  next?.addEventListener("click", () => goTo(activeIndex() + 1));
  track.addEventListener("scroll", () => requestAnimationFrame(updateDots), { passive: true });
  window.addEventListener("resize", updateDots);
  updateDots();
}

// Ajustes exclusivos do índice do Blog do Dr. Bruno.
if (document.querySelector('.blog-index')) {
  const brand = document.querySelector('.brand');
  const brandSmall = document.querySelector('.brand small');
  const nav = document.querySelector('.main-nav');
  if (brand) brand.href = '/';
  if (brandSmall) brandSmall.textContent = 'Atendimento médico';
  if (nav) {
    nav.setAttribute('aria-label', 'Menu principal');
    nav.innerHTML = `
      <a href="/">Início</a><a href="/#sobre">Sobre</a><a href="/#servicos">Serviços</a>
      <a href="/blog/">Blog</a><a href="/#avaliacoes">Avaliações</a><a href="/#localizacao">Localização</a>
      <a class="nav-cta" href="https://wa.me/5541987799634?text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20uma%20consulta%20na%20Cl%C3%ADnica%20Martins." target="_blank" rel="noopener">Agendar consulta</a>`;
  }
  document.querySelectorAll('.site-footer a').forEach(a => {
    const t = a.textContent.trim();
    if (t === 'Blog do Dr. Bruno') a.href = '/blog/';
    if (t === 'Fontes de saúde') a.href = '/blog/fontes/';
    if (t === 'Serviços') a.href = '/#servicos';
  });

  const style = document.createElement('style');
  style.textContent = `
    .blog-hero{padding:72px 0 56px;background:radial-gradient(circle at 12% 12%,rgba(200,157,84,.13),transparent 30%),linear-gradient(135deg,#fffaf5 0%,#f3e8dc 100%)}
    .blog-hero-grid{grid-template-columns:1.15fr .85fr;gap:54px;align-items:center}
    .blog-hero h1{font-size:clamp(3rem,5vw,5rem);line-height:1}
    .blog-hero-photo{border-radius:28px;overflow:hidden;box-shadow:var(--shadow);border:1px solid var(--line)}
    .blog-hero-photo img{height:450px;width:100%;object-fit:cover;object-position:center 25%}
    .blog-index{padding-top:82px;padding-bottom:92px;background:var(--cream-2)}
    .blog-index>.container{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px;align-items:stretch}
    .blog-index .section-heading,.blog-tools{grid-column:1/-1}
    .blog-index .section-heading{margin-bottom:4px;max-width:820px}
    .blog-index .section-heading h2{font-size:clamp(2.2rem,4vw,3.7rem)}
    .blog-tools{display:flex;align-items:end;gap:16px;margin:0 0 18px;padding:18px;border:1px solid var(--line);border-radius:20px;background:#fff;box-shadow:0 10px 30px rgba(63,43,34,.04)}
    .blog-search{display:flex;flex:1;flex-direction:column;gap:7px;font-weight:700;color:var(--brown-900)}
    .blog-search input{width:100%;border:1px solid var(--line);border-radius:14px;padding:14px 16px;font:inherit;outline:none;background:var(--cream-2)}
    .blog-search input:focus{border-color:var(--brown-500);box-shadow:0 0 0 3px rgba(156,120,98,.10)}
    .blog-results-count{min-width:145px;margin:0;padding:12px 0;color:var(--muted);font-size:.88rem}
    .blog-post{margin:0;padding:24px 26px;border:1px solid var(--line);border-radius:20px;background:#fff;box-shadow:0 10px 30px rgba(63,43,34,.045);transition:.2s ease;cursor:pointer;scroll-margin-top:105px}
    .blog-post:hover{transform:translateY(-3px);box-shadow:0 18px 42px rgba(63,43,34,.08);border-color:rgba(111,77,61,.2)}
    .blog-post h2{font-family:'Playfair Display',serif;color:var(--brown-900);font-size:clamp(1.48rem,2vw,1.95rem);line-height:1.15;letter-spacing:-.025em;margin:0 0 12px}
    .blog-post p{margin:0;color:var(--muted);font-size:.96rem;line-height:1.65}
    .child-note{display:inline-flex;margin-top:14px;padding:7px 10px;border-radius:999px;background:#f7efe6;border:1px solid rgba(200,157,84,.22);color:var(--brown-700);font-size:.76rem;font-weight:700;line-height:1.25}
    .blog-post-more{display:inline-block;margin-top:16px;color:var(--brown-700);font-weight:700;font-size:.9rem}
    @media(max-width:980px){.blog-hero-photo img{height:auto;max-height:500px}}
    @media(max-width:720px){.blog-index>.container{grid-template-columns:1fr;gap:14px}.blog-index .section-heading,.blog-tools{grid-column:auto}.blog-tools{align-items:stretch;flex-direction:column}.blog-results-count{padding:0}.blog-post{padding:20px}.blog-post h2{font-size:1.5rem}.blog-hero h1{font-size:clamp(2.9rem,14vw,4.2rem)}.blog-hero{padding:54px 0 44px}}
  `;
  document.head.appendChild(style);

  const posts = [...document.querySelectorAll('.blog-post')];
  const heading = document.querySelector('.blog-index .section-heading');
  if (heading && posts.length) {
    const tools = document.createElement('div');
    tools.className = 'blog-tools';
    tools.innerHTML = `<label class="blog-search"><span>Buscar no blog</span><input id="blogSearch" type="search" autocomplete="off" placeholder="Ex.: pressão alta, tosse, febre em criança"></label><p class="blog-results-count" id="blogResultsCount">${posts.length} artigos disponíveis</p>`;
    heading.insertAdjacentElement('afterend', tools);
    const input = tools.querySelector('#blogSearch');
    const count = tools.querySelector('#blogResultsCount');
    const normalize = v => (v || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const filter = () => {
      const term = normalize(input.value);
      let shown = 0;
      posts.forEach(post => {
        const visible = !term || normalize(post.textContent).includes(term);
        post.hidden = !visible;
        if (visible) shown++;
      });
      count.textContent = `${shown} ${shown === 1 ? 'artigo encontrado' : 'artigos encontrados'}`;
    };
    input.addEventListener('input', filter);
  }

  posts.forEach(post => {
    const slug = post.id;
    if (!slug) return;
    post.tabIndex = 0;
    post.setAttribute('role', 'link');
    const link = document.createElement('a');
    link.className = 'blog-post-more';
    link.href = `/blog/artigo.html#${slug}`;
    link.textContent = 'Ler artigo completo →';
    post.appendChild(link);
    post.addEventListener('click', e => {
      if (e.target.closest('a')) return;
      location.href = link.href;
    });
    post.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); location.href = link.href; }
    });
  });
}