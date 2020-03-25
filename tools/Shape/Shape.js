class Shape {
  constructor(color, isStrict = false) {
    this.minPos = {}
    this.maxPos = {}
    this.color = color;
    this.history = [];
    this.selected = false;
    this.selectedColor = '#ff0000';
    this.originalColor = color;
    this.isStrict = isStrict;
  }

  select() {
    this.selected = true;
    this.color = this.selectedColor;
  }

  unselect() {
    this.selected = true;
    this.color = this.originalColor;
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

  copy(shape) {
    this.minPos = Object.assign(shape.minPos);
    this.maxPos = Object.assign(shape.maxPos);
    this.color = shape.color;
    this.originalColor = shape.originalColor;
    this.history = shape.history.map((action) => Object.assign(action));
    this.isStrict = shape.isStrict;
  }
}

window.Shape = Shape;