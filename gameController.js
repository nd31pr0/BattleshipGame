// gameController.js
import Player from './player.js';
import Gameboard from './gameboard.js';

const GameController = (() => {
  // Game state
  let humanPlayer;
  let computerPlayer;
  let currentPlayer;
  let gameOver = false;

  // DOM elements
  const humanBoardEl = document.getElementById('human-board');
  const computerBoardEl = document.getElementById('computer-board');
  const messageEl = document.getElementById('game-message');

  // Initialize game
  const init = () => {
    // Create players
    humanPlayer = new Player('Human');
    computerPlayer = new Player('Computer', true);

    // Set up ships with predetermined coordinates
    setupShips(humanPlayer.gameboard);
    setupShips(computerPlayer.gameboard);

    currentPlayer = humanPlayer;
    gameOver = false;

    renderBoards();
    updateMessage("Your turn - Attack the computer's fleet!");
  };

  // Predefined ship setup
  const setupShips = (gameboard) => {
    try {
      const ships = [
        { length: 5, coords: [0, 0], direction: 'horizontal' },
        { length: 4, coords: [2, 3], direction: 'vertical' },
        { length: 3, coords: [5, 5], direction: 'horizontal' },
        { length: 3, coords: [7, 1], direction: 'vertical' },
        { length: 2, coords: [9, 6], direction: 'horizontal' }
      ];

      ships.forEach(ship => {
        const newShip = new Ship(ship.length);
        gameboard.placeShip(newShip, ship.coords, ship.direction);
      });
    } catch (error) {
      console.error('Ship setup error:', error);
    }
  };

  // Render both game boards
  const renderBoards = () => {
    renderGameboard(humanPlayer.gameboard, humanBoardEl, false);
    renderGameboard(computerPlayer.gameboard, computerBoardEl, true);
  };

  // Render a single game board
  const renderGameboard = (gameboard, element, hideShips) => {
    element.innerHTML = '';
    
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.row = row;
        cell.dataset.col = col;

        // Add hit/miss/ship classes based on gameboard state
        const cellContent = gameboard.grid[row][col];
        
        if (gameboard.missedAttacks.some(coord => coord[0] === row && coord[1] === col)) {
          cell.classList.add('miss');
        } else if (cellContent instanceof Ship && cellContent.hits > 0) {
          cell.classList.add('hit');
        } else if (cellContent instanceof Ship && !hideShips) {
          cell.classList.add('ship');
        }

        element.appendChild(cell);
      }
    }
  };

  // Handle player attack
  const handlePlayerAttack = (row, col) => {
    if (gameOver || currentPlayer !== humanPlayer) return;

    try {
      humanPlayer.attack(computerPlayer.gameboard, [row, col]);
      checkGameOver();

      if (!gameOver) {
        currentPlayer = computerPlayer;
        updateMessage("Computer's turn...");
        renderBoards();
        
        // Computer's turn after a short delay
        setTimeout(handleComputerTurn, 1000);
      }
    } catch (error) {
      updateMessage(error.message);
    }
  };

  // Handle computer's turn
  const handleComputerTurn = () => {
    try {
      const [row, col] = computerPlayer.attack(humanPlayer.gameboard);
      updateMessage(`Computer attacked (${row}, ${col})`);
      checkGameOver();

      if (!gameOver) {
        currentPlayer = humanPlayer;
        updateMessage("Your turn - Attack the computer's fleet!");
      }
      
      renderBoards();
    } catch (error) {
      console.error('Computer attack error:', error);
    }
  };

  // Check if game is over
  const checkGameOver = () => {
    if (humanPlayer.gameboard.allShipsSunk()) {
      gameOver = true;
      updateMessage("Game over! Computer wins!");
    } else if (computerPlayer.gameboard.allShipsSunk()) {
      gameOver = true;
      updateMessage("Game over! You win!");
    }
  };

  // Update game message
  const updateMessage = (text) => {
    messageEl.textContent = text;
  };

  // Set up event listeners
  const setupEventListeners = () => {
    computerBoardEl.addEventListener('click', (e) => {
      if (!e.target.classList.contains('cell')) return;
      
      const row = parseInt(e.target.dataset.row);
      const col = parseInt(e.target.dataset.col);
      handlePlayerAttack(row, col);
    });

    document.getElementById('restart-btn').addEventListener('click', init);
  };

  // Public API
  return {
    init,
    setupEventListeners
  };
})();

export default GameController;