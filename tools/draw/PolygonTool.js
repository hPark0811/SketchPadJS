class PolygonTool extends Tool {
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

  initShape(poly, x, y) {
    this.poly = poly;
    this.start = { x: x, y: y };
    this.imageData = this.context.getImageData(
      0,
      0,
      this.context.canvas.clientWidth,
      this.context.canvas.clientHeight
    );
    this.move(x, y);
  }

  move(x, y) {
    this.context.putImageData(this.imageData, 0, 0);

    this.offset = {
      x: x - this.start.x,
      y: y - this.start.y
    };

    for (let i = 1; i < this.poly.history.length; i++) {

      const temp = {
        start: {
          x: this.poly.history[i - 1].x + this.offset.x,
          y: this.poly.history[i - 1].y + this.offset.y
        },
        end: {
          x: this.poly.history[i].x + this.offset.x,
          y: this.poly.history[i].y + this.offset.y
        }
      }
      this._createLine(temp.start, temp.end);
    }
  }

  finishMove() {
    this.poly.history = this.poly.history.map((pos) => {
      return { x: pos.x + this.offset.x, y: pos.y + this.offset.y }
    })
    return this.finishDraw();
  }

  _createLine(start, end) {
    this.context.save();
    this.context.lineJoin = 'round';
    this.context.lineCap = 'round';
    this.context.strokeStyle = this.poly.color;
    this.context.lineWidth = 2;
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