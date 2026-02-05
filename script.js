let game = {
  health: 100,
  energy: 100,
  thirst: 100,
  day: true,
  location: "Wreck",
  carRepair: 0,
  inventory: {
    wood: 0,
    water: 0,
    metal: 0,
    meat: 0,
    bandage: 0,
    weapon: 0
  }
};

function updateUI() {
  health.textContent = game.health;
  energy.textContent = game.energy;
  thirst.textContent = game.thirst;
  location.textContent = game.location;
  time.textContent = game.day ? "DAY" : "NIGHT";

  document.body.className = game.day ? "" : "night";

  inventory.innerHTML = "";
  for (let i in game.inventory) {
    if (game.inventory[i] > 0) {
      let li = document.createElement("li");
      li.textContent = `${i.toUpperCase()}: ${game.inventory[i]}`;
      inventory.appendChild(li);
    }
  }

  if (game.thirst <= 0) game.health -= 4;
  if (game.health <= 0) endGame("YOU DIED IN THE FOREST");
  if (game.carRepair >= 100) endGame("YOU ESCAPED");
}

function logMsg(text, danger=false) {
  log.textContent = text;
  (danger ? dangerSound : clickSound).play();
}

function move(place) {
  if (game.energy < 5) return logMsg("TOO TIRED");
  game.energy -= 5;
  game.location = place;
  tick();
}

function gather() {
  if (game.energy < 10) return logMsg("NO ENERGY");
  game.energy -= 10;
  game.thirst -= 5;

  if (game.location === "Forest") game.inventory.wood++;
  if (game.location === "River") game.inventory.water++;
  if (game.location === "Clearing") game.inventory.metal++;

  logMsg("YOU GATHER RESOURCES");
  tick();
}

function hunt() {
  if (game.energy < 15) return logMsg("TOO WEAK");
  game.energy -= 15;
  game.thirst -= 10;

  if (game.inventory.weapon || Math.random() > 0.5) {
    game.inventory.meat++;
    logMsg("HUNT SUCCESS");
  } else {
    game.health -= 15;
    logMsg("YOU WERE INJURED", true);
  }
  tick();
}

function rest() {
  game.energy += 25;
  game.health += 10;
  game.thirst -= 10;
  logMsg("YOU REST");
  tick();
}

function craft(item) {
  if (item === "bandage" && game.inventory.wood >= 1) {
    game.inventory.wood--;
    game.health += 15;
    logMsg("BANDAGE USED");
  }
  else if (item === "weapon" && game.inventory.wood >= 2 && game.inventory.metal >= 1) {
    game.inventory.wood -= 2;
    game.inventory.metal--;
    game.inventory.weapon++;
    logMsg("WEAPON CRAFTED");
  }
  else if (item === "repair" && game.location === "Wreck" && game.inventory.metal >= 2) {
    game.inventory.metal -= 2;
    game.carRepair += 25;
    logMsg(`CAR ${game.carRepair}% FIXED`);
  }
  else logMsg("NOT ENOUGH ITEMS");

  updateUI();
}

function tick() {
  game.day = !game.day;

  if (!game.day && Math.random() < 0.4) {
    game.health -= 20;
    logMsg("SOMETHING ATTACKS", true);
  }

  updateUI();
}

function saveGame() {
  localStorage.setItem("pixelRoadtrip", JSON.stringify(game));
  logMsg("GAME SAVED");
}

function loadGame() {
  let save = localStorage.getItem("pixelRoadtrip");
  if (!save) return logMsg("NO SAVE FOUND");
  game = JSON.parse(save);
  logMsg("GAME LOADED");
  updateUI();
}

function endGame(text) {
  logMsg(text, true);
  document.querySelectorAll("button").forEach(b => b.disabled = true);
}

updateUI();
