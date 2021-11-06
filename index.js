const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const radioRed = document.getElementById("red");
const radioBlue = document.getElementById("blue");
const radios = document.getElementsByName("colorSpawn")

const units = [];

const unitSize = 10;
const directionChecks = [{x: unitSize, y: 0}, {x: -unitSize, y: 0}, {x: 0, y: unitSize}, {x:0, y: -unitSize}];

setInterval(function(){ 
    draw();
}, 50);

setInterval(function(){ 
    actions();
}, 50);

function draw() {
    units.forEach(async unit => {
        await ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = String(unit.color);
        ctx.fillRect(unit.x, unit.y, unitSize, unitSize);
    })
}

function actions() {
    units.forEach((unit, index, fullUnits) => {
        const totalSpots = [];

        const moveSpots = [];
        const unitSpots = [];

        directionChecks.forEach(direction => {
            if (unit.x + direction.x >= 0 && unit.y + direction.y >= 0 && unit.x + direction.x < canvas.width && unit.y + direction.y < canvas.height) {
                totalSpots.push({x: unit.x + direction.x, y: unit.y + direction.y});

                const spotTaken = checkExisting(unit.x + direction.x, unit.y + direction.y);
                if (!spotTaken) {
                    moveSpots.push({x: unit.x + direction.x, y: unit.y + direction.y});
                } else {
                    unitSpots.push({x: unit.x + direction.x, y: unit.y + direction.y});
                }
            }
        });

        const random = Math.floor(Math.random() * totalSpots.length);
        const chosenSpot = totalSpots[random];

        actionRandom = Math.floor(Math.random() * 10);

        moveSpots.forEach(moveSpot => {
            if (chosenSpot.x === moveSpot.x && chosenSpot.y === moveSpot.y)
                fullUnits[index] = {x: chosenSpot.x, y: chosenSpot.y, color: unit.color};
        });
        unitSpots.forEach(unitSpot => {
            if (actionRandom <= 3 && chosenSpot.x === unitSpot.x && chosenSpot.y === unitSpot.y && moveSpots.length) {
                console.log("start");
                const babyRandom = Math.floor(Math.random() * moveSpots.length);
                const babySpot = moveSpots[babyRandom];

                const otherUnit = checkExisting(chosenSpot.x, chosenSpot.y);

                const color = getMiddleColor(unit.color, otherUnit.color);

                spawn(babySpot.x, babySpot.y, color);
            }
        });
    })
}

async function spawn(x, y, color) {
        
        // console.log("x: " + x + " y: " + y + " color: " + color);

    const existing = await checkExisting(x, y);

    if (!existing)
        units.push({x, y, color})
}

function getMiddleColor(color1, color2) {
    rgb1 = hexToRgb(color1);
    rgb2 = hexToRgb(color2);

    rgbFinal = [];

    for(let i = 0; i < 3; i++) {
        rgbFinal.push(Math.round((rgb1[i] + rgb2[i])/2));
        // console.log(rgb1[i]);
        // console.log(rgb2[i]);
        // console.log((rgb1[i] + rgb2[i])/2);
    }

    const middleColor = rgbToHex(rgbFinal);

    console.log(middleColor);
    console.log("end");

    return middleColor;
}

function hexToRgb(color) {
    const aRgbHex = color.substring(1).match(/.{1,2}/g);
    console.log(color);
    console.log(aRgbHex);
    const aRgb = [
        parseInt(aRgbHex[0], 16),
        parseInt(aRgbHex[1], 16),
        parseInt(aRgbHex[2], 16)
    ];

    console.log(aRgb);

    return aRgb;
}

function rgbToHex(color) {
    console.log(color);
    let hexString = "#";
    color.forEach(component => {
        const hex = component.toString(16);
        const newComponent = hex.length == 1 ? "0" + hex : hex;
        hexString += newComponent;
    });

    return hexString;
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
    const color = checkSelectedColor();
    if (color) {
        const rect = canvas.getBoundingClientRect();
        const x = Math.ceil((e.clientX - rect.left) / unitSize) * unitSize - unitSize;
        const y = Math.ceil((e.clientY - rect.top) / unitSize) * unitSize - unitSize;
        spawn(x, y, color);
    }
})