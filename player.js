import Gameboard from './gameboard';

class Player {
    constructor(name, isComputer = false) {
        this.name = name;
        this.isComputer = isComputer;
        this.gameboard = new Gameboard();
        this.previousAttacks = new Set();
    }

    attack(opponentBoard, coordinates = null) {
        if (this.isComputer) {
            return this.#computerAttack(opponentBoard)
        } else {
            if (!coordinate) {
                throw new Error('Human player must provide coordinates');
            }
            return this.#humanAttack(opponentBoard, coordinates);
        }
    }

    #humanAttack(opponentBoard, [row, col]) {
        this.#validateCoordinates(row, col);
        this.#checkDuplicateAttack(row, col);

        opponentBoard.receiveAttack([row, col]);
        this.previousAttacks.add(`${row}, ${col}`);
    }

    #computerAttack(opponentBoard) {
        const availableMoves = [];

        // Generate all possible moves that haven't been attacked
        for (let row = 0; row < 10; row++){
            for (let col = 0; col < 10; col++) {
                const key = `${row}, ${col}`;
                if (!this.previousAttacks.has(key)){
                    availableMoves.push([row, col]);
                }
            }
        }

        if (availableMoves.length === 0) {
            throw new Error('No valid moves remaining');
        }

        // Randomly select from available moves
        const randomIndex = Math.floor(Math.random() * availableMoves.length);
        const [row, col] = availableMoves[randomIndex];

        opponentBoard.receiveAttack([row, col]);
        this.previousAttacks.add(`${row}, ${col}`);

        return [row, col];
    }

    #validateCoordinates(row, col) {
        if (row < 0 || row >= 10 || col < 0 || col >= 10) {
            throw new Error('Attack coordinates out of bounds');
        }
    }

    #checkDuplicateAttack(row, col) {
        const key = `${row}, ${col}`;
        if (this.previousAttacks.has(key)) {
            throw new Error('Already attacked this coordinate');
        }
    }

    
}   

export default Player;