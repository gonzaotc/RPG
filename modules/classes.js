export class Human {
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

    setDomElements(domHealth, domPrint, domError) {
        this.domHealth = domHealth;
        this.domPrint = domPrint;
        this.domError = domError;
    }

    setFunctions(commandPrint, commandError, calculateDamage) {
        this.commandPrint = commandPrint;
        this.commandError = commandError;
        this.calculateDamage = calculateDamage;
    }

    stats() {
        return this.commandPrint(`<span class="orange">${this.name}</span> stats: str: ${this.str}, dex: ${this.dex}, def: ${this.def}, int: ${this.int}`, this.domPrint);
    }
    setHealth(newValue = this.health) {
        this.health = newValue;
        this.domHealth.innerHTML = `${this.health} / ${this.maxhealth}`;
        // $(".healthbar__player__number").effect("shake");
    }
    say(message) {
        console.log(`${this.name} says: ${message}`)
        return this.commandPrint(`<span class="orange">${this.name}</span> says: ${message}`, this.domPrint);
    }
    attack(objetive = "air", player, enemy) {
        if (objetive === "enemy") {
            console.log(`${enemy.name} got attacked by ${this.name}`);
            return this.commandPrint(this.calculateDamage("str", player, enemy), this.domPrint);
        } else return this.commandError(`${objetive} no es un objetivo valido.`, this.domError);
    }
    help() {
        return this.commandPrint(`Commands: help, say, stats, attack<br>Usage: 'command' 'action' `, this.domPrint);
    }
}

export class Enemy {
    constructor(name = "defaultEnemy", maxhealth = 0, health = 0, str = 0, dex = 0, def = 0, int = 0) {
        this.name = name;
        this.maxhealth = maxhealth;
        this.health = health;
        this.str = str;
        this.dex = dex;
        this.def = def;
        this.int = int;
    }

    setDomElements(domHealth, domPrint) {
        this.domHealth = domHealth;
        this.domPrint = domPrint;
    }

    setFunctions(commandPrint, commandError, calculateDamage) {
        this.commandPrint = commandPrint;
        this.commandError = commandError;
        this.calculateDamage = calculateDamage;
    }

    stats() {
        return this.commandPrint(
            `<span class="grey">${this.name}</span> stats: maxhth: ${this.maxhealth}, str: ${this.str}, dex: ${this.dex}, def: ${this.def}, int: ${this.int}`,
            this.domPrint
        );
    }

    setHealth(newValue = this.health) {
        this.health = newValue;
        this.domHealth.innerHTML = `${this.health} / ${this.maxhealth}`;
        // $(".healthbar__enemy__number").effect("shake", { times: 4 }, 1000);
    }

    say(message) {
        console.log(`${this.name} says: ${message}`);
        return this.commandPrint(`<span class="grey">${this.name}</span> says: ${message}`, this.domPrint);
    }

    attack(objetive = "air", player, enemy) {
        if (objetive === "player") {
            console.log(`${objetive} got attacked by ${this.name}`);
            return this.commandPrint(this.calculateDamage("str", enemy, player), this.domPrint);
        } else return console.log(`${objetive} no es un objetivo valido`);
    }
}
