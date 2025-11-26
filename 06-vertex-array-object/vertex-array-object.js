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

// x, y, red, green, blue, alpha
const firstVertexData = new Float32Array([
    -1, 1, 1, 0, 0, 1,
    0, 0, 0, 1, 0, 1,
    -1, -1, 0, 0, 1, 1,
])

// x, y
const secondVertexData = new Float32Array([
    1, 1,
    1, -1,
    0, 0,
])

// Create first vertex array
const firstVAO = gl.createVertexArray();
gl.bindVertexArray(firstVAO);

const firstBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, firstBuffer);
gl.bufferData(gl.ARRAY_BUFFER, firstVertexData, gl.STATIC_DRAW);

gl.vertexAttribPointer(positionAttLocation, 2, gl.FLOAT, true, 6*4, 0);
gl.vertexAttribPointer(colorAttLocation, 4, gl.FLOAT, false, 6*4, 2*4);

gl.enableVertexAttribArray(positionAttLocation);
gl.enableVertexAttribArray(colorAttLocation);

// Create second vertex array
const secondVAO = gl.createVertexArray();
gl.bindVertexArray(secondVAO);

const secondBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, secondBuffer);
gl.bufferData(gl.ARRAY_BUFFER, secondVertexData, gl.STATIC_DRAW);

gl.vertexAttribPointer(positionAttLocation, 2, gl.FLOAT, true, 2*4, 0);

gl.enableVertexAttribArray(positionAttLocation);
gl.vertexAttrib4fv(colorAttLocation, [1,0,0,1]);

//
gl.bindVertexArray(firstVAO);
gl.clearColor(0, 0, 0, 1);
gl.clear(gl.COLOR_BUFFER_BIT);

gl.drawArrays(gl.TRIANGLES, 0, 3);

gl.bindVertexArray(null);

// Change color index by pressing from 1 to 3
window.addEventListener('keydown', (e) => {
    const key = e.key;
    if (key === '1') {
        gl.bindVertexArray(firstVAO);
    } else if(key === '2') {
        gl.bindVertexArray(secondVAO);
    } else {
        return;
    }

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.bindVertexArray(null);
});