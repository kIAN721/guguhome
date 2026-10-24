/* ==========================================================
   1. Procedural Audio Synthesizer (Exact guguletter engine)
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
   2. Telegram Bot Notification when she picks a portal
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
   3. Soft Floating Sparkles Background
========================================================== */
const canvas = document.getElementById('sparkles-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let w = canvas.width = window.innerWidth;
  let h = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  });

  const dots = Array.from({ length: 20 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 4 + 2,
    speedY: Math.random() * 0.5 + 0.2,
    color: Math.random() > 0.5 ? 'rgba(225, 29, 72, 0.18)' : 'rgba(245, 158, 11, 0.22)'
  }));

  function animate() {
    ctx.clearRect(0, 0, w, h);
    dots.forEach(d => {
      d.y -= d.speedY;
      if (d.y < -10) d.y = h + 10;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = d.color;
      ctx.fill();
    });
    requestAnimationFrame(animate);
  }
  animate();
}