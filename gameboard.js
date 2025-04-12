import Ship from './Ship';

class Gameboard {
    constructor(){
        this.grid = Array(10).fill().map(() => Array(10).fill(null));
        this.missedAttacks = [];
        this.ships = [];
    }

    placeShip(ship, [row, col], direction){
        // Check boundaries
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

            if(this.grid[r][c] !== null){
                throw new Error('Ship placement overlaps another ship');
            }
        }

        // Place the ship
        for(let i = 0; i < ship.length; i++){
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
          this.grid[row][col].hit();
        } else {
          this.missedAttacks.push([row, col]);
        }
      }
    
      allShipsSunk() {
        return this.ships.every(ship => ship.isSunk());
    }
}



module.exports = gameboard