const Player = require('./player');
const Gameboard = require('./gameboard');

describe('Player', () => {
    let player;
    let opponentBoard;

    beforeEach(() => {
        opponentBoard = new Gameboard();
        player = new Player('Human');
    });

    test('creates a player with name and gameboard', () => {
        expect(player.name).toBe('Human');
        expect(player.gameboard).toBeInstanceOf(Gameboard);
    })

    describe('attack()', () => {
        test('human player can attack specific coordinates', () => {
            player.attack(opponentBoard, [2, 3]);
            expect(opponentBoard.missedAttacks).toContainEqual([2, 3]);
        });

        test('throw error for invalid coordinates', () => {
            expect(() => {player.attack(opponentBoard, [10, 10])}).toThrow('Attack coordinates out of bounds');
        });
    });

    describe('ComputerPlayer', () => {
        let computer;

        beforeEach(() => {
            computer = new Player('Computer', true);
        });

        test('creates computer player with isComputer flag', () => {
            expect(computer.name).toBe('Computer');
            expect(computer.isComputer).toBe(true);
        });

        test('Computer can make random valid attacks', () => {
            // Fill all but one spot to test computer finds the last possible 🧵 
            for(let i = 0; i < 10; i++){
                for(let j = 0; j < 10; j++){
                    if(i !== 5 || j !== 5){
                        opponentBoard.receiveAttack([i, j]);
                    }
                }
            }

            computer.attack(opponentBoard);
            expect(opponentBoard.missedAttacks).toContainEqual([5, 5]);
        });
    });

    test('computer throws error when no valid moves are left', () => {
        // Fill all spots to test computer finds the last possible 🧵 
        for(let i = 0; i < 10; i++){
            for(let j = 0; j < 10; j++){
                opponentBoard.receiveAttack([i, j]);
            }
        }

        expect(() => {computer.attack(opponentBoard)}).toThrow('No valid moves left');
    });

});