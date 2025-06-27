// game.js – Cyshadow Full Logic

let hs = 10;
let energy = 1000;
let xp = 0;
let missionTimer;
let missionRunning = false;
const missions = [
  { id: 1, name: "Social Engineering", cost: 5, time: 2, xpSuccess: 0.5, xpFail: 0.25, hsRequired: 20 },
  { id: 2, name: "Data Breach", cost: 8, time: 4, xpSuccess: 0.75, xpFail: 0.37, hsRequired: 30 },
  { id: 3, name: "System Override", cost: 12, time: 6, xpSuccess: 1.0, xpFail: 0.5, hsRequired: 40 }
];

const hsSpan = document.getElementById("hsValue");
const energySpan = document.getElementById("energyValue");
const rankSpan = document.getElementById("rankValue");
const statusSpan = document.getElementById("missionStatus");
const missionsContainer = document.getElementById("missionsContainer");
const missionProgress = document.getElementById("missionProgress");
const missionTimerEl = document.getElementById("missionTimer");

function updateHUD() {
  hsSpan.textContent = hs;
  energySpan.textContent = energy;
  rankSpan.textContent = `${xp.toFixed(2)}%`;
}

function injectMissions() {
  missionsContainer.innerHTML = "";
  missions.forEach(m => {
    const box = document.createElement("div");
    box.className = "mission-box";
    box.innerHTML = `
      <strong>${m.name}</strong><br>
      Energy: ${m.cost}<br>
      Time: ${m.time} min<br>
      XP: S ${m.xpSuccess}% / F ${m.xpFail}%<br>
      <div class='start-label'>[ Click to Start ]</div>
    `;
    box.onclick = () => startMission(m);
    missionsContainer.appendChild(box);
  });
}

function startMission(m) {
  if (missionRunning || energy < m.cost) return;
  missionRunning = true;
  energy -= m.cost;
  updateHUD();
  statusSpan.textContent = `Running ${m.name}`;
  missionsContainer.classList.add("hidden");
  missionProgress.classList.remove("hidden");

  let seconds = m.time * 60;
  missionTimerEl.textContent = formatTime(seconds);

  missionTimer = setInterval(() => {
    seconds--;
    missionTimerEl.textContent = formatTime(seconds);
    if (seconds <= 0) {
      clearInterval(missionTimer);
      const success = hs >= m.hsRequired;
      xp += success ? m.xpSuccess : m.xpFail;
      statusSpan.textContent = `Mission ${success ? "Success" : "Failed"}`;
      missionProgress.classList.add("hidden");
      missionsContainer.classList.remove("hidden");
      updateHUD();
      missionRunning = false;
    }
  }, 1000);
}

function formatTime(s) {
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const sec = (s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}

function toggleMenu() {
  document.getElementById("gameMenu").classList.toggle("hidden");
}

// Wallet connection
const connectWalletBtn = document.getElementById("connectWalletBtn");
const beginProtocolBtn = document.getElementById("beginProtocolBtn");

connectWalletBtn.addEventListener("click", async () => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      connectWalletBtn.classList.add("hidden");
      beginProtocolBtn.classList.remove("hidden");
    } catch (e) {
      alert("Wallet connection failed.");
    }
  } else {
    alert("MetaMask is not installed.");
  }
});

beginProtocolBtn.addEventListener("click", () => {
  document.getElementById("entranceScreen").classList.add("hidden");
  document.getElementById("gameScreen").classList.remove("hidden");
  injectMissions();
  updateHUD();
});

// Initialize
updateHUD();
