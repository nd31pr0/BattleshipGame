import Ship from './Ship.js';

class Gameboard {
    constructor(){
        // Initialize a 10x10 grid with null values
        // This will represent empty spaces on the board
        this.grid = Array(10).fill().map(() => Array(10).fill(null));
        // Initialize an empty array to keep track of missed attacks
        this.missedAttacks = [];
        // Initialize an empty array to keep track of ships
        // This will be used to check if all ships are sunk
        this.ships = [];
    }

    placeShip(ship, [row, col], direction){
        // Check boundaries to ensure no addition out of bounds
        if(
            row<0 || row>=10 || col<0 || col>=10 ||
            (direction === 'horizontal' && col + ship.length > 10) ||
            (direction === 'vertical' && row + ship.length > 10)
        ){
            throw new Error('Ship placement out of bounds');
        }

        // Check for overlapping ships
        for(let i = 0; i < ship.length; i++){
            const r = direction === 'horizontal' ? row : row + i;
            const c = direction === 'horizontal' ? col + i : col;
            // Check if the cell is already occupied by another ship
            if(this.grid[r][c] !== null){
                throw new Error('Ship placement overlaps another ship');
            }
        }

        // Place the ship
        for(let i = 0; i < ship.length; i++){
            // Assign the ship to the grid. Depending on the direction, we either increment row or column
            // to place the ship in the correct orientation. For horizontal, we keep the row constant and increment the column
            const r = direction === 'horizontal' ? row : row + i;
            const c = direction === 'horizontal' ? col + i : col;

            this.grid[r][c] = ship;
        }
        this.ships.push(ship);
    }

    receiveAttack([row, col]) {
        // Validate coordinates
        if (row < 0 || row >= 10 || col < 0 || col >= 10) {
          throw new Error('Attack coordinates out of bounds');
        }
    
        // Check if already attacked
        const alreadyAttacked = this.missedAttacks.some(coord => 
          coord[0] === row && coord[1] === col
        ) || (this.grid[row][col] instanceof Ship && this.grid[row][col].hits > 0);
    
        if (alreadyAttacked) {
          throw new Error('Already attacked this coordinate');
        }
    
        // Process attack
        if (this.grid[row][col] instanceof Ship) {
            // If the cell contains a ship, hit the ship
          this.grid[row][col].hit();
        } else {
          this.missedAttacks.push([row, col]);
        }
      }
    
      allShipsSunk() {
        // Check if all ships are sunk
        // The allShipsSunk method checks if every ship in the ships array is sunk
        return this.ships.every(ship => ship.isSunk());
    }
}



module.exports = Gameboard