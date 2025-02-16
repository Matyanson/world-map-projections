uniform vec3 color;
uniform float tRot;
uniform float tTrans;

in float z;

void main() {
    gl_FragColor = vec4(vec3(color), 1.0);
}