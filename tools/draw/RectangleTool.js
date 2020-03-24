class RectangleTool extends Tool {
  constructor(context, isSquare = false) {
    super(context);
    this.isSquare = isSquare;
  }

  initDraw(x, y, color) {
    this.rect = new Rectangle(color, this.isSquare);
    this.rect.history[0] = {x: x, y: y};
    this.imageData = this.context.getImageData(
      0,
      0,
      this.context.canvas.clientWidth,
      this.context.canvas.clientHeight
    );
  }

  draw(x, y) {
    this.rect.history[1] = { x: x, y: y };
    this.context.putImageData(this.imageData, 0, 0);
    this._createRectangle(this.rect);
  }

  redraw() {
    this._createRectangle(this.rect);
  }

  finishDraw() {
    this.rect.updateMinMax();
    return this.rect;
  }

  _createRectangle(rect) {
    let width = rect.history[1].x - rect.history[0].x;
    let height = rect.history[1].y - rect.history[0].y;

    if (rect.isSquare) {
      let minLen = (Math.abs(width) < Math.abs(height)) ? Math.abs(width) : Math.abs(height);
      width = (width < 0) ? -1 * minLen : minLen;
      height = (height < 0) ? -1 * minLen : minLen;
    }

    this.context.save();
    this.context.beginPath();
    this.context.strokeStyle = rect.color;
    this.context.fillStyle = rect.color;
    this.context.lineWidth = 5;
    this.context.rect(rect.history[0].x, rect.history[0].y, width, height);
    this.context.stroke();
    this.context.fill();
    this.context.restore();
  }
}

class Rectangle extends Shape {
  constructor(color, isSquare) {
    super(color);
    this.isSquare = isSquare;
  }
}

window.RectangleTool = RectangleTool;
window.Rectangle = Rectangle;