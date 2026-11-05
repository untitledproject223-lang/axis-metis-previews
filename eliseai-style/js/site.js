(function () {
  const A = window.AXIS;
  const esc = (v) => String(v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const check = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 10.5l3.2 3L15 6.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function renderStatic() {
    $("#hero-body").textContent = A.hero.body;
    $("#trust").innerHTML = A.assurances.map((a) => `<li title="${esc(a.body)}">${check}${esc(a.title)}</li>`).join("");

    $("#logo-grid").innerHTML = A.projects.map((p) => `
      <a class="logo-tile" href="#work/${p.slug}" data-project="${p.slug}">
        <img src="${p.logo}" alt="" width="44" height="44">
        <span class="lt-name">${esc(p.name)}</span>
        <span class="lt-sector">${esc(p.sector)}</span>
        <span class="chip">Case study &#8594;</span>
      </a>`).join("") + `
      <a class="logo-tile more" href="#contact"><span class="lt-name">Your business</span><span class="lt-sector">Next in line</span><span class="chip">Start a project &#8594;</span></a>`;

    $("#std-grid").innerHTML = A.standards.map((s, i) => `
      <article class="std" data-reveal>
        <span class="std-ico">${String(i + 1).padStart(2, "0")}</span>
        <h3>${esc(s.title)}</h3>
        <p>${esc(s.body)}</p>
      </article>`).join("");

    const li = (f) => `<li>${check}<div><b>${esc(f.title)}</b><span>${esc(f.body)}</span></div></li>`;
    $("#fit-yes").innerHTML = A.fit.yes.map(li).join("");
    $("#fit-no").innerHTML = A.fit.no.map(li).join("");
    $("#stack").textContent = A.technology.flatMap((t) => t.items).join(" · ");

    const mail = $("#contact-mail");
    mail.href = `mailto:${A.company.email}`;
    mail.textContent = A.company.email;
    $("#foot-city").textContent = `${A.company.city}, ${A.company.country}`;
    $("#foot-practices").innerHTML = A.practices.map((p, i) => `<li><a href="#platform" data-tab="${i}">${esc(p.title)}</a></li>`).join("");
    $("#foot-work").innerHTML = A.projects.map((p) => `<li><a href="#work/${p.slug}" data-project="${p.slug}">${esc(p.name)}</a></li>`).join("");
  }

  function wireCapture() {
    $$("[data-capture]").forEach((form) =>
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!form.checkValidity()) return form.reportValidity();
        const target = $("#contact-form input[name=email]");
        target.value = form.email.value.trim();
        $("#contact").scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
        setTimeout(() => $("#contact-form input[name=name]").focus({ preventScroll: true }), reduced ? 0 : 600);
      }),
    );
  }

  function wireCarousel() {
    const slides = $("#slides");
    const dots = $("#car-dots");
    const P = A.projects;
    let index = 0;
    let timer = null;

    slides.innerHTML = P.map((p, i) => `
      <article class="slide" role="group" aria-roledescription="slide" aria-label="${i + 1} of ${P.length}" data-i="${i}">
        <div class="slide-media" style="--accent:${p.color}">
          <span class="slide-brand"><img src="${p.logo}" alt="" width="40" height="40">${esc(p.name)}</span>
          <p class="slide-kicker">${esc(p.sector)} · ${esc(p.kicker)}</p>
          <ul>${p.shipped.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
        </div>
        <div class="slide-foot">
          <div><p class="quote">&ldquo;${esc(p.outcome)}&rdquo;</p><p class="muted">${esc(p.name)}</p></div>
          <a class="btn ghost sm" href="#work/${p.slug}" data-project="${p.slug}">Read more</a>
        </div>
      </article>`).join("");
    dots.innerHTML = P.map((p, i) => `<button role="tab" aria-label="${esc(p.name)}" data-i="${i}"></button>`).join("");

    function show(i) {
      index = (i + P.length) % P.length;
      $$(".slide", slides).forEach((s, n) => {
        let off = n - index;
        if (off > P.length / 2) off -= P.length;
        if (off < -P.length / 2) off += P.length;
        s.style.setProperty("--off", off);
        s.classList.toggle("active", off === 0);
        s.setAttribute("aria-hidden", String(off !== 0));
        $$("a", s).forEach((a) => (a.tabIndex = off === 0 ? 0 : -1));
      });
      $$("button", dots).forEach((b, n) => b.setAttribute("aria-selected", String(n === index)));
    }
    const play = () => {
      if (reduced) return;
      clearInterval(timer);
      timer = setInterval(() => show(index + 1), 6000);
    };
    const stop = () => clearInterval(timer);

    $("#car-prev").addEventListener("click", () => (show(index - 1), play()));
    $("#car-next").addEventListener("click", () => (show(index + 1), play()));
    dots.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (b) show(Number(b.dataset.i)), play();
    });
    slides.addEventListener("click", (e) => {
      const s = e.target.closest(".slide");
      if (s && !s.classList.contains("active")) {
        e.preventDefault();
        e.stopPropagation();
        show(Number(s.dataset.i));
        play();
      }
    }, true);
    const car = $("#carousel");
    car.addEventListener("mouseenter", stop);
    car.addEventListener("mouseleave", play);
    car.addEventListener("focusin", stop);
    car.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") show(index + 1);
      if (e.key === "ArrowLeft") show(index - 1);
    });
    let x0 = null;
    car.addEventListener("pointerdown", (e) => (x0 = e.clientX));
    car.addEventListener("pointerup", (e) => {
      if (x0 !== null && Math.abs(e.clientX - x0) > 50) show(index + (e.clientX < x0 ? 1 : -1));
      x0 = null;
    });
    show(0);
    play();
  }

  function wireDemo() {
    const tabs = $("#demo-tabs");
    const panel = $("#demo-panel");
    const short = ["Platforms & CRM", "Commerce", "Custom software"];
    tabs.innerHTML = A.practices.map((p, i) => `<button role="tab" id="dt-${i}" aria-controls="demo-panel" data-i="${i}">${short[i] || esc(p.title)}</button>`).join("");

    function show(i) {
      const p = A.practices[i];
      $$("button", tabs).forEach((b, n) => {
        b.setAttribute("aria-selected", String(n === i));
        b.tabIndex = n === i ? 0 : -1;
      });
      panel.setAttribute("aria-labelledby", `dt-${i}`);
      $("#win-title").textContent = p.title;
      panel.innerHTML = `
        <div class="msg-head"><span class="muted">To</span><b>Your operators</b></div>
        <div class="msg-head"><span class="muted">From</span><b><i class="spark"></i> Axis Metis</b></div>
        <div class="msg-head"><span class="muted">Subject</span><b>${esc(p.title)}</b></div>
        <div class="msg-body">
          <p>${esc(p.body)}</p>
          <ul>${p.points.map((x, n) => `<li style="--d:${n * 70}ms">${check}${esc(x)}</li>`).join("")}</ul>
        </div>
        <div class="msg-foot"><a class="btn sm" href="#contact" data-need="${esc(A.needs[i] || A.needs[0])}">Ask about this</a><span class="muted">Replies within two business days</span></div>`;
    }
    tabs.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (b) show(Number(b.dataset.i));
    });
    tabs.addEventListener("keydown", (e) => {
      const all = $$("button", tabs);
      const cur = all.indexOf(document.activeElement);
      if (cur < 0 || !["ArrowRight", "ArrowLeft"].includes(e.key)) return;
      const next = (cur + (e.key === "ArrowRight" ? 1 : -1) + all.length) % all.length;
      all[next].focus();
      show(next);
    });
    document.addEventListener("click", (e) => {
      const a = e.target.closest("[data-tab]");
      if (a) show(Number(a.dataset.tab));
    });
    show(0);
  }

  function wireRecord() {
    const list = $("#phase-list");
    const panel = $("#phase-panel");
    list.innerHTML = A.phases.map((ph, i) => `
      <li><button role="tab" id="ph-${i}" aria-controls="phase-panel" data-i="${i}">
        <span class="dot"></span><span><b>${esc(ph.title)}</b><small>${esc(ph.output)}</small></span>
      </button></li>`).join("");

    function show(i) {
      const ph = A.phases[i];
      $$("button", list).forEach((b, n) => {
        b.setAttribute("aria-selected", String(n === i));
        b.classList.toggle("done", n < i);
      });
      panel.setAttribute("aria-labelledby", `ph-${i}`);
      panel.innerHTML = `
        <div class="pp-top"><span class="badge">Phase ${i + 1} of ${A.phases.length}</span><span class="muted">${esc(ph.output)}</span></div>
        <h4>${esc(ph.title)}</h4>
        <p>${esc(ph.body)}</p>
        <div class="bubble"><span class="muted">Output for sign-off</span><b>${esc(ph.output)}</b></div>
        <div class="progress"><span style="width:${((i + 1) / A.phases.length) * 100}%"></span></div>
        <div class="pp-actions">
          <button class="btn ghost sm" data-step="-1" ${i === 0 ? "disabled" : ""}>Previous</button>
          <button class="btn sm" data-step="1" ${i === A.phases.length - 1 ? "disabled" : ""}>Next phase</button>
        </div>`;
      current = i;
    }
    let current = 0;
    list.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (b) show(Number(b.dataset.i));
    });
    panel.addEventListener("click", (e) => {
      const b = e.target.closest("[data-step]");
      if (b) show(current + Number(b.dataset.step));
    });
    show(0);
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
    wireCapture();
    wireCarousel();
    wireDemo();
    wireRecord();
    wireNeeds();
  });
})();
