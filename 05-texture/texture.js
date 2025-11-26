const canvas = document.getElementById('the-canvas');

const vertexShaderSource = `#version 300 es

in vec4 aPosition;
in vec2 aTextureCoord;

out vec2 vTextureCoord;

void main() {
    gl_Position = aPosition;
    vTextureCoord = aTextureCoord;
}`;

const fragmentShaderSource = `#version 300 es
precision mediump float;

uniform sampler2D uTexture0;

in vec2 vTextureCoord;

out vec4 outColor;

void main() {
    outColor = texture(uTexture0, vTextureCoord);
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
const uvAttLocation = gl.getAttribLocation(program, 'aTextureCoord');

// x, y, u, v
const vertexData = new Float32Array([
    -0.5, -0.8, 0, 0,
    -0.5, 0.8, 0, 1,
    0.5, 0.8, 1, 1,
    0.5, -0.8, 1, 0,
]);

const indexData = new Uint8Array([
    0, 1, 3,
    1, 2, 3,
]);

const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

gl.vertexAttribPointer(positionAttLocation, 2, gl.FLOAT, false, 4*4, 0);
gl.vertexAttribPointer(uvAttLocation, 2, gl.FLOAT, false, 4*4, 2*4);

gl.enableVertexAttribArray(positionAttLocation);
gl.enableVertexAttribArray(uvAttLocation);

const indexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexData, gl.STATIC_DRAW);

gl.clearColor(0, 0, 0, 1);
gl.clear(gl.COLOR_BUFFER_BIT);

async function loadTexture(imagePath) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => {
            resolve(image);
        };
        image.src = imagePath;
    });
}

async function run() {
    const image = await loadTexture('./../assets/cube.png');

    // Flips the texture vertically
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    // The texture unit to make active
    gl.activeTexture(gl.TEXTURE0);

    // Creates a new texture object and binds it
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Uploads the texture image data to the GPU
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 64, 64, 0, gl.RGB, gl.UNSIGNED_BYTE, image);

    // Generates mipmaps for the texture to improve rendering quality at different scales
    gl.generateMipmap(gl.TEXTURE_2D);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, indexData.length, gl.UNSIGNED_BYTE, 0);
}

run();