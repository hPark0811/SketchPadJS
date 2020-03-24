class ScribbleTool extends Tool {
  initDraw(x, y, color) {
    this.scrib = new Scribble(color);
    this.scrib.prev = { x: x, y: y };
    this.scrib.curr = { x: x, y: y };
  }

  draw(x, y) {
    this.scrib.prev = this.scrib.curr;
    this.scrib.curr = { x: x, y: y };
    this.scrib.history.push(this.scrib.curr);
    this._createLine(this.scrib.prev, this.scrib.curr);
  }

  finishDraw() {
    this.scrib.updateMinMax();
    return this.scrib;
  }

  redraw() {
    for (let i = 1; i < this.scrib.history.length; i++) {
      this._createLine(this.scrib.history[i - 1], this.scrib.history[i]);
    }
  }

  initShape(scrib, x, y) {
    this.scrib = scrib;
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

    for (let i = 1; i < this.scrib.history.length; i++) {
      const temp = {
        start: {
          x: this.scrib.history[i - 1].x + this.offset.x,
          y: this.scrib.history[i - 1].y + this.offset.y
        },
        end: {
          x: this.scrib.history[i].x + this.offset.x,
          y: this.scrib.history[i].y + this.offset.y
        }
      }
      this._createLine(temp.start, temp.end);
    }
  }

  finishMove() {
    this.scrib.history = this.scrib.history.map((pos) => {
      return { x: pos.x + this.offset.x, y: pos.y + this.offset.y }
    })
    return this.finishDraw();
  }

  _createLine(start, end) {
    this.context.save();
    this.context.lineJoin = 'round';
    this.context.lineCap = 'round';
    this.context.strokeStyle = this.scrib.color;
    this.context.lineWidth = 2;
    this.context.beginPath();
    this.context.moveTo(start.x, start.y);
    this.context.lineTo(end.x, end.y);
    this.context.closePath();
    this.context.stroke();
    this.context.restore();
  }
}

class Scribble extends Shape {
  constructor(color) {
    super(color);
  }
}

window.ScribbleTool = ScribbleTool;
window.Scribble = Scribble;