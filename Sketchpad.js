class ShapeGroup {
  constructor(shapes) {
    this.shapes = shapes;
    this.isSelected = false;
    this.groupMin = { ...shapes[0].minPos }
    this.groupMax = { ...shapes[0].maxPos }

    for (const shape of shapes) {
      this.groupMin.x = this.groupMin.x < shape.minPos.x ? this.groupMin.x : shape.minPos.x;
      this.groupMin.y = this.groupMin.y < shape.minPos.y ? this.groupMin.y : shape.minPos.y;
      this.groupMax.x = this.groupMax.x > shape.maxPos.x ? this.groupMax.x : shape.maxPos.x;
      this.groupMax.y = this.groupMax.y > shape.maxPos.y ? this.groupMax.y : shape.maxPos.y;
    }
  }

  checkGroupClick(x, y) {
    return this.groupMin.x <= x && this.groupMax.x >= x && this.groupMin.y <= y && this.groupMax.y >= y;
  }

  click() {
    if (this.isSelected) {
      this.unselect();
    } else {
      this.select();
    }
  }

  select() {
    this.isSelected = true;
    for (const shape of this.shapes) {
      shape.select();
    }
  }

  unselect() {
    this.isSelected = false;
    for (const shape of this.shapes) {
      shape.unselect();
    }
  }
}

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

    // arrays in history holds array of actions per turn
    this._history = {
      active: [],
      undo: []
    }

    this.initEventSetting();

    this.context = this.canvas.getContext('2d');
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    /* this._tool; gets initiated inside set Draw Mode*/
    this.setShape(config.shape);
    this.setAction(config.action);
    this.setColor(config.defaultColor);
    this._isEditCopy = false;


  }

  // private APIs

  _getPosition(e) {
    return {
      x: e.pageX - this.canvas.offsetLeft,
      y: e.pageY - this.canvas.offsetTop,
    };
  }

  _initEditTools(shapeGroup, pos = { x: 0, y: 0 }) {
    this._editTools = shapeGroup.map((shape) => {
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
    this._isSketchMode = action === 'sketch';
    this._isEditMode = action === 'edit';
    this._isSelectMode = action === 'select';

    if (!this._isSelectMode) {
      this._history.active.forEach((group) => {
        group.unselect();
      });
    }
  }

  setColor(color) {
    this._currColor = color;
  }

  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this._history.active = [];
  }

  reset() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this._history.active.forEach((shapeGroup) => {
      this._initEditTools(shapeGroup.shapes);
      this._editTools.forEach((tool) => {
        tool.redraw();
      });
    })
  }

  undo() {
    if (this._history.active.length > 0) {
      this._history.undo.push(this._history.active.shift());
      this.reset();
    }
  }

  redo() {
    if (this._history.undo.length) {
      this._history.active.unshift(this._history.undo.pop());
      this.reset();
    }
  }

  group() {
    const groupToJoinNdxs = [];
    const shapes = [];
    this._history.active.forEach((shapeGroup, index) => {
      if (shapeGroup.isSelected) {
        groupToJoinNdxs.push(index);
        shapes.push(...shapeGroup.shapes);
      }
    });
    const newGroup = new ShapeGroup(shapes);
    groupToJoinNdxs.sort((x, y) => y - x).forEach((ndx) => {
      this._history.active.splice(ndx, 1);
    })
    newGroup.unselect();
    this._history.active.unshift(newGroup);
    this.reset();

  }

  ungroup() {
    const groupToSplitNdxs = [];
    const shapes = [];
    this._history.active.forEach((shapeGroup, index) => {
      if (shapeGroup.isSelected && shapeGroup.shapes.length > 0) {
        shapeGroup.unselect();
        groupToSplitNdxs.push(index);
        shapes.push(...shapeGroup.shapes);
      }
    });

    groupToSplitNdxs.sort((x, y) => y - x).forEach((ndx) => {
      this._history.active.splice(ndx, 1);
    })

    const newGroups = shapes.map((shape) => {
      return new ShapeGroup([shape]);
    })

    this._history.active.unshift(...newGroups);
    this.reset();
  }

  delete() {
    const groupToRemove = [];
    this._history.active.forEach((shapeGroup, index) => {
      if (shapeGroup.isSelected && shapeGroup.shapes.length > 0) {
        groupToRemove.push(index);
      }
    });

    groupToRemove.sort((x, y) => y - x).forEach((ndx) => {
      this._history.active.splice(ndx, 1);
    });
    this.reset();
  }

  // Events

  onMouseDown(event) {
    const pos = this._getPosition(event);

    if (this._isSketchMode) {
      this._state.sketching = true;
      this._history.undo = [];
      // TODO: Dynamic Color change implement
      this._tool.initDraw(pos.x, pos.y, this._currColor);

      // Allow canvas to start listening to event when click is detected.
      this.canvas.addEventListener('mousemove', this.onMouseMove);
    }
    else if (this._isEditMode) {
      let targetNdx = 0;
      for (const shapeGroup of this._history.active) {
        if (shapeGroup.checkGroupClick(pos.x, pos.y)) {
          this._state.dragging = true;
          shapeGroup.select();
          this._initEditTools(shapeGroup.shapes, pos);
          // Allow canvas to start listening to event when click is detected.
          this.canvas.addEventListener('mousemove', this.onMouseMove);

          if (!this._isEditCopy) {
            this._history.active.splice(targetNdx, 1);
          }
          return;
        }
        targetNdx++;
      }
    }
    else if (this._isSelectMode) {
      for (const shapeGroup of this._history.active) {
        if (shapeGroup.checkGroupClick(pos.x, pos.y)) {
          shapeGroup.click();
          this.reset();
          return;
        }
      }
    }
  }

  onMouseMove(event) {
    const pos = this._getPosition(event);
    if (this._isSketchMode) {
      this._tool.draw(pos.x, pos.y);
    }
    else if (this._isEditMode) {
      this._editTools.forEach((editTool) => {
        editTool.move(pos.x, pos.y);
      });
    }
  }

  onMouseUp(event) {
    if (this._isSketchMode) {
      if (this._state.sketching) {
        this._state.sketching = false;
        let action = this._tool.finishDraw();
        if (!(this._tool instanceof PolygonTool)) {
          this._history.active.unshift(new ShapeGroup([action]));
          this.canvas.removeEventListener('mousemove', this.onMouseMove);
        }
      }
    }
    else if (this._isEditMode) {
      if (this._state.dragging) {
        const newGroup = new ShapeGroup(
          this._editTools.map((editTool) => {
            return editTool.finishMove();
          })
        )
        newGroup.unselect();
        this._history.active.unshift(newGroup);
        this._editTools = null;
        this._state.dragging = false;
        this.reset();
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
          this._history.active.unshift(new ShapeGroup([this._tool.finishDraw()]));
          e.stopImmediatePropagation();
          this.reset();
          this._tool = new PolygonTool(this.context);
        }
      });
      document.addEventListener(('keydown'), (e) => {
        if (e.key === 'Control') {
          this._isEditCopy = true;
        }
      });
      document.addEventListener(('keyup'), (e) => {
        if (e.key === 'Control') {
          this._isEditCopy = false;
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