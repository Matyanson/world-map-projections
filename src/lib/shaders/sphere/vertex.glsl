uniform vec2 cursorPosition;
uniform vec2 centralPoint;
uniform float tRot;
uniform float tTrans;

out float z;

vec3 slerp(vec3 a, vec3 b, float t) {
    // Ensure the input vectors are normalized
    a = normalize(a);
    b = normalize(b);

    // Compute the cosine of the angle between the two vectors
    float dotAB = dot(a, b);
    dotAB = clamp(dotAB, -1.0, 1.0); // Avoid numerical errors

    // Compute the angle (theta) between the vectors
    float theta = acos(dotAB);

    // If the angle is very small, use linear interpolation (avoids precision issues)
    if (theta < 1e-6) {
        return mix(a, b, t);
    }

    // Compute the interpolation weights
    float sinTheta = sin(theta);
    float w1 = sin((1.0 - t) * theta) / sinTheta;
    float w2 = sin(t * theta) / sinTheta;

    // Compute the interpolated vector
    return w1 * a + w2 * b;
}


vec3 sphericalToCartesian(float lon, float lat, float r)
{
    lon = lon - 0.5 * 3.14159;
    lat = lat + 0.5 * 3.14159;

    float x = r * cos(lat) * cos(lon);
    float y = r * cos(lat) * sin(lon);
    float z = r * sin(lat);
    return vec3(x, y, z);
}

vec3 toSphereTransition(vec3 pos, float tRot, float tTrans) {
    vec3 spherePos = sphericalToCartesian(pos.x, pos.y, pos.z);
    vec3 originPos = vec3(0.0, 0.0, pos.z);

    // rotate
    vec3 posRot = slerp(spherePos, originPos, tRot);
    // translate to origin
    vec3 transOffset = vec3(pos.xy, 0.0);
    pos = mix(posRot, posRot + transOffset, tTrans);

    return pos;
}

void main() {
    vec3 pos = vec3(position.x, position.y, position.z);
    pos = toSphereTransition(pos, tRot, tTrans);

    z = pos.z;

    gl_Position = projectionMatrix * viewMatrix * vec4(pos, 1.0);
}