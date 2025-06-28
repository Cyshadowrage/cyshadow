// Ambient hacker-code background
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');
// ... existing drawAmbientBackground logic ...

// MetaMask integration & UI flow
async function connectWallet() {
  // ... existing connectWallet code ...
}

function showEntranceButtons() {
  document.getElementById('connectWalletBtn').classList.remove('hidden');
}

function showBeginProtocol() {
  document.getElementById('beginProtocolBtn').classList.remove('hidden');
}

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
  // Cache HUD elements
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

  // Populate wallet address
  const originalAddrText = document.getElementById('walletAddress').textContent;
  walletEl.textContent = originalAddrText;

  // Start mission button
  startBtn.addEventListener('click', () => {
    statusEl.textContent = 'Executing mission...';
    timerEl.textContent = '00:00';
    consoleEl.innerHTML = '';
    // TODO: energy check, timing logic, command-prompt loop
  });

  // Exit back to entrance
  logoutBtn.addEventListener('click', () => {
    location.reload();
  });

  // TODO: menu button logic
}

// Example hook: after protocol begins, call showHUD()
// beginProtocol().then(showHUD);
