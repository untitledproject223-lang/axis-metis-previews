(function () {
  const A = window.AXIS;
  const esc = (v) => String(v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const $ = (s) => document.querySelector(s);
  const pad = (n) => String(n).padStart(2, "0");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const practiceNeeds = ["Operational platform / CRM", "Commerce or customer portal", "Custom software"];

  $("#hero-title").textContent = A.hero.title;
  $("#hero-body").textContent = A.hero.body;
  $("#assurances").innerHTML = A.assurances
    .map((a) => `<li data-reveal><b>${esc(a.title)}</b><span>${esc(a.body)}</span></li>`)
    .join("");

  function presetNeed(need) {
    const select = document.querySelector("#contact select[name=need]");
    if (select) select.value = need;
  }

  function tabKeys(container, selector, activate) {
    container.addEventListener("keydown", (event) => {
      const tabs = Array.from(container.querySelectorAll(selector));
      const i = tabs.indexOf(document.activeElement);
      if (i < 0) return;
      let next = null;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (i + 1) % tabs.length;
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (i - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = tabs.length - 1;
      if (next === null) return;
      event.preventDefault();
      tabs[next].focus();
      activate(next);
    });
  }

  /* Studio player */
  const studio = {
    index: 0,
    playing: false,
    words: [],
    timer: null,
    clock: null,
    started: 0,
    elapsed: 0,
    synth: "speechSynthesis" in window ? window.speechSynthesis : null,
    voice: null,
  };

  const chipsEl = $("#sector-chips");
  const scriptEl = $("#script");
  const waveEl = $("#hero-wave");
  const playBtn = $("#play");
  const progressEl = $("#progress");
  const timeEl = $("#time");
  const noteEl = $("#studio-note");

  const BAR_COUNT = 56;
  waveEl.innerHTML = Array.from({ length: BAR_COUNT }, () => "<i></i>").join("");
  const bars = Array.from(waveEl.children);
  const rest = bars.map((_, i) => 0.18 + 0.5 * Math.abs(Math.sin(i * 0.42)) * Math.abs(Math.cos(i * 0.13)));
  function drawRest() {
    bars.forEach((b, i) => (b.style.transform = `scaleY(${rest[i]})`));
  }

  let level = bars.map(() => 0.2);
  let raf = null;
  function animate() {
    level = level.map((v, i) => {
      const target = 0.15 + Math.random() * (0.55 + 0.3 * Math.sin(Date.now() / 260 + i / 3));
      return v + (target - v) * 0.35;
    });
    bars.forEach((b, i) => (b.style.transform = `scaleY(${Math.max(0.08, Math.min(1, level[i]))})`));
    raf = requestAnimationFrame(animate);
  }

  function scriptFor(p) {
    return `${p.name}. ${p.work} ${p.outcome}`;
  }

  function renderScript() {
    const text = scriptFor(A.projects[studio.index]);
    studio.words = [];
    let html = "";
    const re = /\S+/g;
    let m;
    while ((m = re.exec(text))) {
      studio.words.push({ start: m.index, end: m.index + m[0].length });
      html += `<span data-w="${studio.words.length - 1}">${esc(m[0])}</span> `;
    }
    scriptEl.innerHTML = html;
    scriptEl.dataset.length = text.length;
  }

  function highlight(wordIndex) {
    scriptEl.querySelectorAll("span").forEach((s, i) => {
      s.classList.toggle("said", i < wordIndex);
      s.classList.toggle("now", i === wordIndex);
    });
    const total = studio.words.length || 1;
    progressEl.style.width = `${Math.min(100, ((wordIndex + 1) / total) * 100)}%`;
  }

  function fmt(ms) {
    const s = Math.floor(ms / 1000);
    return `${Math.floor(s / 60)}:${pad(s % 60)}`;
  }

  function setPlaying(on) {
    studio.playing = on;
    playBtn.classList.toggle("on", on);
    playBtn.setAttribute("aria-label", on ? "Pause brief" : "Play brief");
    document.querySelector(".studio").classList.toggle("live", on);
    if (on) {
      studio.started = Date.now() - studio.elapsed;
      studio.clock = setInterval(() => {
        studio.elapsed = Date.now() - studio.started;
        timeEl.textContent = fmt(studio.elapsed);
      }, 250);
      if (!reduced) {
        cancelAnimationFrame(raf);
        animate();
      }
    } else {
      clearInterval(studio.clock);
      cancelAnimationFrame(raf);
      drawRest();
    }
  }

  function stop(reset) {
    if (studio.synth) studio.synth.cancel();
    clearInterval(studio.timer);
    setPlaying(false);
    if (reset) {
      studio.elapsed = 0;
      timeEl.textContent = "0:00";
      progressEl.style.width = "0%";
      highlight(-1);
    }
  }

  function wordAt(charIndex) {
    for (let i = studio.words.length - 1; i >= 0; i--) if (studio.words[i].start <= charIndex) return i;
    return 0;
  }

  function pickVoice() {
    if (!studio.synth) return;
    const voices = studio.synth.getVoices();
    studio.voice =
      voices.find((v) => /en-ZA/i.test(v.lang)) ||
      voices.find((v) => /en-GB/i.test(v.lang)) ||
      voices.find((v) => /^en/i.test(v.lang)) ||
      null;
    $("#voice-label").textContent = studio.voice ? studio.voice.name.replace(/^Microsoft\s+/, "").split(" - ")[0] : "Browser voice";
  }

  function playSimulated(from) {
    let i = from;
    const step = 60000 / 175;
    highlight(i);
    studio.timer = setInterval(() => {
      i += 1;
      if (i >= studio.words.length) {
        stop(false);
        progressEl.style.width = "100%";
        highlight(studio.words.length);
        return;
      }
      highlight(i);
    }, step);
  }

  function play() {
    const text = scriptFor(A.projects[studio.index]);
    setPlaying(true);
    if (!studio.synth) {
      noteEl.textContent = "This browser has no speech engine, so the brief plays as text.";
      playSimulated(0);
      return;
    }
    studio.synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    if (studio.voice) u.voice = studio.voice;
    u.rate = 1;
    u.pitch = 1;
    let heard = false;
    u.onboundary = (e) => {
      heard = true;
      highlight(wordAt(e.charIndex));
    };
    u.onend = () => {
      if (!studio.playing) return;
      stop(false);
      progressEl.style.width = "100%";
      highlight(studio.words.length);
    };
    u.onerror = () => {
      if (!studio.playing) return;
      noteEl.textContent = "Speech is blocked here, so the brief plays as text.";
      studio.synth.cancel();
      playSimulated(0);
    };
    studio.synth.speak(u);
    setTimeout(() => {
      if (studio.playing && !heard && !studio.synth.speaking) {
        noteEl.textContent = "Speech is unavailable here, so the brief plays as text.";
        playSimulated(0);
      }
    }, 1200);
  }

  playBtn.addEventListener("click", () => {
    if (studio.playing) stop(false);
    else {
      stop(true);
      noteEl.textContent = "";
      play();
    }
  });

  function selectSector(i) {
    stop(true);
    studio.index = i;
    chipsEl.querySelectorAll("button").forEach((b, n) => {
      b.setAttribute("aria-selected", String(n === i));
      b.tabIndex = n === i ? 0 : -1;
    });
    renderScript();
  }

  chipsEl.innerHTML = A.projects
    .map((p, i) => `<button role="tab" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${esc(p.sector)}</button>`)
    .join("");
  chipsEl.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (b) selectSector(Array.from(chipsEl.children).indexOf(b));
  });
  tabKeys(chipsEl, "button", selectSector);

  renderScript();
  drawRest();
  if (studio.synth) {
    pickVoice();
    studio.synth.addEventListener?.("voiceschanged", pickVoice);
    window.addEventListener("pagehide", () => studio.synth.cancel());
  }

  /* Services */
  const tabsEl = $("#practice-tabs");
  const panelEl = $("#practice-panel");
  function selectPractice(i) {
    tabsEl.querySelectorAll("button").forEach((b, n) => {
      b.setAttribute("aria-selected", String(n === i));
      b.tabIndex = n === i ? 0 : -1;
    });
    const p = A.practices[i];
    panelEl.innerHTML = `
      <div class="panel-copy">
        <span class="num">${pad(i + 1)}</span>
        <h3>${esc(p.title)}</h3>
        <p>${esc(p.body)}</p>
        <a class="btn btn-light" href="#contact" data-need="${esc(practiceNeeds[i])}">Ask about this</a>
      </div>
      <ul class="panel-points">${p.points.map((pt) => `<li>${esc(pt)}</li>`).join("")}</ul>`;
    panelEl.classList.remove("swap");
    void panelEl.offsetWidth;
    panelEl.classList.add("swap");
  }
  tabsEl.innerHTML = A.practices
    .map((p, i) => `<button role="tab" aria-controls="practice-panel" aria-selected="false" tabindex="-1"><span>${pad(i + 1)}</span>${esc(p.title)}</button>`)
    .join("");
  tabsEl.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (b) selectPractice(Array.from(tabsEl.children).indexOf(b));
  });
  tabKeys(tabsEl, "button", selectPractice);
  selectPractice(0);

  document.addEventListener("click", (e) => {
    const link = e.target.closest("a[data-need]");
    if (link && !link.hasAttribute("data-close")) presetNeed(link.getAttribute("data-need"));
  });

  /* Process */
  const timeline = $("#timeline");
  const phasePanel = $("#phase-panel");
  const phasePlay = $("#phase-play");
  let phase = 0;
  let phaseTimer = null;
  const PHASE_MS = 4200;

  timeline.innerHTML = A.phases
    .map((p, i) => {
      const segBars = Array.from({ length: 14 }, (_, k) => {
        const h = 0.25 + 0.75 * Math.abs(Math.sin((i + 1) * 1.7 + k * 0.55));
        return `<i style="--h:${h.toFixed(2)}"></i>`;
      }).join("");
      return `<button role="tab" aria-selected="false" tabindex="-1" style="--i:${i}">
        <span class="seg-bars">${segBars}</span>
        <span class="seg-label"><b>${pad(i + 1)}</b> ${esc(p.title)}</span>
        <span class="seg-fill" aria-hidden="true"></span>
      </button>`;
    })
    .join("");

  function selectPhase(i) {
    phase = (i + A.phases.length) % A.phases.length;
    timeline.querySelectorAll("button").forEach((b, n) => {
      b.setAttribute("aria-selected", String(n === phase));
      b.tabIndex = n === phase ? 0 : -1;
      b.classList.toggle("done", n < phase);
    });
    const p = A.phases[phase];
    phasePanel.innerHTML = `
      <span class="num">${pad(phase + 1)} / ${pad(A.phases.length)}</span>
      <h3>${esc(p.title)}</h3>
      <p>${esc(p.body)}</p>
      <p class="output"><span>Output</span>${esc(p.output)}</p>`;
  }

  function stopPhases() {
    clearInterval(phaseTimer);
    phaseTimer = null;
    timeline.classList.remove("running");
    phasePlay.textContent = "Play the process";
  }

  function runPhases() {
    if (phaseTimer) return stopPhases();
    if (phase === A.phases.length - 1) selectPhase(0);
    timeline.classList.add("running");
    timeline.style.setProperty("--phase-ms", `${PHASE_MS}ms`);
    phasePlay.textContent = "Pause";
    const restart = () => {
      const active = timeline.querySelector("[aria-selected=true] .seg-fill");
      if (!active) return;
      active.style.animation = "none";
      void active.offsetWidth;
      active.style.animation = "";
    };
    restart();
    phaseTimer = setInterval(() => {
      if (phase >= A.phases.length - 1) {
        stopPhases();
        return;
      }
      selectPhase(phase + 1);
      restart();
    }, PHASE_MS);
  }

  timeline.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    stopPhases();
    selectPhase(Array.from(timeline.children).indexOf(b));
  });
  tabKeys(timeline, "button", (i) => {
    stopPhases();
    selectPhase(i);
  });
  $("#phase-prev").addEventListener("click", () => {
    stopPhases();
    selectPhase(phase - 1);
  });
  $("#phase-next").addEventListener("click", () => {
    stopPhases();
    selectPhase(phase + 1);
  });
  phasePlay.addEventListener("click", runPhases);
  selectPhase(0);

  /* Work */
  const filtersEl = $("#filters");
  const grid = $("#work-grid");
  const empty = $("#work-empty");
  const filterNames = ["All", ...A.sectors];
  filtersEl.innerHTML = filterNames
    .map((name) => {
      const count = name === "All" ? A.projects.length : A.projects.filter((p) => p.sector === name).length;
      return `<button aria-pressed="${name === "All"}" data-filter="${esc(name)}">${esc(name)} <span>${count}</span></button>`;
    })
    .join("");

  grid.innerHTML = A.projects
    .map(
      (p) => `<button class="card" data-project="${p.slug}" data-sector="${esc(p.sector)}" style="--accent:${p.color}" data-reveal>
        <span class="card-top"><img src="${p.logo}" alt="" width="44" height="44"><span class="tag">${esc(p.sector)}</span></span>
        <span class="card-name">${esc(p.name)}</span>
        <span class="card-sum">${esc(p.summary)}</span>
        <span class="card-ship">${p.shipped.map((s) => `<em>${esc(s)}</em>`).join("")}</span>
        <span class="card-open">Open case study</span>
      </button>`,
    )
    .join("");

  filtersEl.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    const f = b.dataset.filter;
    filtersEl.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    let shown = 0;
    grid.querySelectorAll(".card").forEach((card) => {
      const on = f === "All" || card.dataset.sector === f;
      card.hidden = !on;
      if (on) shown += 1;
    });
    empty.hidden = shown > 0;
  });

  /* Standards */
  const acc = $("#standards-list");
  acc.innerHTML = A.standards
    .map(
      (s, i) => `<div class="acc-item">
        <h3><button aria-expanded="${i === 0}" aria-controls="std-${i}" id="std-btn-${i}"><span class="num">${pad(i + 1)}</span>${esc(s.title)}<span class="plus" aria-hidden="true"></span></button></h3>
        <div class="acc-body" id="std-${i}" role="region" aria-labelledby="std-btn-${i}" ${i === 0 ? "" : "hidden"}><p>${esc(s.body)}</p></div>
      </div>`,
    )
    .join("");
  acc.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    const open = b.getAttribute("aria-expanded") === "true";
    b.setAttribute("aria-expanded", String(!open));
    document.getElementById(b.getAttribute("aria-controls")).hidden = open;
  });

  /* Stack */
  $("#stack").innerHTML = A.technology
    .map((t) => `<div class="stack-row"><span>${esc(t.label)}</span><ul>${t.items.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>`)
    .join("");
  const all = A.technology.flatMap((t) => t.items);
  $("#marquee").innerHTML = [...all, ...all].map((x) => `<span>${esc(x)}</span>`).join("");

  /* Fit */
  const fitList = $("#fit-list");
  function renderFit(kind) {
    document.querySelectorAll(".seg button").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.fit === kind)));
    fitList.dataset.kind = kind;
    fitList.innerHTML = A.fit[kind]
      .map((f) => `<article><span class="mark" aria-hidden="true">${kind === "yes" ? "+" : "−"}</span><h3>${esc(f.title)}</h3><p>${esc(f.body)}</p></article>`)
      .join("");
  }
  document.querySelector(".seg").addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (b) renderFit(b.dataset.fit);
  });
  renderFit("yes");
})();
