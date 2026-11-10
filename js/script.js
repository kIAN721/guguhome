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
   3. SOFT FLOATING SPARKLES BACKGROUND CANVAS
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