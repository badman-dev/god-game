const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const radioRed = document.getElementById("red");
const radioBlue = document.getElementById("blue");
const radios = document.getElementsByName("colorSpawn")

const units = [];

let color = null;

const unitSize = 20;

function spawn(e) {
    const color = checkColor();
    if (color) {
        const rect = canvas.getBoundingClientRect();
        const x = Math.ceil((e.clientX - rect.left) / unitSize) * unitSize -unitSize;
        const y = Math.ceil((e.clientY - rect.top) / unitSize) * unitSize -unitSize;
        
        console.log("x: " + x + " y: " + y + " color: " + color);

        units.push({x, y, color});

        console.log(units);

        ctx.fillStyle = String(color);
        ctx.fillRect(x, y, unitSize, unitSize);
    }
}

function checkColor() {
    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked)
            return radios[i].value;
    }
}

canvas.addEventListener("mousedown", function(e) {
    spawn(e)
})