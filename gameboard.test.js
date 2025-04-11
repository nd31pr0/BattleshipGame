const Gameboard = require('./gameboard');
const Ship = require('./Ship');

describe('Gameboard', () => {

    let gameboard;
    let ship;

    beforeEach(() => {
        gameboard = new Gameboard();
        ship = new Ship(3);
    });

    test("initializes a 10x10 grid", () => {
        expect(gameboard.grid.length).toBe(10);
        expect(gameboard.grid[0].length).toBe(10);
        expect(gameboard.grid[0][0]).toBe(null);
    })

    describe('placeShip()', () => {
        test('places ship horizontally correctly', () => {
            gameboard.placeShip(ship, [2,3], 'horizontal');
            expect(gameboard.grid[2][3]).toBe(ship);
            expect(gameboard.grid[2][4]).toBe(ship);
            expect(gameboard.grid[2][5]).toBe(ship);
            expect(gameboard.grid[2][6]).toBe(null);
        });

        test('places ship vertically correct', () =>{
            gameboard.placeShip(ship, [2,3], 'vertical');
            expect(gameboard.grid[2][3]).toBe(ship);
            expect(gameboard.grid[3][3]).toBe(ship);
            expect(gameboard.grid[4][3]).toBe(ship);
            expect(gameboard.grid[5][3]).toBe(null);
        });

        test('throws error for out of bounds placement', () => {
            expect(() => gameboard.placeShip(ship, [8,8], 'horizontal')).toThrow('Ship placement out of bounds');
            expect(() => gameboard.placeShip(ship, [8,8], 'vertical')).toThrow('ship placement out of bounds');
        });

        test('throws error for overlapping ships', () => {
            gameboard.placeShip(ship, [2, 3], 'horizontal');
            const newShip = new Ship(2);
            expect(() => gameboard.placeShip(newShip, [2, 4], 'vertical')).toThrow('Ship placement overlaps another ship');
        });
    });

    describe('receiveAttack()', () => {
        beforeEach(() => {
            gameboard.placeShip(ship, [2,3], 'horizontal');
        });

        test('records hit on ship', () => {
            gameboard.receiveAttack([2,3]);
            expect(ship.hits).toBe(1);
            expect(gameboard.missedAttacks).not.toContainEqual([2,3]);
        });

        test('records missed attack', () => {
            gameboard.receiveAttack([5,5]);
            expect(gameboard.missedAttacks).toContainEqual([5, 5]);
            expect(ship.hits).toBe(0);
        });

        test('throws error for duplicate attack', () => {
            gameboard.receiveAttack([2,3]);
            expect(() => gameboard.receiveAttack([2,3])).toThrow('Already attacked this coordinate');
            gameboard.receiveAttack([5,5]);
            expect(() => gameboard.receiveAttack([5,5])).toThrow('Already attacked this coordinate');
        });

    });

    describe('allShipsSunk()', () => {
        test('returns false when not all ships are sunk', () => {
            gameboard.placeShip(ship, [2,3], 'horizontal');
            expect(gameboard.allShipsSunk()).toBe(false);
        });

        test('returns true when all ships are sunk', () => {
            gameboard.placeShip(ship, [2,3], horizontal);
            gameboard.receiveAttack([2,3]);
            gameboard.receiveAttack([2,4]);
            gameboard.receiveAttack([2,5]);
            expect(gameboard.allShipsSunk()).toBe(true);
        } );

        test('works with multiple ships', () => {
            const ship2 = new ship(2);
            gameboard.placeShip(ship, [2,3], 'horizontal');
            gameboard.placeShip(ship2, [5,5], 'vertical');

            // Sink first ship 
            gameboard.receiveAttack([2,3])
            gameboard.receiveAttack([2,4]);
            gameboard.receiveAttack([2,5]);
            expect(gameboard.allShipsSunk()).toBe(false);

            // sink second ship: 
            gameboard.receiveAttack([5,5]);
            gameboard.receiveAttack([6, 5]);
            expect(gameboard.allShipsSunk()).toBe(true);
        });
    });
});