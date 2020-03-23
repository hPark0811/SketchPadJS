
const drawMode = document.querySelector('#drawMode');
const editMode = document.querySelector('#editMode');

const sketchpad = new Sketchpad({
  canvas: '#sketchpad',
  width: 400,
  height: 400,
  drawMode: drawMode.value,
  editMode: editMode.value,
});

function updateEditMode() {
  sketchpad.setEditMode(editMode.value);
}

function updateDrawMode() {
  sketchpad.setDrawMode(drawMode.value);
}