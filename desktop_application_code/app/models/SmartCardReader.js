export default class SmartCardReader{
    constructor(name){
        this.deviceName = name
        this.active = this.name === undefined ? false : true;
    }

    set name(name){
        this.deviceName = name
    }

    get name(){
        return this.deviceName
    }

    get isActive(){
        return this.active
    }
}