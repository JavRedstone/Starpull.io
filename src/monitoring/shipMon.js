// Room import
import { Socket } from 'socket.io';
import { rooms, die } from '../server.js';
import { Junk } from '../typings.js';
import { calcSpecs } from '../server.js';

// isWithinRadius function
function isWithinRadius(a, b, x, y, r) {
    return Math.pow(a - x, 2) + Math.pow(b - y, 2) < Math.pow(r, 2);
}

// isWithinRadius check

const startcheck = () => {
    const checkRad = setInterval(() => {
        for (var room of rooms) {
            for (var ship of room.ships) {
                var mult = 1;
                for (var asteroid of room.asteroids) {
                    var within = isWithinRadius(asteroid.position.x, asteroid.position.y, ship.position.x, ship.position.y, asteroid.specs.size/2 + ship.specs.sizex/2);
                    if (within) {
                        mult = 1/3;
                        ship.shield -= 0.4 + (asteroid.velocity.vx + asteroid.velocity.vy) * 10;
                        asteroid.velocity.vx = -asteroid.velocity.vx*2;
                        asteroid.velocity.vy = -asteroid.velocity.vy*2;
                    }
                }
                
                ship.velocity.vx = Math.cos((ship.rotation - 90)*Math.PI/180) * ship.speed * mult;
                ship.velocity.vy = Math.sin((ship.rotation - 90)*Math.PI/180) * ship.speed * mult;

                for (var junk of room.junks) {
                    var within = isWithinRadius(junk.position.x, junk.position.y, ship.position.x, ship.position.y, junk.specs.size/2 + ship.specs.sizex/2);
                    if (within && ship.junk < 100) {
                        ship.junk += ship.junkrate;
                        room.removeObject(junk, 3);
                        new Junk({
                            id: room.junks.length,
                            position: { x: Math.floor(Math.random()*room.maps[0].size), y: Math.floor(Math.random()*room.maps[0].size) },
                            rotation: Math.floor(Math.random()*360)
                        }).initiate(room);
                    }
                }
                for (var laser of room.lasers) {
                    var within = isWithinRadius(laser.position.x, laser.position.y, ship.position.x, ship.position.y, laser.specs.size/2 + ship.specs.sizex/2);
                    if (within && ship.shield > 0) {
                        ship.shield -= 25;
                        room.removeObject(laser, 5);
                    }
                }

                ship.position.x < 0 || ship.position.x > room.maps[0].size || ship.position.y < 0 || ship.position.y > room.maps[0].size && ship.shield > 0 ? ship.shield -= 0.2 : void(0);

                ship.shield < 100 ? ship.shield += ship.shieldrate : void(0);
                ship.energy < 100 ? ship.energy += ship.energyrate : void(0);

                if (ship.junk == 100 && ship.tier < 5) {
                    ship.tier+=1;
                    
                    ship.junk = 0;
                    ship.shieldrate = calcSpecs(ship.tier).shieldrate;
                    ship.energyrate = calcSpecs(ship.tier).energyrate;
                    ship.junkrate = calcSpecs(ship.tier).junkrate;
                    ship.specs = calcSpecs(ship.tier).specs;
                }

                ship.shield <= 0 ? die(ship) : void(0);
            }
        }
    }, 0);
};

/** @exports startcheck **/ export { startcheck };