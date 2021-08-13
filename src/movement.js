import { rooms } from './server.js';

const move = (object) => {
    object.position.x += object.velocity.vx;
    object.position.y += object.velocity.vy;
}

const startmove = () => {
    const moveInt = setInterval(() => {
        for (var room of rooms) {
            for (var ship of room.ships) move(ship);
            for (var asteroid of room.asteroids) move(asteroid);
            for (var laser of room.lasers) move(laser);
        }
    },0);
}

/** @exports startmove **/ export { startmove };