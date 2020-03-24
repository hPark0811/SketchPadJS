const shape = document.querySelector('#shape');
const action = document.querySelector('#action');
const mode = document.querySelector('#copyMode');

const sketchpad = new Sketchpad({
  canvas: '#sketchpad',
  width: 400,
  height: 600,
  shape: shape.value,
  action: action.value,
  copyMode: mode.value
});

function updateAction() {
  sketchpad.setAction(action.value);
  if (action.value === 'select') {
    shape.disabled = true;
    mode.disabled = false;
  } else {
    shape.disabled = false;
    mode.disabled = true;
  }
}

function updateShape() {
  sketchpad.setShape(shape.value);

  if (shape.value === 'polygon') {
    alert('Polygon mode can only be exited with ESC key!')
  }
}

function updateCopyMode() {
  sketchpad.setCopyMode(mode.value);
}