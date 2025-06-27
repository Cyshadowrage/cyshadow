// Matrix animation for entrance background
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const letters = '01';
const fontSize = 14;
const columns = canvas.width / fontSize;
const drops = Array(Math.floor(columns)).fill(1);

function drawMatrix() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#00BDEB';
  ctx.font = fontSize + 'px monospace';
  for (let i = 0; i < drops.length; i++) {
    const text = letters[Math.floor(Math.random() * letters.length)];
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);
    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }
}
setInterval(drawMatrix, 33);

// Wallet connection
const connectBtn = document.getElementById("connectWalletBtn");
const beginProtocolBtn = document.getElementById("beginProtocolBtn");
let userWallet = null;

connectBtn.onclick = async () => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      userWallet = accounts[0];
      connectBtn.classList.add("hidden");
      beginProtocolBtn.classList.remove("hidden");
    } catch (err) {
      alert("Wallet connection failed.");
    }
  } else {
    alert("MetaMask is not installed.");
  }
};

beginProtocolBtn.onclick = () => {
  document.getElementById("entranceScreen").classList.add("hidden");
  document.getElementById("gameScreen").classList.remove("hidden");
};

// Game logic
let hs = 10;
let energy = 1000;
let xp = 0;

const missionStatus = document.getElementById("missionStatus");
const hsValue = document.getElementById("hsValue");
const energyValue = document.getElementById("energyValue");
const plaiValue = document.getElementById("plaiValue");
const rankValue = document.getElementById("rankValue");

hsValue.textContent = hs;
energyValue.textContent = energy;
rankValue.textContent = `${xp.toFixed(2)}%`;

function updateXP(amount) {
  xp += amount;
  if (xp > 100) xp = 100;
  rankValue.textContent = `${xp.toFixed(2)}%`;
}

function updateEnergy(amount) {
  energy -= amount;
  if (energy < 0) energy = 0;
  energyValue.textContent = energy;
}

function startMission(mission) {
  if (document.querySelector('.progress-box')) return;
  const missionData = {
    1: { energy: 5, time: 2, xpS: 0.5, xpF: 0.25, hsReq: 20 },
    2: { energy: 8, time: 4, xpS: 0.75, xpF: 0.37, hsReq: 30 },
    3: { energy: 12, time: 6, xpS: 1.0, xpF: 0.5, hsReq: 40 },
  }[mission];

  if (energy < missionData.energy) {
    alert("Not enough energy.");
    return;
  }

  document.querySelector(".missions-container").classList.add("hidden");
  missionStatus.textContent = `Running Mission ${mission}`;
  updateEnergy(missionData.energy);

  const progressBox = document.createElement("div");
  progressBox.className = "progress-box";
  progressBox.style.cssText = "color:#00BDEB; padding:20px; border:2px solid #00BDEB; border-radius:8px; margin-top:20px; text-align:center; width:100%;";
  progressBox.innerHTML = `
    <div><strong>Running...</strong></div>
    <div id="missionTimer">${missionData.time * 60}</div>
    <div><em>Executing hack protocol</em></div>
  `;

  document.querySelector(".hud-overlay").appendChild(progressBox);

  let seconds = missionData.time * 60;
  const timer = setInterval(() => {
    seconds--;
    document.getElementById("missionTimer").textContent = seconds;
    if (seconds <= 0) {
      clearInterval(timer);
      progressBox.remove();
      document.querySelector(".missions-container").classList.remove("hidden");
      const success = hs >= missionData.hsReq;
      updateXP(success ? missionData.xpS : missionData.xpF);
      missionStatus.textContent = `Mission ${mission} ${success ? 'Succeeded' : 'Failed'}`;
    }
  }, 1000);
}

function toggleMenu() {
  const menu = document.getElementById("menu");
  menu.classList.toggle("hidden");
}
