class Shape {
  constructor(color) {
    this.minPos = {}
    this.maxPos = {}
    this.color = color;
    this.history = [];
  }

  updateMinMax() {
    const xHistory = this.history.map(action => action.x);
    const yHistory = this.history.map(action => action.y);
    this.minPos = {
      x: Math.min(...xHistory),
      y: Math.min(...yHistory)
    }
    this.maxPos = {
      x: Math.max(...xHistory),
      y: Math.max(...yHistory)
    }
  }

  contains(x, y) {
    return this.minPos.x <= x && this.maxPos.x >= x && this.minPos.y <= y && this.maxPos.y >= y;
  }
}

window.Shape = Shape;