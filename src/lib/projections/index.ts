type MapProjectionCodeRequired = {
    name: string,
    projection: string,
}
type MapProjectionCodeOptional = {
    position: string,
    centerTransformation: string
}
type MapProjectionCode = MapProjectionCodeRequired & Partial<MapProjectionCodeOptional>;

export function insertID(code: string, id: string): string {
    const keywords = ['applyMapProjection', 'projectUVToPosition', 'applyCursorCentering'];
    const pattern = `(${keywords.map(x => x + '\\s*').join('|')})\\(`;
    const replace = `$1${id}(`;
    return code.replaceAll(new RegExp(pattern, 'gm'), replace);
}

export const defaultValue: MapProjectionCodeOptional = {
    position: `
    vec2 ab = uvToSphericalCoords(uv);
    vec2 xy = applyMapProjection(ab.x, ab.y);
    return vec3(xy, 1.0);`,
    centerTransformation: `
    vec3 mappedCursor = projectUVToPosition(cursor);
    vec3 finalPosition = position - vec3(mappedCursor.xy, 0.0);
    return vec4(finalPosition, 1.0);`
}

export const values: MapProjectionCode[] = [
    {
        name: 'Globe',
        projection: `
        float x = 0.0;
        float y = 0.0;`,
        position: `return position;`,
        centerTransformation: `
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

        return rotX * rotY * vec4(position, 1.0);`
    },
    {
        name: 'Equirectangular',
        projection: `
        float x = a;
        float y = b;`
    },
    {
        name: 'Mercator',
        projection: `
        float x = a;
        float y = log(1.0 / cos(b) + tan(b));`
    },
    {
        name: 'Sinusoidal',
        projection: `
        float x = a * cos(b);
        float y = b;`
    },
    {
        name: 'Central Cylindrical',
        projection: `
        float x = a;
        float y = tan(b);`
    },
    {
        name: 'Lambert Cylindrical Equal Area',
        projection: `
        float x = a;
        float y = sin(b);`
    },
]