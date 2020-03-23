const drawMode = document.querySelector('#drawMode');
const editMode = document.querySelector('#editMode');

const sketchpad = new Sketchpad({
  canvas: '#sketchpad',
  width: 300,
  height: 600,
  drawMode: drawMode.value,
  editMode: editMode.value,
});

function updateEditMode() {
  sketchpad.setEditMode(editMode.value);
}

function updateDrawMode() {
  sketchpad.setDrawMode(drawMode.value);

  if (drawMode.value === 'polygon') {
    alert('Polygon mode can only be exited with ESC key!')
  }
}