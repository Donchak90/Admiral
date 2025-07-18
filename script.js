const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
const grid = createMatrix(12, 20);
const clearedCells = [];
let pieceCounter = 0;

function createMatrix(w, h) {
    const matrix = [];
    while (h--) matrix.push(new Array(w).fill(0));
    return matrix;
}

const player = {
    matrix: null,
    pos: {x: 0, y: 0}
};

function createPiece() {
    const shapes = [
        [[1, 1, 1],
         [0, 1, 0]],
        [[2, 2],
         [2, 2]],
        [[0, 3, 0, 0],
         [0, 3, 0, 0],
         [0, 3, 0, 0],
         [0, 3, 0, 0]]
    ];
    return shapes[Math.floor(Math.random() * shapes.length)];
}

function mergePiece() {
    player.matrix.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell !== 0) {
                clearedCells.push({x: player.pos.x + x, y: player.pos.y + y});
            }
        });
    });
}

function draw() {
    context.fillStyle = '#00c8ff';
    context.fillRect(0, 0, canvas.width, canvas.height);

    clearedCells.forEach(cell => {
        context.clearRect(cell.x, cell.y, 1, 1);
    });

    drawMatrix(player.matrix, player.pos);
}

function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = 'rgba(255,255,255,0.2)';
                context.fillRect(offset.x + x, offset.y + y, 1, 1);
            }
        });
    });
}

function playerDrop() {
    player.pos.y++;
    if (collide()) {
        player.pos.y--;
        mergePiece();
        resetPlayer();
    }
}

function collide() {
    const [m, o] = [player.matrix, player.pos];
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0 &&
                (grid[y + o.y] &&
                 grid[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

function resetPlayer() {
    player.matrix = createPiece();
    player.pos.y = 0;
    player.pos.x = (grid[0].length / 2 | 0) - (player.matrix[0].length / 2 | 0);
    pieceCounter++;
    updatePieceCount();
}

function updatePieceCount() {
    document.getElementById('pieces').innerText = 'Фигур использовано: ' + pieceCounter;
}

function update(time = 0) {
    draw();
    requestAnimationFrame(update);
}

document.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') player.pos.x--;
    else if (event.key === 'ArrowRight') player.pos.x++;
    else if (event.key === 'ArrowDown') playerDrop();
});

function moveLeft() { player.pos.x--; }
function moveRight() { player.pos.x++; }
function rotatePiece() {}
function dropPiece() { playerDrop(); }
function restartGame() {
    clearedCells.length = 0;
    pieceCounter = 0;
    resetPlayer();
}

resetPlayer();
update();
