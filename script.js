const linksBtn = document.getElementById("links-btn");
const projectsBtn = document.getElementById("projects-btn");
const contactBtn = document.getElementById("contact-btn");

const tagList = document.getElementById("tag-list");
const icons = document.getElementById("icons");
const projectsContainer = document.getElementById("projects-container");
const contactContainer = document.getElementById("contact-container");

const displayName = document.getElementById("display-name");
const timeEl = document.getElementById("my-time");
const statusText = document.getElementById("status-text");
const headerActions = document.querySelector(".header-actions");

const ORIGINAL_NAME = displayName ? displayName.textContent : "crisjonks";

let clickSound = document.getElementById("click-sound");

if (!clickSound) {
  clickSound = document.createElement("audio");
  clickSound.id = "click-sound";
  clickSound.src = "/pop.mp3";
  clickSound.preload = "auto";
  document.body.appendChild(clickSound);
}

function playClickSound() {
  if (!clickSound) return;
  try {
    clickSound.currentTime = 0;
  } catch (_) {}
  clickSound.play().catch(() => {});
}

document.addEventListener(
  "pointerdown",
  (e) => {
    if (e.target.closest("button, a")) {
      playClickSound();
    }
  },
  true
);

const projects = [
  {
    name: "code-editor",
    desc: "free-to-use code editor for any code in your browser",
    url: "https://crisjonks.github.io/code-editor",
  },
  {
    name: "chihuahua-spin",
    desc: "a spinning chihuahua (https)",
    url: "https://crisjonks.github.io/chihuahua-spin",
  },
];

if (projectsContainer) {
  projectsContainer.innerHTML = projects
    .map(
      (p) => `
      <div class="project">
        <a href="${p.url}" class="project-name" target="_blank" rel="noopener noreferrer">${p.name}</a>
        <span class="project-desc">${p.desc}</span>
      </div>
    `
    )
    .join("");
}

let ensuredContactBtn = contactBtn;
if (!ensuredContactBtn && headerActions) {
  ensuredContactBtn = document.createElement("button");
  ensuredContactBtn.id = "contact-btn";
  ensuredContactBtn.className = "contact-btn";
  ensuredContactBtn.type = "button";
  ensuredContactBtn.setAttribute("aria-label", "contact");
  ensuredContactBtn.textContent = "Contact";
  headerActions.appendChild(ensuredContactBtn);
}

let ensuredContactContainer = contactContainer;
if (!ensuredContactContainer && projectsContainer) {
  ensuredContactContainer = document.createElement("section");
  ensuredContactContainer.id = "contact-container";
  ensuredContactContainer.className = "contact hidden";
  ensuredContactContainer.setAttribute("aria-label", "Contact section");
  ensuredContactContainer.innerHTML = `
    <div class="project">
      <span class="project-name">contact</span>
      <span class="project-desc">coming soon</span>
    </div>
  `;
  projectsContainer.insertAdjacentElement("afterend", ensuredContactContainer);
}

function setHidden(el, hidden) {
  if (!el) return;
  el.classList.toggle("hidden", hidden);
}

function setActive(btn) {
  [linksBtn, projectsBtn, ensuredContactBtn].forEach((b) => b && b.classList.remove("active"));
  if (btn) btn.classList.add("active");
}

function showLinks() {
  if (tagList) tagList.style.display = "flex";
  if (icons) icons.style.display = "flex";
  setHidden(projectsContainer, true);
  setHidden(ensuredContactContainer, true);
  if (displayName) displayName.textContent = ORIGINAL_NAME;
  setActive(linksBtn);
}

function showProjects() {
  if (tagList) tagList.style.display = "none";
  if (icons) icons.style.display = "none";
  setHidden(projectsContainer, false);
  setHidden(ensuredContactContainer, true);
  if (displayName) displayName.textContent = "projects";
  setActive(projectsBtn);
}

function showContact() {
  if (tagList) tagList.style.display = "none";
  if (icons) icons.style.display = "none";
  setHidden(projectsContainer, true);
  setHidden(ensuredContactContainer, false);
  if (displayName) displayName.textContent = "contact";
  setActive(ensuredContactBtn);
}

if (linksBtn) linksBtn.addEventListener("click", showLinks);
if (projectsBtn) projectsBtn.addEventListener("click", showProjects);
if (ensuredContactBtn) ensuredContactBtn.addEventListener("click", showContact);

showLinks();

if (icons && displayName) {
  icons.addEventListener("pointerover", (e) => {
    const btn = e.target.closest(".social-link");
    if (!btn) return;
    displayName.textContent = btn.dataset.username || ORIGINAL_NAME;
    displayName.classList.add("pop");
  });

  icons.addEventListener("pointerout", () => {
    displayName.textContent = ORIGINAL_NAME;
    displayName.classList.remove("pop");
  });

  icons.addEventListener("click", (e) => {
    const btn = e.target.closest(".social-link");
    if (!btn) return;
    const url = btn.dataset.url;
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  });
}

const torontoFmt = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Toronto",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

const torontoOffsetFmt = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Toronto",
  timeZoneName: "shortOffset",
});

const toronto24Fmt = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Toronto",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

function getTorontoOffset() {
  const parts = torontoOffsetFmt.formatToParts(new Date());
  const tz = parts.find((p) => p.type === "timeZoneName");
  return tz ? tz.value.replace("GMT", "UTC") : "UTC-5";
}

function isProbablyAwake() {
  const parts = toronto24Fmt.formatToParts(new Date());
  const hour = Number(parts.find((p) => p.type === "hour")?.value || "0");
  const minute = Number(parts.find((p) => p.type === "minute")?.value || "0");

  return (
    (hour > 6 || (hour === 6 && minute >= 0)) &&
    (hour < 22 || (hour === 22 && minute < 30))
  );
}

function updateTime() {
  if (!timeEl) return;

  const parts = torontoFmt.formatToParts(new Date());
  const h = parts.find((p) => p.type === "hour")?.value || "--";
  const m = parts.find((p) => p.type === "minute")?.value || "--";
  const ampm = (parts.find((p) => p.type === "dayPeriod")?.value || "AM").toUpperCase();

  const base = `my time is ${h}:${m} ${ampm}, ${getTorontoOffset()}`;
  timeEl.textContent = base;

  const tip = isProbablyAwake() ? "i'm probably awake" : "i'm probably asleep";
  timeEl.title = tip;
  timeEl.dataset.tooltip = tip;
}

updateTime();
setInterval(updateTime, 60000);

if (statusText) {
  const SPLASH_TEXTS = [
    "coding things nobody asked for since forever",
    "probably breaking something right now",
    "powered by caffeine and stubbornness",
    "shipping bugs as features since day one",
    "yes, i wrote this myself",
    "99 little bugs in the code",
    "roblox dev by night, everything else by day",
    "click the avatar. i dare you.",
    "try the konami code",
    "still not done with this site",
    "commit messages: 'fix', 'fix fix', 'please work'",
    "professionally overengineering hobby projects",
    "made with luau, love, and mild frustration",
    "works on my machine",
    "type 'matrix' somewhere on this page",
  ];

  const STATUS_TEXT =
    SPLASH_TEXTS[Math.floor(Math.random() * SPLASH_TEXTS.length)];
  const TYPE_SPEED = 55;
  let charIndex = 0;

  function typeStatus() {
    charIndex++;
    statusText.textContent = STATUS_TEXT.slice(0, charIndex);
    if (charIndex < STATUS_TEXT.length) {
      setTimeout(typeStatus, TYPE_SPEED);
    }
  }

  setTimeout(typeStatus, 900);
}

(function () {
  const avatarEl = document.querySelector(".avatar");
  if (!avatarEl) return;

  avatarEl.style.cursor = "pointer";

  let count = 0;
  let resetTimer = null;

  avatarEl.addEventListener("click", () => {
    count++;

    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => { count = 0; }, 1400);

    if (count >= 7) {
      count = 0;
      clearTimeout(resetTimer);
      openSnakeGame();
    }
  });
})();

(function () {
  const SEQ = [
    "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
    "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
    "b", "a"
  ];
  let idx = 0;

  document.addEventListener("keydown", (e) => {
    if (document.getElementById("egg-overlay")) return;
    if (e.key === SEQ[idx]) {
      idx++;
      if (idx === SEQ.length) {
        openSnakeGame();
        idx = 0;
      }
    } else {
      idx = e.key === SEQ[0] ? 1 : 0;
    }
  });
})();

function openSnakeGame() {
  if (document.getElementById("egg-overlay")) return;

  const overlay = document.createElement("div");
  overlay.className = "egg-overlay";
  overlay.id = "egg-overlay";

  const panel = document.createElement("div");
  panel.className = "egg-panel";

  const closeBtn = document.createElement("button");
  closeBtn.className = "egg-close";
  closeBtn.textContent = "✕";
  closeBtn.setAttribute("aria-label", "close");

  const title = document.createElement("div");
  title.className = "egg-title";
  title.textContent = "snake";

  const scoreEl = document.createElement("div");
  scoreEl.className = "egg-score";
  scoreEl.textContent = "score: 0";

  const canvas = document.createElement("canvas");
  canvas.width  = 420;
  canvas.height = 420;
  canvas.className = "egg-canvas";

  const hint = document.createElement("div");
  hint.className = "egg-hint";
  hint.textContent = "click to start  ·  arrows / wasd  ·  esc to close";

  panel.append(closeBtn, title, scoreEl, canvas, hint);
  overlay.appendChild(panel);
  document.body.appendChild(overlay);

  const CELL = 20;
  const COLS = canvas.width  / CELL;
  const ROWS = canvas.height / CELL;
  const ctx  = canvas.getContext("2d");

  const TICK_MS = 95;

  const HS_KEY = "snake-hs";
  const getHS  = () => parseInt(localStorage.getItem(HS_KEY) || "0", 10);
  const saveHS = (s) => { if (s > getHS()) localStorage.setItem(HS_KEY, String(s)); };

  let snake, prevSnake, dir, dirQueue, food, score, gameOver, paused;
  let gameInterval = null;
  let rafId = null;
  let lastTickTime = 0;

  function resetState() {
    snake     = [{ x: 7, y: 10 }, { x: 6, y: 10 }, { x: 5, y: 10 }];
    prevSnake = snake.map((s) => ({ ...s }));
    dir       = { x: 1, y: 0 };
    dirQueue  = [];
    food      = spawnFood();
    score     = 0;
    gameOver  = false;
    lastTickTime = performance.now();
    scoreEl.textContent = `score: 0  ·  best: ${getHS()}`;
  }

  function startLoop() {
    clearInterval(gameInterval);
    lastTickTime = performance.now();
    gameInterval = setInterval(tick, TICK_MS);
  }

  function init() {
    resetState();
    paused = false;
    startLoop();
  }

  function armPaused() {
    resetState();
    paused = true;
    clearInterval(gameInterval);
  }

  function beginFromPause() {
    if (!paused) return;
    paused = false;
    startLoop();
  }

  function handleTapStart() {
    if (gameOver) { init(); return; }
    if (paused) { beginFromPause(); return; }
  }

  function queueDir(nx, ny) {
    const last = dirQueue.length ? dirQueue[dirQueue.length - 1] : dir;
    if (nx === last.x && ny === last.y) return;
    if (nx === -last.x && ny === -last.y) return;
    if (dirQueue.length < 2) dirQueue.push({ x: nx, y: ny });
  }

  function spawnFood() {
    let pos;
    do {
      pos = {
        x: Math.floor(Math.random() * COLS),
        y: Math.floor(Math.random() * ROWS),
      };
    } while (snake.some((s) => s.x === pos.x && s.y === pos.y));
    return pos;
  }

  function tick() {
    if (gameOver || paused) return;

    prevSnake = snake.map((s) => ({ ...s }));
    lastTickTime = performance.now();
    if (dirQueue.length) dir = dirQueue.shift();

    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

    if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
      return endGame();
    }
    if (snake.some((s) => s.x === head.x && s.y === head.y)) {
      return endGame();
    }

    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
      score++;
      scoreEl.textContent = `score: ${score}  ·  best: ${getHS()}`;
      food = spawnFood();
    } else {
      snake.pop();
    }
  }

  function endGame() {
    gameOver = true;
    saveHS(score);
    clearInterval(gameInterval);
  }

  function drawApple(fx, fy) {
    const r = CELL / 2 - 3;

    ctx.beginPath();
    ctx.fillStyle = "#e0433c";
    ctx.arc(fx, fy + 1, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.arc(fx - r * 0.35, fy - r * 0.35, r * 0.28, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#6b4226";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(fx, fy - r);
    ctx.lineTo(fx + 1, fy - r - 5);
    ctx.stroke();

    ctx.beginPath();
    ctx.fillStyle = "#4ede7a";
    ctx.ellipse(fx + 4, fy - r - 3, 4, 2.2, -0.5, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawFrame(positions) {
    ctx.fillStyle = "#08140a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "rgba(78,222,122,0.06)";
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= COLS; x++) {
      ctx.beginPath();
      ctx.moveTo(x * CELL, 0);
      ctx.lineTo(x * CELL, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y <= ROWS; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * CELL);
      ctx.lineTo(canvas.width, y * CELL);
      ctx.stroke();
    }

    drawApple(food.x * CELL + CELL / 2, food.y * CELL + CELL / 2);

    if (positions.length > 1) {
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "#4ede7a";
      ctx.lineWidth = CELL - 6;
      ctx.beginPath();
      ctx.moveTo(positions[0].x * CELL + CELL / 2, positions[0].y * CELL + CELL / 2);
      for (let i = 1; i < positions.length; i++) {
        ctx.lineTo(positions[i].x * CELL + CELL / 2, positions[i].y * CELL + CELL / 2);
      }
      ctx.stroke();
    }

    if (positions.length > 0) {
      const hd = positions[0];
      const cx = hd.x * CELL + CELL / 2;
      const cy = hd.y * CELL + CELL / 2;

      ctx.fillStyle = "#4ede7a";
      ctx.beginPath();
      ctx.arc(cx, cy, CELL / 2 - 3, 0, Math.PI * 2);
      ctx.fill();

      let ex1, ey1, ex2, ey2;
      if      (dir.x ===  1) { ex1 = cx + 4; ey1 = cy - 3; ex2 = cx + 4; ey2 = cy + 3; }
      else if (dir.x === -1) { ex1 = cx - 4; ey1 = cy - 3; ex2 = cx - 4; ey2 = cy + 3; }
      else if (dir.y === -1) { ex1 = cx - 3; ey1 = cy - 4; ex2 = cx + 3; ey2 = cy - 4; }
      else                   { ex1 = cx - 3; ey1 = cy + 4; ex2 = cx + 3; ey2 = cy + 4; }

      ctx.fillStyle = "#08140a";
      ctx.beginPath(); ctx.arc(ex1, ey1, 2.2, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(ex2, ey2, 2.2, 0, Math.PI * 2); ctx.fill();

      ctx.fillStyle = "rgba(255,255,255,0.55)";
      ctx.beginPath(); ctx.arc(ex1 - 0.5, ey1 - 0.5, 0.9, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(ex2 - 0.5, ey2 - 0.5, 0.9, 0, Math.PI * 2); ctx.fill();
    }

    if (paused) drawOverlayText("click to start", "");
    if (gameOver) drawOverlayText("game over", `score: ${score}  ·  best: ${getHS()}`, "click or space to restart");
  }

  function drawOverlayText(main, sub, tail) {
    ctx.fillStyle = "rgba(0,0,0,0.52)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.font = "bold 20px 'Merriweather', Georgia, serif";
    ctx.fillStyle = "#4ede7a";
    ctx.fillText(main, canvas.width / 2, canvas.height / 2 - (sub ? 22 : 0));

    if (sub) {
      ctx.font = "13px 'Merriweather', Georgia, serif";
      ctx.fillStyle = "#9bcfa8";
      ctx.fillText(sub, canvas.width / 2, canvas.height / 2 + 4);
    }

    if (tail) {
      ctx.font = "11px 'Merriweather', Georgia, serif";
      ctx.fillStyle = "#4d7a59";
      ctx.fillText(tail, canvas.width / 2, canvas.height / 2 + 26);
    }
  }

  function renderLoop() {
    rafId = requestAnimationFrame(renderLoop);

    if (paused || gameOver) {
      drawFrame(snake);
      return;
    }

    const t = Math.min(1, (performance.now() - lastTickTime) / TICK_MS);
    const positions = snake.map((seg, i) => {
      const prev = prevSnake[i];
      if (!prev) return seg;
      return {
        x: prev.x + (seg.x - prev.x) * t,
        y: prev.y + (seg.y - prev.y) * t,
      };
    });
    drawFrame(positions);
  }

  const MOVE_KEYS = new Set([
    "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " ",
    "w", "a", "s", "d", "W", "A", "S", "D",
  ]);

  const keyHandler = (e) => {
    if (MOVE_KEYS.has(e.key)) e.preventDefault();

    if (e.key === "Escape") { closeSnakeGame(); return; }
    if ((e.key === " " || e.key === "Enter") && gameOver) { init(); return; }
    if ((e.key === " " || e.key === "Enter") && paused) { beginFromPause(); return; }

    if (e.key === "ArrowUp"    || e.key === "w" || e.key === "W") queueDir(0, -1);
    if (e.key === "ArrowDown"  || e.key === "s" || e.key === "S") queueDir(0, 1);
    if (e.key === "ArrowLeft"  || e.key === "a" || e.key === "A") queueDir(-1, 0);
    if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") queueDir(1, 0);
  };

  document.addEventListener("keydown", keyHandler);

  canvas.addEventListener("click", handleTapStart);

  let touchOrigin = null;
  canvas.addEventListener("touchstart", (e) => {
    touchOrigin = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    e.preventDefault();
  }, { passive: false });

  canvas.addEventListener("touchend", (e) => {
    if (!touchOrigin) return;
    const dx = e.changedTouches[0].clientX - touchOrigin.x;
    const dy = e.changedTouches[0].clientY - touchOrigin.y;
    touchOrigin = null;

    if (gameOver) { init(); return; }
    if (paused) { beginFromPause(); return; }

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 16) queueDir(1, 0);
      if (dx < -16) queueDir(-1, 0);
    } else {
      if (dy > 16) queueDir(0, 1);
      if (dy < -16) queueDir(0, -1);
    }
    e.preventDefault();
  }, { passive: false });

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeSnakeGame();
  });
  closeBtn.addEventListener("click", closeSnakeGame);

  overlay._cleanup = () => {
    clearInterval(gameInterval);
    cancelAnimationFrame(rafId);
    document.removeEventListener("keydown", keyHandler);
  };

  armPaused();
  renderLoop();
}

function closeSnakeGame() {
  const overlay = document.getElementById("egg-overlay");
  if (!overlay) return;
  if (overlay._cleanup) overlay._cleanup();
  const panel = overlay.querySelector(".egg-panel");
  if (panel) panel.style.animation = "egg-out 0.18s ease forwards";
  overlay.style.transition = "opacity 0.2s ease";
  overlay.style.opacity = "0";
  setTimeout(() => overlay.remove(), 220);
}

(function () {
  const WORD = "matrix";
  let typed = "";

  document.addEventListener("keydown", (e) => {
    if (document.getElementById("egg-overlay")) return;
    if (e.key.length !== 1) return;

    typed = (typed + e.key.toLowerCase()).slice(-WORD.length);
    if (typed === WORD) {
      typed = "";
      openMatrixRain();
    }
  });
})();

function openMatrixRain() {
  if (document.getElementById("matrix-overlay")) return;

  const overlay = document.createElement("div");
  overlay.className = "matrix-overlay";
  overlay.id = "matrix-overlay";

  const canvas = document.createElement("canvas");
  overlay.appendChild(canvas);

  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add("matrix-visible"));

  const ctx = canvas.getContext("2d");
  const CHARS =
    "アイウエオカキクケコサシスセソタチツテト0123456789こんにちはCRISJONKS";

  let cols, drops, dpr;

  function resize() {
    dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.floor(window.innerWidth / 16);
    drops = new Array(cols).fill(0).map(() => Math.random() * -50);
  }
  resize();

  function frame() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    ctx.font = "15px monospace";
    for (let i = 0; i < cols; i++) {
      const char = CHARS[Math.floor(Math.random() * CHARS.length)];
      const x = i * 16;
      const y = drops[i] * 18;

      ctx.fillStyle = Math.random() > 0.94 ? "#dfffe6" : "#4ede7a";
      ctx.fillText(char, x, y);

      if (y > window.innerHeight && Math.random() > 0.975) {
        drops[i] = 0;
      } else {
        drops[i]++;
      }
    }
  }

  const matrixInterval = setInterval(frame, 45);
  const onResize = () => resize();
  window.addEventListener("resize", onResize);

  function closeMatrixRain() {
    clearInterval(matrixInterval);
    window.removeEventListener("resize", onResize);
    document.removeEventListener("keydown", onKey);
    overlay.classList.remove("matrix-visible");
    setTimeout(() => overlay.remove(), 400);
  }

  function onKey(e) {
    if (e.key === "Escape") closeMatrixRain();
  }

  document.addEventListener("keydown", onKey);
  overlay.addEventListener("click", closeMatrixRain);
}
