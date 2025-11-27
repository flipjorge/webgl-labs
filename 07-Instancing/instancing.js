const canvas = document.getElementById('the-canvas');

const vertexShaderSource = `#version 300 es

in vec2 aVertex;
in vec2 aPositionOffset;
in float aScale;
in vec4 aColor;

out vec4 vColor;

void main() {
    gl_Position = vec4(aVertex * aScale + aPositionOffset, 0, 1);
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

const vertexAttLocation = gl.getAttribLocation(program, 'aVertex');
const positionOffsetAttLocation = gl.getAttribLocation(program, 'aPositionOffset');
const scaleAttLocation = gl.getAttribLocation(program, 'aScale');
const colorAttLocation = gl.getAttribLocation(program, 'aColor');

// x, y
const vertexData = new Float32Array([
    -0.05, -0.05,
    0, 0.05,
    0.05, -0.05,
])

// x, y, scale, red, green, blue, alpha
const transformData = new Float32Array([
    0, 0, 1, 1, 0, 0, 1,
    -0.4, -0.4, 0.8, 0, 1, 0, 1,
    0.5, 0.2, 0.6, 0, 0, 1, 1,
    -0.7, 0.1, 0.4, 1, 1, 0, 1,
    0.7, -0.2, 2, 0, 1, 1, 1,
    -0.8, 0.6, 3, 1, 1, 1, 1,
])

const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

gl.vertexAttribPointer(vertexAttLocation, 2, gl.FLOAT, false, 2*4, 0);
gl.enableVertexAttribArray(vertexAttLocation);

const transformBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, transformBuffer);
gl.bufferData(gl.ARRAY_BUFFER, transformData, gl.STATIC_DRAW);

gl.vertexAttribPointer(positionOffsetAttLocation, 2, gl.FLOAT, false, 7*4, 0);
gl.vertexAttribPointer(scaleAttLocation, 1, gl.FLOAT, false, 7*4, 2*4);
gl.vertexAttribPointer(colorAttLocation, 4, gl.FLOAT, false, 7*4, 3*4);

gl.enableVertexAttribArray(positionOffsetAttLocation);
gl.enableVertexAttribArray(scaleAttLocation);
gl.enableVertexAttribArray(colorAttLocation);

gl.vertexAttribDivisor(positionOffsetAttLocation, 1);
gl.vertexAttribDivisor(scaleAttLocation, 1);
gl.vertexAttribDivisor(colorAttLocation, 1);

gl.clearColor(0, 0, 0, 1);
gl.clear(gl.COLOR_BUFFER_BIT);

gl.drawArraysInstanced(gl.TRIANGLES, 0, 3, 6);