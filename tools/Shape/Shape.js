class Shape {
  constructor(x, y, color) {
    this.minPos = { x: x, y: y }
    this.maxPos = { x: x, y: y }
    this.color = color;
  }
}

window.Shape = Shape;