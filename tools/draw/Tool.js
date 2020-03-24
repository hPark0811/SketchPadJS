class Tool {
  constructor(context) {
    this.context = context;
  }

  initDraw(x, y, color) {
    throw new Error("Method 'initDraw(x, y, color)' must be implemented.");
  }

  grab(shape) {
    throw new Error("Method 'grab(shape)' must be implemented.");
  }

  draw(x, y) {
    throw new Error("Method 'draw(x, y)' must be implemented.");
  }

  finishDraw() {
    throw new Error("Method 'finishDraw()' must be implemented.");
  }
}

window.Tool = Tool;