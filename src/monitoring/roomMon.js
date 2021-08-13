import { createNewRoom, rooms, reload } from '../server.js';

// Room monitoring

const startroomMon = () => {
    const roomMon = setInterval(() => {
        for (let i = 0; i < rooms.length; i++){
            var room = rooms[i];
            if (room.numUsers > 1 && room.numUsers < 10){
                room.progress = 'S';
            }
            else if (room.numUsers >= 10 && !room.lock){
                room.progress = 'E';
                room.lock = true;
                createNewRoom();
            }

            if (room.progress == 'E' && room.numUsers == 1) {
                reload(room.ships[0]);
                room.destroy(rooms);
            }
        }
    }, 0);
}

/** @exports startroomMon **/ export { startroomMon };