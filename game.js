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
    await window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: baseChainId }] });

  } catch (err) {
    console.error(err);
    alert("Failed to connect or switch network.");
  }
}

document.getElementById('connectWalletBtn').addEventListener('click', connectWallet);

document.getElementById('beginProtocolBtn').addEventListener('click', () => {
  updateXp(0, 100);
  if (!connectedWallet) {
    alert("Please connect wallet first.");
    return;
  }
  document.getElementById('entranceScreen').classList.add('hidden');
  document.getElementById('gameScreen').classList.remove('hidden');
});


// Update XP pill fill and text
function updateXp(currentPercent, maxPercent) {
  const xpFill = document.getElementById('xp-fill');
  const xpText = document.getElementById('xp-text');
  if (xpFill && xpText) {
    const percent = Math.round((currentPercent / maxPercent) * 100);
    xpFill.style.width = percent + '%';
    xpText.textContent = percent + '%/' + maxPercent + '%';
  }
}

// Mission control setup
const missionList = [
  { title: 'Social Engineering', desc: 'Attempting to gain valid credentials to infiltrate HQ.' },
  { title: 'Network Intrusion', desc: 'Bypassing firewalls to access secure data streams.' },
  { title: 'DDoS Attack', desc: 'Flooding target servers with traffic to overwhelm defenses.' },
  { title: 'Malware Deployment', desc: 'Installing stealth malware to exfiltrate data.' },
  { title: 'DNS Spoofing', desc: 'Redirecting domain requests to compromised endpoints.' }
];

function initMission() {
  const mc = document.getElementById('mission-control');
  const m = missionList[Math.floor(Math.random() * missionList.length)];
  mc.innerHTML = `
    <div class="mission-title">${m.title}</div>
    <div class="mission-desc">${m.desc}</div>
    <div class="mission-start">Start Mission</div>
  `;
  mc.querySelector('.mission-start').addEventListener('click', startMission);
}

function startMission() {
  const mc = document.getElementById('mission-control');
  mc.innerHTML = '<canvas id="missionCanvas"></canvas>';
  // Simple terminal animation
  const canvas = document.getElementById('missionCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = mc.clientWidth;
  canvas.height = mc.clientHeight;
  let elapsed = 0;
  const interval = 200;
  const timer = setInterval(() => {
    const cmd = commands[Math.floor(Math.random() * commands.length)];
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    ctx.font = '16px monospace';
    ctx.fillStyle = '#00BDEB';
    ctx.fillText(cmd, x, y);
    elapsed += interval;
    if (elapsed >= 60000) {
      clearInterval(timer);
      initMission();
      updateXp( Math.min(100, elapsed / 600), 100);
    }
  }, interval);
}

// Initialize mission on load
document.addEventListener('DOMContentLoaded', initMission);


// Initialize mission UI
function initMission() {
  const mc = document.getElementById('mission-control');
  const m = missionList[Math.floor(Math.random() * missionList.length)];
  mc.innerHTML = `
    <div class="mission-title">${m.title}</div>
    <div class="mission-desc">${m.desc}</div>
    <div class="mission-start">Start Mission</div>
  `;
  mc.querySelector('.mission-start').addEventListener('click', () => startMission(m));
}

// Start mission: setup timer and terminal log
function startMission(mission) {
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

  // Terminal logs related to mission
  const logs = [
    `Connecting to ${mission.title.toLowerCase().replace(/ /g, '_')}...`,
    'Authentication successful.',
    `${mission.title} sequence initiated.`,
    'Bypassing security protocols...',
    'Elevating privileges...',
    'Injecting payload...',
    'Monitoring system response...',
    'Extracting sensitive data...',
    'Logging activity...',
    'Terminating session.'
  ];
  let logIndex = 0;

  // Log interval
  const logInterval = setInterval(() => {
    const line = logs[logIndex];
    const p = document.createElement('div');
    p.textContent = line;
    termEl.appendChild(p);
    termEl.scrollTop = termEl.scrollHeight;
    logIndex = (logIndex + 1) % logs.length;
    if (remaining <= 0) {
      clearInterval(logInterval);
      initMission();
      updateXp(Math.min(100, (60 - remaining) / 60 * 100), 100);
    }
  }, 1500);
}

// Kick off the first mission on load
document.addEventListener('DOMContentLoaded', initMission);
