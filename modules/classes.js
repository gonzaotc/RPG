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

    setDomElements(domHealth) {
        this.domHealth = domHealth;
    }

    stats() {
        return `<span class="orange">${this.name}</span> stats: str: ${this.str}, dex: ${this.dex}, def: ${this.def}, int: ${this.int} `;
    }
    setHealth(newValue = this.health) {
        this.health = newValue;
        this.domHealth.innerHTML = `${this.health} / ${this.maxhealth}`;
        // $(".healthbar__player__number").effect("shake");
    }
    say(message) {
        return `<span class="orange">${this.name}</span> says: ${message}`;
    }
    attack(objetive = "air", player, enemy, calculateDamage, commandError) {
        if (objetive === "enemy") {
            console.log(`${enemy.name} got attacked`);
            return calculateDamage("str", player, enemy);
        } else return commandError(`${objetive} no es un objetivo valido.`, domError);
    }
    help() {
        return `Commands: help, say, stats, attack<br>Usage: 'command' 'action' `;
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

    setDomElements(domHealth) {
        this.domHealth = domHealth;
    }

    stats() {
        return commandPrint(
            `<span class="grey">${this.name}</span> stats: maxhth: ${this.maxhealth}, str: ${this.str}, dex: ${this.dex}, def: ${this.def}, int: ${this.int}`,
            domPrint
        );
    }

    setHealth(newValue = this.health) {
        this.health = newValue;
        this.domHealth.innerHTML = `${this.health} / ${this.maxhealth}`;
        // $(".healthbar__enemy__number").effect("shake", { times: 4 }, 1000);
    }

    say(message) {
        return commandPrint(`<span class="grey">${this.name}</span> says: ${message}`, domPrint);
    }

    attack(objetive = "air", player, enemy, calculateDamage, commandError) {
        if (objetive === "player") {
            console.log(`${objetive} got attacked`);
            return commandPrint(calculateDamage("str", enemy, player), domPrint);
        } else return console.log(`${objetive} no es un objetivo valido`);
    }
}
