class LineTool extends Tool{
  initShape(line, x, y) {
    this.line = line; 
    this.start = { x: x, y: y };
    this.imageData = this.context.getImageData(
      0, 
      0, 
      this.context.canvas.clientWidth, 
      this.context.canvas.clientHeight
    );
  }

  move(x, y) {
    const offset = {
      x: x - this.start.x,
      y: y - this.start.y
    };

    this.curr = {
      start: { 
        x: this.line.history[0].x + offset.x,
        y: this.line.history[0].y + offset.y
      },
      end: {
        x: this.line.history[1].x + offset.x,
        y: this.line.history[1].y + offset.y
      }
    }

    this.context.putImageData(this.imageData, 0, 0);
    this._createLine(this.curr.start, this.curr.end);
  }

  finishMove() {
    this.line.history[0] = this.curr.start;
    this.line.history[1] = this.curr.end;
    return this.finishDraw();
  }

  initDraw(x, y, color) {
    this.line = new Line(color);
    this.line.history[0] = {x: x, y: y};
    this.imageData = this.context.getImageData(
      0, 
      0, 
      this.context.canvas.clientWidth, 
      this.context.canvas.clientHeight
    );
  }

  draw(x, y) {
    this.line.history[1] = { x: x, y: y };
    this.context.putImageData(this.imageData, 0, 0);
    this._createLine(this.line.history[0], this.line.history[1]);
  }

  redraw() {
    this._createLine(this.line.history[0], this.line.history[1]);
  }

  finishDraw() {
    this.line.updateMinMax();
    return this.line;
  }

  _createLine(start, end) {
    this.context.save();
    this.context.lineJoin = 'round';
    this.context.lineCap = 'round';
    this.context.strokeStyle = this.line.color;
    this.context.lineWidth = 5;
    this.context.beginPath();
    this.context.moveTo(start.x, start.y);
    this.context.lineTo(end.x, end.y);
    this.context.closePath();
    this.context.stroke();
    this.context.restore();
  }
}

class Line extends Shape {
  constructor(color) {
    super(color);
  }
}

window.LineTool = LineTool;
window.Line = Line;