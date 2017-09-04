class Store {
  constructor() {
    this.state = [];
  }

  add({type, time}) {
    this.state.push({type, time});
    this.state.sort((a , b) => {
      if (isBefore(a.time, b.time))
        return -1;
      if (isAfter(a.time, b.time))
        return 1;
      return 0;
    });
  }

  get(cb) {
    const l = this.state.length;
    cb(this.state[l-1]);
  }

  getAll(cb) {
    cb(this.state);
  }
}

module.exports = Store;
