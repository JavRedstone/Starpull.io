/** @class Room **/
class Room {
    constructor({
        id: ID,
        progress: pro,
        lock: loc,
        numUsers: num,
        maps: maps,
        ships: ships,
        asteroids: asteroids,
        junks: junks,
        shooters: shooters,
        lasers: lasers,
        ropeIMG: rI
    }){
        this.id = ID;
        this.progress = pro,
        this.lock = loc,
        this.numUsers = num,
        this.maps = maps;
        this.ships = ships;
        this.asteroids = asteroids;
        this.junks = junks;
        this.shooters = shooters;
        this.lasers = lasers;
        this.ropeIMG = rI;
    }
    
    initiate(rooms) {
        rooms.push(this);
        return this;
    }

    destroy(rooms) {
        rooms.splice(rooms.indexOf(this),1);
    }

    setMap(attributes) {
        this.maps.push(attributes);
        return this;
    }

    setObject(attributes, type) {
        switch (type){
            case 1:
                this.ships.push(attributes);
                break;
            case 2:
                this.asteroids.push(attributes);
                break;  
            case 3:
                this.junks.push(attributes);
                break; 
            case 4:
                this.shooters.push(attributes);
                break;
            case 5:
                this.lasers.push(attributes);
                break;   
        }
    }

    removeObject(obj, type) {
        switch (type){
            case 1:
                this.ships.splice(obj.id,1);
                for(let i = 0; i < this.ships.length; i++){
                    this.ships[i].id = i;
                }
                break;
            case 2:
                this.asteroids.splice(obj.id,1);
                for(let i = 0; i < this.asteroids.length; i++){
                    this.asteroids[i].id = i;
                }
                break;
            case 3:
                this.junks.splice(obj.id,1);
                for(let i = 0; i < this.junks.length; i++){
                    this.junks[i].id = i;
                }
                break;
            case 4:
                this.shooters.splice(obj.id,1);
                for(let i = 0; i < this.shooters.length; i++){
                    this.shooters[i].id = i;
                }
                break;
            case 5:
                this.lasers.splice(obj.id,1);
                for(let i = 0; i < this.lasers.length; i++){
                    this.lasers[i].id = i;
                }
                break;
        }
    }
}

/** @exports Room **/ export { Room };