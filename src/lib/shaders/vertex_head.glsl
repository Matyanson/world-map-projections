uniform vec2 cursorPosition;
uniform vec2 centralPoint;
uniform float transition;

out vec2 vUV;
out vec3 vNormal;
out vec3 fragPositionA;

vec2 uvToSphericalCoords(vec2 uv) {
    float a = (2.0 * uv.x - 1.0) * 3.14159265359;
    float b = (uv.y - 0.5) * 3.14159265359;
    return vec2(a, b);
}

vec2 sphericalCoordsToUV(vec2 ab) {
    float u = (ab.x / 3.14159265359) * 0.5 + 0.5;
    float v = (ab.y / 3.14159265359)       + 0.5;
    return vec2(u, v);
}