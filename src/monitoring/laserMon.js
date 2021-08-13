import { rooms } from '../server.js';

// Laser monitoring

const startlaserMon = () => {
    const laserMon = setInterval(() => {
        for (var room of rooms) {
            for (var laser of room.lasers) {
                if (laser.position.x < 0 || laser.position.x > room.maps[0].size || laser.position.y < 0 || laser.position.y > room.maps[0].size) {
                    room.removeObject(laser, 5);
                }
            }
        }
    },0);
}

/** @exports startlaserMon **/ export { startlaserMon };