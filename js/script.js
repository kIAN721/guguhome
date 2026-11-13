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

// Start chimes on first tap anywhere on the page
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

  // Create twinkling 4-point stars and soft bokeh particles
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
   3B. 3D CAROUSEL, DYNAMIC AURA & LOCKED CARD CONTROLLER
========================================================== */
const AURA_THEMES = [
  // 0: Letter (Rose Pink)
  {
    top: '#FFE4EC', mid: '#FFF5F7', glow: 'rgba(225, 29, 72, 0.16)',
    accent: '#E11D48', bg: '#FFE4E6',
    sparkles: ['rgba(225, 29, 72, 0.28)', 'rgba(251, 113, 133, 0.24)']
  },
  // 1: Thadingyut (Lantern Gold)
  {
    top: '#FEF3C7', mid: '#FFFBEB', glow: 'rgba(245, 158, 11, 0.18)',
    accent: '#D97706', bg: '#FEF3C7',
    sparkles: ['rgba(245, 158, 11, 0.32)', 'rgba(217, 119, 6, 0.24)']
  },
  // 2: Christmas & New Year (Winter Mint)
  {
    top: '#D1FAE5', mid: '#F0FDF4', glow: 'rgba(16, 185, 129, 0.16)',
    accent: '#059669', bg: '#D1FAE5',
    sparkles: ['rgba(16, 185, 129, 0.28)', 'rgba(239, 68, 68, 0.22)']
  },
  // 3: Chinese New Year (Crimson & Peach Gold)
  {
    top: '#FEE2E2', mid: '#FFFBEB', glow: 'rgba(239, 68, 68, 0.16)',
    accent: '#DC2626', bg: '#FEE2E2',
    sparkles: ['rgba(239, 68, 68, 0.28)', 'rgba(245, 158, 11, 0.28)']
  },
  // 4: Thingyan Festival (Cool Water Aqua & Padauk)
  {
    top: '#E0F2FE', mid: '#F0F9FF', glow: 'rgba(6, 182, 212, 0.16)',
    accent: '#0284C7', bg: '#E0F2FE',
    sparkles: ['rgba(6, 182, 212, 0.28)', 'rgba(250, 204, 21, 0.28)']
  },
  // 5: Birthday Surprise (Dreamy Cancer Lavender)
  {
    top: '#FAE8FF', mid: '#FDF4FF', glow: 'rgba(192, 38, 211, 0.17)',
    accent: '#9333EA', bg: '#FAE8FF',
    sparkles: ['rgba(192, 38, 211, 0.28)', 'rgba(147, 51, 234, 0.24)']
  }
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

    // Calculate circular shortest distance around the 6-card deck
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

  // Update active state on the Emoji Dock
  dockBtns.forEach((btn, idx) => {
    btn.classList.toggle('active', idx === currentSlide);
  });

  // Update slide counter text
  if (hintEl) {
    hintEl.textContent = `✨ Swipe cards or tap emojis above (${currentSlide + 1} / ${total}) ✨`;
  }

  // Shift background aura & sparkle colors to match the active card
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

// Handle clicking an unlocked link card (rotates to center first if peeking from the side)
function handleCardClick(e, index, portalName) {
  if (currentSlide !== index) {
    e.preventDefault();
    goToSlide(index);
    return;
  }
  notifyChoice(portalName);
}

// Handle clicking a locked festival card (Christmas, CNY, Thingyan)
function handleLockedCard(e, index, portalName) {
  if (currentSlide !== index) {
    goToSlide(index);
    return;
  }
  const card = cards[index];
  if (!card) return;

  // Trigger shake animation
  card.classList.remove('card-shake');
  void card.offsetWidth;
  card.classList.add('card-shake');

  // Temporarily show playful locked message on the button
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

  // Send Telegram alert
  notifyChoice(`${portalName} — Tried to open! 🤪`);
}

// Handle clicking the Birthday card (rotates to center first if on the side)
function handleBirthdayCard(e, index) {
  if (currentSlide !== index) {
    goToSlide(index);
    return;
  }
  openBirthdayModal();
}

// Touch / Swipe & Mouse Drag Support on the 3D Stage
const stageEl = document.getElementById('carousel-stage');
let startX = 0;
let isDragging = false;

if (stageEl) {
  stageEl.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
  }, { passive: true });

  stageEl.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    isDragging = false;
    const endX = e.changedTouches[0].clientX;
    const diffX = endX - startX;
    if (Math.abs(diffX) > 40) {
      if (diffX < 0) changeSlide(1);
      else changeSlide(-1);
    }
  }, { passive: true });

  // Keyboard Left/Right Arrow Support for Desktop
  document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('bday-modal');
    if (modal && modal.classList.contains('active')) return;
    if (e.key === 'ArrowLeft') changeSlide(-1);
    if (e.key === 'ArrowRight') changeSlide(1);
  });
}

// Initialize the 3D Carousel on page load
updateCarousel();

/* ==========================================================
   4. BIRTHDAY SURPRISE LOCK & PASSWORD CONTROLLER
========================================================== */
const IS_BIRTHDAY_READY = false;
const BIRTHDAY_PASSWORDS = ["072103", "210703", "030721", "032107", "0721", "2107", "20030721"];
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

  if (!IS_BIRTHDAY_READY) {
    icon.textContent = '🎂🔒';
    title.textContent = 'Not Unlocked Yet! 🤪';
    desc.textContent = 'ဒါက ကုကုမွေးနေ့ရောက်မှ ဖွင့်လို့ရမှာနော်! ခုတော့ ခဏစောင့်ပါဦးဗျာ 🎂✨';
    passSection.style.display = 'none';
    lockedOkBtn.style.display = 'block';
    notifyChoice('🎂 Birthday Card (Tried to peek while Locked 🔒)');
  } else {
    icon.textContent = '🎂🔐';
    title.textContent = 'Happy Birthday, 顾顾! 🥺🎂';
    desc.textContent = 'ဒီလက်ဆောင်လေးကိုဖွင့်ဖို့ ကုကုရဲ့ မွေးနေ့ဂဏန်းလေးကို Password အဖြစ် ရိုက်ထည့်လိုက်နော် 👇✨';
    passSection.style.display = 'flex';
    lockedOkBtn.style.display = 'none';
    if (errorMsg) errorMsg.textContent = '';
    if (passInput) {
      passInput.value = '';
      setTimeout(() => passInput.focus(), 150);
    }
    notifyChoice('🎂 Birthday Card (Opened Password Prompt 🔐)');
  }

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
    errorMsg.style.color = '#16A34A';
    errorMsg.textContent = '✨ Password မှန်ပါတယ်! ဝင်နေပါပြီနော်... 🎂💖';
    notifyChoice(`🎂🎉 UNLOCKED Birthday Web with password: ${cleanedInput}`);

    setTimeout(() => {
      window.location.href = BIRTHDAY_WEB_URL;
    }, 650);
  } else {
    errorMsg.style.color = '#E11D48';
    errorMsg.textContent = 'ဟိတ် မွေးနေ့ Password မမှန်သေးဘူးနော်! ပြန်စမ်းကြည့်ပါဦး 🥺🌸';
    passInput.classList.remove('shake');
    void passInput.offsetWidth;
    passInput.classList.add('shake');
    notifyChoice(`🎂❌ Typed wrong Birthday Password: "${passInput.value}"`);
  }
}

// Allow pressing "Enter" key inside the password box
const bdayInputEl = document.getElementById('bday-pass-input');
if (bdayInputEl) {
  bdayInputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') verifyBirthdayPassword();
  });
}