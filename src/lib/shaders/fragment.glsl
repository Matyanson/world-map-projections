uniform sampler2D globeTexture;
uniform vec2 cursorPosition;

in vec2 vUV;
in vec3 vNormal;
in vec3 fragPositionGlobe;

float getDistOnGlobe(vec3 a, vec3 b) {
    float dotProduct = dot(normalize(a), normalize(b));
    float distance = acos(dotProduct); // Sphere radius is 1.0
    return distance;
}

void main() {
    vec3 cursor3D = vec3(0.0, 0.0, 1.0);
    float atmosphereIntensity = 1.05 - max(0.0, dot(vNormal, vec3(0.0, 0.0, 1.0)));
    vec3 atmosphereColor = vec3(0.3, 0.6, 1.0) * pow(atmosphereIntensity, 1.5);
    vec4 color = texture2D(globeTexture, vUV);
    color = vec4(color.xyz + atmosphereColor, 1.0);

    // draw cursor
    if(getDistOnGlobe(cursor3D, fragPositionGlobe) < 0.025) {
        gl_FragColor = mix(color, vec4(1.0, 0.0, 0.0, 1.0), 0.5);
    }
    else {
        gl_FragColor = color;
    }
}