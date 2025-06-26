// FULL game.js — entrance screen animation + game logic

const missionSubtitles = [
  "Bypassing security gate at NexCorp HQ...",
  "Extracting credentials from zero-day logs...",
  "Hacking elevator firmware...",
  "Fooling receptionist AI...",
  "Social graph manipulation..."
];

let hs = 100;
let energy = 1000;
let rank = 0;
let missionActive = false;
let flashes = [];
let redFlashes = [];

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
      ctx.fillStyle = '#00ffff';
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
    flashes.push({
      text: cmd,
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      age: 0,
      maxAge: 50 + Math.random() * 30
    });
  }, 1500);

  setInterval(() => {
    const alert = redAlerts[Math.floor(Math.random() * redAlerts.length)];
    redFlashes.push({
      text: alert,
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      age: 0,
      maxAge: 70 + Math.random() * 40
    });
  }, 4000);

  setInterval(draw, 200);

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

drawAmbientBackground();

function openMissionPanel() {
  if (missionActive) return alert("Mission in progress!");
  const sub = missionSubtitles[Math.floor(Math.random() * missionSubtitles.length)];
  document.getElementById("subtitle1").textContent = sub;
  document.getElementById("missionPanel").classList.remove("hidden");
}

function closeMissionPanel() {
  document.getElementById("missionPanel").classList.add("hidden");
}

function startMission(missionId) {
  if (missionActive) return;

  const missions = {
    1: { time: 2, energyCost: 5, failXP: 0.05, successXP: 0.25 },
    2: { time: 4, energyCost: 8, failXP: 0.10, successXP: 0.50 },
    3: { time: 6, energyCost: 12, failXP: 0.15, successXP: 0.75 },
  };

  const m = missions[missionId];
  if (energy < m.energyCost) {
    alert("Not enough energy!");
    return;
  }

  energy -= m.energyCost;
  document.getElementById("energyValue").textContent = energy;
  document.getElementById("missionStatus").textContent = "In Progress...";
  missionActive = true;
  closeMissionPanel();

  setTimeout(() => {
    const successChance = Math.min(1, hs / 150);
    const success = Math.random() < successChance;
    const gained = success ? m.successXP : m.failXP;
    rank += gained;
    document.getElementById("rankValue").textContent = `${rank.toFixed(2)}%`;
    document.getElementById("missionStatus").textContent = success ? "✅ Mission Success!" : "❌ Mission Failed";
    missionActive = false;
  }, m.time * 1000);
}

// Entrance Flow Controls
const connectBtn = document.getElementById('connectWalletBtn');
const startBtn = document.getElementById('beginProtocolBtn');
if (connectBtn && startBtn) {
  connectBtn.addEventListener('click', () => {
    connectBtn.classList.add('hidden');
    startBtn.classList.remove('hidden');
  });

  startBtn.addEventListener('click', () => {
    document.getElementById('entranceScreen').classList.add('hidden');
    document.getElementById('gameScreen').classList.remove('hidden');
  });
}
