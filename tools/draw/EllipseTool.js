class EllipseTool extends DrawTool {
  constructor(context, isCircle = false) {
    super(context);
    this.isCircle = isCircle;
  }

  initDraw(x, y, color) {
    this.ellipse = new Ellipse(x, y, color, this.isCircle);
    this.imageData = this.context.getImageData(
      0,
      0,
      this.context.canvas.clientWidth,
      this.context.canvas.clientHeight
    );
  }

  draw(x, y) {
    this.ellipse.edge = { x: x, y: y };
    this.context.putImageData(this.imageData, 0, 0);
    this._createEllipse(this.ellipse);
  }

  finishDraw() {
    // TODO: Calculate min and max
    this._createEllipse(this.ellipse);
  }

  _createEllipse(ellipse) {
    /* let minX = ellipse.start.x < ellipse.edge.x ? ellipse.start.x : ellipse.edge.x;
    let minY = ellipse.start.y < ellipse.edge.y ? ellipse.start.y : ellipse.edge.y */;
    let radiusX = Math.abs(ellipse.edge.x - ellipse.center.x);
    let radiusY = Math.abs(ellipse.edge.y - ellipse.center.y);

    if (ellipse.isCircle) {
      let minLen = radiusX < radiusY ? radiusX : radiusY;
      radiusX = minLen;
      radiusY = minLen;
    }

    this.context.save();
    this.context.beginPath();
    this.context.strokeStyle = ellipse.color;
    this.context.fillStyle = ellipse.color;
    this.context.lineWidth = 5;
    this.context.ellipse(
      ellipse.center.x,
      ellipse.center.y,
      radiusX,
      radiusY,
      0,
      0,
      2 * Math.PI
    );
    this.context.stroke();
    this.context.fill();
    this.context.restore();
  }
}

class Ellipse extends Shape {
  constructor(x, y, color, isCircle) {
    super(x, y, color);
    this.isCircle = isCircle;
    this.center = { x: x, y: y };
    this.edge = {};
  }
}

window.EllipseTool = EllipseTool;