class Sketchpad {
  constructor(config) {
    if (!config.canvas) {
      alert('Please enter proper canvas ID!');
      return;
    }
    this.canvas = document.querySelector(config.canvas);

    // Set default value for canvas activity;
    this.width = this.canvas.getAttribute('data-width');
    this.height = this.canvas.getAttribute('data-height');
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

    this.initEventSetting();
  }

  // Events

  onMouseDown(event) {
    console.log('mouse down!')
  }

  onMouseUp(event) {
    console.log('mouse up!')
  }

  onMouseOut(event) {
    console.log('mouse out!')
  }

  onMouseMove(event) {
    console.log('mouse move!')
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
    }, this);
    this.context = this.canvas.getContext('2d');
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