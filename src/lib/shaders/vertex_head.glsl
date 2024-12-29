uniform vec2 cursorPosition;
uniform float transition;

out vec2 vUV;
out vec3 fragPositionA;

vec2 uvToSphericalCoords(vec2 uv) {
    float a = (2.0 * uv.x - 1.0) * 3.14159265359;
    float b = (uv.y - 0.5) * 3.14159265359;
    return vec2(a, b);
}