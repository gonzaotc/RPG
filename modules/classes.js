class Entity {
    constructor(name) {
        this.name = name;
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
        return this.commandPrint(
            `<span class="${this.color}">${this.name}</span> stats: str: ${this.str}, dex: ${this.dex}, def: ${this.def}, int: ${this.int}`,
            this.domPrint
        );
    }

    setHealth(newValue = this.health) {
        this.health = newValue;
        this.domHealth.innerHTML = `${this.health} / ${this.maxhealth}`;
        // $(".healthbar__player__number").effect("shake");
    }

    do(action) {
        console.log(`${this.name} ${action}`);
        return this.commandPrint(
            `
        <span class="${this.color}">${this.name}</span> ${action}`,
            this.domPrint
        );
    }

    say(message) {
        console.log(`${this.name} says: ${message}`);
        return this.commandPrint(
            `<span class="${this.color}">${this.name}</span> says: ${message}`,
            this.domPrint
        );
    }
}

export class Human extends Entity {
    constructor(name) {
        super(name);
        this.color = "orange";
        this.maxhealth = 20;
        this.health = 10;
        this.dex = 3;
        this.def = 3;
        this.str = 3;
        this.int = 3;
        this.lvl = 1;
        this.exp = 1;
    }

    attack(objetive = "air", player, enemy) {
        if (objetive === "enemy") {
            console.log(`${enemy.name} got attacked by ${this.name}`);
            return this.commandPrint(this.calculateDamage("str", player, enemy), this.domPrint);
        } else return this.commandError(`${objetive} no es un objetivo valido.`, this.domError);
    }

    help() {
        return this.commandPrint(
            `Commands: <br>
            <span class="yellow"> help </span> => see available commands.<br>
            <span class="yellow"> clear </span> => clear the history.<br>
            <span class="yellow"> say 'message' </span> => say something.<br>
            <span class="yellow"> stats </span> => show player stats.<br>
            <span class="yellow"> enemy </span> => show actual enemy stats.<br>
            <span class="yellow"> attack 'objetive' </span> => attack somebody.<br>
            ej: <span class="yellow"> attack enemy </span> => attack the enemy.<br>`,
            this.domPrint
        );
    }
}

export class Enemy extends Entity {
    constructor(name = "defaultEnemy", maxhealth = 0, health = 0, str = 0, dex = 0, def = 0, int = 0) {
        super(name);
        this.color = "grey";
        this.maxhealth = maxhealth;
        this.health = health;
        this.str = str;
        this.dex = dex;
        this.def = def;
        this.int = int;
    }

    attack(objetive = "air", player, enemy) {
        if (objetive === "player") {
            console.log(`${objetive} got attacked by ${this.name}`);
            return this.commandPrint(this.calculateDamage("str", enemy, player), this.domPrint);
        } else return console.log(`${objetive} no es un objetivo valido`);
    }
}
