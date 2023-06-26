class IdGenerator {
  constructor() {
    this.id = 0;
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IdGenerator();
    }
    return this.instance;
  }

  getId() {
    this.id++;
    return this.id;
  }
}

export default IdGenerator.getInstance();