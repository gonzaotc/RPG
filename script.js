let screen__content = document.querySelector(".interface__screen__content");
let input__container = document.querySelector(".interface__input__container");

let errors__content = document.querySelector(".interface__errors");
let input = document.querySelector(".interface__input");
let button = document.querySelector(".interface__button");
let clear = document.querySelector(".interface__clear");

let player__health = document.querySelector(".healthbar__player__number");

let enemy__health = document.querySelector(".healthbar__enemy__number");

function processCommand(entry) {
    entry = entry.split(" ");
    let command = entry[0];
    let action = entry.slice(1).join(" ");

    if (command === "clear") {
        return clearScreen();
    }
    if (command === "help") {
        return commandPrint(player.help());
    }
    if (command === "stats") {
        return commandPrint(player.stats());
    }
    if (command === "say") {
        return commandPrint(player.say(action));
    }
    if (command === "attack") {
        return commandPrint(player.attack(entry[1]));
    }

    return commandError(`"${command}" no es un comando válido.`);
}

function commandError(errorText) {
    let error = document.createElement("p");
    error.classList.add("interface__error");
    // error.classList.add("interface__error--show");
    // error.classList.remove("interface__error--show");
    error.innerText = errorText;

    let errors = errors__content.children;
    if (errors.length > 0) {
        for (let i = 0; i < errors.length; i++) {
            errors[i].classList.add("hide");
        }
    }

    errors__content.appendChild(error);
    setTimeout(() => {
        errors__content.removeChild(error);
    }, 4000);
}

function commandPrint(result) {
    let text = document.createElement("p");
    text.innerHTML = result;
    screen__content.appendChild(text);
    if (screen__content.children.length > 10) {
        screen__content.removeChild(screen__content.children[0]);
    }
}

function clearScreen() {
    let entrys = screen__content.children;
    while (entrys.length > 0) {
        screen__content.removeChild(entrys[0]);
    }
    commandError(`Cleaned history`);
}

button.addEventListener("click", e => {
    e.preventDefault();
    let entry = input.value;
    input.value = "";
    console.log(`entry: ${entry}`);
    processCommand(entry);
});

clear.addEventListener("click", e => {
    e.preventDefault();
    clearScreen();
});

function rollDice(size) {
    return Math.round(Math.random() * size);
}

function attackColor(number) {
    let textColor;
    if (number < 5) textColor = "grey";
    if (number >= 5) textColor = "green";
    if (number >= 13) textColor = "yellow";
    if (number >= 17) textColor = "orange";
    if (number >= 19) textColor = "purple";

    // if (number === 1) dice = "[. ]";
    // if (number === 2) dice = "[ : ]";
    // if (number === 3) dice = "[. :]";
    // if (number === 4) dice = "[: :]";
    // if (number === 5) dice = "[::.]";
    // if (number === 6) dice = "[:::]";
    // if (number === 7) dice = "[:::] [ . ]";
    // if (number === 8) dice = "[:::] [ : ]";
    // if (number === 9) dice = "[:::] [: .]";
    // if (number === 10) dice = "[:::] [: :]";
    // if (number === 11) dice = "[:::] [::.]";
    // if (number === 12) dice = "[:::] [:::]";
    // if (number === 13) dice = "[:::] [:::] [ . ]";
    // if (number === 14) dice = "[:::] [:::] [ : ]";
    // if (number === 15) dice = "[:::] [:::] [: .]]";
    // if (number === 16) dice = "[:::] [:::] [: :]";
    // if (number === 17) dice = "[:::] [:::] [::.]";
    // if (number === 18) dice = "[:::] [:::] [:::]";
    // if (number === 19) dice = "[:::] [:::] [:::] [ . ]";
    // if (number === 19) dice = "[:::] [:::] [:::] [ : ]";

    return `<span class="attack__number ${textColor}"><b>${number}</b></span>`;
}

function attackString(atribute, attacker, defender, attackDice, defenseDice) {
    return `<span class="${attacker}">${attacker.name}</span> [${attackColor(attackDice)}]+${attackColor(
        attacker[atribute]
    )} attacks
            <span class="${defender}">${defender.name}</span> [${attackColor(defenseDice)}]+${attackColor(
        defender.dex
    )} `;
}

function calculateDamage(atribute, attacker, defender) {
    // El roll es de 0 a 20, más el atributo del ataque.
    // Si saca 15 natural y tiene 5 de fuerza => 20.
    let attackDice = rollDice(20);
    let attack = attackDice + attacker[atribute];

    // El roll de defensa tambien es de 0 a 20 más la destreza.
    let defenseDice = rollDice(20);
    let defense = defenseDice + defender.dex;

    // Intento de ataque.
    let hit = attack - defense;

    let damage = Math.round(hit / 3 + attacker[atribute] - defender.def);

    console.log(`hit: ${hit}`);

    // Si el dado es cero natural, se hace daño a si mismo.
    if (attackDice === 0) {
        attacker.setHealth(attacker.health - 1);
        return `${attackString(atribute, attacker, defender, attackDice, defenseDice)} \n 
        Fail... sword dropped in foot`;
    }
    // Si el dado es 20 natural, golpea si o si y es critico.
    if (attackDice === 20 && defenseDice !== 20) {
        damage = damage * 1.5;
        attacker.setHealth(attacker.health - damage);
        return `${attackString(atribute, attacker, defender, attackDice, defenseDice)} <br> 
        <span class="yellow">CRITICAL HIT!</span> \n
        ${damage} damage produced to ${defender.name}`;
    }
    if (attackDice === 20 && defenseDice == 20) {
        damage = damage * 1.5;
        attacker.setHealth(attacker.health - damage);
        return `${attackString(atribute, attacker, defender, attackDice, defenseDice)} <br> 
        <span class="yellow">Critical!</span> , <span class="purple">Perfect defense!<br>
        ${damage} damage produced to ${defender.name}`;
    }
    // Si el hit es menor a 10 o la def saca 20 natural => contra ataque
    if (defenseDice === 20 || -10 >= hit) {
        console.log("Counter attacked");
        if (defenseDice === 20) {
            return `${attackString(atribute, attacker, defender, attackDice, defenseDice)} <br>
         <span class="purple">Perfect defense!</span> Counter Attacked! <br>
         ${calculateDamage(atribute, defender, attacker)}`;
        } else
            return `${attackString(atribute, attacker, defender, attackDice, defenseDice)} <br>
         Counter Attacked! <br>
         ${calculateDamage(atribute, defender, attacker)}`;
    }
    // Si gana el atacante  => se produce daño
    if (hit > 0) {
        defender.setHealth(defender.health - damage);
        return `${attackString(atribute, attacker, defender, attackDice, defenseDice)} <br>
        ${damage} damage produced to ${defender.name}`;
    }
    // Si el hit es menor a cero, se esquiva el ataque.
    if (0 >= hit && hit > -10) {
        console.log("Missed");
        return `${attackString(atribute, attacker, defender, attackDice, defenseDice)} <br>
        Missed..  `;
    }
}

class Human {
    constructor(name) {
        this.name = name;
        this.maxhealth = 20;
        this.health = 10;
        this.dex = 3;
        this.def = 3;
        this.str = 3;
        this.int = 3;
        this.lvl = 1;
        this.exp = 1;
    }

    stats() {
        return `<span class="orange">${this.name}</span> stats: str: ${this.str}, dex: ${this.dex}, def: ${this.def}, int: ${this.int} `;
    }
    setHealth(newValue = player.health) {
        this.health = newValue;
        player__health.innerHTML = `${this.health} / ${this.maxhealth}`;
        // $(".healthbar__player__number").effect("shake");
    }
    say(message) {
        return `<span class="orange">${this.name}</span> says: ${message}`;
    }
    attack(objetive = "air") {
        if (objetive === "enemy") {
            console.log(`${enemy.name} got attacked`);
            return calculateDamage("str", player, enemy);
        } else return commandError(`${objetive} no es un objetivo valido.`);
    }
    help() {
        return `Commands: help, say, stats, attack\nUsage: 'command' 'action' `;
    }
}

class Enemy {
    constructor(name = "defaultEnemy", maxhealth = 0, health = 0, str = 0, dex = 0, def = 0, int = 0) {
        this.name = name;
        this.maxhealth = maxhealth;
        this.health = health;
        this.str = str;
        this.dex = dex;
        this.def = def;
        this.int = int;
    }

    stats() {
        return commandPrint(
            `<span class="grey">${this.name}</span> stats: maxhth: ${this.maxhealth}, str: ${this.str}, dex: ${this.dex}, def: ${this.def}, int: ${this.int} `
        );
    }

    setHealth(newValue = enemy.health) {
        this.health = newValue;
        enemy__health.innerHTML = `${this.health} / ${this.maxhealth}`;
        // $(".healthbar__enemy__number").effect("shake", { times: 4 }, 1000);
    }

    say(message) {
        return commandPrint(`<span class="grey">${this.name}</span> says: ${message}`);
    }

    attack(objetive = "air") {
        if (objetive === "player") {
            console.log(`${objetive} got attacked`)
            return commandPrint(calculateDamage("str", enemy, player));
        }
        else return console.log(`${objetive} no es un objetivo valido`)
    }
}

let player = new Human("Razmuth");
console.log(player);
player.setHealth();

let enemy = new Enemy("Skeleton", 10, 10, 1, 1, 1, 1);
enemy.setHealth();
