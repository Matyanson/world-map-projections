uniform vec2 cursorPosition;

out vec2 vUV;
out vec3 fragPosition;

mat4 getMapModelMat(vec2 cursor) {
    float latitude = (cursor.y - 0.5) * 3.14159265359; // Normalize to radians
    float longitude = (cursor.x - 0.5) * 6.28318530718; // Normalize to radians

    // Compute rotations
    mat4 rotX = mat4(
        1.0, 0.0, 0.0, 0.0,
        0.0, cos(latitude), -sin(latitude), 0.0,
        0.0, sin(latitude), cos(latitude), 0.0,
        0.0, 0.0, 0.0, 1.0
    );

    mat4 rotY = mat4(
        cos(longitude), 0.0, sin(longitude), 0.0,
        0.0, 1.0, 0.0, 0.0,
        -sin(longitude), 0.0, cos(longitude), 0.0,
        0.0, 0.0, 0.0, 1.0
    );

    mat4 rotZ = mat4(
        cos(latitude), -sin(latitude), 0.0, 0.0,
        sin(latitude), cos(latitude), 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0
    );


    return rotX * rotY;
}

void main() {
    mat4 mapModelMat = getMapModelMat(cursorPosition);

    vUV = uv;
    fragPosition = vec3(mapModelMat * vec4(position, 1.0));
    gl_Position = projectionMatrix * modelViewMatrix * vec4(fragPosition, 1.0);
}