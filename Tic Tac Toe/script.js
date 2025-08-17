const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");
const resetBtn = document.getElementById("resetBtn");

let board, currentPlayer, gameOver;

const winningCombos = [
  [0,1,2],[3,4,5],[6,7,8], // rows
  [0,3,6],[1,4,7],[2,5,8], // cols
  [0,4,8],[2,4,6] // diagonals
];

// --- Init / Reset ---
function init() {
  board = Array(9).fill("");
  currentPlayer = "X";
  gameOver = false;
  renderBoard();
  updateStatus(`Turn: ${currentPlayer}`);
}

// Create cells
function renderBoard() {
  boardEl.innerHTML = "";
  board.forEach((val, idx) => {
    const btn = document.createElement("button");
    btn.className = "cell";
    btn.dataset.index = idx;
    btn.textContent = val;
    btn.disabled = gameOver || val !== "";
    btn.addEventListener("click", onCellClick, { once: true });
    boardEl.appendChild(btn);
  });
}

function onCellClick(e) {
  const idx = Number(e.currentTarget.dataset.index);
  if (gameOver || board[idx] !== "") return;

  // Place the move
  board[idx] = currentPlayer;
  e.currentTarget.textContent = currentPlayer;
  e.currentTarget.disabled = true;

  // Check outcome
  const winner = getWinner();
  if (winner) {
    gameOver = true;
    highlightWin(winner.line);
    updateStatus(`Winner: ${winner.player} 🎉`);
    lockAllCells();
    return;
  }

  if (board.every(c => c !== "")) {
    gameOver = true;
    updateStatus("It's a draw 🤝");
    lockAllCells();
    return;
  }

  // Next turn
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  updateStatus(`Turn: ${currentPlayer}`);
}

function getWinner() {
  for (const [a,b,c] of winningCombos) {
    if (board[a] && board[a] === board[b] && board[b] === board[c]) {
      return { player: board[a], line: [a,b,c] };
    }
  }
  return null;
}

function highlightWin(line) {
  line.forEach(i => {
    const cell = boardEl.children[i];
    cell.style.borderColor = "#ffd700";
    cell.style.boxShadow = "0 0 10px rgba(0,128,0,.5) inset";
  });
}

function lockAllCells() {
  [...boardEl.children].forEach(c => c.disabled = true);
}

function updateStatus(msg) {
  statusEl.textContent = msg;
}

resetBtn.addEventListener("click", init);

// Start game
init();