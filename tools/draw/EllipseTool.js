class EllipseTool extends Tool {
  constructor(context, isCircle = false) {
    super(context);
    this.isCircle = isCircle;
  }

  initDraw(x, y, color) {
    this.ellipse = new Ellipse(color, this.isCircle);
    this.ellipse.history[0] = {x: x, y: y};
    this.ellipse.history[1] = {x: 0, y: 0};
    this.imageData = this.context.getImageData(
      0,
      0,
      this.context.canvas.clientWidth,
      this.context.canvas.clientHeight
    );
  }

  draw(x, y) {
    this.ellipse.history[1] = {
      x: Math.abs(x - this.ellipse.history[0].x),
      y: Math.abs(y - this.ellipse.history[0].y)
    }
    this.context.putImageData(this.imageData, 0, 0);
    this._createEllipse(this.ellipse);
  }

  redraw() {
    _createEllipse(this.ellipse);
  }

  finishDraw() {
    this.ellipse.minPos = {
      x: this.ellipse.history[0].x - this.ellipse.history[1].x, 
      y: this.ellipse.history[0].y - this.ellipse.history[1].y
    }
    this.ellipse.maxPos = {
      x: this.ellipse.history[0].x + this.ellipse.history[1].x, 
      y: this.ellipse.history[0].y + this.ellipse.history[1].y
    }

    return this.ellipse;
  }

  _createEllipse(ellipse) {
    if (ellipse.isCircle) {
      let maxLen = ellipse.history[1].x > ellipse.history[1].y ? ellipse.history[1].x : ellipse.history[1].y;
      ellipse.history[1].x = maxLen;
      ellipse.history[1].y = maxLen;
    }

    this.context.save();
    this.context.beginPath();
    this.context.strokeStyle = ellipse.color;
    this.context.fillStyle = ellipse.color;
    this.context.lineWidth = 5;
    this.context.ellipse(
      ellipse.history[0].x,
      ellipse.history[0].y,
      ellipse.history[1].x,
      ellipse.history[1].y,
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
  constructor(color, isCircle) {
    super(color);
    this.isCircle = isCircle;
  }
}

window.EllipseTool = EllipseTool;
window.Ellipse = Ellipse;