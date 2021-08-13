import { rooms } from '../server.js';
import { Asteroid } from '../typings.js';

// Asteroid monitoring

const startastMon = () => {
    const astMon = setInterval(() => {
        for (var room of rooms) {
            for (var asteroid of room.asteroids) {
                if (asteroid.position.x < 0 || asteroid.position.x > room.maps[0].size || asteroid.position.y < 0 || asteroid.position.y > room.maps[0].size) {
                    for (var ship of room.ships) {
                        if (ship.getAst == null) {
                            room.removeObject(asteroid, 2);
                            new Asteroid({
                                id: room.asteroids.length,
                                position: { x: Math.floor(Math.random()*room.maps[0].size), y: Math.floor(Math.random()*room.maps[0].size) },
                                velocity: { vx: 0, vy: 0 },
                                inuse: false
                            }).initiate(room);
                        }
                    }
                }
            }
        }
    },0);
}

/** @exports startastMon **/ export { startastMon };