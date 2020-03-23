class ScribbleTool extends DrawTool {
  initDraw(x, y, color) {
    this.line = new Scribble(x, y, color);
  }

  draw(x, y) {
    this.line.prev = this.line.curr;
    this.line.curr = { x: x, y: y };
    this.line.paths.push = this.line.curr;
    this._createLine(this.line);
  }

  finishDraw() {
    // TODO: Calculate min and max
    this._createLine(this.line);
  }

  _createLine(line) {
    this.context.save();
    this.context.lineJoin = 'round';
    this.context.lineCap = 'round';
    this.context.strokeStyle = line.color;
    this.context.lineWidth = 5;
    this.context.beginPath();
    this.context.moveTo(line.prev.x, line.prev.y);
    this.context.lineTo(line.curr.x, line.curr.y);
    this.context.closePath();
    this.context.stroke();
    this.context.restore();
  }
}

class Scribble extends Shape {
  constructor(x, y, color) {
    super(x, y, color);
    this.prev = { x: x, y: y };
    this.curr = { x: x, y: y };
    this.paths = [{ x: x, y: y }];
  }
}

window.ScribbleTool = ScribbleTool;