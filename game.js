const TREASURY_ADDRESS = 
'0xb7fe8a3f08fe96104c2a526463ef1879edfe82a7';

// ─── PLAYER ENERGY MANAGEMENT ────────────────────────────────────
// Start with 1000 energy
let energy = 1000;

/**
 * Deduct `amount` from energy (not dropping below 0) and update UI
 * @param {number} amount
 */
function updateEnergy(amount) {
  energy = Math.max(0, energy - amount);
  document.getElementById('energy-value-2').textContent = energy;
}

// Schedule a daily reset of energy to 1000 at 00:00 UTC
(function scheduleDailyEnergyReset() {
  const now = new Date();
  const nextUTCmidnight = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + 1, 0, 0, 0
  ));
  const msUntilReset = nextUTCmidnight.getTime() - now.getTime();
  setTimeout(() => {
    energy = 1000;
    document.getElementById('energy-value-2').textContent = energy;
    scheduleDailyEnergyReset();
  }, msUntilReset);
})();



// ─── PLAI TOKEN CONFIG 

const PLAI_ADDRESS = '0x977EA2DDa60C1FdFfd4b0377b036D3871f2d01a9';
const PLAI_ABI = [
  "function balanceOf(address account) view returns (uint256)",
  "function decimals() view returns (uint8)"
];

async function fetchPlaiBalance() {
  if (!connectedWallet) return;
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new ethers.Contract(PLAI_ADDRESS, PLAI_ABI, provider);
  // PLAI has 6 decimals
  const raw = await contract.balanceOf(connectedWallet);
  const decimals = 6;
  const amount = Number(raw) / Math.pow(10, decimals);
  // display with up to 6 decimal places
  document.getElementById('plai-value').textContent =
    amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: decimals });
}


// Ambient background animation and HUD reveal after entrance
const commands = [
  'ping nexus_corp -t', 'decrypt --key 0xf3b1c4a9', 'breach --firewall --deep',
  'inject retribution.exe', 'netstat /trace /stealth', 'sudo erase --history',
  'download payload.pkg', 'uplink established ✔', 'trace.mask.enabled',
  'rm -rf /root/nexus', 'dns spoof: ACTIVE', 'backdoor.exe loading...',
  'ssh -i ghost_key root@target', 'loop breach > trace.block',
  'auth override: 0x9A7F', 'tracking disabled', 'chain.inject(success)',
  'threat neutralized', 'shell opened: #root', 'AI bypass granted',
  'proxy tunnel created', 'bootloader hacked', 'logging disabled',
  'sysinfo dump → /tmp', ':: uploading vengeance'
];

const redAlerts = [
  'CRITICAL BREACH DETECTED', 'WARNING: NEXUS TRACE INITIATED',
  'UNAUTHORIZED ACCESS FLAGGED', 'ALERT: TRACE LOCATED',
  'FIREWALL OVERRIDE FAILED', 'SECURITY TRIPWIRE TRIGGERED',
  'COUNTER-INTEL DEPLOYED', 'CORE DUMP ENGAGED',
  'MALWARE SIGNATURE DETECTED', 'TRACE NEARBY — DISCONNECT NOW'
];

let flashes = [], redFlashes = [];

function drawAmbientBackground() {
  const canvas = document.getElementById('matrixCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  function draw() {
    ctx.fillStyle = 'rgba(0, 10, 20, 0.12)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < 8; i++) {
      const cmd = commands[Math.floor(Math.random() * commands.length)];
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      ctx.font = '16px monospace';
      ctx.fillStyle = '#00BDEB';
      ctx.fillText(cmd, x, y);
    }

    flashes.forEach(flash => {
      const { text, x, y, age, maxAge } = flash;
      const opacity = 1 - age / maxAge;
      ctx.font = 'bold 20px monospace';
      ctx.fillStyle = `rgba(0, 255, 255, ${opacity})`;
      ctx.fillText(text, x, y);
      flash.age++;
    });

    redFlashes.forEach(alert => {
      const { text, x, y, age, maxAge } = alert;
      const opacity = 1 - age / maxAge;
      ctx.font = 'bold 22px monospace';
      ctx.fillStyle = `rgba(255, 0, 0, ${opacity})`;
      ctx.fillText(text, x, y);
      alert.age++;
    });

    flashes = flashes.filter(f => f.age < f.maxAge);
    redFlashes = redFlashes.filter(r => r.age < r.maxAge);
  }

  setInterval(() => {
    const cmd = commands[Math.floor(Math.random() * commands.length)];
    flashes.push({ text: cmd, x: Math.random() * canvas.width, y: Math.random() * canvas.height, age: 0, maxAge: 50 + Math.random() * 30 });
  }, 1500);

  setInterval(() => {
    const alert = redAlerts[Math.floor(Math.random() * redAlerts.length)];
    redFlashes.push({ text: alert, x: Math.random() * canvas.width, y: Math.random() * canvas.height, age: 0, maxAge: 70 + Math.random() * 40 });
  }, 4000);

  setInterval(draw, 200);

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

drawAmbientBackground();

// Wallet + Screen Transitions
let connectedWallet = null;

async function connectWallet() {
  if (!window.ethereum) {
    alert("MetaMask is not installed!");
    return;
  }

  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    connectedWallet = accounts[0];
    document.getElementById('walletAddress').textContent = `Wallet: ${connectedWallet}`;
    const hudWalletEl = document.getElementById('hud-wallet');
    if (hudWalletEl) {
      hudWalletEl.textContent = `Wallet: ${connectedWallet}`;
    }
    // Also update the in-game HUD wallet cell
    const hudWalletCell = document.getElementById('hud-wallet');
    if (hudWalletCell) {
      // Shorten address to 0xABCD...1234
      const shortWallet = `0x${connectedWallet.slice(2, 6)}...${connectedWallet.slice(-4)}`;
      hudWalletCell.textContent = `Wallet: ${shortWallet}`;
    }
    document.getElementById('connectWalletBtn').classList.add('hidden');
    document.getElementById('beginProtocolBtn').classList.remove('hidden');

    const baseChainId = '0x2105'; // Base Mainnet
    await window.ethereum.request({ 
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: baseChainId }] 
    });

// now that we're on Base and have an address, fetch PLAI balance
    fetchPlaiBalance();

  } catch (err) {
    console.error(err);
    alert("Failed to connect or switch network.");
  }
}

document.getElementById('connectWalletBtn').addEventListener('click', connectWallet);

// When “BEGIN PROTOCOL” is clicked, show game HUD and check HS
document.getElementById('beginProtocolBtn').addEventListener('click', () => {
  updateXp(0, 100);
  if (!connectedWallet) {
    alert("Please connect wallet first.");
    return;
  }
  document.getElementById('entranceScreen').classList.add('hidden');
  document.getElementById('gameScreen').classList.remove('hidden');

  // If HS is still 0, prompt with our HUD modal
  const hsVal = parseInt(document.getElementById('hs-value-2').textContent, 10);
  if (hsVal === 0) {
    document.getElementById('unlock-modal').style.display = 'flex';
  }
});

function updateXp(xpDelta) {
  const xpFill = document.getElementById('xp-fill');
  const xpText = document.getElementById('xp-text');
  if (!xpFill || !xpText) return;

  // 1) Read current percent (strip off the “%”)
  let current = parseFloat(xpFill.style.width) || 0;
  // 2) Add the new XP
  let next    = current + xpDelta;

  // 3) Level up when we cross 100%
  if (next >= 100) {
    // bump the rank
    const rankEl = document.getElementById('hud-rank');
    if (rankEl) {
      const m = rankEl.textContent.match(/Rank:\s*(\d+)/);
      if (m) {
        rankEl.textContent = `Rank: ${parseInt(m[1],10) + 1}`;
      }
    }
    // carry over any overflow
    next = next - 100;
  }

  // 4) Update the bar & text
  xpFill.style.width = next + '%';
  xpText.textContent = Math.round(next) + '%/100%';
}



// Mission control setup
const missionList = [
  { title: 'Social Engineering', desc: 'Attempting to gain valid credentials to infiltrate HQ.' },
  { title: 'Network Intrusion', desc: 'Bypassing firewalls to access secure data streams.' },
  { title: 'DDoS Attack', desc: 'Flooding target servers with traffic to overwhelm defenses.' },
  { title: 'Malware Deployment', desc: 'Installing stealth malware to exfiltrate data.' },
  { title: 'DNS Spoofing', desc: 'Redirecting domain requests to compromised endpoints.' }
];


// Initialize mission UI
function initMission() {
  const mc = document.getElementById('mission-control');
  const m = missionList[Math.floor(Math.random() * missionList.length)];
  mc.innerHTML = `
    <div class="mission-title">${m.title}</div>
    <div class="mission-desc">${m.desc}</div>
    <button class="hud-action mission-start">Start Mission</button>
  `;
  mc.querySelector('.mission-start').addEventListener('click', () => startMission(m));
}

// Start mission: setup timer and terminal log
async function startMission(mission) {
  // ─── BLOCK IF NO HS ─────────────────────────────────────────────
  const hsVal = parseInt(document.getElementById('hs-value-2').textContent, 10);
  if (hsVal === 0) {
    // show the unlock popup again
    document.getElementById('unlock-modal').style.display = 'flex';
    return;
  }

  // now they have HS ≥1, go ahead and deduct energy
  updateEnergy(5);
  const mc = document.getElementById('mission-control');
  mc.innerHTML = `
    <div id="mission-timer">60s</div>
    <div id="mission-terminal"></div>
  `;
  const timerEl = document.getElementById('mission-timer');
  const termEl = document.getElementById('mission-terminal');
  let remaining = 60;

  // Countdown timer
  const timerInterval = setInterval(() => {
    remaining--;
    timerEl.textContent = remaining + 's';
    if (remaining <= 0) {
      clearInterval(timerInterval);
    }
  }, 1000);

  // Initial CLI banner logs
  [
    `Connecting to ${mission.title.toLowerCase().replace(/ /g, '_')}...`,
    'Authentication successful.'
  ].forEach(line => {
    const p = document.createElement('div');
    p.textContent = line;
    termEl.appendChild(p);
  });

// scroll effect on terminal screen
  const logInterval = setInterval(() => {

if (remaining <= 0) {
  clearInterval(logInterval);
  initMission();

  // ─── MISSION COMPLETE: AWARD HS-BASED XP ─────────────────────────
  const now    = Date.now();
  let baseHs   = parseInt(document.getElementById('hs-value-2').textContent, 10);
  // include active booster
  if (now < skillSurgeExpiry) baseHs += 10;
  const xpPerHs = 0.5;               // % XP per HS
  const xpDelta = baseHs * xpPerHs; // total % to add
  updateXp(xpDelta);

  return;
}


  const cmd = commands[Math.floor(Math.random() * commands.length)];
  const p = document.createElement('div');
  p.textContent = cmd;
  termEl.appendChild(p);
  termEl.scrollTop = termEl.scrollHeight;

  // ─── SCROLL EFFECT: DROP TOP LINE WHEN OVERFLOW ─────────────────
  if (termEl.scrollHeight > termEl.clientHeight) {
    termEl.removeChild(termEl.firstChild);
  }
}, 1500);
}

// Kick off the first mission on load
document.addEventListener('DOMContentLoaded', initMission);

// ─── SHOP LOGIC ──────────────────────────────────────────────────
const shopModal        = document.getElementById('shop-modal');
const shopBtn          = document.getElementById('shopBtn');
const closeShopBtn     = document.getElementById('closeShopBtn');
const shopItemsContainer = document.getElementById('shop-items');

const shopItems = [
  {
    id: 'chronoShift',
    name: 'Chrono Shift',
    price: 10,
    description: 'Accelerate all missions by 25% for the next 1 hour.'
  },
  {
    id: 'skillSurge',
    name: 'Skill Surge',
    price: 10,
    description: 'Gain +10 HS for the next 1 hour.'
  }
];


function renderShopItems() {
  shopItemsContainer.innerHTML = '';
  shopItems.forEach(item => {
    const div = document.createElement('div');
    div.className = 'shop-item';
    div.innerHTML = `
      <h3>${item.name} — ${item.price} PLAI</h3>
      <p>${item.description}</p>
      <button class="hud-action buy-btn" data-id="${item.id}">Buy</button>
    `;
    shopItemsContainer.appendChild(div);
  });
// ─── BOOSTER EXPIRY TRACKERS ─────────────────────────────────────
let chronoShiftExpiry = 0;
let skillSurgeExpiry  = 0;

// …inside renderShopItems()…  
document.querySelectorAll('.buy-btn').forEach(btn =>
  btn.addEventListener('click', async () => {
    const id   = btn.dataset.id;
    const item = shopItems.find(i => i.id === id);

    if (!connectedWallet) {
      shopErrorEl.textContent = 'Please connect your wallet first.';
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer   = provider.getSigner();
    const token    = new ethers.Contract(PLAI_ADDRESS, PLAI_ABI, signer);
    const price    = ethers.utils.parseUnits(item.price.toString(), 6);

    try {
      const bal = await token.balanceOf(connectedWallet);

      // ← ← ← HERE is your “Insufficient PLAI” check
      if (bal.lt(price)) {
        shopErrorEl.textContent =
          `Insufficient PLAI. You need ${item.price} PLAI to buy ${item.name}.`;
        return;
      }

      const tx = await token.transfer(TREASURY_ADDRESS, price);
      await tx.wait();

      // record a 1-hour window
      const now = Date.now();
      if (id === 'chronoShift') {
        chronoShiftExpiry = now + 3600 * 1000;
      } else {
        skillSurgeExpiry = now + 3600 * 1000;
      }

      // on success, clear error & close
      shopErrorEl.textContent = '';
      shopModal.style.display  = 'none';

    } catch (err) {
      console.error(err);
      shopErrorEl.textContent = 'Purchase failed. Please try again.';
    }
  })
);

}

shopBtn.addEventListener('click', () => {
  shopErrorEl.textContent = '';      // clear any old error
  renderShopItems();
  shopModal.style.display = 'flex';
});

closeShopBtn.addEventListener('click', () => {
  shopModal.style.display = 'none';
});

// ─── UNLOCK HS MODAL HANDLERS (simple bind) ───────────────────────
const unlockModal      = document.getElementById('unlock-modal');
const unlockErrorEl    = document.getElementById('unlock-error');
const unlockConfirmBtn = document.getElementById('unlockConfirmBtn');
const unlockCancelBtn  = document.getElementById('unlockCancelBtn');
const shopErrorEl = document.getElementById('shop-error');

unlockConfirmBtn.addEventListener('click', async () => {
  console.log('Unlock button clicked');
  unlockErrorEl.textContent = '';   // clear previous

  if (!connectedWallet) {
    unlockErrorEl.textContent = 'Please connect your wallet first.';
    return;
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer   = provider.getSigner();
  const token    = new ethers.Contract(PLAI_ADDRESS, PLAI_ABI, signer);
  const price    = ethers.utils.parseUnits('5', 6);

  try {
    const rawBal = await token.balanceOf(connectedWallet);
    if (rawBal.lt(price)) {
      unlockErrorEl.textContent = 'Insufficient PLAI. You need at least 5 PLAI.';
      return;
    }
    const tx = await token.transfer(TREASURY_ADDRESS, price);
    await tx.wait();

    // on success
    document.getElementById('hs-value-2').textContent = '1';
    unlockModal.style.display = 'none';
  } catch (err) {
    console.error(err);
    unlockErrorEl.textContent = 'Purchase failed or was rejected. Please try again.';
  }
});

unlockCancelBtn.addEventListener('click', () => {
  unlockErrorEl.textContent = '';
  unlockModal.style.display = 'none';
});

