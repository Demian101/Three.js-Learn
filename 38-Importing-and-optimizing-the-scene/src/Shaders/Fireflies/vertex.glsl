#define USE_SIZEATTENUATION true

attribute float aScale;

uniform float uSize;
uniform float uPixelRatio;
uniform float uTime;



void main(){

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    modelPosition.y += sin(uTime * 0.2 + modelPosition.x * 100.0) * aScale * 0.25;
    


    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projection = projectionMatrix * viewPosition;

    gl_Position = projection;

    gl_PointSize = uSize * uPixelRatio * aScale;

    /**
        Size Attenuation
    */

    gl_PointSize *= ( 1.0 / - viewPosition.z );

    
}