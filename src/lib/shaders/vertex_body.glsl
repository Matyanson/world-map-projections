vec3 projectUVToPositionA(vec2 uv) {
    return position;
}

vec4 applyCursorCenteringA(vec3 position, vec2 cursor) {
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

    return rotX * rotY * vec4(position, 1.0);
}

void main() {
    vUV = uv;

    vec3 mappedPositionA = projectUVToPositionA(uv);
    vec3 mappedPositionB = projectUVToPositionB(uv);

    vec4 positionA = applyCursorCenteringA(mappedPositionA, cursorPosition);
    vec4 positionB = applyCursorCenteringB(mappedPositionB, cursorPosition);

    fragPositionA = vec3(positionA);

    // Interpolate between positionA and positionB
    vec4 viewPosition = mix(positionA, positionB, transition);

    gl_Position = projectionMatrix * viewMatrix * viewPosition;
}