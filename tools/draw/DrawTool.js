class DrawTool {
  constructor(context) {
    this.context = context;
  }

  initDraw(x, y, color) {
    throw new Error("Method 'initDraw(x, y, color)' must be implemented.");
  }

  draw(x, y) {
    throw new Error("Method 'draw(x, y)' must be implemented.");
  }

  finishDraw() {
    throw new Error("Method 'finishDraw()' must be implemented.");
  }
}

window.DrawTool = DrawTool;