uniform vec2 cursorPosition;

out vec2 vUV;
out vec3 fragPosition;

vec3 mapProjectionA(vec2 uv) {
    return position;
}

vec3 mapProjectionB(vec2 uv) {
    return vec3(uv * vec2(2.0, 1.0), 1.0);
}


mat4 getModelMatA(vec2 cursor) {
    vec2 sphereOriginOffset = vec2(0.25, 0.5);
    vec2 scaledCursor = (cursorPosition - sphereOriginOffset) * vec2(6.28318530718, 3.14159265359);

    float theta = scaledCursor.x; // Longitude
    float phi = -scaledCursor.y; // Latitude (inverted for equirectangular mapping)


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

mat4 getModelMatB(vec2 cursor) {
    // map cursor according to the map projection function
    vec3 mappedCursor = mapProjectionB(cursor);


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
    vec3 mappedPositionA = mapProjectionA(uv);
    vec3 mappedPositionB = mapProjectionB(uv);

    mat4 mapModelMatA = getModelMatA(cursorPosition);
    mat4 mapModelMatB = getModelMatB(cursorPosition);

    vUV = uv;

    vec4 viewPosition = mapModelMatA * vec4(mappedPositionA, 1.0);
    // vec4 viewPosition = mapModelMatB * vec4(mappedPositionB, 1.0);
    fragPosition = vec3(viewPosition);
    gl_Position = projectionMatrix * viewMatrix * viewPosition;
}