let screen__content = document.querySelector(".interface__screen__content");
// let input__container = document.querySelector(".interface__input__container");

let errors__content = document.querySelector(".interface__errors");
let input = document.querySelector(".interface__input");
let button = document.querySelector(".interface__button");
let clear = document.querySelector(".interface__clear");

let player__health = document.querySelector(".healthbar__player__number");
let enemy__health = document.querySelector(".healthbar__enemy__number");

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

import { Human, Enemy } from "./modules/classes.js";

button.addEventListener("click", e => {
    e.preventDefault();
    let entry = input.value;
    input.value = "";
    console.log(`entry: ${entry}`);
    processPlayerCommand(player, enemy, entry, screen__content, errors__content);
});

clear.addEventListener("click", e => {
    e.preventDefault();
    clearScreen(screen__content);
});

let player = new Human("Razmuth");
console.log(player);
player.setDomElements(player__health, screen__content, errors__content);
player.setFunctions(commandPrint, commandError, calculateDamage);
player.setHealth();

let enemy = new Enemy("Skeleton", 10, 10, 1, 1, 1, 1);
console.log(enemy);
enemy.setDomElements(enemy__health, screen__content);
enemy.setFunctions(commandPrint, commandError, calculateDamage)
enemy.setHealth();


player.say('Vas a cagar fuego');
player.attack('enemy', player, enemy);

enemy.say('Ahora te toca a vos gil')
enemy.attack('player', player, enemy);
