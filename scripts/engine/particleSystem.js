// Canvas Setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 600;
canvas.height = 400;

// Grid Size
const GRID_SIZE = 5; // Particle size
const COLS = canvas.width / GRID_SIZE;
const ROWS = canvas.height / GRID_SIZE;

// Particle Types
const EMPTY = 0;
const SAND = 1;
const WATER = 2;
const FIRE = 3;
const WOOD = 4;
const OIL = 5;
const LAVA = 6;
const STONE = 7;



// Update Material Colors
const COLORS = {
    [EMPTY]: "#000000",  // Black (empty space)
    [SAND]: "#FFD700",   // Gold (sand particle)
    [WATER]: "#0066FF",  // Blue (water particle)
    [FIRE]: "#FF4500",   // Orange-red (fire particle)
    [WOOD]: "#8B4513",   // Brown (wood particle)
    [OIL]: "#4B3621",    // Dark brown (oil particle)
    [LAVA]: "#FF3300",   // Bright red (lava particle)
    [STONE]: "#808080",  // Gray (stone particle)
};



// Handle Material Selection from UI
document.querySelectorAll(".material-btn").forEach(button => {
    button.addEventListener("click", () => {
        selectedParticle = parseInt(button.getAttribute("data-type"));
    });
});



// Particle Grid
let grid = Array.from({ length: ROWS }, () => Array(COLS).fill(EMPTY));
let velocityGrid = Array.from({ length: ROWS }, () => Array(COLS).fill(0)); // Stores falling speed


// Mouse Controls
let selectedParticle = SAND; // Default to sand

canvas.addEventListener("mousedown", (event) => {
    isMouseDown = true;
    placeParticle(event);
});

canvas.addEventListener("mouseup", () => (isMouseDown = false));

canvas.addEventListener("mousemove", (event) => {
    if (isMouseDown) {
        placeParticle(event);
    }
});

// Update Material Selection When Clicking a Button
document.querySelectorAll(".material-btn").forEach(button => {
    button.addEventListener("click", () => {
        selectedParticle = parseInt(button.getAttribute("data-type"));
        updateSelectionDisplay();
    });
});

// Update Material Selection When Pressing a Number Key
document.addEventListener("keydown", (event) => {
    const keyMap = {
        "1": 1, "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "0": 0
    };

    if (keyMap[event.key] !== undefined) {
        selectedParticle = keyMap[event.key];
        updateSelectionDisplay();
    }
});

// Update UI to Highlight the Current Selection
function updateSelectionDisplay() {
    document.getElementById("currentSelection").textContent = "Selected: " + materialNames[selectedParticle];

    document.querySelectorAll(".material-btn").forEach(btn => {
        btn.classList.remove("selected");
        if (parseInt(btn.getAttribute("data-type")) === selectedParticle) {
            btn.classList.add("selected");
        }
    });
}

// Ensure Initial Selection is Highlighted
updateSelectionDisplay();

function updateSelectionDisplay() {
    document.querySelectorAll(".material-btn").forEach(btn => {
        btn.classList.remove("selected");
        if (parseInt(btn.getAttribute("data-type")) === selectedParticle) {
            btn.classList.add("selected");
        }
    });
}

// Switch between sand and water using the keyboard
document.addEventListener("keydown", (event) => {
    if (event.key === "1") selectedParticle = SAND;
    if (event.key === "2") selectedParticle = WATER;
    if (event.key === "3") selectedParticle = FIRE;
    if (event.key === "4") selectedParticle = WOOD;
    if (event.key === "5") selectedParticle = OIL;
    if (event.key === "6") selectedParticle = LAVA;
    if (event.key === "7") selectedParticle = STONE; // Stone now on 7
    if (event.key === "0") selectedParticle = EMPTY; // Eraser Tool now on 0 🧽
});

function placeParticle(event) {
    const x = Math.floor(event.offsetX / GRID_SIZE);
    const y = Math.floor(event.offsetY / GRID_SIZE);

    if (grid[y] && grid[y][x] !== selectedParticle) {
        if (selectedParticle === EMPTY) {
            grid[y][x] = EMPTY; // Correctly erase particles
        } else {
            grid[y][x] = selectedParticle;
        }
    }
}





function updateParticles() {
    for (let y = ROWS - 2; y >= 0; y--) { // Loop from bottom to top
        for (let x = 0; x < COLS; x++) {
            let type = grid[y][x];

            if (type === SAND) updateSand(y, x);
            else if (type === WATER) updateWater(y, x);
            else if (type === FIRE) updateFire(y, x);
            else if (type === OIL) updateOil(y, x);
            else if (type === LAVA) updateLava(y, x);
        }
    }
}


function updateSand(y, x) {
    if (grid[y + 1][x] === EMPTY || grid[y + 1][x] === WATER) {
        if (grid[y + 1][x] === WATER) grid[y][x] = WATER;
        else grid[y][x] = EMPTY;
        grid[y + 1][x] = SAND;
    } else {
        let left = x > 0 && (grid[y + 1][x - 1] === EMPTY || grid[y + 1][x - 1] === WATER);
        let right = x < COLS - 1 && (grid[y + 1][x + 1] === EMPTY || grid[y + 1][x + 1] === WATER);

        if (left && right) {
            if (Math.random() < 0.5) right = false;
            else left = false;
        }

        if (left) {
            if (grid[y + 1][x - 1] === WATER) grid[y][x] = WATER;
            else grid[y][x] = EMPTY;
            grid[y + 1][x - 1] = SAND;
        } else if (right) {
            if (grid[y + 1][x + 1] === WATER) grid[y][x] = WATER;
            else grid[y][x] = EMPTY;
            grid[y + 1][x + 1] = SAND;
        }
    }
}


function updateWater(y, x) {
    if (grid[y + 1][x] === EMPTY) {
        grid[y + 1][x] = WATER;
        grid[y][x] = EMPTY;
    } 
    else if (grid[y + 1][x] === FIRE) {
        grid[y + 1][x] = EMPTY;
        grid[y][x] = EMPTY;
    } 
    else {
        let left = x > 0 && grid[y][x - 1] === EMPTY;
        let right = x < COLS - 1 && grid[y][x + 1] === EMPTY;

        if (left && right) {
            if (Math.random() < 0.5) right = false;
            else left = false;
        }

        if (left) {
            grid[y][x - 1] = WATER;
            grid[y][x] = EMPTY;
        } else if (right) {
            grid[y][x + 1] = WATER;
            grid[y][x] = EMPTY;
        }
    }
}



function updateFire(y, x) {
    let neighbors = [[y + 1, x], [y - 1, x], [y, x + 1], [y, x - 1]];

    neighbors.forEach(([ny, nx]) => {
        if (ny >= 0 && ny < ROWS && nx >= 0 && nx < COLS) {
            if (grid[ny][nx] === WOOD || grid[ny][nx] === OIL) {
                if (Math.random() < (grid[ny][nx] === OIL ? 0.7 : 0.3)) {
                    grid[ny][nx] = FIRE;
                }
            }
        }
    });

    if (Math.random() < 0.1) grid[y][x] = EMPTY;
}


function updateOil(y, x) {
    if (grid[y + 1][x] === EMPTY) {
        grid[y + 1][x] = OIL;
        grid[y][x] = EMPTY;
    } else {
        let left = x > 0 && grid[y][x - 1] === EMPTY;
        let right = x < COLS - 1 && grid[y][x + 1] === EMPTY;

        if (left && right) {
            if (Math.random() < 0.5) right = false;
            else left = false;
        }

        if (left) {
            grid[y][x - 1] = OIL;
            grid[y][x] = EMPTY;
        } else if (right) {
            grid[y][x + 1] = OIL;
            grid[y][x] = EMPTY;
        }
    }
}


function updateLava(y, x) {
    // Lava falls downward like water but moves slower
    if (grid[y + 1][x] === EMPTY) {
        grid[y + 1][x] = LAVA;
        grid[y][x] = EMPTY;
    } 
    else {
        let left = x > 0 && grid[y][x - 1] === EMPTY;
        let right = x < COLS - 1 && grid[y][x + 1] === EMPTY;

        // Lava spreads sideways like water but with a 30% chance per frame (viscosity effect)
        if (left && right) {
            if (Math.random() < 0.5) right = false;
            else left = false;
        }

        if (left && Math.random() < 0.3) { // 30% chance per frame
            grid[y][x - 1] = LAVA;
            grid[y][x] = EMPTY;
        } else if (right && Math.random() < 0.3) { // 30% chance per frame
            grid[y][x + 1] = LAVA;
            grid[y][x] = EMPTY;
        }
    }

    // 🔥 Lava Burns Nearby Materials (except Stone & Water)
    let neighbors = [[y + 1, x], [y - 1, x], [y, x + 1], [y, x - 1]];
    neighbors.forEach(([ny, nx]) => {
        if (ny >= 0 && ny < ROWS && nx >= 0 && nx < COLS) {
            if (grid[ny][nx] !== EMPTY && grid[ny][nx] !== LAVA && grid[ny][nx] !== STONE && grid[ny][nx] !== WATER) {
                grid[ny][nx] = FIRE; // Burns everything except Stone & Water
            }
        }
    });

    // 🌊 Lava Cools into Stone When Touching Water
    let touchingWater = neighbors.some(([ny, nx]) => 
        ny >= 0 && ny < ROWS && nx >= 0 && nx < COLS && grid[ny][nx] === WATER
    );

    if (touchingWater) {
        grid[y][x] = STONE;
    }

    // 🏖️ Lava Cools into Stone When Sufficient Sand is Added
    let sandCount = neighbors.filter(([ny, nx]) => 
        ny >= 0 && ny < ROWS && nx >= 0 && nx < COLS && grid[ny][nx] === SAND
    ).length;

    if (sandCount >= 3) { // Require at least 3 sand particles to cool lava
        grid[y][x] = STONE;
    }
}




function updateStone(y, x) {
    let neighbors = [[y + 1, x], [y - 1, x], [y, x + 1], [y, x - 1]];

    // If stone is next to lava for a while, it melts back into lava
    let touchingLava = neighbors.some(([ny, nx]) => 
        ny >= 0 && ny < ROWS && nx >= 0 && nx < COLS && grid[ny][nx] === LAVA
    );

    if (touchingLava && Math.random() < 0.02) { // 2% chance per frame
        grid[y][x] = LAVA;
    }
}




// Render Loop
function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.heighAt);
    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            ctx.fillStyle = COLORS[grid[y][x]];
            ctx.fillRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
        }
    }
}

// Game Loop
function gameLoop() {
    updateParticles();
    drawGrid();
    requestAnimationFrame(gameLoop);
}

// Start the loop
gameLoop();
