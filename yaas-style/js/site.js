(function () {
  const A = window.AXIS;
  const esc = (v) => String(v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const flavour = {
    "digital-dwella": "#12b5a5",
    "pheli-seafood": "#ff5a4e",
    "vital-plate": "#7bc943",
    "dka-school": "#d6336c",
    "nendila-travels": "#ff9f1c",
  };
  const needFor = (p) => (p.sector === "Hospitality" ? "Commerce or customer portal" : "Operational platform / CRM");

  const can = (p, cls = "") => `
    <div class="can ${cls}" style="--c:${flavour[p.slug]}">
      <span class="can-top"></span>
      <span class="can-brand">AXIS</span>
      <span class="can-flavor">${esc(p.sector)}</span>
      <img class="can-logo" src="${p.logo}" alt="">
      <span class="can-name">${esc(p.name)}</span>
      <span class="can-tag">Yours to own</span>
    </div>`;

  const faq = [
    ["Who owns the system when it is finished?", A.standards[1].body],
    ["How do you agree what gets built?", A.standards[0].body],
    ["How is the build tested?", A.standards[2].body],
    ["What happens after launch?", A.standards[5].body],
    ["What kind of work do you take on?", A.practices.map((p) => p.title).join(", ") + ", for " + A.sectors.join(", ").toLowerCase() + " businesses."],
    ["When should we not build custom software?", A.fit.no[0].body],
    ["Where is the team?", A.assurances[3].body + "."],
  ];

  function renderStatic() {
    $("#hero-body").textContent = A.hero.body;
    $("#loader-cans").innerHTML = A.projects.map((p) => can(p, "mini")).join("");
    $("#hero-cans").innerHTML = A.projects.map((p, i) => `<div class="float f${i}">${can(p)}</div>`).join("");

    $("#pin-track").innerHTML = A.phases.map((ph, i) => `
      <article class="step" style="--c:${Object.values(flavour)[i % 5]}">
        <span class="step-n">${String(i + 1).padStart(2, "0")}</span>
        <h3>${esc(ph.title)}</h3>
        <p>${esc(ph.body)}</p>
        <p class="step-out"><b>You get</b>${esc(ph.output)}</p>
      </article>`).join("");

    $("#mix").innerHTML = A.practices.map((p, i) => `
      <article class="mix-card" data-reveal style="--c:${Object.values(flavour)[i]}">
        <h3>${esc(p.title)}</h3>
        <p>${esc(p.body)}</p>
        <ul>${p.points.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
        <a class="btn dark sm" href="#contact" data-need="${esc(A.needs[i] || A.needs[0])}">Ask about this</a>
      </article>`).join("");

    $("#cards").innerHTML = A.standards.map((s, i) => `
      <article class="card" data-reveal style="--tilt:${[-4, 3, -2, 4, -3, 2][i]}deg">
        <span class="card-n">${i + 1}</span>
        <h3>${esc(s.title)}</h3>
        <p>${esc(s.body)}</p>
      </article>`).join("");

    $("#faq-list").innerHTML = faq.map(([q, a], i) => `
      <div class="qa">
        <h3><button aria-expanded="false" aria-controls="qa-${i}" id="qb-${i}">${esc(q)}<span aria-hidden="true">+</span></button></h3>
        <div class="qa-body" id="qa-${i}" role="region" aria-labelledby="qb-${i}" hidden><p>${esc(a)}</p></div>
      </div>`).join("");

    const mail = $("#contact-mail");
    mail.href = `mailto:${A.company.email}`;
    mail.textContent = A.company.email;
    $("#stack").textContent = A.technology.flatMap((t) => t.items).join(" · ");
  }

  function wireLoader() {
    const bar = $("#loader-bar");
    let pct = 0;
    const tick = setInterval(() => {
      pct = Math.min(90, pct + 7 + Math.random() * 12);
      bar.style.width = pct + "%";
    }, 90);
    const done = () => {
      clearInterval(tick);
      bar.style.width = "100%";
      setTimeout(() => document.body.classList.remove("loading"), reduced ? 0 : 320);
    };
    const start = performance.now();
    const finish = () => setTimeout(done, Math.max(0, 1100 - (performance.now() - start)));
    if (document.readyState === "complete") finish();
    else addEventListener("load", finish, { once: true });
    setTimeout(done, 3500);
    $("#loader").addEventListener("click", done);
  }

  function wireHero() {
    if (reduced) return;
    const cans = $("#hero-cans");
    addEventListener("pointermove", (e) => {
      cans.style.setProperty("--mx", (e.clientX / innerWidth - 0.5).toFixed(3));
      cans.style.setProperty("--my", (e.clientY / innerHeight - 0.5).toFixed(3));
    }, { passive: true });
    addEventListener("scroll", () => cans.style.setProperty("--sy", Math.min(scrollY, 900) + "px"), { passive: true });
  }

  function wireSpotlight() {
    const section = $("#work");
    const dots = $("#spot-dots");
    let index = 0;
    dots.innerHTML = A.projects.map((p, i) => `<button role="tab" aria-label="${esc(p.name)}" data-i="${i}"></button>`).join("");

    function show(i, dir = 1) {
      index = (i + A.projects.length) % A.projects.length;
      const p = A.projects[index];
      section.style.setProperty("--c", flavour[p.slug]);
      $("#spot-count").textContent = `${p.sector} · ${String(index + 1).padStart(2, "0")} of ${String(A.projects.length).padStart(2, "0")}`;
      $("#spot-name").textContent = p.name;
      $("#spot-work").textContent = p.work;
      $("#spot-shipped").innerHTML = p.shipped.map((s) => `<li>${esc(s)}</li>`).join("");
      $("#spot-open").setAttribute("data-project", p.slug);
      $("#spot-need").setAttribute("data-need", needFor(p));
      const stage = $("#spot-can");
      stage.style.setProperty("--dir", dir);
      stage.innerHTML = can(p, "big");
      $$("button", dots).forEach((b, n) => b.setAttribute("aria-selected", String(n === index)));
    }

    $("#spot-prev").addEventListener("click", () => show(index - 1, -1));
    $("#spot-next").addEventListener("click", () => show(index + 1, 1));
    dots.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (b) show(Number(b.dataset.i), Number(b.dataset.i) >= index ? 1 : -1);
    });
    section.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") show(index + 1, 1);
      if (e.key === "ArrowLeft") show(index - 1, -1);
    });
    let x0 = null;
    section.addEventListener("pointerdown", (e) => (x0 = e.clientX));
    section.addEventListener("pointerup", (e) => {
      if (x0 !== null && Math.abs(e.clientX - x0) > 50) show(index + (e.clientX < x0 ? 1 : -1), e.clientX < x0 ? 1 : -1);
      x0 = null;
    });
    show(0);
  }

  function wireStatement() {
    const el = $("#statement-text");
    el.innerHTML = el.textContent.split(" ").map((w) => `<span>${esc(w)}</span>`).join(" ");
    const words = $$("span", el);
    if (reduced) return words.forEach((w) => w.classList.add("on"));
    const section = $("#statement");
    const update = () => {
      const r = section.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (innerHeight * 0.85 - r.top) / (r.height + innerHeight * 0.2)));
      const lit = Math.round(p * words.length * 1.15);
      words.forEach((w, i) => w.classList.toggle("on", i < lit));
    };
    addEventListener("scroll", update, { passive: true });
    update();
  }

  function wirePin() {
    const section = $("#process");
    const track = $("#pin-track");
    const bar = $("#pin-bar");
    const mq = matchMedia("(min-width: 860px)");
    function layout() {
      if (!mq.matches || reduced) {
        section.classList.remove("pinned");
        section.style.height = "";
        track.style.transform = "";
        return;
      }
      section.classList.add("pinned");
      const travel = track.scrollWidth - innerWidth + 80;
      section.style.height = innerHeight + Math.max(0, travel) + "px";
      update();
    }
    function update() {
      if (!section.classList.contains("pinned")) return;
      const r = section.getBoundingClientRect();
      const travel = section.offsetHeight - innerHeight;
      const p = Math.min(1, Math.max(0, -r.top / travel));
      track.style.transform = `translateX(${-p * travel}px)`;
      bar.style.width = p * 100 + "%";
    }
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", layout);
    mq.addEventListener("change", layout);
    layout();
    document.fonts && document.fonts.ready.then(layout);
  }

  function wireFaq() {
    $("#faq-list").addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      const open = b.getAttribute("aria-expanded") === "true";
      $$("#faq-list button").forEach((x) => {
        x.setAttribute("aria-expanded", "false");
        $("#" + x.getAttribute("aria-controls")).hidden = true;
      });
      if (!open) {
        b.setAttribute("aria-expanded", "true");
        $("#" + b.getAttribute("aria-controls")).hidden = false;
      }
    });
  }

  function wireFit() {
    const list = $("#fit-list");
    const render = (k) => {
      list.className = `fit-list ${k}`;
      list.innerHTML = A.fit[k].map((f) => `<li><b>${esc(f.title)}</b><span>${esc(f.body)}</span></li>`).join("");
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
    wireLoader();
    wireHero();
    wireSpotlight();
    wireStatement();
    wirePin();
    wireFaq();
    wireFit();
    wireNeeds();
  });
})();
