let screen__content = document.querySelector(".interface__screen__content");

let errors__content = document.querySelector(".interface__errors");
let input = document.querySelector(".interface__input");
let button = document.querySelector(".interface__button");
let clear = document.querySelector(".interface__clear");

let player__health = document.querySelector(".healthbar__player__number");
let enemy__health = document.querySelector(".healthbar__enemy__number");

let button__attack = document.querySelector(".interface__buttons__attack");

import globalFunctions from "./modules/globalFunctions.js";
const {
    processPlayerCommand,
    commandError,
    commandPrint,
    clearScreen,
    rollDice,
    attackColor,
    attackString,
    calculateDamage,
} = globalFunctions;

// This makes easier the prints from main.js
function print(argument) {
    commandPrint(argument, screen__content);
}

function printColor(argument, color) {
    commandPrint(`<span class="${color}"> ${argument} </span>`, screen__content);
}

import { Human, Enemy } from "./modules/classes.js";

button.addEventListener("click", e => {
    e.preventDefault();
    let entry = input.value;
    input.value = "";
    console.log(`entry: ${entry}`);
    processPlayerCommand(player, enemy, entry, screen__content, errors__content, startGame);
});

clear.addEventListener("click", e => {
    e.preventDefault();
    clearScreen(screen__content);
});

button__attack.addEventListener("click", e => {
    e.preventDefault();
    player.attack("enemy", player, enemy);
});

let player = new Human("Razmuth");
console.log(player);
player.setDomElements(player__health, screen__content, errors__content);
player.setFunctions(commandPrint, commandError, calculateDamage);
player.setHealth();

let enemy = new Enemy("Skeleton", 10, 10, 1, 1, 1, 1);
console.log(enemy);
enemy.setDomElements(enemy__health, screen__content);
enemy.setFunctions(commandPrint, commandError, calculateDamage);
enemy.setHealth();

// START OF GAME
print(`
    Welcome, dear warrior. type <span class="yellow">help</span> to see your available commands.
    For developing reasons, your player name is <span class="${player.color}">${player.name}</span>. <br><br>`);

setTimeout(() => {
    print(" Año 1233 de la Tierra Media, Calabozo subterraneo, Minas de Moria.<br>");
}, 2000);

setTimeout(() => {
    print("se escuchan pasos...");
}, 4000);

function startGame() {
    setTimeout(() => {
        enemy.say("...");
    }, 2000);

    setTimeout(() => {
        enemy.say("...hmm??");
    }, 5000);

    setTimeout(() => {
        enemy.do("*abre la compuerta del calabozo bruscamente*");
    }, 8000);

    setTimeout(() => {
        enemy.say("TE VOY A HACER CAGAR, HIJO DE PUTAAA!!");
    }, 10500);

    setTimeout(() => {
        enemy.do("*Ataca con su espada embrujada por el señor oscuro*");
    }, 13500);

    setTimeout(() => {
        enemy.attack("player", player, enemy);
    }, 15000);
}
 

