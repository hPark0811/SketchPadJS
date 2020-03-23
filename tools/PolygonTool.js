class PolygonTool extends DrawTool{
  initDraw(x, y, color) {
    if (this.poly) {
      this.poly.history.push({ x: x, y: y });
    } 
    else {
      this.poly = new Polygon(x, y, color);
    }
    this.imageData = this.context.getImageData(
      0, 
      0, 
      this.context.canvas.clientWidth, 
      this.context.canvas.clientHeight
    );
  }

  draw(x, y) {
    this.poly.curr = { x: x, y: y };
    this.context.putImageData(this.imageData, 0, 0);
    this._createPoly(this.poly);
  }

  finishDraw() {
    // TODO: Calculate min and max
    this._createPoly(this.poly);
  }

  _createPoly(line) {
    const prev = this.poly.history[this.poly.history.length - 1];

    this.context.save();
    this.context.lineJoin = 'round';
    this.context.lineCap = 'round';
    this.context.strokeStyle = line.color;
    this.context.lineWidth = 5;
    this.context.beginPath();
    this.context.moveTo(prev.x, prev.y);
    this.context.lineTo(line.curr.x, line.curr.y);
    this.context.closePath();
    this.context.stroke();
    this.context.restore();
  }
}

class Polygon extends Shape {
  constructor(x, y, color) {
    super(x, y, color);
    this.history = [{ x: x, y: y }];
  }
}

window.PolygonTool = PolygonTool;