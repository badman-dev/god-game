const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const radioRed = document.getElementById("red");
const radioBlue = document.getElementById("blue");
const radios = document.getElementsByName("colorSpawn")

const units = [];

let color = null;

const unitSize = 20;

async function spawn(e) {
    const color = checkSelectedColor();
    if (color) {
        const rect = canvas.getBoundingClientRect();
        const x = Math.ceil((e.clientX - rect.left) / unitSize) * unitSize -unitSize;
        const y = Math.ceil((e.clientY - rect.top) / unitSize) * unitSize -unitSize;
        
        console.log("x: " + x + " y: " + y + " color: " + color);

        const existing = await checkExisting(x, y);

        if (!existing) {
            units.push({x, y, color});

            ctx.fillStyle = String(color);
            ctx.fillRect(x, y, unitSize, unitSize);
        }


    }
}

function checkSelectedColor() {
    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked)
            return radios[i].value;
    }
}

function checkExisting(x, y) {
    let existing = null;
    units.forEach(unit => {
        if (unit.x === x && unit.y === y)
            existing = unit;
    })
    return existing;
}

canvas.addEventListener("mousedown", function(e) {
    spawn(e)
})