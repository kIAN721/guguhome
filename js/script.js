/* ==========================================================
   1. PROCEDURAL AUDIO SYNTHESIZER
========================================================== */
class ProceduralAudio {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.timer = null;
    this.step = 0;
    this.score = [
      261.63, 329.63, 392.00, 523.25, 440.00, 392.00, 329.63, 293.66, 349.23, 440.00, 523.25
    ];
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playNote(freq) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.12, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 1.4);
  }

  start() {
    this.init();
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.step = 0;
    const musicText = document.getElementById('music-text');
    if (musicText) musicText.textContent = 'Mute';
    this.loop();
  }

  loop() {
    if (!this.isPlaying) return;
    this.playNote(this.score[this.step % this.score.length]);
    this.step++;
    this.timer = setTimeout(() => this.loop(), 640);
  }

  stop() {
    this.isPlaying = false;
    if (this.timer) clearTimeout(this.timer);
    const musicText = document.getElementById('music-text');
    if (musicText) musicText.textContent = 'Play Music';
  }

  toggle() {
    if (this.isPlaying) this.stop();
    else this.start();
  }
}

const audio = new ProceduralAudio();
const musicToggle = document.getElementById('music-toggle');

if (musicToggle) {
  musicToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    audio.toggle();
  });
}

document.addEventListener('click', () => {
  if (!audio.isPlaying) {
    audio.start();
  }
}, { once: true });

/* ==========================================================
   2. TELEGRAM BOT NOTIFICATION WHEN SHE PICKS A PORTAL
========================================================== */
const TELEGRAM_BOT_TOKEN = "8832112215:AAGga3nuyOUKmOcTPjLs1FcU8zS9Rf7QCrc";
const TELEGRAM_CHAT_ID = "1694644020";

function notifyChoice(portalName) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: `🏠 顾顾 is on the Home Web and clicked: ${portalName}\n⏰ Time: ${new Date().toLocaleString()}`
    }),
    keepalive: true
  }).catch(err => console.log(err));
}

/* ==========================================================
   3. TWINKLING 4-POINT STAR SPARKLES CANVAS (BG IDEA 3)
========================================================== */
let activeSparkleColors = ['rgba(225, 29, 72, 0.28)', 'rgba(244, 63, 94, 0.22)'];

const canvas = document.getElementById('sparkles-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let w = canvas.width = window.innerWidth;
  let h = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  });

  const stars = Array.from({ length: 26 }, (_, i) => ({
    x: Math.random() * w,
    y: Math.random() * h,
    size: Math.random() * 5 + 3,
    speedY: Math.random() * 0.45 + 0.15,
    speedX: (Math.random() - 0.5) * 0.25,
    phase: Math.random() * Math.PI * 2,
    twinkleSpeed: Math.random() * 0.03 + 0.015,
    isStar: i % 2 === 0,
    colorIndex: i % 2
  }));

  function drawFourPointStar(cx, cy, radius, alpha, color) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      const outerX = cx + Math.cos(angle) * radius;
      const outerY = cy + Math.sin(angle) * radius;
      const innerAngle = angle + Math.PI / 4;
      const innerX = cx + Math.cos(innerAngle) * (radius * 0.32);
      const innerY = cy + Math.sin(innerAngle) * (radius * 0.32);
      if (i === 0) ctx.moveTo(outerX, outerY);
      else ctx.lineTo(outerX, outerY);
      ctx.lineTo(innerX, innerY);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);
    stars.forEach(s => {
      s.y -= s.speedY;
      s.x += s.speedX;
      s.phase += s.twinkleSpeed;

      if (s.y < -15) s.y = h + 15;
      if (s.x < -15) s.x = w + 15;
      if (s.x > w + 15) s.x = -15;

      const alpha = 0.35 + 0.65 * Math.abs(Math.sin(s.phase));
      const color = activeSparkleColors[s.colorIndex] || activeSparkleColors[0];

      if (s.isStar) {
        drawFourPointStar(s.x, s.y, s.size * 1.3, alpha, color);
      } else {
        ctx.save();
        ctx.globalAlpha = alpha * 0.7;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * 0.55, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.restore();
      }
    });
    requestAnimationFrame(animate);
  }
  animate();
}

/* ==========================================================
   3B. 3D CAROUSEL & DYNAMIC AURA CONTROLLER (7 Themes)
========================================================== */
const AURA_THEMES = [
  // 0: Letter (Rose Pink)[cite: 2]
  { top: '#FFE4EC', mid: '#FFF5F7', glow: 'rgba(225, 29, 72, 0.16)', accent: '#E11D48', bg: '#FFE4E6', sparkles: ['rgba(225, 29, 72, 0.28)', 'rgba(251, 113, 133, 0.24)'] },
  // 1: Thadingyut (Lantern Gold)[cite: 2]
  { top: '#FEF3C7', mid: '#FFFBEB', glow: 'rgba(245, 158, 11, 0.18)', accent: '#D97706', bg: '#FEF3C7', sparkles: ['rgba(245, 158, 11, 0.32)', 'rgba(217, 119, 6, 0.24)'] },
  // 2: Christmas (Winter Mint)
  { top: '#D1FAE5', mid: '#F0FDF4', glow: 'rgba(16, 185, 129, 0.16)', accent: '#059669', bg: '#D1FAE5', sparkles: ['rgba(16, 185, 129, 0.28)', 'rgba(239, 68, 68, 0.22)'] },
  // 3: New Year (Midnight Gold)
  { top: '#312E81', mid: '#1E1B4B', glow: 'rgba(245, 158, 11, 0.22)', accent: '#F59E0B', bg: '#312E81', sparkles: ['rgba(245, 158, 11, 0.35)', 'rgba(253, 230, 138, 0.3)'] },
  // 4: Chinese New Year (Crimson & Peach Gold)
  { top: '#FEE2E2', mid: '#FFFBEB', glow: 'rgba(239, 68, 68, 0.16)', accent: '#DC2626', bg: '#FEE2E2', sparkles: ['rgba(239, 68, 68, 0.28)', 'rgba(245, 158, 11, 0.28)'] },
  // 5: Thingyan Festival (Cool Water Aqua & Padauk)
  { top: '#E0F2FE', mid: '#F0F9FF', glow: 'rgba(6, 182, 212, 0.16)', accent: '#0284C7', bg: '#E0F2FE', sparkles: ['rgba(6, 182, 212, 0.28)', 'rgba(250, 204, 21, 0.28)'] },
  // 6: Birthday Surprise (Dreamy Cancer Lavender)[cite: 2]
  { top: '#FAE8FF', mid: '#FDF4FF', glow: 'rgba(192, 38, 211, 0.17)', accent: '#9333EA', bg: '#FAE8FF', sparkles: ['rgba(192, 38, 211, 0.28)', 'rgba(147, 51, 234, 0.24)'] }
];

let currentSlide = 0;
const cards = Array.from(document.querySelectorAll('.portal-card'));
const dockBtns = Array.from(document.querySelectorAll('.dock-btn'));
const hintEl = document.getElementById('carousel-hint');

function updateCarousel() {
  const total = cards.length;
  if (!total) return;

  cards.forEach((card, index) => {
    card.classList.remove('is-active', 'is-prev', 'is-next', 'is-far-prev', 'is-far-next');

    let diff = index - currentSlide;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    if (diff === 0) {
      card.classList.add('is-active');
    } else if (diff === -1) {
      card.classList.add('is-prev');
    } else if (diff === 1) {
      card.classList.add('is-next');
    } else if (diff < -1) {
      card.classList.add('is-far-prev');
    } else {
      card.classList.add('is-far-next');
    }
  });

  dockBtns.forEach((btn, idx) => {
    btn.classList.toggle('active', idx === currentSlide);
  });

  if (hintEl) {
    hintEl.textContent = `✨ Swipe cards or tap emojis above (${currentSlide + 1} / ${total}) ✨`;
  }

  const theme = AURA_THEMES[currentSlide] || AURA_THEMES[0];
  const root = document.documentElement;
  root.style.setProperty('--aura-top', theme.top);
  root.style.setProperty('--aura-mid', theme.mid);
  root.style.setProperty('--aura-glow', theme.glow);
  root.style.setProperty('--dock-accent', theme.accent);
  root.style.setProperty('--dock-bg', theme.bg);
  activeSparkleColors = theme.sparkles;
}

function goToSlide(index) {
  const total = cards.length;
  currentSlide = (index + total) % total;
  updateCarousel();
}

function changeSlide(step) {
  goToSlide(currentSlide + step);
}

function handleCardClick(e, index, portalName) {
  if (currentSlide !== index) {
    e.preventDefault();
    goToSlide(index);
    return;
  }
  notifyChoice(portalName);
}

/* Touch & Drag Handling */
const stageEl = document.getElementById('carousel-stage');
let startX = 0;
let startY = 0;
let currentDeltaX = 0;
let isDragging = false;
let isHorizontalSwipe = null;

if (stageEl) {
  stageEl.addEventListener('touchstart', (e) => {
    if (e.touches.length !== 1) return;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    currentDeltaX = 0;
    isDragging = true;
    isHorizontalSwipe = null;

    const activeCard = cards[currentSlide];
    if (activeCard) activeCard.classList.add('is-dragging');
  }, { passive: true });

  stageEl.addEventListener('touchmove', (e) => {
    if (!isDragging || e.touches.length !== 1) return;

    const moveX = e.touches[0].clientX;
    const moveY = e.touches[0].clientY;
    const deltaX = moveX - startX;
    const deltaY = moveY - startY;

    if (isHorizontalSwipe === null && (Math.abs(deltaX) > 6 || Math.abs(deltaY) > 6)) {
      isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);
    }

    if (isHorizontalSwipe) {
      if (e.cancelable) e.preventDefault();
      currentDeltaX = deltaX;

      const activeCard = cards[currentSlide];
      if (activeCard) {
        const clampedX = Math.max(-130, Math.min(130, deltaX * 0.65));
        const rotateDeg = clampedX * -0.08;
        activeCard.style.transform = `translate3d(${clampedX}px, 0, 0) scale(0.98) rotateY(${rotateDeg}deg)`;
      }
    }
  }, { passive: false });

  const finishSwipe = () => {
    if (!isDragging) return;
    isDragging = false;

    const activeCard = cards[currentSlide];
    if (activeCard) {
      activeCard.classList.remove('is-dragging');
      activeCard.style.transform = '';
    }

    if (isHorizontalSwipe && Math.abs(currentDeltaX) > 32) {
      if (currentDeltaX < 0) changeSlide(1);
      else changeSlide(-1);
    }

    currentDeltaX = 0;
    isHorizontalSwipe = null;
  };

  stageEl.addEventListener('touchend', finishSwipe, { passive: true });
  stageEl.addEventListener('touchcancel', finishSwipe, { passive: true });

  document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('bday-modal');
    if (modal && modal.classList.contains('active')) return;
    if (e.key === 'ArrowLeft') changeSlide(-1);
    if (e.key === 'ArrowRight') changeSlide(1);
  });
}

updateCarousel();

/* ==========================================================
   4. MASTER UNLOCK SWITCHBOARD (SEPARATE CHRISTMAS & NEW YEAR)
========================================================== */
const PORTAL_SCHEDULE = {
  christmas: {
    forceUnlock: false,
    unlockDate: "2026-12-25T00:00:00",
    name: "🎄 Merry Christmas",
    unlockedTag: "🎄 Christmas Special",
    unlockedBtn: "Enter Christmas 🎄✨"
  },
  newyear: {
    forceUnlock: false,
    unlockDate: "2027-01-01T00:00:00",
    name: "🎆 New Year 2027",
    unlockedTag: "🎆 New Year Special",
    unlockedBtn: "Enter New Year 🎆✨"
  },
  cny: {
    forceUnlock: false,
    unlockDate: "2027-02-05T00:00:00", // CNY Eve 2027
    name: "🧧 Chinese New Year",
    unlockedTag: "🧧 CNY Special",
    unlockedBtn: "Enter Festival 🧧"
  },
  thingyan: {
    forceUnlock: false,
    unlockDate: "2027-04-13T00:00:00", // Thingyan Eve 2027
    name: "💦 Thingyan Festival",
    unlockedTag: "💦 Water Festival",
    unlockedBtn: "Enter Festival 💦"
  },
  birthday: {
    forceUnlock: false,
    unlockDate: "2027-07-21T00:00:00",
    name: "🎂 Birthday Surprise",
    unlockedTag: "🎂 Happy Birthday ✨",
    unlockedBtn: "Unlock Birthday 🎂💖"
  }
};

function isPortalUnlocked(key) {
  const cfg = PORTAL_SCHEDULE[key];
  if (!cfg) return false;
  if (cfg.forceUnlock) return true;
  return new Date() >= new Date(cfg.unlockDate);
}

function syncPortalLocksUI() {
  ['christmas', 'newyear', 'cny', 'thingyan'].forEach(key => {
    if (isPortalUnlocked(key)) {
      const cfg = PORTAL_SCHEDULE[key];
      const tagEl = document.getElementById(`tag-${key}`);
      const btnEl = document.getElementById(`btn-${key}`);
      if (tagEl) tagEl.textContent = cfg.unlockedTag;
      if (btnEl) btnEl.textContent = cfg.unlockedBtn;
    }
  });

  if (isPortalUnlocked('birthday')) {
    const bdayTag = document.getElementById('bday-card-tag');
    const bdayBtn = document.getElementById('bday-card-btn');
    if (bdayTag) bdayTag.textContent = PORTAL_SCHEDULE.birthday.unlockedTag;
    if (bdayBtn) bdayBtn.textContent = PORTAL_SCHEDULE.birthday.unlockedBtn;
  }
}

function handleFestivalCard(e, index, key) {
  if (currentSlide !== index) {
    e.preventDefault();
    goToSlide(index);
    return;
  }

  const cfg = PORTAL_SCHEDULE[key];

  if (isPortalUnlocked(key)) {
    notifyChoice(`${cfg.name} (Unlocked & Entered ✨)`);
    return;
  }

  e.preventDefault();
  const card = cards[index];
  if (!card) return;

  card.classList.remove('card-shake');
  void card.offsetWidth;
  card.classList.add('card-shake');

  const btn = card.querySelector('.portal-btn');
  if (btn && !btn.dataset.locking) {
    const originalText = btn.textContent;
    btn.dataset.locking = 'true';
    btn.textContent = 'Not Ready Yet 🤪🔒';
    setTimeout(() => {
      btn.textContent = originalText;
      delete btn.dataset.locking;
    }, 1400);
  }

  notifyChoice(`${cfg.name} (Locked) — Tried to open! 🤪`);
}

function handleBirthdayCard(e, index) {
  if (currentSlide !== index) {
    goToSlide(index);
    return;
  }
  openBirthdayModal();
}

/* ==========================================================
   5. BIRTHDAY PASSWORD CONTROLLER
========================================================== */
const BIRTHDAY_PASSWORDS = ["072103", "210703", "032107", "030721"];
const BIRTHDAY_WEB_URL = "https://kian721.github.io/gugubirthday/";

function openBirthdayModal() {
  const modal = document.getElementById('bday-modal');
  const icon = document.getElementById('bday-modal-icon');
  const title = document.getElementById('bday-modal-title');
  const desc = document.getElementById('bday-modal-desc');
  const passSection = document.getElementById('bday-pass-section');
  const lockedOkBtn = document.getElementById('bday-locked-ok-btn');
  const passInput = document.getElementById('bday-pass-input');
  const errorMsg = document.getElementById('bday-error-msg');

  if (!modal) return;

  icon.textContent = isPortalUnlocked('birthday') ? '🎂💖' : '🎂🔐';
  title.textContent = isPortalUnlocked('birthday')
    ? 'Happy Birthday, 顾顾! 🥺🎂'
    : 'Birthday Secret Box ✨';
  desc.textContent = 'Enter 6 digits password to open 👇✨';

  passSection.style.display = 'flex';
  lockedOkBtn.style.display = 'none';

  if (errorMsg) errorMsg.textContent = '';
  if (passInput) {
    passInput.value = '';
    setTimeout(() => passInput.focus(), 150);
  }

  notifyChoice('🎂 Birthday Card (Opened Password Box 🔐)');
  modal.classList.add('active');
}

function closeBirthdayModal(e) {
  if (!e || e.target.id === 'bday-modal') {
    const modal = document.getElementById('bday-modal');
    if (modal) modal.classList.remove('active');
  }
}

function verifyBirthdayPassword() {
  const passInput = document.getElementById('bday-pass-input');
  const errorMsg = document.getElementById('bday-error-msg');
  if (!passInput) return;

  const cleanedInput = passInput.value.trim().replace(/[\s\/\-\.]/g, '');

  if (BIRTHDAY_PASSWORDS.includes(cleanedInput)) {
    if (isPortalUnlocked('birthday')) {
      errorMsg.style.color = '#16A34A';
      errorMsg.textContent = '✨ Password is correct! You may enter... 🎂💖';
      notifyChoice(`🎂🎉 UNLOCKED & ENTERED Birthday Web with password: ${cleanedInput}`);

      setTimeout(() => {
        window.location.href = BIRTHDAY_WEB_URL;
      }, 650);
    } else {
      errorMsg.style.color = '#9333EA';
      errorMsg.textContent = '✨ Password is correct! ဒါပေမယ့် ကုကုမွေးနေ့ရောက်မှ ပွင့်မှာနော် ခဏစောင့်ပါဦးဗျာ 🎂🔒💖';
      notifyChoice(`🎂🔐 Typed CORRECT Birthday Password ("${cleanedInput}"), but kept locked until July 21!`);
    }
  } else {
    errorMsg.style.color = '#E11D48';
    errorMsg.textContent = 'Password is incorrect! ပြန်စမ်းကြည့်ပါဦး 🥺🌸';
    passInput.classList.remove('shake');
    void passInput.offsetWidth;
    passInput.classList.add('shake');
    notifyChoice(`🎂❌ Typed wrong Birthday Password: "${passInput.value}"`);
  }
}

const bdayInputEl = document.getElementById('bday-pass-input');
if (bdayInputEl) {
  bdayInputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') verifyBirthdayPassword();
  });
}

syncPortalLocksUI();