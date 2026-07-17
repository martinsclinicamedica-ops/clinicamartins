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
