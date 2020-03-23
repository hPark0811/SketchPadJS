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
      sketching: false
    }

    this.initEventSetting();

    this.context = this.canvas.getContext('2d');
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    /* this._drawTool; gets initiated inside set Draw Mode*/
    this.setDrawMode(config.drawMode);
    this.setEditMode(config.editMode);
  }

  // private APIs

  _getPosition(e) {
    return {
      x: e.pageX - this.canvas.offsetLeft,
      y: e.pageY - this.canvas.offsetTop,
    };
  }

  // public APIs

  setDrawMode(drawMode) {
    /* TODO Assign proper draw tool class */
    switch (drawMode) {
      case 'scribble':
        this._drawTool = new ScribbleTool(this.context);
        break;
      case 'line':
        this._drawTool = new LineTool(this.context);
        break;
      case 'rectangle':
        this._drawTool = new RectangleTool(this.context);
        break;
      case 'square':
        this._drawTool = new RectangleTool(this.context, true);
        break;
      case 'ellipse':
        this._drawTool = new EllipseTool(this.context);
        break;
      case 'circle':
        this._drawTool = new EllipseTool(this.context, true);
        break;
      case 'polygon':
        this._drawTool = new PolygonTool(this.context);
        break;
    }
    console.log(drawMode);
  }

  setEditMode(editMode) {
    console.log(editMode);
  }

  // Events

  onMouseDown(event) {
    const pos = this._getPosition(event);
    console.log(pos);

    this._state.sketching = true;
    // TODO: Dynamic Color change implement
    this._drawTool.initDraw(pos.x, pos.y, '#000');

    // Allow canvas to start listening to event when click is detected.
    this.canvas.addEventListener('mousemove', this.onMouseMove);
  }

  onMouseMove(event) {
    const pos = this._getPosition(event);
    this._drawTool.draw(pos.x, pos.y);
  }

  onMouseUp(event) {
    if (this._state.sketching) {
      this._state.sketching = false;
      this._drawTool.finishDraw();
    }
    // Remove event when mouse up detected.

    // For polygon mode, don't remove event listener, it's a bit
    if (!(this._drawTool instanceof PolygonTool)) {
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
        if (e.key === "Escape") { // escape key maps to keycode `27`
          this.canvas.removeEventListener('mousemove', this.onMouseMove);
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