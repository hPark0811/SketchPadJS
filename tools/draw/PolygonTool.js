class PolygonTool extends Tool{
  initDraw(x, y, color) {
    if (!this.poly) {
      this.poly = new Polygon(x, y, color);
    }
    this.poly.history.push({ x: x, y: y });
    this.imageData = this.context.getImageData(
      0, 
      0, 
      this.context.canvas.clientWidth, 
      this.context.canvas.clientHeight
    );
  }

  draw(x, y) {
    const curr = { x: x, y: y };
    this.context.putImageData(this.imageData, 0, 0);

    this._createLine(this.poly.history[this.poly.history.length - 1], curr);
  }

  redraw() {
    for (let i = 1; i < this.poly.history.length; i++) {
      this._createLine(this.poly.history[i - 1], this.poly.history[i]);
    }
  }

  finishDraw() {
    this.poly.updateMinMax();
    return this.poly;
  }

  _createLine(start, end) {
    this.context.save();
    this.context.lineJoin = 'round';
    this.context.lineCap = 'round';
    this.context.strokeStyle = this.poly.color;
    this.context.lineWidth = 5;
    this.context.beginPath();
    this.context.moveTo(start.x, start.y);
    this.context.lineTo(end.x, end.y);
    this.context.closePath();
    this.context.stroke();
    this.context.restore();
  }
}

class Polygon extends Shape {
  constructor(color) {
    super(color);
  }
}

window.PolygonTool = PolygonTool;
window.Shape = Shape;