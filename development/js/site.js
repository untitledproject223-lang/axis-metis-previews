(function () {
  const A = window.AXIS;
  const esc = (v) => String(v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const $ = (s) => document.querySelector(s);
  const pad = (n) => String(n).padStart(2, "0");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const practiceNeeds = ["Operational platform / CRM", "Commerce or customer portal", "Custom software"];
  const needFor = (p) => (p.sector === "Hospitality" ? "Commerce or customer portal" : "Operational platform / CRM");

  $("#hero-title").textContent = A.hero.title;
  $("#hero-body").textContent = A.hero.body;
  $("#assurances").innerHTML = A.assurances.map((a) => `<li><b>${esc(a.title)}</b><span>${esc(a.body)}</span></li>`).join("");

  document.addEventListener("click", (e) => {
    const link = e.target.closest("a[data-need]");
    if (!link || link.hasAttribute("data-close")) return;
    const select = document.querySelector("#contact select[name=need]");
    if (select) select.value = link.getAttribute("data-need");
  });

  /* Video */
  const video = $("#stage-video");
  const videoToggle = $("#video-toggle");
  function setVideo(play) {
    if (play) video.play().catch(() => {});
    else video.pause();
    videoToggle.setAttribute("aria-pressed", String(!play));
    videoToggle.textContent = play ? "Pause video" : "Play video";
  }
  if (reduced) setVideo(false);
  videoToggle.addEventListener("click", () => setVideo(video.paused));

  /* Featured carousel */
  const FEAT_MS = 7000;
  const featMain = $("#feat-main");
  const featList = $("#feat-list");
  let feat = 0;
  let featTimer = null;
  let featHold = false;

  featList.innerHTML = A.projects
    .map(
      (p, i) => `<li><button data-i="${i}" style="--accent:${p.color}">
        <img src="${p.logo}" alt="" width="48" height="48">
        <span><b>${esc(p.name)}</b><em>${esc(p.sector)}</em></span>
        <i class="fill" aria-hidden="true"></i>
      </button></li>`,
    )
    .join("");

  function renderFeat() {
    const p = A.projects[feat];
    featMain.style.setProperty("--accent", p.color);
    featMain.innerHTML = `
      <div class="feat-art" aria-hidden="true"><img src="${p.logo}" alt=""><span>${esc(p.sector)}</span></div>
      <div class="feat-copy">
        <p class="kicker">${esc(p.kicker)} · ${pad(feat + 1)} of ${pad(A.projects.length)}</p>
        <h3>${esc(p.name)}</h3>
        <p>${esc(p.work)}</p>
        <ul class="tags">${p.shipped.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
        <div class="actions">
          <a class="btn btn-light" href="#work/${p.slug}" data-project="${p.slug}">View case study</a>
          <a class="btn btn-dark" href="#contact" data-need="${needFor(p)}">Start a similar project</a>
        </div>
      </div>`;
    featMain.classList.remove("swap");
    void featMain.offsetWidth;
    featMain.classList.add("swap");
    featList.querySelectorAll("button").forEach((b, i) => {
      if (i === feat) b.setAttribute("aria-current", "true");
      else b.removeAttribute("aria-current");
      const fill = b.querySelector(".fill");
      fill.style.animation = "none";
      void fill.offsetWidth;
      fill.style.animation = "";
    });
  }

  function goFeat(i) {
    feat = (i + A.projects.length) % A.projects.length;
    renderFeat();
    restartFeat();
  }

  function restartFeat() {
    clearInterval(featTimer);
    if (reduced || featHold) return;
    featTimer = setInterval(() => goFeat(feat + 1), FEAT_MS);
  }

  function holdFeat(on) {
    featHold = on;
    $("#featured").classList.toggle("held", on);
    if (on) clearInterval(featTimer);
    else restartFeat();
  }

  featList.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (b) goFeat(Number(b.dataset.i));
  });
  $("#feat-prev").addEventListener("click", () => goFeat(feat - 1));
  $("#feat-next").addEventListener("click", () => goFeat(feat + 1));
  const featured = $("#featured");
  featured.style.setProperty("--feat-ms", `${FEAT_MS}ms`);
  featured.addEventListener("mouseenter", () => holdFeat(true));
  featured.addEventListener("mouseleave", () => holdFeat(false));
  featured.addEventListener("focusin", () => holdFeat(true));
  featured.addEventListener("focusout", (e) => {
    if (!featured.contains(e.relatedTarget)) holdFeat(false);
  });
  featured.addEventListener("keydown", (e) => {
    if (e.target.closest("input, textarea, select")) return;
    if (e.key === "ArrowRight") goFeat(feat + 1);
    if (e.key === "ArrowLeft") goFeat(feat - 1);
  });
  let touchX = null;
  featMain.addEventListener("touchstart", (e) => (touchX = e.touches[0].clientX), { passive: true });
  featMain.addEventListener("touchend", (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 40) goFeat(feat + (dx < 0 ? 1 : -1));
    touchX = null;
  });
  document.addEventListener("visibilitychange", () => (document.hidden ? clearInterval(featTimer) : restartFeat()));
  renderFeat();
  restartFeat();

  /* Services covers */
  $("#covers").innerHTML = A.practices
    .map(
      (p, i) => `<article class="cover cover-${i + 1}" tabindex="0">
        <div class="cover-art" aria-hidden="true"><span>${pad(i + 1)}</span></div>
        <div class="cover-body">
          <h3>${esc(p.title)}</h3>
          <div class="cover-more">
            <p>${esc(p.body)}</p>
            <ul>${p.points.map((pt) => `<li>${esc(pt)}</li>`).join("")}</ul>
            <a class="btn btn-light" href="#contact" data-need="${esc(practiceNeeds[i])}">Ask about this</a>
          </div>
        </div>
      </article>`,
    )
    .join("");

  /* Library */
  const grid = $("#lib-grid");
  const search = $("#lib-search");
  const sort = $("#lib-sort");
  const genres = $("#genres");
  const count = $("#lib-count");
  const empty = $("#lib-empty");
  let genre = "All";

  genres.innerHTML = ["All", ...A.sectors]
    .map((g) => `<button aria-pressed="${g === "All"}" data-g="${esc(g)}">${esc(g)}</button>`)
    .join("");

  const order = A.projects.map((p) => p.slug);

  function haystack(p) {
    return [p.name, p.sector, p.summary, p.work, p.kicker, ...p.shipped].join(" ").toLowerCase();
  }

  function renderLibrary() {
    const q = search.value.trim().toLowerCase();
    let list = A.projects.filter((p) => (genre === "All" || p.sector === genre) && (!q || haystack(p).includes(q)));
    if (sort.value === "az") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    else if (sort.value === "sector") list = [...list].sort((a, b) => a.sector.localeCompare(b.sector));
    else list = [...list].sort((a, b) => order.indexOf(a.slug) - order.indexOf(b.slug));

    grid.innerHTML = list
      .map(
        (p) => `<button class="tile" data-project="${p.slug}" style="--accent:${p.color}">
          <span class="tile-art"><img src="${p.logo}" alt="" width="72" height="72"></span>
          <span class="tile-sector">${esc(p.sector)}</span>
          <span class="tile-name">${esc(p.name)}</span>
          <span class="tile-sum">${esc(p.summary)}</span>
          <span class="tile-foot">${esc(p.kicker)}</span>
        </button>`,
      )
      .join("");
    count.textContent = `${list.length} of ${A.projects.length} projects`;
    empty.hidden = list.length > 0;
  }

  let debounce = null;
  search.addEventListener("input", () => {
    clearTimeout(debounce);
    debounce = setTimeout(renderLibrary, 120);
  });
  sort.addEventListener("change", renderLibrary);
  genres.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    genre = b.dataset.g;
    genres.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    renderLibrary();
  });
  $("#lib-reset").addEventListener("click", () => {
    search.value = "";
    sort.value = "featured";
    genre = "All";
    genres.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", String(x.dataset.g === "All")));
    renderLibrary();
    search.focus();
  });
  renderLibrary();

  /* Process chapters */
  const track = $("#chapters");
  track.innerHTML = A.phases
    .map(
      (p, i) => `<article class="chapter" style="--n:${i}">
        <span class="chapter-num">${pad(i + 1)}</span>
        <h3>${esc(p.title)}</h3>
        <p>${esc(p.body)}</p>
        <p class="chapter-out"><span>Output</span>${esc(p.output)}</p>
      </article>`,
    )
    .join("");
  const chapters = Array.from(track.children);
  const chapterCount = $("#chapter-count");
  const chapterBar = $("#chapter-bar");

  function currentChapter() {
    const left = track.scrollLeft + track.clientWidth * 0.2;
    let best = 0;
    chapters.forEach((c, i) => {
      if (c.offsetLeft - track.offsetLeft <= left) best = i;
    });
    if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 4) best = chapters.length - 1;
    return best;
  }

  function goChapter(i) {
    const target = chapters[Math.max(0, Math.min(chapters.length - 1, i))];
    track.scrollTo({ left: target.offsetLeft - track.offsetLeft - parseFloat(getComputedStyle(track).paddingLeft), behavior: reduced ? "auto" : "smooth" });
  }

  function syncChapters() {
    const i = currentChapter();
    chapterCount.textContent = `${pad(i + 1)} / ${pad(chapters.length)}`;
    const max = track.scrollWidth - track.clientWidth;
    chapterBar.style.width = `${max > 0 ? Math.max(8, (track.scrollLeft / max) * 100) : 100}%`;
    chapters.forEach((c, n) => c.classList.toggle("on", n === i));
  }

  $("#ch-prev").addEventListener("click", () => goChapter(currentChapter() - 1));
  $("#ch-next").addEventListener("click", () => goChapter(currentChapter() + 1));
  track.addEventListener("scroll", () => requestAnimationFrame(syncChapters), { passive: true });
  track.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goChapter(currentChapter() + 1);
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      goChapter(currentChapter() - 1);
    }
  });
  window.addEventListener("resize", syncChapters);
  syncChapters();

  /* Standards, fit, specs */
  $("#standards-list").innerHTML = A.standards
    .map((s, i) => `<article data-reveal><span>${pad(i + 1)}</span><h3>${esc(s.title)}</h3><p>${esc(s.body)}</p></article>`)
    .join("");
  $("#fit-yes").innerHTML = A.fit.yes.map((f) => `<li><b>${esc(f.title)}</b><span>${esc(f.body)}</span></li>`).join("");
  $("#fit-no").innerHTML = A.fit.no.map((f) => `<li><b>${esc(f.title)}</b><span>${esc(f.body)}</span></li>`).join("");
  $("#specs").innerHTML = A.technology
    .map((t) => `<div><dt>${esc(t.label)}</dt><dd>${t.items.map(esc).join(" · ")}</dd></div>`)
    .join("");
})();
