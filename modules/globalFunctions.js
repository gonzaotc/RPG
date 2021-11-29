function processPlayerCommand(player, enemy, entry, domPrint, domError) {
    entry = entry.split(" ");
    let command = entry[0];
    let action = entry.slice(1).join(" ");

    if (command === "clear") {
        return clearScreen(domPrint);
    }
    if (command === "help") {
        return commandPrint(player.help(), domPrint);
    }
    if (command === "stats") {
        return commandPrint(player.stats(), domPrint);
    }
    if (command === "say") {
        return commandPrint(player.say(action), domPrint);
    }
    if (command === "attack") {
        return commandPrint(player.attack(entry[1], player, enemy, calculateDamage, commandError), domPrint);
    }

    return commandError(`"${command}" no es un comando válido.`, domError);
}

function commandPrint(result, domPrint) {
    const MAXHISTORY = 20;
    let text = document.createElement("p");
    text.innerHTML = result;
    domPrint.appendChild(text);
    if (domPrint.children.length > MAXHISTORY) {
        domPrint.removeChild(domPrint.children[0]);
    }
    let screen = domPrint.parentElement;
    screen.scrollTop = screen.scrollHeight - screen.clientHeight;
    console.log(domPrint.parentElement.scrollTop); // Que tanto se desplazó
    console.log(domPrint.parentElement.scrollHeight); // Su altura incluyendo lo que no es visible en pantalla
    console.log(domPrint.parentElement.clientHeight); // La altura del elemento que se está viendo.
    // console.log(domPrint.scrollHeight);
}

function commandError(errorText, domError) {
    let error = document.createElement("p");
    error.classList.add("interface__error");
    error.innerText = errorText;

    let errors = domError.children;

    // Si ya hay un error (o más), los escondo para mostrar el último
    if (errors.length > 0) {
        for (let i = 0; i < errors.length; i++) {
            errors[i].classList.add("hide");
        }
    }
    // Muestro el error durante 4 segundos.
    domError.appendChild(error);
    setTimeout(() => {
        domError.removeChild(error);
    }, 4000);
}

function clearScreen(domPrint) {
    let entrys = domPrint.children;
    while (entrys.length > 0) {
        domPrint.removeChild(entrys[0]);
    }
    commandError(`Cleaned history`, domError);
}

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

const globalFunctions = {
    processPlayerCommand,
    commandError,
    commandPrint,
    clearScreen,
    rollDice,
    attackColor,
    attackString,
    calculateDamage,
};
export default globalFunctions;
