const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const radios = document.getElementsByName("colorSpawn");
const customColor = document.getElementById("customColor");

const units = [];

const unitSize = 10;
const directionChecks = [{x: unitSize, y: 0}, {x: -unitSize, y: 0}, {x: 0, y: unitSize}, {x:0, y: -unitSize}];

let timer = 0;

let mouseDown = false;

setInterval(function(){
    if (units.length < 4900 || timer < 15) {
        actions();
        draw();
        timer++;
    }
}, 100);

function draw() {
    units.forEach(async unit => {
        await ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = String(unit.color);
        ctx.fillRect(unit.x, unit.y, unitSize, unitSize);
    })
}

function actions() {
    units.forEach((unit, index, fullUnits) => {
        if (unit.color != "black") {
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

            if (moveSpots.length) {
                const random = Math.floor(Math.random() * totalSpots.length);
                const chosenSpot = totalSpots[random];

                actionRandom = Math.floor(Math.random() * 10);

                moveSpots.forEach(moveSpot => {
                    if (chosenSpot.x === moveSpot.x && chosenSpot.y === moveSpot.y) {
                        fullUnits[index] = {x: chosenSpot.x, y: chosenSpot.y, color: unit.color};
                        timer = 0;
                    }
                });
                unitSpots.forEach(unitSpot => {
                    if (actionRandom === 1 && chosenSpot.x === unitSpot.x && chosenSpot.y === unitSpot.y && moveSpots.length) {
                        const babyRandom = Math.floor(Math.random() * moveSpots.length);
                        const babySpot = moveSpots[babyRandom];

                        const otherUnit = checkExisting(chosenSpot.x, chosenSpot.y);

                        const color = getMiddleColor(unit.color, otherUnit.color);

                        spawn(babySpot.x, babySpot.y, color);

                        timer = 0;
                    }
                });
            }
        }
    })
}

async function spawn(x, y, color) {
    const existing = await checkExisting(x, y);

    if (!existing) {
        units.push({x, y, color});
    }
}

function getMiddleColor(color1, color2) {
    rgb1 = hexToRgb(color1);
    rgb2 = hexToRgb(color2);

    rgbFinal = [];

    for(let i = 0; i < 3; i++) {
        rgbFinal.push(Math.round((rgb1[i] + rgb2[i])/2));
    }

    const middleColor = rgbToHex(rgbFinal);

    return middleColor;
}

function hexToRgb(color) {
    const aRgbHex = color.substring(1).match(/.{1,2}/g);
    const aRgb = [
        parseInt(aRgbHex[0], 16),
        parseInt(aRgbHex[1], 16),
        parseInt(aRgbHex[2], 16)
    ];

    return aRgb;
}

function rgbToHex(color) {
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
        if (radios[i].checked) {
            if (radios[i].value === "custom")
                return customColor.value;
                
            return radios[i].value;
        }
    }
}

function checkExisting(x, y) {
    return units.find(u => u.x === x && u.y === y)
}

canvas.addEventListener("mousedown", function(e) {
    if (!mouseDown) {
        const color = checkSelectedColor();
        if (color) {
            const rect = canvas.getBoundingClientRect();
            const x = Math.ceil((e.clientX - rect.left) / unitSize) * unitSize - unitSize;
            const y = Math.ceil((e.clientY - rect.top) / unitSize) * unitSize - unitSize;
            spawn(x, y, color);
        }

        mouseDown = true;
    }
})

canvas.addEventListener("mouseup", function(e) {
    if (mouseDown)
        mouseDown = false;
})

canvas.addEventListener("mousemove", function(e) {
    const color = checkSelectedColor();
    if (mouseDown && color === "black") {
        if (color) {
            const rect = canvas.getBoundingClientRect();
            const x = Math.ceil((e.clientX - rect.left) / unitSize) * unitSize - unitSize;
            const y = Math.ceil((e.clientY - rect.top) / unitSize) * unitSize - unitSize;
            spawn(x, y, color);
        }
    }
})

customColor.addEventListener("click", function(e) {
    for (let i = 0; i < radios.length; i++) {
        if (radios[i].value === "custom")
            radios[i].checked = true;
        else  
            radios[i].checked = false;
    }
})