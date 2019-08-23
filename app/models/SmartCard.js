export class Block{
    constructor(data){
        this.data = data;
    }
}

export class Sector{
    constructor(){
        this.blocks = [];
    }

    setBlock(i,block){
        this.blocks[i] = block;
    }
}

export default class SmartCard {
    constructor (id){
        this.id = id;
        this.sectors = [];
        this.active = this.id === undefined ? false : true;
    }
    
    get isActive(){
        return this.active;
    }

    setSector(i,sector){
        this.sectors[i] = sector;
    }
}

