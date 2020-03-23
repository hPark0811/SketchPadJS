class LineTool extends DrawTool{
  initDraw(x, y, color) {
    this.line = new Line(x, y, color);
    this.imageData = this.context.getImageData(
      0, 
      0, 
      this.context.canvas.clientWidth, 
      this.context.canvas.clientHeight
    );
  }

  draw(x, y) {
    this.line.end = { x: x, y: y };
    this.context.putImageData(this.imageData, 0, 0);
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
    this.context.moveTo(line.start.x, line.start.y);
    this.context.lineTo(line.end.x, line.end.y);
    this.context.closePath();
    this.context.stroke();
    this.context.restore();
  }
}

class Line extends Shape {
  constructor(x, y, color) {
    super(x, y, color);
    this.start = { x: x, y: y };
    this.end = {};
  }
}

window.LineTool = LineTool;