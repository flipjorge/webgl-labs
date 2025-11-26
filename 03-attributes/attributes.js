const canvas = document.getElementById('the-canvas');

const vertexShaderSource = `#version 300 es

in vec4 aPosition;
in float aSize;
in vec4 aColor;

out vec4 vColor;

void main() {
    gl_Position = aPosition;
    gl_PointSize = aSize;
    vColor = aColor;
}`;

const fragmentShaderSource = `#version 300 es
precision mediump float;

in vec4 vColor;

out vec4 outColor;

void main() {
    outColor = vColor;
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

// Get attributes locations
const positionAttLocation = gl.getAttribLocation(program, 'aPosition');
const sizeAttLocation = gl.getAttribLocation(program, 'aSize');
const colorAttLocation = gl.getAttribLocation(program, 'aColor');

// Vertex data
// x, y, size, red, green, blue, alpha
const vertexData = new Float32Array([
    0, 0.5, 10, 1, 0, 0, 1,
    0.5, -0.5, 10, 0, 1, 0, 1,
    -0.5, -0.5, 10, 0, 0, 1, 1,
])

// Create and bind buffer
const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

// Set attribute pointers
gl.vertexAttribPointer(positionAttLocation, 2, gl.FLOAT, true, 28, 0);
gl.vertexAttribPointer(sizeAttLocation, 1, gl.FLOAT, false, 28, 8);
gl.vertexAttribPointer(colorAttLocation, 4, gl.FLOAT, true, 28, 12);

// Enable vertex attributes
gl.enableVertexAttribArray(positionAttLocation);
gl.enableVertexAttribArray(sizeAttLocation);
gl.enableVertexAttribArray(colorAttLocation);

gl.clearColor(0, 0, 0, 1);
gl.clear(gl.COLOR_BUFFER_BIT);

gl.drawArrays(gl.TRIANGLES, 0, 3);