(function () {
  const A = window.AXIS;
  const esc = (v) => String(v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const looks = ["type", "split", "poster", "stat", "grid"];

  const faq = [
    ["Who owns the system when it is finished?", A.standards[1].body],
    ["How do you agree what gets built?", A.standards[0].body],
    ["How is the build tested?", A.standards[2].body],
    ["What happens after launch?", A.standards[5].body],
    ["What kind of work do you take on?", A.practices.map((p) => p.title).join(", ") + ", for " + A.sectors.join(", ").toLowerCase() + " businesses."],
    ["When should we not build custom software?", A.fit.no[0].body],
    ["Where is the team?", A.assurances[3].body + "."],
  ];

  function slide(p, i) {
    const look = looks[i % looks.length];
    const word = esc(p.sector.toUpperCase());
    const inner = {
      type: `<p class="s-repeat">${(word + " ").repeat(3)}</p><p class="s-repeat alt">${(word + " ").repeat(3)}</p><img class="s-logo center" src="${p.logo}" alt="">`,
      split: `<div class="s-split"><div><p class="s-kick">${esc(p.kicker)}</p><h3>${esc(p.summary)}</h3><span class="s-btn">View case study</span></div><img src="${p.logo}" alt=""></div>`,
      poster: `<img class="s-logo big" src="${p.logo}" alt=""><h3 class="s-serif">${esc(p.name)}</h3><p class="s-kick">${esc(p.sector)} · ${esc(p.kicker)}</p>`,
      stat: `<p class="s-num">${p.shipped.length}</p><p class="s-stat">pieces delivered for <b>${esc(p.name)}</b>: ${p.shipped.map(esc).join(", ")}.</p>`,
      grid: `<div class="s-grid">${p.shipped.map((s) => `<span>${esc(s)}</span>`).join("")}</div><h3>${esc(p.name)}</h3>`,
    }[look];
    return `<a class="slide ${look}" href="#work/${p.slug}" data-project="${p.slug}" style="--c:${p.color}" aria-label="${esc(p.name)} case study">
      <span class="s-top"><span>${esc(p.name)}</span><span>${String(i + 1).padStart(2, "0")}</span></span>${inner}</a>`;
  }

  function renderStatic() {
    $("#hero-body").textContent = A.hero.body;
    const cards = A.projects.map(slide).join("");
    // Second copy keeps the marquee loop seamless; it is hidden from assistive tech.
    $("#rail-track").innerHTML = cards + cards.replace(/<a class="slide/g, '<a tabindex="-1" aria-hidden="true" class="slide');

    const visuals = [
      (p) => `<div class="v-chat"><p class="bubble me">We track jobs in three spreadsheets.</p><p class="bubble ai"><i></i>Map the process first. Then one system of record: ${p.points.slice(0, 3).map(esc).join(", ").toLowerCase()}.</p><p class="bubble me short">Start with discovery.</p></div>`,
      (p) => `<div class="v-looks">${p.points.map((x, n) => `<span style="--n:${n}">${esc(x)}</span>`).join("")}</div>`,
      (p) => `<div class="v-edit"><div class="v-doc"><b></b><b></b><b class="s"></b></div><div class="v-tools">${p.points.map((x) => `<span>${esc(x)}</span>`).join("")}</div></div>`,
    ];
    $("#rows").innerHTML = A.practices.map((p, i) => `
      <article class="row ${i % 2 ? "flip" : ""}" data-reveal>
        <div class="row-copy">
          <h3>${esc(p.title)}</h3>
          <p>${esc(p.body)}</p>
          <ul>${p.points.slice(0, 3).map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
          <a class="dark-pill" href="#contact" data-need="${esc(A.needs[i] || A.needs[0])}">Ask about this</a>
        </div>
        <div class="row-visual v${i}">${visuals[i](p)}</div>
      </article>`).join("");

    $("#format-grid").innerHTML = A.phases.map((ph, i) => `
      <article class="fmt f${i}" data-reveal tabindex="0">
        <div class="fmt-art"><span>${String(i + 1).padStart(2, "0")}</span><b>${esc(ph.output)}</b></div>
        <h3>${esc(ph.title)}</h3>
        <p>${esc(ph.body)}</p>
      </article>`).join("");

    $("#board-track").innerHTML = A.standards.map((s, i) => `
      <article class="member m${i}">
        <div class="m-art"><span>${esc(s.title.split(" ")[0])}</span></div>
        <h3>${esc(s.title)}</h3>
        <p>${esc(s.body)}</p>
      </article>`).join("");

    const quote = (p) => `<figure class="q"><blockquote>${esc(p.outcome)}</blockquote><figcaption><img src="${p.logo}" alt="" width="28" height="28">${esc(p.name)}, ${esc(p.sector)}</figcaption></figure>`;
    const half = A.projects.map(quote).join("") + A.assurances.map((a) => `<figure class="q alt"><blockquote>${esc(a.body)}.</blockquote><figcaption>${esc(a.title)}</figcaption></figure>`).join("");
    $("#marquee").innerHTML = [0, 1].map((n) => `<div class="m-row ${n ? "rev" : ""}"><div class="m-inner">${half}<div aria-hidden="true" class="m-dup">${half}</div></div></div>`).join("");

    $("#faq-list").innerHTML = faq.map(([q, a], i) => `
      <div class="qa">
        <h3><button aria-expanded="false" aria-controls="qa-${i}" id="qb-${i}">${esc(q)}<span aria-hidden="true"></span></button></h3>
        <div class="qa-body" id="qa-${i}" role="region" aria-labelledby="qb-${i}"><div><p>${esc(a)}</p></div></div>
      </div>`).join("");

    const mail = $("#faq-mail");
    mail.href = `mailto:${A.company.email}`;
    mail.textContent = A.company.email;
    $("#stack").textContent = A.technology.flatMap((t) => t.items).join(" · ");
    $("#foot-work").innerHTML = A.projects.map((p) => `<li><a href="#work/${p.slug}" data-project="${p.slug}">${esc(p.name)}</a></li>`).join("");
  }

  function stars(canvas) {
    const ctx = canvas.getContext("2d");
    let pts = [];
    const size = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      pts = Array.from({ length: Math.round((r.width * r.height) / 5000) }, () => ({
        x: Math.random() * r.width,
        y: Math.random() * r.height * 0.75,
        r: Math.random() * 1.2 + 0.2,
        p: Math.random() * Math.PI * 2,
      }));
    };
    const draw = (t) => {
      const r = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, r.width, r.height);
      pts.forEach((s) => {
        ctx.globalAlpha = 0.35 + 0.65 * Math.abs(Math.sin(s.p + t / 1400));
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });
    };
    size();
    addEventListener("resize", size);
    if (reduced) return draw(0);
    let visible = true;
    new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(canvas);
    const loop = (t) => {
      if (visible) draw(t);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  function wireSky() {
    stars($("#stars"));
    stars($("#stars-2"));
    if (reduced) return;
    const sky = $(".sky");
    addEventListener("scroll", () => sky.style.setProperty("--sy", Math.min(scrollY, 1000)), { passive: true });
    sky.addEventListener("pointermove", (e) => {
      sky.style.setProperty("--mx", (e.clientX / innerWidth - 0.5).toFixed(3));
      sky.style.setProperty("--my", (e.clientY / innerHeight - 0.5).toFixed(3));
    });
  }

  function wireRail() {
    const rail = $("#work");
    const track = $("#rail-track");
    const cards = $$(".slide", track);
    let x = 0;
    let paused = false;
    let loop = 0;
    const measure = () => (loop = cards[A.projects.length].offsetLeft - cards[0].offsetLeft);
    const place = () => {
      track.style.transform = `translateX(${-x}px)`;
      const mid = innerWidth / 2;
      cards.forEach((c) => {
        const d = (c.offsetLeft + c.offsetWidth / 2 - x - mid) / innerWidth;
        const k = Math.max(-1, Math.min(1, d));
        c.style.transform = `perspective(1400px) rotateY(${-k * 28}deg) translateZ(${-Math.abs(k) * 120}px) translateY(${Math.abs(k) * 14}px)`;
      });
    };
    measure();
    addEventListener("resize", () => (measure(), place()));
    document.fonts && document.fonts.ready.then(() => (measure(), place()));
    rail.addEventListener("mouseenter", () => (paused = true));
    rail.addEventListener("mouseleave", () => (paused = false));
    rail.addEventListener("focusin", (e) => {
      paused = true;
      const c = e.target.closest(".slide");
      if (c) x = Math.max(0, c.offsetLeft + c.offsetWidth / 2 - innerWidth / 2);
      place();
    });
    rail.addEventListener("focusout", () => (paused = false));
    let last = performance.now();
    const tick = (t) => {
      const dt = Math.min(64, t - last);
      last = t;
      if (!paused && !reduced) {
        x += dt * 0.04;
        if (loop && x >= loop) x -= loop;
      }
      place();
      requestAnimationFrame(tick);
    };
    x = Math.max(0, cards[0].offsetWidth * 0.4);
    requestAnimationFrame(tick);
  }

  function wireBoard() {
    const track = $("#board-track");
    const step = () => (track.firstElementChild ? track.firstElementChild.getBoundingClientRect().width + 20 : 300);
    $("#board-prev").addEventListener("click", () => track.scrollBy({ left: -step(), behavior: reduced ? "auto" : "smooth" }));
    $("#board-next").addEventListener("click", () => track.scrollBy({ left: step(), behavior: reduced ? "auto" : "smooth" }));
    const sync = () => {
      $("#board-prev").disabled = track.scrollLeft < 4;
      $("#board-next").disabled = track.scrollLeft + track.clientWidth > track.scrollWidth - 4;
    };
    track.addEventListener("scroll", sync, { passive: true });
    addEventListener("resize", sync);
    sync();
  }

  function wireFaq() {
    $("#faq-list").addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      const open = b.getAttribute("aria-expanded") === "true";
      b.setAttribute("aria-expanded", String(!open));
      b.closest(".qa").classList.toggle("open", !open);
    });
  }

  function wireFit() {
    const list = $("#fit-list");
    const render = (k) => {
      list.innerHTML = A.fit[k].map((f) => `<li class="${k}"><b>${esc(f.title)}</b><span>${esc(f.body)}</span></li>`).join("");
      $$("[data-fit]").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.fit === k)));
    };
    $$("[data-fit]").forEach((b) => b.addEventListener("click", () => render(b.dataset.fit)));
    render("yes");
  }

  function wireNeeds() {
    document.addEventListener("click", (e) => {
      const a = e.target.closest("a[data-need]");
      if (!a || a.closest("dialog")) return;
      const select = $("#contact select[name=need]");
      if (select) select.value = a.getAttribute("data-need");
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderStatic();
    wireSky();
    wireRail();
    wireBoard();
    wireFaq();
    wireFit();
    wireNeeds();
  });
})();
