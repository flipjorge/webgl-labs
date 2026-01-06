# WebGL Labs

This project was created to explore and learn WebGL concepts through practical examples.

## Running Locally

To run the examples locally, you can use `http-server`.

1. Install `http-server` globally (if not already installed):
```bash
npm install -g http-server
```

2. Start the server from the project root or inside an example folder:
```bash
http-server -p 3000 --cors
```

## Topics

### Context

WebGL2 rendering context setup establishes the bridge between the HTML5 Canvas and the GPU's rendering pipeline. This foundational step requires initializing the GL context, defining the programmable shader pipeline (Vertex and Fragment shaders), and managing the compilation and linking process to create an executable GPU program.

- `canvas.getContext('webgl2')`: Acquires the WebGL 2.0 rendering context from the HTML5 canvas element to begin API calls.
- `gl.createShader()` / `gl.compileShader()`: Creates shader objects and compiles GLSL source strings for the vertex and fragment stages.
- `gl.createProgram()` / `gl.linkProgram()`: Attaches compiled shaders and links them into a single executable program that runs on the GPU.
- `gl.drawArrays()`: Executes the draw call to render primitives (points, lines, triangles) based on the current state.

### Uniforms

Uniforms provide a mechanism to pass constant data from the CPU to the GPU that remains unchanged across a specific draw call. Unlike attributes, which differ per vertex, uniforms are conceptually global variables for the shader program, ideal for shared properties like transformation matrices, light settings, or global colors.

- `uniform` (GLSL keyword): Declares a global variable in the shader tailored for data that is constant across a draw call.
- `gl.getUniformLocation()`: Looks up the specific memory address ID of a uniform variable within the linked program.
- `gl.uniform[1234][fi][v]()`: Sends specific data types (floats, integers, vectors) from the JavaScript to the uniform location.

### Attributes

Attributes act as the primary input channel for vertex data in the shader pipeline, allowing each vertex to have unique properties such as position, color, or texture coordinates. Utilizing binary data buffers ensures high-performance data transfer to the GPU, with specific memory layouts defined to interpret the raw bytes correctly.

- `in` (GLSL keyword): Defines an input variable in the Vertex Shader that receives unique data for every vertex processed.
- `gl.createBuffer()` / `gl.bindBuffer()`: Allocates and binds a WebGLBuffer to store binary vertex data arrays.
- `gl.vertexAttribPointer()`: Describes how the GPU should interpret the raw binary data (stride, offset, size) for a specific attribute.
- `gl.enableVertexAttribArray()`: Activates the attribute stream so the vertex shader can pull data from the bound buffer during rendering.

### Elements

Indexed drawing uses an additional buffer (Element Array Buffer) to define the order of vertices, enabling the reuse of vertex data for shared points. This optimization significantly reduces memory footprint and vertex processing overhead by processing shared vertices only once in the pipeline for connected geometries.

- `gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER)`: Binds a specific buffer target for storing indices that define vertex consumption order.
- `gl.drawElements()`: Renders primitives by looking up vertices via the index buffer, replacing `gl.drawArrays`.
- Indexing strategy: Using indices to define triangles allows vertices shared by multiple triangles to be stored only once in the vertex buffer.

### Texture

Textures map 2D image data onto 3D geometry, adding surface detail without increasing geometric complexity. The process involves sampling pixel data (texels) in the fragment shader based on interpolated coordinate data (UVs) passed from the vertex stage.

- `gl.createTexture()` / `gl.bindTexture()`: Creates and activates a texture object to store and configure image data.
- `gl.texImage2D()`: Uploads the HTML Image element or data array to the GPU as the data source for the texture.
- `gl.generateMipmap()`: Automatically creates downscaled versions of the texture (mipmaps) to improve rendering quality at distances.
- `texture()` (GLSL function): Samples the color from the bound texture at the specific interpolated UV coordinate in the fragment shader.

### Vertex Array Object

Vertex Array Objects (VAOs) encapsulate the state of vertex attribute configurations and buffer bindings into a single state object. This architecture eliminates the overhead of re-binding buffers and re-defining attribute pointers for every draw call, streamlining the rendering loop for complex scenes.

- `gl.createVertexArray()`: Creates a new VAO container ID to hold vertex attribute state.
- `gl.bindVertexArray()`: Activates a VAO so that subsequent attribute pointer settings and buffer bindings are recorded into it.
- State Recording: All calls to `vertexAttribPointer` and `enableVertexAttribArray` are stored within the currently bound VAO.
- Fast Switching: Binding a previously recorded VAO instantly restores the entire attribute configuration, avoiding redundant API calls.

### Instancing

Geometry Instancing allows the GPU to render thousands of identical meshes in a single API call, each with unique variations like position or color. This relies on dividing attribute updates per-instance rather than per-vertex, drastically reducing CPU-side overhead for repetitive objects.

- `gl.vertexAttribDivisor()`: Configures an attribute to advance once per *instance* (e.g., per object) rather than once per vertex.
- `gl.drawArraysInstanced()`: Executes a command to draw the same geometry N times efficiently in a single call.
- Instance Data Buffers: Using separate buffers to hold per-instance data like transformation matrices or color variations.
- Attribute Combination: Combining standard attributes (mesh shape) with instanced attributes (position offset) in the Vertex Shader.

### Perspective

The Model-View-Projection (MVP) matrix pipeline transforms 3D coordinates from local object space into the normalized device coordinates (NDC) required by WebGL. This mathematical chain allows for simulating camera movement (View), object placement (Model), and 3D depth perception (Projection) on a 2D screen.

- `gl-matrix` library: Using external math libraries to compute complex 4x4 transformation matrices for Model, View, and Projection.
- `gl.uniformMatrix4fv()`: Uploads the computed 4x4 matrices to the shader uniforms to transform vertex positions.
- `gl.enable(gl.DEPTH_TEST)`: Activates the depth buffer to ensure objects closer to the camera correctly obscure those behind them.
- Coordinate Transformation: Multiplying `Projection * View * Model * Vertex` in the shader to move vertices from Local Space to Clip Space.

### Lightning

Directional (Lambertian) lighting simulates light sources that are infinitely far away, striking surfaces with parallel rays. The brightness of a surface is calculated using the dot product between the surface normal and the light direction, simulating realistic diffusion of light based on geometry orientation.

- Normal Attributes: Passing normal vectors (perpendicular to surface directions) as attributes to calculate lighting angles.
- Inverse Transpose Matrix: Computing a specific matrix to transform normals correctly when objects have non-uniform scaling.
- `dot()` (GLSL function): Calculating the dot product between the surface Normal and Light Direction to determine physically based brightness.
- `max(val, 0.0)`: Clamping lighting values to ensure surfaces facing away from the light receive zero illumination (no negative light).