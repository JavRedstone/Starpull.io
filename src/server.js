/**
 * @author JavRedstone
 * @version 0.0.1
 * @copyright
 */

// Require Imports
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
// Dirname imports
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Utility Imports
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// Custom Objects
import { Map, Ship, Asteroid, Junk, Shooter, Laser } from './typings.js';
import { Room } from './rooms.js';

// Movement
import { startmove } from './movement.js';

// Room monitoring
import { startroomMon } from './monitoring/roomMon.js';

// Ship monitoring
import { startcheck } from './monitoring/shipMon.js';

// Asteroid monitoring

import { startastMon } from './monitoring/astMon.js';

// Shooter monitoring
import { startshootMon } from './monitoring/shooterMon.js';

// Laser monitoring
import { startlaserMon } from './monitoring/laserMon.js';

// Creating HTML Request
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Global Variables

const map_size = 8000;
/** @exports map_size **/ export { map_size };

// Game Initialization

var rooms = [];
/** @exports rooms **/ export { rooms };

// Create new room function

const createNewRoom = () => {
    // Create a new room
    new Room ({
        id: Math.floor(Math.random()*9999),
        progress: 'S',
        lock: false,
        numUsers: 0,
        maps: [],
        ships: [],
        asteroids: [],
        junks: [],
        shooters: [],
        lasers: [],
        ropeIMG: "https://i.imgur.com/HuEwQEC.png"
    }).initiate(rooms)

    const room = rooms[rooms.length-1];

    console.log(`INIT: Room - ${room.id} -- SUCCESS`);

    // Create a new Map
    new Map({
        id: 0,
        size: map_size
    }).initiate(room);

    const map = room.maps[0];

    console.log(`INIT: Map - ${map.id} - Room - ${room.id} -- SUCCESS`);

    for (let j = 0; j < map_size / 500; j++){
        // Create a new Asteroid
        new Asteroid({
            id: j,
            position: { x: Math.floor(Math.random()*map_size), y: Math.floor(Math.random()*map_size) },
            velocity: { vx: 0, vy: 0 },
            inuse: false
        }).initiate(room);

        const asteroid = room.asteroids[j];

        console.log(`INIT: Asteroid - ${asteroid.id} - Room - ${room.id} -- SUCCESS`);
    }

    for (let k = 0; k < map_size / 250; k++){
        // Create a new Junk
        new Junk({
            id: k,
            position: { x: Math.floor(Math.random()*map_size), y: Math.floor(Math.random()*map_size) },
            rotation: Math.floor(Math.random()*360)
        }).initiate(room);

        const junk = room.junks[k];

        console.log(`INIT: Junk - ${junk.id} - Room - ${room.id} -- SUCCESS`);
    }

    for (let l = 0; l < 2; l++){
        //Create a new Shooter
        new Shooter({
            id: l,
            position: { x: map_size/2 + map_size/4 * (l == 0 ? -1 : 1), y: map_size/2 },
            rotation: 0
        }).initiate(room);

        const shooter = room.shooters[l];

        console.log(`INIT: Shooter - ${shooter.id} - Room - ${room.id} -- SUCCESS`);
    }
};

/** @exports createNewRoom **/ export { createNewRoom };

const init = () => {
    // Create three new rooms

    for (let i = 0; i < 3; i++) createNewRoom();
}

// Running init

init();

// On connect
io.on("connection", (socket) => {
    const socketid = socket.id;
    
    // Socket intros
    socket.room = null;
    socket.ship = null;

    const assignroom = () => {
        var assignedroom = rooms[Math.floor(Math.random()*rooms.length)];
        socket.room = assignedroom.progress == 'S' || 'R' ? assignedroom : assignroom();
    }
    assignroom();
    console.log(`CONNECT: Socket - ${socketid} -- SUCCESS`);
    socket.join(socket.room.id);
    console.log(`JOIN: Socket - ${socketid} - Room - ${socket.room.id} -- SUCCESS`);
    
    // On disconnect
    socket.on("disconnect", () => {
        socket.ship != null ? socket.room.removeObject(socket.ship, 1) : void(0);
        console.log(`DISCONNECT: Socket - ${socketid} -- SUCCESS`)
    });

    // On A
    socket.on('A', () => {
        var serverlist = [];
        for (var room of rooms) {
            serverlist.push({
                id: room.id,
                progress: room.progress
            });
        }
        socket.emit('A',serverlist);
    });

    // On B
    socket.on('B', (msg) => {
        if (socket.ship != null) {
            const mouseang = calcAng(msg[0]-msg[2],msg[1]-msg[3]);
            socket.ship.rotation = mouseang*180/Math.PI+90;
        }
    });

    // On C
    socket.on('C', (msg) => {
        // Assign a game

        var isIn = null;
        for (var room of rooms) room.id == msg.room && room.progress != "E" ? isIn = room : void(0);
        if (isIn != null) {
            socket.leave(Array.from(socket.rooms)[1]);
            console.log(`LEAVE: User - ${socketid} - Room - ${socket.room.id} -- SUCCESS`);
            socket.room = isIn;
            socket.join(isIn.id);
            console.log(`JOIN: User - ${socketid} - Room - ${socket.room.id} -- SUCCESS`);
        }
        else{
            console.log(`LEAVE: User - ${socketid} - Room - ${socket.room.id} -- FAIL`);
            console.log(`JOIN: User - ${socketid} - Room - ${socket.room.id} -- FAIL`);
        }

        socket.room.numUsers++;

        // Assign a user

        new Ship({
            id: socket.room.ships.length,
            sid: socketid,
            name: null,
            tier: 1,
            died: false,
            position: { x: Math.floor(Math.random()*map_size), y: Math.floor(Math.random()*map_size) },
            velocity: { vx: 0, vy: 0 },
            rotation: 0,
            speed: calcSpecs(1).speed,
            shield: 100,
            shieldrate: calcSpecs(1).shieldrate,
            energy: 100,
            energyrate: calcSpecs(1).energyrate,
            junk: 0,
            junkrate: calcSpecs(1).junkrate,
            specs: calcSpecs(1).specs,
            astAngle: null,
            astDist: null,
            getAst: null
        }).initiate(socket.room);

        for (var ship of socket.room.ships) if (ship.sid == socketid) socket.ship = ship;

        // Assign a username

        if (msg.name != "" && msg.name != "__UNNAMED__") {
            socket.ship.name = msg.name;
            console.log(`NAME: User - ${socketid} - Name - ${socket.ship.name} -- SUCCESS`);
        }
        else {
            socket.ship.name = "__UNNAMED__";
            console.log(`NAME: User - ${socketid} - Name - ${socket.ship.name} -- FAIL`);
        }
    });

    // On E

    var astmove;
    var lIndex;

    socket.on('E', () => {
        if (socket.ship != null && socket.ship.getAst == null) {
            var distlist = [];
            for (var asteroid of socket.room.asteroids) {
                distlist.push(calcDist(asteroid.position.x, asteroid.position.y, socket.ship.position.x, socket.ship.position.y));
            }
            lIndex = 0;
            var least = distlist[0];
            for (let i = 0; i < distlist.length; i++){
                if(distlist[i]<least) {
                    least = distlist[i];
                    lIndex = i;
                }
            }
            const ast = socket.room.asteroids[lIndex];
            
            socket.astDist = least;
            const spinAst = () => {
                ast.inuse = true;
                socket.ship.getAst = ast;
                var an = Math.acos((ast.position.x - socket.ship.position.x)/least);
                astmove = setInterval(function(){
                    an+=socket.ship.energy/2500;
                    var prevx = ast.position.x;
                    var prevy = ast.position.y;
                    var postx = least*Math.cos(an)+socket.ship.position.x;
                    var posty = least*Math.sin(an)+socket.ship.position.y;

                    ast.velocity.vx = postx - prevx;
                    ast.velocity.vy = posty - prevy;

                    socket.ship.astAngle = 90 + an * 180/Math.PI;

                    socket.ship.astDist = least;

                    socket.ship.energy > 0 ? socket.ship.energy -= 0.2 : clearAst(ast);
                },0);
            };
            least < 400 && !ast.inuse ? spinAst() : void(0);
        }
    });

    // On F
    socket.on('F', () => {
        if (socket.ship != null && socket.ship.getAst != null) {
            clearAst(socket.ship.getAst);
        }
    });

    const clearAst = (ast) => {
        clearInterval(astmove);
        socket.ship.getAst = null;
        socket.ship.astAngle = null;
        socket.ship.astDist = null;
        ast.inuse = false;
    }

    // On G
    socket.on('G', () => {
        if (socket.ship != null && socket.ship.junk > 0) {
            socket.ship.junk -= socket.ship.junkrate;
            new Junk({
                id: socket.room.junks.length,
                position: { x: Math.floor(Math.random()*map_size), y: Math.floor(Math.random()*map_size) },
                rotation: Math.floor(Math.random()*360)
            }).initiate(socket.room);
            socket.room.removeObject(socket.room.junks[Math.floor(Math.random()*socket.room.junks.length)]);
        }
    });

    // On I
    socket.on('I', () => {
        if (socket.ship.died){
            socket.ship.position = { x: Math.floor(Math.random()*map_size), y: Math.floor(Math.random()*map_size) };
            socket.ship.shield = 100;
            socket.ship.energy = 100;
            socket.ship.junk = 0;
            socket.ship.died = false;
        }
    });
});

// Continuous functions

const sendInfo = setInterval(() => {
    for (var room of rooms) {
        if (room.numUsers > 0) {
            io.to(room.id).emit('D', room);
        }
    }
}, 10);

const gameOver = setInterval(() => {
    if (socket.room.progress == 'E' && socket.ship.died) {
        io.to(socket.id).emit('J');
    }
}, 0)

startmove();

startroomMon();

startcheck();

startastMon();

startshootMon();

startlaserMon();

// Important functions

const calcAng = (x, y) => {
    return Math.atan2(y, x);
};

const calcDist = (a, b, x, y) => {
    return Math.sqrt(Math.pow(x-a,2) + Math.pow(y-b,2));
};

const calcSpecs = (tier) => {
    var specs = {};
    switch(tier) {
        case 1:
            var speed = 3;
            var shieldrate = 0.02;
            var energyrate = 0.03;
            var junkrate = 20;
            var specs = {
                image: "https://i.imgur.com/c1QgmPF.png",
                imageS: "https://i.imgur.com/Fn7h6NM.png",
                sizex: 60,
                sizey: 87
            };
            break;
        case 2:
            var speed = 3.2;
            var shieldrate = 0.06;
            var energyrate = 0.05;
            var junkrate = 10;
            var specs = {
                image: "https://i.imgur.com/7vfVHpa.png",
                imageS: "https://i.imgur.com/rgwdNoq.png",
                sizex: 44,
                sizey: 106
            };
            break;
        case 3:
            var speed = 3.4;
            var shieldrate = 0.1;
            var energyrate = 0.08;
            var junkrate = 5;
            var specs = {
                image: "https://i.imgur.com/izwckIM.png",
                imageS: "https://i.imgur.com/KaSleFc.png",
                sizex: 45,
                sizey: 210
            };
            break;
        case 4:
            var speed = 2.6;
            var shieldrate = 0.16;
            var energyrate = 0.10;
            var junkrate = 4;
            var specs = {
                image: "https://i.imgur.com/CnRFbLG.png",
                imageS: "https://i.imgur.com/tDY6H4U.png",
                sizex: 75,
                sizey: 84
            };
            break;
        case 5:
            var speed = 3.6;
            var shieldrate = 0.14;
            var energyrate = 0.14;
            var junkrate = 2.5;
            var specs = {
                image: "https://i.imgur.com/dzW2Xh6.png",
                imageS: "https://i.imgur.com/h3C0tir.png",
                sizex: 60,
                sizey: 159
            };
            break;
    }
    return {speed: speed, shieldrate: shieldrate, energyrate, energyrate, junkrate: junkrate, specs: specs};
};

/** @exports calcSpecs **/ export { calcSpecs };

// Winning a round

const reload = (ship) => {
    io.to(ship.sid).emit('H');
}

/** @exports reload **/ export { reload };

// Dying

const die = (ship) => {
    ship.died = true;
    io.to(ship.sid).emit('I');
}

/** @exports die **/ export { die };

// Server init

const port = 443;

server.listen(port, ()=>{
    console.log(`LISTEN: Port - ${port} -- SUCCESS`);
});