

varying vec2 vUv;

void main(){
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition =  viewMatrix * modelPosition;
    vec4 projection = projectionMatrix * viewPosition;

    gl_Position = projection;    

    /*
        Varying
    */
    vUv = uv;
}