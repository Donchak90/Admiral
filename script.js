
const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
context.scale(20, 20);

let figureCount = 0;

function createMatrix(w, h) {
  const matrix = [];
  while (h--) matrix.push(new Array(w).fill(0));
  return matrix;
}

function createPiece(type) {
  if (type === 'T') return [[0,0,0],[1,1,1],[0,1,0]];
  if (type === 'O') return [[2,2],[2,2]];
  if (type === 'I') return [[3,3,3,3]];
  if (type === 'L') return [[0,4,0],[0,4,0],[0,4,4]];
  if (type === 'J') return [[0,5,0],[0,5,0],[5,5,0]];
  if (type === 'S') return [[0,6,6],[6,6,0],[0,0,0]];
  if (type === 'Z') return [[7,7,0],[0,7,7],[0,0,0]];
}

const colors = [
  null,
  'red',
  'yellow',
  'cyan',
  'orange',
  'blue',
  'green',
  'purple'
];

function updateScore() {
  document.getElementById('score').innerText = 'Фигур: ' + figureCount;
}

function drawMatrix(matrix, offset, fixed=false) {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        if (fixed) {
          context.clearRect(x + offset.x, y + offset.y, 1, 1);
        } else {
          context.fillStyle = colors[value];
          context.fillRect(x + offset.x, y + offset.y, 1, 1);
        }
      }
    });
  });
}

function draw() {
  context.fillStyle = '#fff';
  context.fillRect(0, 0, canvas.width, canvas.height);

  drawMatrix(arena, {x:0, y:0}, true);
  drawMatrix(player.matrix, player.pos, false);
}

function merge(arena, player) {
  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        arena[y + player.pos.y][x + player.pos.x] = value;
      }
    });
  });
  figureCount++;
  updateScore();
}

function restartGame() {
  arena.forEach(row => row.fill(0));
  figureCount = 0;
  updateScore();
  playerReset();
}

function collide(arena, player) {
  const [m, o] = [player.matrix, player.pos];
  for (let y = 0; y < m.length; ++y) {
    for (let x = 0; x < m[y].length; ++x) {
      if (m[y][x] !== 0 &&
         (arena[y + o.y] &&
          arena[y + o.y][x + o.x]) !== 0) {
        return true;
      }
    }
  }
  return false;
}

function playerDrop() {
  player.pos.y++;
  if (collide(arena, player)) {
    player.pos.y--;
    merge(arena, player);
    playerReset();
  }
  dropCounter = 0;
}

function playerMove(dir) {
  player.pos.x += dir;
  if (collide(arena, player)) {
    player.pos.x -= dir;
  }
}

function playerReset() {
  const pieces = 'TJLOSZI';
  player.matrix = createPiece(pieces[Math.floor(Math.random() * pieces.length)]);
  player.pos.y = 0;
  player.pos.x = (arena[0].length / 2 | 0) - (player.matrix[0].length / 2 | 0);
  if (collide(arena, player)) {
    arena.forEach(row => row.fill(0));
    figureCount = 0;
    updateScore();
  }
}

function playerRotate(dir) {
  const pos = player.pos.x;
  let offset = 1;
  const rotated = player.matrix[0].map((_, i) =>
    player.matrix.map(row => row[i])
  );
  if (dir > 0) rotated.forEach(row => row.reverse());
  else rotated.reverse();
  player.matrix = rotated;
  while (collide(arena, player)) {
    player.pos.x += offset;
    offset = -(offset + (offset > 0 ? 1 : -1));
    if (offset > player.matrix[0].length) {
      player.matrix = rotate(player.matrix, -dir);
      player.pos.x = pos;
      return;
    }
  }
}

let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;

function update(time = 0) {
  const deltaTime = time - lastTime;
  lastTime = time;
  dropCounter += deltaTime;
  if (dropCounter > dropInterval) {
    playerDrop();
  }
  draw();
  requestAnimationFrame(update);
}

document.addEventListener('keydown', event => {
  if (event.keyCode === 37) playerMove(-1);
  else if (event.keyCode === 39) playerMove(1);
  else if (event.keyCode === 40) playerDrop();
  else if (event.keyCode === 81) playerRotate(-1);
  else if (event.keyCode === 87) playerRotate(1);
});

const arena = createMatrix(12, 20);
const player = { pos: {x: 0, y: 0}, matrix: null };

playerReset();
update();
