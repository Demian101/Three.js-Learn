// precision mediump float;

varying vec2 vUv;

uniform vec3 uColor;
uniform sampler2D uTexture;

// varying float vRandom;
varying float vElevation;

void main()
{
    vec4 textureColor = texture2D(uTexture, vUv);
    // gl_FragColor = vec4(0.75, vRandom, 0.5, 1.0) ;
    // gl_FragColor = vec4(uColor, 1.0);
    vec4 color = vec4(vElevation * uColor, 1.0) + 0.5;
    // textureColor.rgb *= vElevation * 2.0 + 0.5;

    gl_FragColor = textureColor * color;
    // gl_FragColor = textureColor;
    // gl_FragColor = vec4(vUv, 1.0, 1.0);
}