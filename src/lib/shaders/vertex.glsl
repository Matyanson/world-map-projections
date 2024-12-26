out vec2 vUV;

void main() {
    vUV = uv;
    vec2 cursorPosition = vec2(0.5, 0.5);
    vec3 finalPosition = vec3((uv - cursorPosition) * vec2(2.0, 1.0), 0.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}