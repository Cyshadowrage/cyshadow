
let currentMission = null;
let timerInterval = null;
let energy = 1000;
let xp = 0;
let hs = 10;

document.getElementById("connectWalletBtn").addEventListener("click", async () => {
  if (typeof window.ethereum === "undefined") {
    alert("MetaMask not installed");
    return;
  }

  try {
    await window.ethereum.request({ method: "eth_requestAccounts" });

    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    const baseChainId = "0x2105";

    if (chainId !== baseChainId) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: baseChainId }],
        });
      } catch (switchError) {
        alert("Please switch to Base manually.");
        return;
      }
    }

    document.getElementById("beginProtocolBtn").classList.remove("hidden");
  } catch (err) {
    console.error(err);
    alert("Connection failed");
  }
});

document.getElementById("beginProtocolBtn").addEventListener("click", () => {
  document.getElementById("entranceScreen").classList.add("hidden");
  document.getElementById("gameScreen").classList.remove("hidden");
  updateHUD();
});

function updateHUD() {
  document.getElementById("energyValue").textContent = energy;
  document.getElementById("rankValue").textContent = xp.toFixed(2) + "%";
  document.getElementById("hsValue").textContent = hs;
}

function startMission(id) {
  if (currentMission) return;
  currentMission = id;

  const energyCost = [0, 5, 8, 12][id];
  const successXP = [0, 0.5, 0.75, 1.0][id];
  const failXP = [0, 0.25, 0.37, 0.5][id];
  const requiredHS = [0, 20, 30, 40][id];
  const duration = [0, 120, 240, 360][id];

  if (energy < energyCost) {
    alert("Not enough energy!");
    currentMission = null;
    return;
  }

  energy -= energyCost;
  updateHUD();

  document.querySelector(".missions-container").classList.add("hidden");
  const progressBox = document.getElementById("missionProgress");
  progressBox.classList.add("active");
  document.getElementById("missionStatus").innerText = "Running Mission " + id;

  let timeLeft = duration;
  const timerDisplay = document.getElementById("missionTimer");

  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      document.getElementById("missionStatus").innerText = "Complete";

      const success = hs >= requiredHS;
      xp += success ? successXP : failXP;
      updateHUD();

      timerDisplay.textContent = success ? "Mission Success!" : "Mission Failed!";
      setTimeout(() => {
        document.querySelector(".missions-container").classList.remove("hidden");
        progressBox.classList.remove("active");
        currentMission = null;
      }, 3000);
    } else {
      const mins = Math.floor(timeLeft / 60).toString().padStart(2, "0");
      const secs = (timeLeft % 60).toString().padStart(2, "0");
      timerDisplay.textContent = `${mins}:${secs}`;
      timeLeft--;
    }
  }, 1000);
}

function toggleMenu() {
  document.getElementById("gameMenu").classList.toggle("hidden");
}
