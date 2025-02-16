uniform vec3 color;
uniform float tRot;
uniform float tTrans;

void main() {
    gl_FragColor = vec4(vec3(tRot, tTrans, 0.0), 1.0);
}