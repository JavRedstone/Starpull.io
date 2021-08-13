import { map_size, rooms } from '../server.js';
import { Laser } from '../typings.js';

// Shooter monitoring

const startshootMon = () => {
    var an = 0;
    const shootMon = setInterval(() => {
        an += 0.00075;
        var x = map_size/4 * Math.cos(an) + map_size / 2;
        var y = map_size/4 * Math.sin(an) + map_size / 2;
        for (var room of rooms){
            room.shooters[0].position.x = x;
            room.shooters[0].position.y = y;
            room.shooters[1].position.x = map_size - x;
            room.shooters[1].position.y = map_size - y;
        }
    },0);

    var lasAngles = [0, 45, 90, 135, 180, 225, 270, 315];
    var lasvx = [1, 0.5, 0, -0.5, -1, -0.5, 0, 0.5];
    var lasvy = [0, 0.5, 1, 0.5, 0, -0.5, -1, -0.5];
    const shootLas = setInterval(() => {
        for (var room of rooms){
            for (var shooter of room.shooters){
                for (let i = 0; i < 8; i++) {
                    new Laser({
                        id: room.lasers.length,
                        position: { x: shooter.position.x, y: shooter.position.y },
                        velocity: { vx: lasvx[i]*15, vy: lasvy[i]*15 },
                        rotation: lasAngles[i] + 90
                    }).initiate(room);
                }
            }
        }
    },20000)
}

/** @exports startshootMon **/ export { startshootMon };