const canvas = document.getElementById('constellation-bg');
const ctx = canvas.getContext('2d');
let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

const STAR_COUNT = 60;
const STAR_RADIUS = 2;
const LINE_DISTANCE = 140;
const stars = [];

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function createStars() {
  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
      x: random(0, width),
      y: random(0, height),
      vx: random(-0.3, 0.3),
      vy: random(-0.3, 0.3)
    });
  }
}

function getIsLightTheme() {
  // Check prefers-color-scheme or body class for dark theme
  return !document.documentElement.classList.contains('dark');
}

function drawStars() {
  ctx.clearRect(0, 0, width, height);
  // Determine color based on theme
  const isLight = getIsLightTheme();
  console.log('isLight', isLight);
  const starColor = isLight ? '#000' : '#fff';
  const lineColor = isLight ? 'rgba(6,6,6,0.12)' : 'rgba(255,255,255,0.15)';
  // Draw lines
  ctx.save();
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 1;
  for (let i = 0; i < STAR_COUNT; i++) {
    for (let j = i + 1; j < STAR_COUNT; j++) {
      const dx = stars[i].x - stars[j].x;
      const dy = stars[i].y - stars[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < LINE_DISTANCE) {
        ctx.beginPath();
        ctx.moveTo(stars[i].x, stars[i].y);
        ctx.lineTo(stars[j].x, stars[j].y);
        ctx.stroke();
      }
    }
  }
  ctx.restore();
  // Draw stars
  ctx.save();
  ctx.fillStyle = starColor;
  for (let i = 0; i < STAR_COUNT; i++) {
    ctx.beginPath();
    ctx.arc(stars[i].x, stars[i].y, STAR_RADIUS, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function animateStars() {
  for (let i = 0; i < STAR_COUNT; i++) {
    stars[i].x += stars[i].vx;
    stars[i].y += stars[i].vy;
    // Bounce off edges
    if (stars[i].x < 0 || stars[i].x > width) stars[i].vx *= -1;
    if (stars[i].y < 0 || stars[i].y > height) stars[i].vy *= -1;
  }
}

function loop() {
  drawStars();
  animateStars();
  requestAnimationFrame(loop);
}

function resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
}

window.addEventListener('resize', resize);
createStars();
loop();
