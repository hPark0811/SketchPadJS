const shape = document.querySelector('#shape');
const color = document.querySelector('#color')
const action = document.querySelector('#action');
const groupDrawing = document.querySelector('#groupDrawing');
const ungroupDrawing = document.querySelector('#ungroupDrawing');
const deleteDrawing = document.querySelector('#deleteDrawing');
const instruction = document.querySelector('#instruction');

const sketchpad = new Sketchpad({
  canvas: '#sketchpad',
  width: 400,
  height: 400,
  shape: shape.value,
  action: action.value,
  defaultColor: '#686262'
});

updateAction();

function updateAction() {
  sketchpad.setAction(action.value);
  if (action.value === 'sketch') {
    shape.disabled = false;
    color.disabled = false;
    groupDrawing.disabled = true;
    ungroupDrawing.disabled = true;
    deleteDrawing.disabled = true;
    instruction.textContent = 'Sketch mode: Select proper draw mode to start drawing :D';
  } 
  else if (action.value === 'edit'){
    shape.disabled = true;
    color.disabled = true;
    groupDrawing.disabled = true;
    ungroupDrawing.disabled = true;
    deleteDrawing.disabled = true;
    instruction.textContent = 'Edit mode: Move / Copy object by dragging them! (press ctrl button to copy)';
  } 
  else {
    shape.disabled = true;
    color.disabled = true;
    groupDrawing.disabled = false;
    ungroupDrawing.disabled = false;
    deleteDrawing.disabled = false;
    instruction.textContent = 'Select mode: Misc activites: Group/Ungroup, delete';
  }
}

function updateShape() {
  sketchpad.setShape(shape.value);
  if (shape.value === 'polygon') {
    alert('Polygon mode can only be exited with ESC key!')
  }
}

function clearSketch() {
  if (confirm("You won't be able to undo your work.\n Are you sure?")) {
    sketchpad.clear();
  }
}