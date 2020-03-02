export const SmartCardType = { NONE: 0, INIT_OLD: 1, INIT: 2, NEW: 3 }

export class Block {
  constructor (id, data) {
    this.id = id
    this.data = data
  }
}

export class Sector {
  constructor (id) {
    this.id = id
    this.blocks = []
  }

  setBlock (i, block) {
    this.blocks[i] = block
  }
}

export default class SmartCard {
  constructor (id) {
    this.id = id
    this.sectors = []
    this.active = this.id !== undefined
  }

  isAdmissionNumber = admissionNumber => {
    let flag = true
    let isStart = true
    for (let i = 0; i < admissionNumber.length; i++) {
      const ascii = admissionNumber.charCodeAt(i)
      if (
        ascii < 48 ||
        (ascii > 57 && ascii < 65) ||
        (ascii > 90 && ascii < 97) ||
        ascii > 122
      ) {
        if (isStart) {
          flag = false
        }
        break
      }
      isStart = false
    }
    return flag
  }

  get admissionNumberForOldCard () {
    if (
      this.sectors[0] === undefined ||
      this.sectors[0].blocks[1] === undefined
    ) {
      return undefined
    }
    return this.sectors[0].blocks[1].data.toString()
  }

  get admissionNumber () {
    let admn = ''
    if (this.sectors[9] !== undefined) {
      const data = this.sectors[9].blocks[0].data.toString()
      for(let i=0;i<data.length;i++){
        if(data.charCodeAt(i)!==0){
          admn+=data[i]
        }
      }
      // return this.sectors[9].blocks[0].data.toString()
    }
    return admn
  }

  get type () {
    if (
      this.sectors[0] === undefined ||
      this.sectors[0].blocks[1] === undefined
    ) {
      return SmartCardType.NONE
    }

    const data = this.sectors[0].blocks[1].data.toString()
    let newData
    if (this.sectors[9] !== undefined) {
      newData = this.sectors[9].blocks[0].data.toString()
    }
    if (this.isAdmissionNumber(newData)) {
      return SmartCardType.INIT
    }
    if (this.isAdmissionNumber(data)) {
      return SmartCardType.INIT_OLD
    }
    return SmartCardType.NEW
  }

  get isActive () {
    return this.active
  }

  setSector (i, sector) {
    this.sectors[i] = sector
  }
}
