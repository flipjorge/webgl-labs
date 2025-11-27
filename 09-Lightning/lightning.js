const canvas = document.getElementById('the-canvas');

const vertexShaderSource = `#version 300 es

in vec4 aVertex;
in vec3 aNormal;
in vec4 aColor;

uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;

uniform vec3 uLightDirection;

out vec4 vColor;
out float vBrightness;

void main() {
    gl_Position = uProjection * uView * uModel * aVertex;
    vColor = aColor;

    // Using inverse transpose to make sure the normals are correct in non uniform-scaling
    mat3 inverseTransposeMatrix = mat3(transpose(inverse(uModel)));
    vec3 normal = normalize(inverseTransposeMatrix * aNormal);

    // max makes sure is never negative
    // uLightDirection should always be normalized
    vBrightness = max(dot(normal, normalize(uLightDirection)), 0.0);
}`;

const fragmentShaderSource = `#version 300 es
precision mediump float;

in vec4 vColor;
in float vBrightness;

out vec4 outColor;

void main() {
    outColor = vColor * vBrightness;
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

const modelUniLocation = gl.getUniformLocation(program, 'uModel');
const viewUniLocation = gl.getUniformLocation(program, 'uView');
const projectionUniLocation = gl.getUniformLocation(program, 'uProjection');

const lightDirectionUniLocation = gl.getUniformLocation(program, 'uLightDirection');

const vertexAttLocation = gl.getAttribLocation(program, 'aVertex');
const normalAttLocation = gl.getAttribLocation(program, 'aNormal');
const colorAttLocation = gl.getAttribLocation(program, 'aColor');

// x, y, z, normal x, ny, nz
const cubeData = new Float32Array([
    //front
    -0.5, -0.5, -0.5, 0, 0, -1,
    -0.5, 0.5, -0.5, 0, 0, -1,
    0.5, -0.5, -0.5, 0, 0, -1,
    -0.5, 0.5, -0.5, 0, 0, -1,
    0.5, 0.5, -0.5, 0, 0, -1,
    0.5, -0.5, -0.5, 0, 0, -1,

    //right
    0.5, -0.5, -0.5, 1, 0, 0,
    0.5, 0.5, -0.5, 1, 0, 0,
    0.5, -0.5, 0.5, 1, 0, 0,
    0.5, 0.5, -0.5, 1, 0, 0,
    0.5, 0.5, 0.5, 1, 0, 0,
    0.5, -0.5, 0.5, 1, 0, 0,

    //back
    0.5, -0.5, 0.5, 0, 0, 1,
    0.5, 0.5, 0.5, 0, 0, 1,
    -0.5, -0.5, 0.5, 0, 0, 1,
    0.5, 0.5, 0.5, 0, 0, 1,
    -0.5, 0.5, 0.5, 0, 0, 1,
    -0.5, -0.5, 0.5, 0, 0, 1,

    //left
    -0.5, -0.5, 0.5, -1, 0, 0,
    -0.5, 0.5, 0.5, -1, 0, 0,
    -0.5, -0.5, -0.5, -1, 0, 0,
    -0.5, 0.5, 0.5, -1, 0, 0,
    -0.5, 0.5, -0.5, -1, 0, 0,
    -0.5, -0.5, -0.5, -1, 0, 0,

    //top
    -0.5, 0.5, -0.5, 0, 1, 0,
    -0.5, 0.5, 0.5, 0, 1, 0,
    0.5, 0.5, -0.5, 0, 1, 0,
    -0.5, 0.5, 0.5, 0, 1, 0,
    0.5, 0.5, 0.5, 0, 1, 0,
    0.5, 0.5, -0.5, 0, 1, 0,

    //bottom
    -0.5, -0.5, 0.5, 0, -1, 0,
    -0.5, -0.5, -0.5, 0, -1, 0,
    0.5, -0.5, 0.5, 0, -1, 0,
    -0.5, -0.5, -0.5, 0, -1, 0,
    0.5, -0.5, -0.5, 0, -1, 0,
    0.5, -0.5, 0.5, 0, -1, 0,
]);

const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, cubeData, gl.STATIC_DRAW);

gl.vertexAttribPointer(vertexAttLocation, 3, gl.FLOAT, true, 6*4, 0);
gl.vertexAttribPointer(normalAttLocation, 3, gl.FLOAT, true, 6*4, 3*4);

gl.enableVertexAttribArray(vertexAttLocation);
gl.enableVertexAttribArray(normalAttLocation);
gl.vertexAttrib4fv(colorAttLocation, [1,1,1,1]);

const modelMatrix = glMatrix.mat4.create();
const viewMatrix = glMatrix.mat4.create();
const projectionMatrix = glMatrix.mat4.create();

glMatrix.mat4.lookAt(viewMatrix, [0, 1, -2], [0,0,0], [0,1,0]);
glMatrix.mat4.perspective(projectionMatrix, Math.PI / 2, gl.canvas.width / gl.canvas.height, .01, 100);

gl.uniformMatrix4fv(modelUniLocation, false, modelMatrix);
gl.uniformMatrix4fv(viewUniLocation, false, viewMatrix);
gl.uniformMatrix4fv(projectionUniLocation, false, projectionMatrix);

gl.enable(gl.DEPTH_TEST);
gl.clearColor(0, 0, 0, 1);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

// Sets uniform light direction
gl.uniform3fv(lightDirectionUniLocation, [0, 1, -2]);

function run() {
    glMatrix.mat4.rotateY(modelMatrix, modelMatrix, 0.01);
    gl.uniformMatrix4fv(modelUniLocation, false, modelMatrix);
    
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 6*2*3);

    requestAnimationFrame(run);
}

run();