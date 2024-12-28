uniform sampler2D globeTexture;
uniform vec2 cursorPosition;

in vec2 vUV;
in vec3 fragPositionA;

float getDistOnGlobe(vec3 a, vec3 b) {
    float dotProduct = dot(normalize(a), normalize(b));
    float distance = acos(dotProduct); // Sphere radius is 1.0
    return distance;
}

void main() {
    vec3 cursor3D = vec3(0.0, 0.0, 1.0);
    vec4 color = texture2D(globeTexture, vUV);

    if(getDistOnGlobe(cursor3D, fragPositionA) < 0.025) {
        gl_FragColor = mix(color, vec4(1.0, 0.0, 0.0, 1.0), 0.5);
    }
    else {
        gl_FragColor = color;
    }
}