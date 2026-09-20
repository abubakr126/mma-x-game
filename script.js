const startBtn = document.getElementById("startBtn");
const gameArea = document.getElementById("gameArea");
const punchBtn = document.getElementById("punchBtn");
const kickBtn = document.getElementById("kickBtn");
const healthText = document.getElementById("health");
const message = document.getElementById("message");

let health = 100;

startBtn.addEventListener("click", () => {
  health = 100;
  healthText.textContent = health;
  message.textContent = "Fight started! 🥊";
  gameArea.style.display = "block";
});

function attack(damage, move) {
  health -= damage;

  if (health < 0) {
    health = 0;
  }

  healthText.textContent = health;
  message.textContent = `${move}! Opponent health: ${health}`;

  if (health === 0) {
    message.textContent = "You win! 🏆";
  }
}

punchBtn.addEventListener("click", () => {
  if (health > 0) {
    attack(10, "PUNCH");
  }
});

kickBtn.addEventListener("click", () => {
  if (health > 0) {
    attack(15, "KICK");
  }
});
