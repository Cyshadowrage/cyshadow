// MATRIX BACKGROUND ANIMATION
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

// Resize canvas on window resize
window.addEventListener('resize', () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
});

const letters = 'abcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()*&^%+-/~{[|`]}';
const fontSize = 16;
let columns = Math.floor(width / fontSize);
let drops = Array(columns).fill(0);

// Update drops array on resize
function resetMatrix() {
  columns = Math.floor(width / fontSize);
  drops = Array(columns).fill(0);
}
window.addEventListener('resize', resetMatrix);

// Draw the matrix
function drawMatrix() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = '#0F0';
  ctx.font = `${fontSize}px monospace`;

  for (let i = 0; i < drops.length; i++) {
    const text = letters.charAt(Math.floor(Math.random() * letters.length));
    const x = i * fontSize;
    const y = drops[i] * fontSize;
    ctx.fillText(text, x, y);

    if (y > height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }
}
setInterval(drawMatrix, 50);

// ENTRANCE & HUD LOGIC
document.addEventListener('DOMContentLoaded', () => {
  const connectBtn = document.getElementById('connectWalletBtn');
  const beginBtn = document.getElementById('beginProtocolBtn');

  connectBtn.addEventListener('click', async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        document.getElementById('walletAddress').textContent = `Wallet: ${account}`;
        connectBtn.classList.add('hidden');
        beginBtn.classList.remove('hidden');
      } catch (err) {
        console.error(err);
      }
    } else {
      alert('Please install MetaMask');
    }
  });

  beginBtn.addEventListener('click', () => {
    showHUD();
  });
});

function hideEntrance() {
  document.getElementById('entranceScreen').classList.add('hidden');
}

function showHUD() {
  hideEntrance();
  document.getElementById('gameScreen').classList.remove('hidden');
  const hudGrid = document.getElementById('game-hud');
  hudGrid.classList.remove('hidden');
  initHUD();
}

function initHUD() {
  const walletEl = document.getElementById('hud-wallet');
  const rankEl = document.getElementById('hud-rank');
  const xpFill = document.getElementById('hud-xp-fill');
  const xpText = document.getElementById('hud-xp-text');
  const lbEl = document.getElementById('hud-lb');
  const hsEl = document.getElementById('hud-hs');
  const energyEl = document.getElementById('hud-energy');
  const plaiEl = document.getElementById('hud-plai');
  const statusEl = document.getElementById('hud-status');
  const descEl = document.getElementById('hud-mission-desc');
  const startBtn = document.getElementById('hud-start');
  const timerEl = document.getElementById('hud-timer');
  const consoleEl = document.getElementById('hud-console');
  const logoutBtn = document.getElementById('hud-logout');
  const menuBtn = document.getElementById('hud-menu-btn');

  // Populate wallet address into HUD
  const addrText = document.getElementById('walletAddress').textContent;
  walletEl.textContent = addrText;

  // Start mission stub
  startBtn.addEventListener('click', () => {
    statusEl.textContent = 'Executing mission...';
    timerEl.textContent = '00:00';
    consoleEl.innerHTML = '';
    // TODO: implement command-prompt loop and mission timer
  });

  // Logout / reload
  logoutBtn.addEventListener('click', () => {
    location.reload();
  });
}
