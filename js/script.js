/* Telegram Bot Notification when she picks a portal on Home Hub */
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

/* Soft Floating Sparkles Background */
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

/* ==========================================================
   Background Music Toggle & Autoplay Control
========================================================== */
let isPlaying = true;

function updateMusicUI(playing) {
  const btn = document.getElementById('music-toggle-btn');
  const icon = document.getElementById('music-icon');
  const text = document.getElementById('music-text');

  if (!btn || !icon || !text) return;

  if (playing) {
    btn.classList.add('playing');
    icon.textContent = '🎶';
    text.textContent = 'Mute';
  } else {
    btn.classList.remove('playing');
    icon.textContent = '🎵';
    text.textContent = 'Play';
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const audio = document.getElementById('bg-audio');
  if (!audio) return;

  audio.play().then(() => {
    isPlaying = true;
    updateMusicUI(true);
  }).catch(() => {
    // Browser က Autoplay ပိတ်ထားလျှင် ပထမဆုံး click နှိပ်ချိန်တွင် အလိုအလျောက် ဖွင့်ပေးမည်
    isPlaying = false;
    updateMusicUI(false);

    document.addEventListener('click', function startOnFirstTap(e) {
      if (e.target.closest('#music-toggle-btn')) return;
      audio.play().then(() => {
        isPlaying = true;
        updateMusicUI(true);
      }).catch(err => console.log(err));
      document.removeEventListener('click', startOnFirstTap);
    }, { once: true });
  });
});

function toggleMusic() {
  const audio = document.getElementById('bg-audio');
  if (!audio) return;

  if (!isPlaying) {
    audio.play().then(() => {
      isPlaying = true;
      updateMusicUI(true);
    }).catch(err => console.log("Audio play error:", err));
  } else {
    audio.pause();
    isPlaying = false;
    updateMusicUI(false);
  }
}