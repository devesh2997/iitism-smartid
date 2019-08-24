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

  get isActive () {
    return this.active
  }

  setSector (i, sector) {
    this.sectors[i] = sector
  }
}
