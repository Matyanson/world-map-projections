uniform vec2 cursorPosition;
uniform vec2 centralPoint;
uniform float transition;

vec3 toSphere(float lon, float lat)
{
    float x = cos(lat) * cos(lon);
    float y = cos(lat) * sin(lon);
    float z = sin(lat);
    return vec3(x, y, z);
}


void main() {
    vec3 pos = vec3(position.x, position.y, position.z); //toSphere(position.x, position.y);

    gl_Position = projectionMatrix * viewMatrix * vec4(pos, 1.0);
}