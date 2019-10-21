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
    if (this.sectors[9] !== undefined) {
      return this.sectors[9].blocks[0].data.toString()
    }
    return ''
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
    if (newData.includes('JE') || newData.includes('je')) {
      return SmartCardType.INIT
    }
    if (data.includes('JE') || data.includes('je')) {
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
