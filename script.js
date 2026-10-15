/* ========== MATRIX RAIN EFFECT ========== */
(function() {
  const canvas = document.getElementById('matrix-canvas');
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  const chars = 'アカサタナハマヤラワイキシチニヒミリウクスツヌフムユルエケセテネヘメレオコソトノホモヨロ0123456789ABCDEF';
  const fontSize = 14;
  const columns = Math.floor(width / fontSize);
  const drops = Array(columns).fill(1);

  function drawMatrix() {
    ctx.fillStyle = 'rgba(10, 10, 26, 0.08)';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#00f0ff';
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
      const text = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);

      if (drops[i] * fontSize > height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  setInterval(drawMatrix, 50);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });
})();

/* ========== CONFETTI EFFECT ========== */
const confettiCanvas = document.getElementById('confetti-canvas');
const confettiCtx = confettiCanvas.getContext('2d');
let confettiParticles = [];
let confettiActive = false;

function resizeConfetti() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
resizeConfetti();
window.addEventListener('resize', resizeConfetti);

const confettiColors = ['#00f0ff', '#ff00c8', '#00ff88', '#ffcc00', '#ff6b6b', '#a855f7'];

function createConfetti() {
  confettiParticles = [];
  const count = 180;
  for (let i = 0; i < count; i++) {
    confettiParticles.push({
      x: Math.random() * confettiCanvas.width,
      y: Math.random() * confettiCanvas.height - confettiCanvas.height,
      w: Math.random() * 10 + 5,
      h: Math.random() * 6 + 3,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      vy: Math.random() * 3 + 2,
      vx: Math.random() * 2 - 1,
      rotation: Math.random() * 360,
      rotationSpeed: Math.random() * 10 - 5,
      opacity: 1
    });
  }
}

function animateConfetti() {
  if (!confettiActive) return;
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

  let allDone = true;
  confettiParticles.forEach(p => {
    p.y += p.vy;
    p.x += p.vx;
    p.rotation += p.rotationSpeed;
    p.vy += 0.05;
    p.vx *= 0.99;

    if (p.y < confettiCanvas.height + 50) allDone = false;

    confettiCtx.save();
    confettiCtx.translate(p.x, p.y);
    confettiCtx.rotate(p.rotation * Math.PI / 180);
    confettiCtx.globalAlpha = p.opacity;
    confettiCtx.fillStyle = p.color;
    confettiCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    confettiCtx.restore();
  });

  if (allDone) {
    confettiActive = false;
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  } else {
    requestAnimationFrame(animateConfetti);
  }
}

function launchConfetti() {
  createConfetti();
  confettiActive = true;
  animateConfetti();
}

/* ========== WEB AUDIO BEEP ========== */
function playBeep() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'square';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + i * 0.12 + 0.15);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(audioCtx.currentTime + i * 0.12);
      osc.stop(audioCtx.currentTime + i * 0.12 + 0.15);
    });
  } catch (e) {
    // Silent fallback
  }
}

/* ========== BALLOON EFFECT ========== */
function launchBalloons() {
  const emojis = ['🎈', '🎉', '🎊', '⭐', '💖', '✨', '🎁', '🌟'];
  for (let i = 0; i < 25; i++) {
    setTimeout(() => {
      const balloon = document.createElement('div');
      balloon.className = 'balloon';
      balloon.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      balloon.style.left = Math.random() * 100 + 'vw';
      balloon.style.fontSize = (Math.random() * 20 + 25) + 'px';
      balloon.style.animationDuration = (Math.random() * 3 + 4) + 's';
      document.body.appendChild(balloon);

      setTimeout(() => balloon.remove(), 8000);
    }, i * 80);
  }
}

/* ========== SPARKLE BURST ========== */
function sparkleBurst(x, y) {
  for (let i = 0; i < 20; i++) {
    const spark = document.createElement('div');
    spark.className = 'sparkle';
    spark.style.left = x + 'px';
    spark.style.top = y + 'px';
    const angle = (Math.PI * 2 * i) / 20;
    const distance = Math.random() * 120 + 60;
    spark.style.setProperty('--tx', Math.cos(angle) * distance + 'px');
    spark.style.setProperty('--ty', Math.sin(angle) * distance + 'px');
    document.body.appendChild(spark);
    setTimeout(() => spark.remove(), 1000);
  }
}

/* ========== BUTTON INTERACTION ========== */
function handleCelebrate(e) {
  // 1. Confetti
  launchConfetti();

  // 2. Balloons
  launchBalloons();

  // 3. Sparkle burst di posisi tombol
  if (e && e.currentTarget) {
    const rect = e.currentTarget.getBoundingClientRect();
    sparkleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
  }

  // 4. Suara beep
  playBeep();

  // 5. Ubah teks tombol sementara
  const btn = e.currentTarget;
  const originalText = btn.textContent;
  btn.textContent = '🎉 Selamat! 🎉';
  btn.style.background = 'linear-gradient(90deg, #ff00c8, #ffcc00)';
  btn.style.color = '#0a0a1a';

  setTimeout(() => {
    btn.textContent = originalText;
    btn.style.background = '';
    btn.style.color = '';
  }, 2500);
}

// Pasang event ke SEMUA tombol dengan class btn-tech
document.querySelectorAll('.btn-tech').forEach(btn => {
  btn.addEventListener('click', handleCelebrate);
});

/* ========== SCROLL PROGRESS BAR ========== */
const scrollProgress = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  scrollProgress.style.width = progress + '%';
});

/* ========== AUTO CONFETTI ON LOAD ========== */
window.addEventListener('load', () => {
  setTimeout(launchConfetti, 800);
});