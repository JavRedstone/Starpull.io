// Object classes

/** @class Map **/
class Map {
    constructor({
        id: ID,
        size: msize,
    })
    {
        this.id = ID;
        this.size = msize;
    }

    initiate(room) {
        room.setMap({ id: this.id, size: this.size });
        return this;
    }
}

/** @class Ship **/
class Ship {
    constructor({
        id: ID,
        sid: sID,
        name: na,
        tier: ti,
        died: di,
        position: { x: sx, y: sy },
        velocity: { vx: svx, vy: svy },
        rotation: srot,
        speed: se,
        shield: sh,
        shieldrate: shr,
        energy: en,
        energyrate: enr,
        junk: ju,
        junkrate: jur,
        specs: sp,
        astAngle: aA,
        astDist: aD,
        getAst: gA
    })
    {
        this.id = ID;
        this.sid = sID;
        this.name = na;
        this.tier = ti;
        this.died = di;
        this.position = { x: sx, y: sy };
        this.velocity = { vx: svx, vy: svy };
        this.rotation = srot;
        this.speed = se,
        this.shield = sh;
        this.shieldrate = shr;
        this.energy = en;
        this.energyrate = enr;
        this.junk = ju;
        this.junkrate = jur;
        this.specs = sp;
        this.astAngle = aA;
        this.astDist = aD;
        this.getAst = gA;
    }

    initiate(room) {
        room.setObject({ id: this.id, sid: this.sid, name: this.name, tier: this.tier, died: this.died, position: this.position, velocity: this.velocity, rotation: this.rotation, speed: this.speed, shield: this.shield, shieldrate: this.shieldrate, energy: this.energy, energyrate: this.energyrate, junk: this.junk, junkrate: this.junkrate, specs: this.specs, astAngle: this.astAngle, astDist: this.astDist, getAst: this.getAst }, 1);
        return this;
    }
}

/** @class Asteroid **/
class Asteroid {
    constructor({
        id: ID,
        position: { x: ax, y: ay },
        velocity: { vx: avx, vy: avy },
        inuse: iu
    })
    {
        this.id = ID;
        this.position = { x: ax, y: ay };
        this.velocity = { vx: avx, vy: avy };
        this.inuse = iu;
        this.specs = { image : "https://i.imgur.com/CYmCjBo.png", size : 150};
    }

    initiate(room) {
        room.setObject({ id: this.id, position: this.position, velocity: this.velocity, inuse: this.inuse, specs: this.specs }, 2);
        return this;
    }
}

/** @class Junk **/
class Junk {
    constructor({
        id: ID,
        position: { x: jx, y: jy },
        rotation: jrot,
    })
    {
        this.id = ID;
        this.position = { x: jx, y: jy };
        this.rotation = jrot;
        this.specs = { image : "https://i.imgur.com/a4fBfF5.png", size : 45};
    }

    initiate(room) {
        room.setObject({ id: this.id, position: this.position, rotation: this.rotation, specs: this.specs }, 3);
        return this;
    }
}

/** @class Shooter **/
class Shooter {
    constructor({
        id: ID,
        position: { x: sx, y: sy },
        rotation: srot,
    })
    {
        this.id = ID;
        this.position = { x: sx, y: sy };
        this.rotation = srot;
        this.specs = { image : "https://i.imgur.com/jfN5uj9.png", size : 300};
    }

    initiate(room) {
        room.setObject({ id: this.id, position: this.position, rotation: this.rotation, specs: this.specs }, 4);
        return this;
    }
}

/** @class Laser **/
class Laser {
    constructor({
        id: ID,
        position: { x: lx, y: ly },
        velocity: { vx: lvx, vy: lvy },
        rotation: lrot,
    })
    {
        this.id = ID;
        this.position = { x: lx, y: ly };
        this.velocity = { vx: lvx, vy: lvy };
        this.rotation = lrot;
        this.specs = { image : "https://i.imgur.com/Fy3weLG.png", size : 20};
    }

    initiate(room) {
        room.setObject({ id: this.id, position: this.position, velocity: this.velocity, rotation: this.rotation, specs: this.specs }, 5);
        return this;
    }
}

/** @exports Map **/ export { Map };
/** @exports Ship **/ export { Ship };
/** @exports Asteroid **/ export { Asteroid };
/** @exports Junk **/ export { Junk };
/** @exports Shooter **/ export { Shooter };
/** @exports Laser **/ export { Laser };