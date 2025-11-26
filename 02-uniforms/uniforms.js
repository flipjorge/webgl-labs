const canvas = document.getElementById('the-canvas');

const vertexShaderSource = `#version 300 es

void main() {
    gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
    gl_PointSize = 10.0;
}`;

const fragmentShaderSource = `#version 300 es
precision mediump float;

uniform int uColorIndex;
uniform vec4 uColors[3];

out vec4 outColor;

void main() {
    outColor = uColors[uColorIndex];
}`;

/** @type {WebGL2RenderingContext} */ 
const gl = canvas.getContext('webgl2');

const program = gl.createProgram();

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertexShaderSource);
gl.compileShader(vertexShader);
gl.attachShader(program, vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fragmentShaderSource);
gl.compileShader(fragmentShader);
gl.attachShader(program, fragmentShader);

gl.linkProgram(program);

if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.log(gl.getShaderInfoLog(vertexShader));
    console.log(gl.getShaderInfoLog(fragmentShader));
}

gl.useProgram(program);

// Get uniform locations
const colorIndexLocation = gl.getUniformLocation(program, 'uColorIndex');
const colorsLocation = gl.getUniformLocation(program, 'uColors');

// Set uniform values
gl.uniform1i(colorIndexLocation, 1);
gl.uniform4fv(colorsLocation, [
    1.0, 0.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 1.0
]);

gl.clearColor(0, 0, 0, 1);
gl.clear(gl.COLOR_BUFFER_BIT);

gl.drawArrays(gl.POINTS, 0, 1);

// Change color index by pressing from 1 to 3
window.addEventListener('keydown', (e) => {
    const key = e.key;
    if (key === '1' || key === '2' || key === '3') {
        const index = parseInt(key, 10) - 1;
        gl.uniform1i(colorIndexLocation, index);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.POINTS, 0, 1);
    }
});