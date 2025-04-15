import Ship from "./Ship";

describe('Ship', () => {
    let ship;

    beforeEach(() => {
        ship = new Ship(3);
    });

    test('initializes ship with correct propties', () =>{
        expect(ship.length).toBe(3);
        expect(ship.hits).toBe(0);
    });

    test('hit() increases hit count', () => {
        ship.hit();
        expect(ship.hits).toBe(1);

        ship.hit();
        expect(ship.hits).toBe(2);
    })

    test('isSunk() returns false when hits < length', () => {
        ship.hit();
        ship.hit();
        expect(ship.isSunk()).toBe(false);
    })

    test('isSunk returns true if hits >= length', () => {
        ship.hit();
        ship.hit();
        ship.hit();
        expect(ship.isSunk()).toBe(true);

        // an extra hit shouldn't change the hit status
        ship.hit();
        expect(ship.isSunk()).toBe(true);

    });
});