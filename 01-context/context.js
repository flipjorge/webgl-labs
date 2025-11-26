const canvas = document.getElementById('the-canvas');

const vertexShaderSource = `#version 300 es

void main() {
    gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
    gl_PointSize = 10.0;
}`;

const fragmentShaderSource = `#version 300 es
precision mediump float;
out vec4 outColor;

void main() {
    outColor = vec4(1.0, 0.0, 0.0, 1.0);
}`;

/** @type {WebGL2RenderingContext} */ 
const gl = canvas.getContext('webgl2');

// Create program.
// The program will hold the vertex and fragment shaders.
const program = gl.createProgram();


// Compile each shader and attach it to the program.
// Compilation makes the shader source ready for the program.
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertexShaderSource);
gl.compileShader(vertexShader);
gl.attachShader(program, vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fragmentShaderSource);
gl.compileShader(fragmentShader);
gl.attachShader(program, fragmentShader);

// Link the program.
gl.linkProgram(program);

// Report errors if linking fails.
if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.log(gl.getShaderInfoLog(vertexShader));
    console.log(gl.getShaderInfoLog(fragmentShader));
}

// Use the linked program for drawing.
gl.useProgram(program);

// Set the clear color. This does not change pixels immediately.
gl.clearColor(0, 0, 0, 1);

// Clear the color buffer using the current clear color.
gl.clear(gl.COLOR_BUFFER_BIT);

// Draw a single point with the current program and state.
gl.drawArrays(gl.POINTS, 0, 1);