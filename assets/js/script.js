// Ajustes específicos do blog — mantém a identidade visual da página principal
if (document.querySelector('.blog-index')) {
  // Deixa o cabeçalho do blog igual ao cabeçalho da página inicial
  const brand = document.querySelector('.brand');
  const brandSmall = document.querySelector('.brand small');
  const blogNav = document.querySelector('.main-nav');

  if (brand) brand.href = 'https://clinicamartins.med.br/';
  if (brandSmall) brandSmall.textContent = 'Atendimento médico';
  if (blogNav) {
    blogNav.setAttribute('aria-label', 'Menu principal');
    blogNav.innerHTML = `
      <a href="https://clinicamartins.med.br/">Início</a>
      <a href="https://clinicamartins.med.br/#sobre">Sobre</a>
      <a href="https://clinicamartins.med.br/#servicos">Serviços</a>
      <a href="https://clinicamartins.med.br/blog/">Blog</a>
      <a href="https://clinicamartins.med.br/#avaliacoes">Avaliações</a>
      <a href="https://clinicamartins.med.br/#localizacao">Localização</a>
      <a class="nav-cta" href="https://wa.me/5541987799634?text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20uma%20consulta%20na%20Cl%C3%ADnica%20Martins." target="_blank" rel="noopener">Agendar consulta</a>`;
  }

  const blogStyle = document.createElement('style');
  blogStyle.textContent = `
    .blog-hero{padding:72px 0 56px;background:radial-gradient(circle at 12% 12%,rgba(200,157,84,.13),transparent 30%),linear-gradient(135deg,#fffaf5 0%,#f3e8dc 100%)}
    .blog-hero-grid{grid-template-columns:1.15fr .85fr;gap:54px;align-items:center}
    .blog-hero h1{font-size:clamp(3rem,5vw,5rem);line-height:1}
    .blog-hero-photo{border-radius:28px;overflow:hidden;box-shadow:var(--shadow);border:1px solid var(--line)}
    .blog-hero-photo img{height:450px;width:100%;object-fit:cover;object-position:center 25%}
    .blog-index{padding-top:82px;padding-bottom:92px;background:var(--cream-2)}
    .blog-index>.container{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px;align-items:stretch}
    .blog-index .section-heading{grid-column:1/-1;margin-bottom:22px;max-width:820px}
    .blog-index .section-heading h2{font-size:clamp(2.2rem,4vw,3.7rem)}
    .blog-index .section-heading p{margin-bottom:0}
    .blog-post{margin:0;padding:24px 26px;border:1px solid var(--line);border-radius:20px;background:#fff;box-shadow:0 10px 30px rgba(63,43,34,.045);transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease;scroll-margin-top:105px}
    .blog-post:hover{transform:translateY(-3px);box-shadow:0 18px 42px rgba(63,43,34,.08);border-color:rgba(111,77,61,.2)}
    .blog-post h2{font-family:'Playfair Display',serif;color:var(--brown-900);font-size:clamp(1.48rem,2vw,1.95rem);line-height:1.15;letter-spacing:-.025em;margin:0 0 12px}
    .blog-post p{margin:0;color:var(--muted);font-size:.96rem;line-height:1.65}
    .blog-post p+p{margin-top:10px}
    .child-note{display:inline-flex;margin-top:14px;padding:7px 10px;border-radius:999px;background:#f7efe6;border:1px solid rgba(200,157,84,.22);color:var(--brown-700);font-size:.76rem;font-weight:700;line-height:1.25}
    .scope-note{font-size:.94rem;line-height:1.6;padding:18px 20px;border:1px solid var(--line);border-radius:16px;background:rgba(255,255,255,.62);margin-top:20px}
    @media(max-width:980px){.blog-index>.container{grid-template-columns:1fr 1fr}.blog-hero-grid{grid-template-columns:1fr}.blog-hero-photo{max-width:620px}.blog-hero-photo img{height:auto;max-height:500px}}
    @media(max-width:720px){.blog-index>.container{grid-template-columns:1fr;gap:14px}.blog-index .section-heading{grid-column:auto}.blog-index{padding-top:62px;padding-bottom:72px}.blog-post{padding:20px}.blog-post h2{font-size:1.5rem}.blog-hero h1{font-size:clamp(2.9rem,14vw,4.2rem)}.blog-hero{padding:54px 0 44px}}
  `;
  document.head.appendChild(blogStyle);
}

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

window.addEventListener("load", () => {
  if (!location.hash) window.scrollTo(0, 0);
});

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

menuToggle?.addEventListener("click", () => {
  const open = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});

mainNav?.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

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

  function offset(i) {
    return cards[i].offsetLeft - track.offsetLeft;
  }

  function activeIndex() {
    let active = 0;
    let distance = Infinity;
    cards.forEach((card, i) => {
      const d = Math.abs(offset(i) - track.scrollLeft);
      if (d < distance) {
        distance = d;
        active = i;
      }
    });
    return active;
  }

  function updateDots() {
    const active = activeIndex();
    dots.forEach((dot, i) => dot.classList.toggle("active", i === active));
  }

  function goTo(i) {
    const target = Math.max(0, Math.min(cards.length - 1, i));
    track.scrollTo({ left: offset(target), behavior: "smooth" });
  }

  prev?.addEventListener("click", () => goTo(activeIndex() - 1));
  next?.addEventListener("click", () => goTo(activeIndex() + 1));
  track.addEventListener("scroll", () => requestAnimationFrame(updateDots), { passive: true });
  window.addEventListener("resize", updateDots);
  updateDots();
}
