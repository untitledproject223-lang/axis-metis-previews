(function () {
  const A = window.AXIS;
  const esc = (v) => String(v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const needFor = (p) => (p.sector === "Hospitality" ? "Commerce or customer portal" : "Operational platform / CRM");

  // Each line restates facts already in data.js; nothing here adds figures or claims.
  const detail = {
    "digital-dwella": {
      users: "Letting staff and property managers",
      handled: [
        "Three letting environments with different rules, from formal screening in urban estates to faster placement in townships",
        "Whole-property accommodation such as student residences, run as one record",
        "Tenancies, rent, and maintenance tickets kept together",
      ],
    },
    "pheli-seafood": {
      users: "Customers ordering, and the kitchen team",
      handled: [
        "High order volume at a busy Atteridgeville restaurant",
        "Orders arriving from the website and native iOS and Android apps",
        "One order queue the kitchen works from, with menu and stock control behind it",
      ],
    },
    "vital-plate": {
      users: "Dietitians and practice staff",
      handled: [
        "Clinical confidentiality for patient records",
        "Bookings and consultation notes tied to each patient",
        "Meal plans kept with the patient history",
      ],
    },
    "dka-school": {
      users: "Parents, prospective families, and school staff",
      handled: [
        "Academics, admissions, news, and contact in one clear structure",
        "Pages written for parents and families deciding on the school",
        "A single authoritative channel for admissions",
      ],
    },
    "nendila-travels": {
      users: "Agency consultants and their travellers",
      handled: [
        "Bookings and client records in one agency system",
        "PDF invoices generated from the booking",
        "Travel documents prepared for each traveller",
      ],
    },
  };

  const handover = [
    "Source code in a repository you own",
    "Hosting and service accounts in your name",
    "Written documentation and admin walkthroughs",
    "A training session for your staff",
    "A signed test and acceptance record",
    "An agreed support arrangement",
  ];

  function screen(p) {
    return `
      <div class="mock" style="--c:${p.color}" aria-hidden="true">
        <div class="mock-side"><img src="${p.logo}" alt=""><span>${esc(p.name)}</span>
          ${p.shipped.map((s, i) => `<b class="${i === 0 ? "on" : ""}">${esc(s)}</b>`).join("")}
        </div>
        <div class="mock-main">
          <div class="mock-head"><span>${esc(p.shipped[0])}</span><i></i></div>
          <div class="mock-rows">${[0, 1, 2, 3, 4].map((n) => `<div><i style="width:${[62, 48, 70, 40, 55][n]}%"></i><i class="s"></i></div>`).join("")}</div>
        </div>
      </div>
      <p class="mock-note">Illustrative layout of the ${esc(p.name)} workspace, not live data.</p>`;
  }

  function renderStatic() {
    $("#handover-mini").innerHTML = handover.slice(0, 4).map((h) => `<li>${esc(h)}</li>`).join("");
    $("#handover").innerHTML = handover.map((h, i) => `<li><span>${String(i + 1).padStart(2, "0")}</span>${esc(h)}</li>`).join("");

    $("#client-row").innerHTML = A.projects.map((p) => `
      <li><a href="#work" data-case="${p.slug}"><img src="${p.logo}" alt="" width="40" height="40"><span><b>${esc(p.name)}</b><small>${esc(p.sector)}</small></span></a></li>`).join("");

    $("#reasons").innerHTML = A.standards.map((s, i) => `
      <li data-reveal><span class="num">${i + 1}</span><div><h3>${esc(s.title)}</h3><p>${esc(s.body)}</p></div></li>`).join("");

    $("#practice-cols").innerHTML = A.practices.map((p, i) => `
      <div class="practice">
        <h3>${esc(p.title)}</h3>
        <p>${esc(p.body)}</p>
        <ul>${p.points.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
        <a href="#contact" class="text-link" data-need="${esc(A.needs[i] || A.needs[0])}">Ask about ${esc(p.title.split(" ")[0].toLowerCase())} work &#8594;</a>
      </div>`).join("");

    const li = (f) => `<li><b>${esc(f.title)}</b><span>${esc(f.body)}</span></li>`;
    $("#fit-yes").innerHTML = A.fit.yes.map(li).join("");
    $("#fit-no").innerHTML = A.fit.no.map(li).join("");

    const mail = $("#contact-mail");
    mail.href = `mailto:${A.company.email}`;
    mail.textContent = A.company.email;
    $("#contact-city").textContent = `${A.company.city}, ${A.company.country}`;
    $("#contact-sectors").textContent = A.sectors.join(", ");
    $("#stack").textContent = "Built with " + A.technology.flatMap((t) => t.items).slice(0, 10).join(", ") + ".";
    $("#foot-work").innerHTML = A.projects.map((p) => `<li><a href="#work/${p.slug}" data-project="${p.slug}">${esc(p.name)}</a></li>`).join("");
  }

  function wireCases() {
    const tabs = $("#case-tabs");
    const panel = $("#case");
    tabs.innerHTML = A.projects.map((p, i) => `
      <button role="tab" id="ct-${i}" aria-controls="case" data-i="${i}">
        <img src="${p.logo}" alt="" width="36" height="36"><span><b>${esc(p.name)}</b><small>${esc(p.sector)}</small></span>
      </button>`).join("");

    function show(i, focus) {
      const p = A.projects[i];
      const d = detail[p.slug];
      $$("button", tabs).forEach((b, n) => {
        b.setAttribute("aria-selected", String(n === i));
        b.tabIndex = n === i ? 0 : -1;
      });
      if (focus) $$("button", tabs)[i].focus();
      panel.setAttribute("aria-labelledby", `ct-${i}`);
      panel.style.setProperty("--c", p.color);
      panel.innerHTML = `
        <header class="case-head">
          <img src="${p.logo}" alt="" width="64" height="64">
          <div><p class="case-kicker">${esc(p.sector)} · ${esc(p.kicker)}</p><h3>${esc(p.name)}</h3></div>
        </header>
        <p class="case-brief">${esc(p.work)}</p>
        <div class="case-cols">
          <div>
            <h4>What it had to handle</h4>
            <ul class="ticks">${d.handled.map((h) => `<li>${esc(h)}</li>`).join("")}</ul>
            <h4>Used by</h4>
            <p>${esc(d.users)}</p>
          </div>
          <div>
            <h4>Delivered</h4>
            <ul class="chips">${p.shipped.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
            <blockquote class="result"><span>Result</span>${esc(p.outcome)}</blockquote>
          </div>
        </div>
        ${screen(p)}
        <div class="case-actions">
          <a class="btn" href="#contact" data-need="${needFor(p)}">Start a similar project</a>
          <a class="btn ghost" href="#work/${p.slug}" data-project="${p.slug}">Full case study</a>
        </div>`;
    }

    tabs.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (b) show(Number(b.dataset.i));
    });
    tabs.addEventListener("keydown", (e) => {
      const keys = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
      if (!(e.key in keys)) return;
      e.preventDefault();
      const cur = $$("button", tabs).indexOf(document.activeElement);
      show((cur + keys[e.key] + A.projects.length) % A.projects.length, true);
    });
    document.addEventListener("click", (e) => {
      const a = e.target.closest("[data-case]");
      if (a) show(A.projects.findIndex((p) => p.slug === a.dataset.case));
    });
    show(0);
  }

  function wireCapture() {
    $$("[data-capture]").forEach((form) =>
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!form.checkValidity()) return form.reportValidity();
        $("#contact-form input[name=email]").value = form.email.value.trim();
        $("#contact").scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
        setTimeout(() => $("#contact-form input[name=name]").focus({ preventScroll: true }), reduced ? 0 : 600);
      }),
    );
  }

  function wireRecord() {
    const list = $("#phase-list");
    const panel = $("#phase-panel");
    let current = 0;
    list.innerHTML = A.phases.map((ph, i) => `
      <li><button role="tab" id="ph-${i}" aria-controls="phase-panel" data-i="${i}">
        <span class="dot"></span><span><b>${esc(ph.title)}</b><small>${esc(ph.output)}</small></span>
      </button></li>`).join("");

    function show(i) {
      current = i;
      const ph = A.phases[i];
      $$("button", list).forEach((b, n) => {
        b.setAttribute("aria-selected", String(n === i));
        b.classList.toggle("done", n < i);
      });
      panel.setAttribute("aria-labelledby", `ph-${i}`);
      panel.innerHTML = `
        <p class="pp-top">Phase ${i + 1} of ${A.phases.length}</p>
        <h4>${esc(ph.title)}</h4>
        <p>${esc(ph.body)}</p>
        <div class="bubble"><span>You receive</span><b>${esc(ph.output)}</b></div>
        <div class="progress"><span style="width:${((i + 1) / A.phases.length) * 100}%"></span></div>
        <div class="pp-actions">
          <button class="btn ghost sm" data-step="-1" ${i === 0 ? "disabled" : ""}>Previous</button>
          <button class="btn sm" data-step="1" ${i === A.phases.length - 1 ? "disabled" : ""}>Next phase</button>
        </div>`;
    }
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
    wireCases();
    wireCapture();
    wireRecord();
    wireNeeds();
  });
})();
