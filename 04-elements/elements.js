const canvas = document.getElementById('the-canvas');

const vertexShaderSource = `#version 300 es

in vec4 aPosition;
in vec4 aColor;

out vec4 vColor;

void main() {
    gl_Position = aPosition;
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

const positionAttLocation = gl.getAttribLocation(program, 'aPosition');
const colorAttLocation = gl.getAttribLocation(program, 'aColor');

// Vertex data
// x, y
const vertexData = new Float32Array([
    0, 0,
    -0.5, 0,
    -0.2, 0.5,
    0.2, 0.5,
    0.5, 0,
    0.2, -0.5,
    -0.2, -0.5,
]);

// Index data
const indexData = new Uint8Array([
    0, 1, 2,
    0, 2, 3,
    0, 3, 4,
    0, 4, 5,
    0, 5, 6,
    0, 6, 1,
]);

// Create and bind vertex buffer
const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

// Set attribute pointers
gl.vertexAttribPointer(positionAttLocation, 2, gl.FLOAT, false, 2*4, 0);

// Enable vertex attributes
// Keep aColor attribute disabled so we can set a constant color with vertexAttrib4fv.
gl.enableVertexAttribArray(positionAttLocation);

// Create and bind index buffer
const indexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexData, gl.STATIC_DRAW);

gl.clearColor(0, 0, 0, 1);
gl.clear(gl.COLOR_BUFFER_BIT);

// Draw triangles background in red
gl.vertexAttrib4fv(colorAttLocation, [1,0,0,1]);
gl.drawElements(gl.TRIANGLES, 6*3, gl.UNSIGNED_BYTE, 0);

// Draw triangles wireframe in white
gl.vertexAttrib4fv(colorAttLocation, [1,1,1,1]);
gl.drawElements(gl.LINE_LOOP, 6*3, gl.UNSIGNED_BYTE, 0);