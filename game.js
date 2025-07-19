
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const pieceCounter = document.getElementById('pieceCount');

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;

let grid = [];
let pieceCount = 0;
let photo = new Image();
photo.src = 'photo.jpg';

const shapes = [
    [[1, 1, 1, 1]],
    [[1, 1], [1, 1]],
    [[0, 1, 0], [1, 1, 1]],
    [[1, 0, 0], [1, 1, 1]],
    [[0, 0, 1], [1, 1, 1]],
    [[1, 1, 0], [0, 1, 1]],
    [[0, 1, 1], [1, 1, 0]]
];

let currentPiece = null;

function createGrid() {
    grid = [];
    for (let r = 0; r < ROWS; r++) {
        grid.push(new Array(COLS).fill(null));
    }
}

function drawGrid() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const cell = grid[r][c];
            if (cell) {
                ctx.save();
                ctx.beginPath();
                ctx.rect(c * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                ctx.clip();
                ctx.drawImage(photo, 0, 0, canvas.width, canvas.height);
                ctx.restore();

                ctx.strokeStyle = '#444';
                ctx.strokeRect(c * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }
}

function newPiece() {
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    currentPiece = {
        shape,
        x: Math.floor(COLS / 2) - Math.floor(shape[0].length / 2),
        y: 0,
        color: `hsl(${Math.random() * 360}, 80%, 50%)`
    };
    pieceCount++;
    pieceCounter.textContent = pieceCount;
}

function moveDown() {
    if (!currentPiece) return;
    currentPiece.y++;
    if (collision()) {
        currentPiece.y--;
        merge();
        newPiece();
    }
    draw();
}

function moveLeft() {
    if (currentPiece) {
        currentPiece.x--;
        if (collision()) currentPiece.x++;
        draw();
    }
}

function moveRight() {
    if (currentPiece) {
        currentPiece.x++;
        if (collision()) currentPiece.x--;
        draw();
    }
}

function rotate() {
    if (currentPiece) {
        const shape = currentPiece.shape;
        const rotated = shape[0].map((_, i) => shape.map(row => row[i]).reverse());
        const oldShape = currentPiece.shape;
        currentPiece.shape = rotated;
        if (collision()) currentPiece.shape = oldShape;
        draw();
    }
}

function collision() {
    const { shape, x, y } = currentPiece;
    for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
            if (shape[r][c]) {
                const newX = x + c;
                const newY = y + r;
                if (newX < 0 || newX >= COLS || newY >= ROWS || grid[newY]?.[newX]) {
                    return true;
                }
            }
        }
    }
    return false;
}

function merge() {
    const { shape, x, y } = currentPiece;
    shape.forEach((row, r) => {
        row.forEach((cell, c) => {
            if (cell) {
                grid[y + r][x + c] = true;
            }
        });
    });
}

function draw() {
    drawGrid();
    if (currentPiece) {
        const { shape, x, y, color } = currentPiece;
        ctx.fillStyle = color;
        shape.forEach((row, r) => {
            row.forEach((cell, c) => {
                if (cell) {
                    ctx.fillRect((x + c) * BLOCK_SIZE, (y + r) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                }
            });
        });
    }
}

function restartGame() {
    createGrid();
    pieceCount = 0;
    pieceCounter.textContent = pieceCount;
    newPiece();
    draw();
}


let gameInterval = setInterval(moveDown, 500);

function gameOver() {
    alert("Игра окончена!");
    clearInterval(gameInterval);
}

function merge() {
    const { shape, x, y } = currentPiece;
    shape.forEach((row, r) => {
        row.forEach((cell, c) => {
            if (cell) {
                const newY = y + r;
                const newX = x + c;
                grid[newY][newX] = true;
            }
        });
    });

    if (grid[0].some(cell => cell)) {
        gameOver();
    }
}


photo.onload = () => {
    restartGame();
};
