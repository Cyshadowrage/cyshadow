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
  if (!connectedWallet) {
    alert("Please connect wallet first.");
    return;
  }
  document.getElementById('entranceScreen').classList.add('hidden');
  document.getElementById('gameScreen').classList.remove('hidden');
});
