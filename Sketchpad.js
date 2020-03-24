class Sketchpad {
  constructor(config) {
    if (!config.canvas) {
      alert('Please enter proper canvas ID!');
      return;
    }
    this.canvas = document.querySelector(config.canvas);

    // Set default value for canvas activity;
    this.canvas.width = config.width || 0;
    this.canvas.height = config.height || 0;

    this.color = this.canvas.getAttribute('data-color') || '#000';
    this.readOnly = this.canvas.getAttribute('data-readOnly') || false;

    // Able to copy history
    // Histories can be a list of single history, or multipe histories
    this.history = config.history || [];
    // History for undo
    this.undoHistory = [];

    // Add mouse events
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);

    this._state = {
      sketching: false,
      moving: false,
      copying: false
    }

    this.initEventSetting();

    this.context = this.canvas.getContext('2d');
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    /* this._tool; gets initiated inside set Draw Mode*/
    this.setShape(config.shape);
    this.setAction(config.action);
    this.setCopyMode(config.copyMode);

    // arrays in history holds array of actions per turn
    this._history = {
      active: [],
      undo: []
    }
  }

  // private APIs

  _getPosition(e) {
    return {
      x: e.pageX - this.canvas.offsetLeft,
      y: e.pageY - this.canvas.offsetTop,
    };
  }

  _initEditTools(shapes, pos = { x: 0, y: 0 }) {
    this._editTools = shapes.map((shape) => {
      let editTool;
      let copyShape;
      switch (true) {
        case shape instanceof Line:
          editTool = new LineTool(this.context);
          copyShape = new Line();
          break;
        case shape instanceof Ellipse:
          editTool = new EllipseTool(this.context);
          copyShape = new Ellipse();
          break;
        case shape instanceof Polygon:
          editTool = new PolygonTool(this.context);
          copyShape = new Polygon();
          break;
        case shape instanceof Rectangle:
          editTool = new RectangleTool(this.context);
          copyShape = new Rectangle();
          break;
        default:
          editTool = new ScribbleTool(this.context);
          copyShape = new Scribble();
          break;
      }
      copyShape.copy(shape);
      editTool.initShape(copyShape, pos.x, pos.y);
      return editTool;
    })
  }

  // public APIs

  setShape(shape) {
    switch (shape) {
      case 'scribble':
        this._tool = new ScribbleTool(this.context);
        break;
      case 'line':
        this._tool = new LineTool(this.context);
        break;
      case 'rectangle':
        this._tool = new RectangleTool(this.context);
        break;
      case 'square':
        this._tool = new RectangleTool(this.context, true);
        break;
      case 'ellipse':
        this._tool = new EllipseTool(this.context);
        break;
      case 'circle':
        this._tool = new EllipseTool(this.context, true);
        break;
      case 'polygon':
        this._tool = new PolygonTool(this.context);
        break;
    }
  }

  setAction(action) {
    this._isSketch = action === 'sketch';
  }

  setCopyMode(mode) {
    this._isCopy = mode === 'copy';
  }

  clear() {
    /* this._history.active.unshift({
      type: 'clear',
    }); */
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  reset() {
    this.clear();
    this._history.active.forEach((shapes) => {
      this._initEditTools(shapes);
      this._editTools.forEach((tool) => {
        tool.redraw();
      });
    })
  }

  // Events

  onMouseDown(event) {
    const pos = this._getPosition(event);

    if (this._isSketch) {
      this._state.sketching = true;
      // TODO: Dynamic Color change implement
      this._tool.initDraw(pos.x, pos.y, '#000');

      // Allow canvas to start listening to event when click is detected.
      this.canvas.addEventListener('mousemove', this.onMouseMove);
    }
    else {
      let targetNdx = 0;
      for (const shapes of this._history.active) {
        for (const shape of shapes) {
          if (shape.contains(pos.x, pos.y)) {

            this._state.dragging = true;
            this._initEditTools(shapes, pos);
            // Allow canvas to start listening to event when click is detected.
            this.canvas.addEventListener('mousemove', this.onMouseMove);

            if (!this._isCopy) {
              this._history.active.splice(targetNdx, 1);
            }
            return;
          }
        }
        targetNdx++;
      }
    }
  }

  onMouseMove(event) {
    const pos = this._getPosition(event);
    if (this._isSketch) {
      this._tool.draw(pos.x, pos.y);
    }
    else {
      this._editTools.forEach((editTool) => {
        editTool.move(pos.x, pos.y);
      });
    }
  }

  onMouseUp(event) {
    if (this._isSketch) {
      if (this._state.sketching) {
        this._state.sketching = false;
        let action = this._tool.finishDraw();
        if (!(this._tool instanceof PolygonTool)) {
          this._history.active.unshift([action]);
          this.canvas.removeEventListener('mousemove', this.onMouseMove);
        }
      }
    }
    else {
      if (this._state.dragging) {
        console.log(this._history.active.length);
        this._history.active.unshift(
          this._editTools.map((editTool) => {
            return editTool.finishMove();
          })
        );
        this._editTools = null;
        this._state.dragging = false;
        if (!this._isCopy) {
          this.reset();
        }
        console.log(this._history.active.length);
      }

      this.canvas.removeEventListener('mousemove', this.onMouseMove);
    }
  }

  onMouseOut(event) {
    this.onMouseUp(event);
  }


  // Setup internal inputs from canvas and add dom event listener
  // Referneced to: https://github.com/yiom/sketchpad to further clean up
  // event handling activity
  initEventSetting() {
    this.events = {};
    this.events['mousemove'] = [];
    this.internalEvents = ['MouseDown', 'MouseUp', 'MouseOut'];
    this.internalEvents.forEach((name) => {
      let lower = name.toLowerCase();
      this.events[lower] = [];

      // Enforce context for Internal Event Functions
      this['on' + name] = this['on' + name].bind(this);

      // Add DOM Event Listeners
      this.canvas.addEventListener(lower, (...args) => this.trigger(lower, args));
      this.off(lower)
      if (!this.readOnly) {
        this.on(lower, this['on' + name])
      }

      document.addEventListener(('keyup'), (e) => {
        if (e.key === "Escape" && this._tool instanceof PolygonTool) { // escape key maps to keycode `27`
          this.canvas.removeEventListener('mousemove', this.onMouseMove);
          this._history.active.unshift([this._tool.finishDraw()]);
          e.stopImmediatePropagation();
          this.reset();
          this._tool = new PolygonTool(this.context);
        }
      });
    }, this);
  }

  // Attach an event callback
  on(action, callback) {
    // Tell the user if the action he has input was invalid
    if (this.events[action] === undefined) {
      return console.error(`Sketchpad: No such action '${action}'`);
    }
    this.events[action].push(callback);
  }

  // Detach an event callback
  off(action, callback) {
    if (callback) {
      // If a callback has been specified delete it specifically
      var index = this.events[action].indexOf(callback);
      (index !== -1) && this.events[action].splice(index, 1);
      return index !== -1;
    }

    // Else just erase all callbacks
    this.events[action] = [];
  }

  trigger(eventType, args = []) {
    // Fire all events with the given callback
    this.events[eventType].forEach((callback) => {
      callback(...args);
    });
  }
}

window.Sketchpad = Sketchpad;