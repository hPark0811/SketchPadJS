class RectangleTool extends DrawTool {
  constructor(context, isSquare = false) {
    super(context);
    this.isSquare = isSquare;
  }

  initDraw(x, y, color) {
    this.rect = new Rectangle(x, y, color, this.isSquare);
    this.imageData = this.context.getImageData(
      0,
      0,
      this.context.canvas.clientWidth,
      this.context.canvas.clientHeight
    );
  }

  draw(x, y) {
    this.rect.end = { x: x, y: y };
    this.context.putImageData(this.imageData, 0, 0);
    this._createRectangle(this.rect);
  }

  finishDraw() {
    // TODO: Calculate min and max
    this._createRectangle(this.rect);
  }

  _createRectangle(rect) {
    /* let minX = rect.start.x < rect.end.x ? rect.start.x : rect.end.x;
    let minY = rect.start.y < rect.end.y ? rect.start.y : rect.end.y */;
    let width = rect.end.x - rect.start.x;
    let height = rect.end.y - rect.start.y;

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
    this.context.rect(rect.start.x, rect.start.y, width, height);
    this.context.stroke();
    this.context.fill();
    this.context.restore();
  }
}

class Rectangle extends Shape {
  constructor(x, y, color, isSquare) {
    super(x, y, color);
    this.isSquare = isSquare;
    this.start = { x: x, y: y };
    this.end = {};
  }
}

window.RectangleTool = RectangleTool;