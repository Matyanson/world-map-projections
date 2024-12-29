uniform vec2 cursorPosition;
uniform float transition;

out vec2 vUV;
out vec3 fragPositionA;

vec2 uvToSphericalCoords(vec2 uv) {
    float a = (2.0 * uv.x - 1.0) * 3.14159265359;
    float b = (uv.y - 0.5) * 3.14159265359;
    return vec2(a, b);
}

vec3 projectUVToPositionA(vec2 uv) {
    return position;
}

vec2 applyMapProjectionB(float a, float b) {

    float x = a;
    float y = b;

    return vec2(x, y);
}

vec3 projectUVToPositionB(vec2 uv) {
    vec2 ab = uvToSphericalCoords(uv);
    vec2 xy = applyMapProjectionB(ab.x, ab.y);
    return vec3(xy, 1.0);
}

mat4 getCursorCenteringMatrixA(vec2 cursor) {
    vec2 sphereOriginOffset = vec2(-0.25, 0.0);
    vec2 cursorOnSphere = uvToSphericalCoords(cursor - sphereOriginOffset);

    float theta = cursorOnSphere.x; // Longitude
    float phi = -cursorOnSphere.y; // Latitude (inverted for equirectangular mapping)

    // Compute rotations
    mat4 rotX = mat4(
        1.0, 0.0,        0.0,        0.0,
        0.0, cos(phi),  -sin(phi),   0.0,
        0.0, sin(phi),   cos(phi),   0.0,
        0.0, 0.0,        0.0,        1.0
    );

    mat4 rotY = mat4(
        cos(theta),  0.0, sin(theta), 0.0,
        0.0,         1.0, 0.0,        0.0,
        -sin(theta), 0.0, cos(theta), 0.0,
        0.0,         0.0, 0.0,        1.0
    );

    return rotX * rotY;
}

mat4 getCursorCenteringMatrixB(vec2 cursor) {
    // map cursor according to the map projection function
    vec3 mappedCursor = projectUVToPositionB(cursor);

    // Compute translation
    mat4 translation = mat4(
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        -mappedCursor.x, -mappedCursor.y, 0.0, 1.0
    );

    return translation;
}

void main() {
    vec3 mappedPositionA = projectUVToPositionA(uv);
    vec3 mappedPositionB = projectUVToPositionB(uv);

    mat4 mapModelMatA = getCursorCenteringMatrixA(cursorPosition);
    mat4 mapModelMatB = getCursorCenteringMatrixB(cursorPosition);

    vUV = uv;

    vec4 viewPositionA = mapModelMatA * vec4(mappedPositionA, 1.0);
    vec4 viewPositionB = mapModelMatB * vec4(mappedPositionB, 1.0);
    fragPositionA = vec3(viewPositionA);

    // Interpolate between viewPositionA and viewPositionB
    vec4 viewPosition = mix(viewPositionA, viewPositionB, transition);

    gl_Position = projectionMatrix * viewMatrix * viewPosition;
}