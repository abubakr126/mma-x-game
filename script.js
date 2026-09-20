const startBtn = document.getElementById("startBtn");
const gameArea = document.getElementById("gameArea");

const punchBtn = document.getElementById("punchBtn");
const kickBtn = document.getElementById("kickBtn");

const playerHealthText = document.getElementById("playerHealth");
const opponentHealthText = document.getElementById("opponentHealth");

const playerHealthBar = document.getElementById("playerHealthBar");
const opponentHealthBar = document.getElementById("opponentHealthBar");

const player = document.getElementById("player");
const opponent = document.getElementById("opponent");

const message = document.getElementById("message");

let playerHealth = 100;
let opponentHealth = 100;

startBtn.addEventListener("click", () => {
  playerHealth = 100;
  opponentHealth = 100;

  playerHealthText.textContent = playerHealth;
  opponentHealthText.textContent = opponentHealth;

  playerHealthBar.style.width = "100%";
  opponentHealthBar.style.width = "100%";

  message.textContent = "FIGHT! 🥊";

  gameArea.style.display = "block";
});

function attack(damage, move) {
  if (opponentHealth <= 0) return;

  opponentHealth -= damage;

  if (opponentHealth < 0) {
    opponentHealth = 0;
  }

  opponentHealthText.textContent = opponentHealth;
  opponentHealthBar.style.width = opponentHealth + "%";

  message.textContent = move + "! 💥";

  opponent.classList.remove("hit");
  void opponent.offsetWidth;
  opponent.classList.add("hit");

  if (opponentHealth === 0) {
    message.textContent = "YOU WIN! 🏆";
  }
}

punchBtn.addEventListener("click", () => {
  attack(10, "PUNCH");
});

kickBtn.addEventListener("click", () => {
  attack(15, "KICK");
});