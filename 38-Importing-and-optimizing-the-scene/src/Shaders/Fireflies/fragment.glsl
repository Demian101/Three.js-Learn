
uniform float uEmissive;


void main() {

    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
    float strength = 0.05 / distanceToCenter - 0.05 * 2.0;
    
    strength *= uEmissive;

    vec3 color = vec3(0.87, 0.65, 0.4);

    gl_FragColor = vec4(color, strength);
}