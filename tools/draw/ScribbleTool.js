class ScribbleTool extends Tool {
  initDraw(x, y, color) {
    this.scrib = new Scribble(color);
    this.scrib.prev = { x: x, y: y };
    this.scrib.curr = { x: x, y: y };
  }

  draw(x, y) {
    this.scrib.prev = this.scrib.curr;
    this.scrib.curr = { x: x, y: y };
    this.scrib.history.push(this.scrib.curr);
    this._createLine(this.scrib.prev, this.scrib.curr);
  }

  finishDraw() {
    this.scrib.updateMinMax();
    return this.scrib;
  }

  redraw() {
    for (let i = 1; i < this.scrib.history.length; i++) {
      this._createLine(this.scrib.history[i - 1], this.scrib.history[i]);
    }
  }

  _createLine(start, end) {
    this.context.save();
    this.context.lineJoin = 'round';
    this.context.lineCap = 'round';
    this.context.strokeStyle = this.scrib.color;
    this.context.lineWidth = 5;
    this.context.beginPath();
    this.context.moveTo(start.x, start.y);
    this.context.lineTo(end.x, end.y);
    this.context.closePath();
    this.context.stroke();
    this.context.restore();
  }
}

class Scribble extends Shape {
  constructor(color) {
    super(color);
  }
}

window.ScribbleTool = ScribbleTool;
window.Scribble = Scribble;