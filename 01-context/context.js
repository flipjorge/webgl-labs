const canvas = document.getElementById('the-canvas');

const gl = canvas.getContext('webgl2');

gl.clearColor(0, 0, 0, 1);
gl.clear(gl.COLOR_BUFFER_BIT);

console.log(gl);