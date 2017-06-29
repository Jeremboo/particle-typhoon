class Loop {
  constructor() {
    this._idRAF = -1;
    this._count = 0;

    this._listeners = [];

    this._binds = {};
    this._binds.update = this._update.bind(this);
  }

  _update() {
    let listener = null;
    let i = this._count;
    while (--i >= 0) {
      listener = this._listeners[i];
      if (listener) {
        listener.listener.apply(this, null);
      }
    }
    this._idRAF = requestAnimationFrame(this._binds.update);
  }

  start() {
    this._update();
  }

  stop() {
    cancelAnimationFrame(this._idRAF);
  }

  getIdx(id) {
    let idx = -1;
    let i = 0;
    while ((idx < 0) && i < this._listeners.length) {
      if (id === this._listeners[i].id) idx = i;
      i++;
    }
    return idx;
  }

  add(id, listener) {
    const idx = this.getIdx(id);
    if (idx >= 0) return;
    this._listeners.push({ id, listener });
    this._count++;
  }

  remove(id) {
    const idx = this.getIdx(id);
    if (idx < 0) return;
    this._listeners.splice(idx, 1);
    this._count--;
  }
}

module.exports = new Loop();
