
vec4 applyCursorCenteringGlobe(vec3 position, vec2 cursor) {
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

vec2 sphericalRotation(vec2 ab, vec2 offsetAB) {
    float lambda = ab.x;  // Longitude (λ)
    float phi = ab.y;     // Latitude (φ)

    float lambdaOffset = offsetAB.x; // Longitude offset (λ_offset)
    float phiOffset = offsetAB.y;    // Latitude offset (φ_offset)

    // Calculate rotated spherical coordinates
    float deltaLambda = lambda + lambdaOffset;

    float newLambda = atan(
        cos(phi) * sin(deltaLambda),
        cos(phiOffset) * cos(phi) * cos(deltaLambda) - sin(phiOffset) * sin(phi)
    );

    float newPhi = asin(
        sin(phi) * cos(phiOffset) + cos(phi) * sin(phiOffset) * cos(deltaLambda)
    );

    return vec2(newLambda, newPhi);
}

vec2 offsetUV(vec2 uv, vec2 offset) {
    vec2 uvSphere = uvToSphericalCoords(uv);
    vec2 offsetSphere = uvToSphericalCoords(offset);

    vec2 ab = sphericalRotation(uvSphere, offsetSphere);

    return sphericalCoordsToUV(ab);
}

void main() {
    vUV = offsetUV(uv, centralPoint);

    vec3 mappedPositionA = projectUVToPositionA(uv);
    vec3 mappedPositionB = projectUVToPositionB(uv);

    vec4 positionA = applyCursorCenteringA(mappedPositionA, cursorPosition);
    vec4 positionB = applyCursorCenteringB(mappedPositionB, cursorPosition);
    vec4 positionGlobe = applyCursorCenteringGlobe(position, cursorPosition);

    fragPositionGlobe = vec3(positionGlobe);

    // Interpolate between positionA and positionB
    vec4 viewPosition = mix(positionA, positionB, transition);

    vec3 normalA = positionA.xyz;
    vec3 normalB = positionB.xyz;
    vNormal = mix(normalA, normalB, transition);

    gl_Position = projectionMatrix * viewMatrix * viewPosition;
}