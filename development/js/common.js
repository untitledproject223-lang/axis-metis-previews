(function () {
  const A = window.AXIS;

  function esc(value) {
    return String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  }

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  let lastFocus = null;

  function openDialog(html, label) {
    const dialog = $("#dialog");
    $("#dialog-body").innerHTML = html;
    dialog.setAttribute("aria-label", label);
    lastFocus = document.activeElement;
    dialog.showModal();
    document.body.classList.add("locked");
  }

  function closeDialog() {
    const dialog = $("#dialog");
    if (dialog.open) dialog.close();
  }

  function projectHtml(project) {
    const groups = project.groups
      .map(
        (group) => `<h4>${esc(group.label)}</h4><ul class="d-groups">${group.items
          .map((item) => `<li><b>${esc(item.title)}</b>${item.body ? `<span>${esc(item.body)}</span>` : ""}</li>`)
          .join("")}</ul>`,
      )
      .join("");
    return `
      <div class="d-head" style="--accent:${project.color}">
        <img src="${project.logo}" alt="" width="56" height="56">
        <div><p class="d-kicker">${esc(project.sector)} · ${esc(project.kicker)}</p><h3>${esc(project.name)}</h3></div>
      </div>
      <p class="d-lead">${esc(project.work)}</p>
      <div class="d-outcome"><span>Outcome</span><p>${esc(project.outcome)}</p></div>
      ${groups}
      <h4>Shipped</h4>
      <ul class="d-chips">${project.shipped.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
      <a class="d-cta" href="#contact" data-close data-need="${project.sector === "Hospitality" ? "Commerce or customer portal" : "Operational platform / CRM"}">Start a similar project</a>`;
  }

  function openProject(slug) {
    const project = A.projects.find((p) => p.slug === slug);
    if (!project) return;
    openDialog(projectHtml(project), project.name);
    history.replaceState(null, "", `#work/${slug}`);
  }

  function openLegal(kind) {
    const items = kind === "privacy" ? A.privacy : A.terms;
    const title = kind === "privacy" ? "Privacy" : "Terms";
    openDialog(
      `<h3>${title}</h3>${items.map((i) => `<h4>${esc(i.title)}</h4><p>${esc(i.body)}</p>`).join("")}`,
      title,
    );
  }

  function wireDialog() {
    const dialog = $("#dialog");
    dialog.addEventListener("close", () => {
      document.body.classList.remove("locked");
      if (location.hash.startsWith("#work/")) history.replaceState(null, "", "#work");
      if (lastFocus) lastFocus.focus();
    });
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) closeDialog();
      const close = event.target.closest("[data-close]");
      if (!close) return;
      closeDialog();
      const need = close.getAttribute("data-need");
      if (need) {
        const select = $("#contact select[name=need]");
        if (select) select.value = need;
      }
    });
    document.addEventListener("click", (event) => {
      const project = event.target.closest("[data-project]");
      if (project) {
        event.preventDefault();
        openProject(project.getAttribute("data-project"));
      }
      const legal = event.target.closest("[data-legal]");
      if (legal) {
        event.preventDefault();
        openLegal(legal.getAttribute("data-legal"));
      }
    });
    const deep = location.hash.match(/^#work\/(.+)$/);
    if (deep) openProject(deep[1]);
  }

  function wireNav() {
    const toggle = $("#menu-toggle");
    const menu = $("#menu");
    if (toggle && menu) {
      toggle.addEventListener("click", () => {
        const open = toggle.getAttribute("aria-expanded") === "true";
        toggle.setAttribute("aria-expanded", String(!open));
        menu.classList.toggle("open", !open);
      });
      menu.addEventListener("click", (event) => {
        if (event.target.closest("a")) {
          toggle.setAttribute("aria-expanded", "false");
          menu.classList.remove("open");
        }
      });
    }

    const header = $("#top");
    const onScroll = () => header && header.classList.toggle("scrolled", window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const links = $$("#menu a[href^='#']");
    const sections = links.map((a) => $(a.getAttribute("href"))).filter(Boolean);
    if (!("IntersectionObserver" in window) || !sections.length) return;
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${entry.target.id}`));
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => spy.observe(s));
  }

  function wireReveal() {
    const items = $$("[data-reveal]");
    if (!("IntersectionObserver" in window)) {
      items.forEach((i) => i.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      }),
      { threshold: 0.12 },
    );
    items.forEach((i) => io.observe(i));
  }

  function renderNeeds() {
    const select = $("#contact select[name=need]");
    if (select) select.innerHTML = A.needs.map((n) => `<option>${esc(n)}</option>`).join("");
  }

  function wireForm() {
    const form = $("#contact-form");
    if (!form) return;
    const status = $("#form-status");
    const button = form.querySelector("button[type=submit]");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      if (form.website && form.website.value) return;

      const data = new FormData(form);
      const name = String(data.get("name") || "").trim();
      const email = String(data.get("email") || "").trim();
      const companyName = String(data.get("company") || "").trim();
      const need = String(data.get("need") || "").trim();
      const message = String(data.get("message") || "").trim();
      const subject = `${A.company.legalName} — ${companyName || name || "new project"}`;
      const body = [`Name: ${name}`, `Email: ${email}`, `Company: ${companyName}`, `Need: ${need}`, "", message].join("\n");

      button.disabled = true;
      button.dataset.label = button.dataset.label || button.textContent;
      button.textContent = "Sending";
      status.className = "form-status";
      status.textContent = "";

      try {
        if (!window.emailjs) throw new Error("EmailJS did not load");
        await window.emailjs.send(
          A.emailjs.serviceId,
          A.emailjs.templateId,
          { to_name: A.emailjs.adminName, subject, message: body, reply_to: email },
          { publicKey: A.emailjs.publicKey },
        );
        form.reset();
        renderNeeds();
        status.classList.add("ok");
        status.textContent = "Sent. We reply within two business days.";
      } catch {
        status.classList.add("err");
        status.innerHTML = `The enquiry did not send. Email <a href="mailto:${A.company.email}">${A.company.email}</a> directly.`;
      } finally {
        button.disabled = false;
        button.textContent = button.dataset.label;
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    $$("[data-year]").forEach((n) => (n.textContent = new Date().getFullYear()));
    renderNeeds();
    wireDialog();
    wireNav();
    wireForm();
    requestAnimationFrame(wireReveal);
  });

  window.AX = { esc, $, $$, openProject, openDialog, closeDialog };
})();
