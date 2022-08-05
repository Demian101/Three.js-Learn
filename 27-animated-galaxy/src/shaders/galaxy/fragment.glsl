varying vec3 vColor;

float invert(float n){
    return 1.0 - n;
}

void main(){
    /*
     内置变量 `gl_FragCoord` 表示 WebGL 在 canvas 画布上渲染的所有片元或者说像素的坐标，
     坐标原点是 canvas 画布的左上角，x 轴水平向右，y 竖直向下，gl_FragCoord 坐标的单位是像素，值是 `vec2(x,y)` , 
     通过 `gl_FragCoord.x`、`gl_FragCoord.y` 方式可以分别访问片元坐标的纵横坐标。
    */
    float strength = distance(gl_PointCoord, vec2(0.5, 0.5));   // 即 vec2(0.5, 0.5)
    // strength = invert(step(strength,0.5));
    strength = invert(strength);
    strength = pow(strength, 10.0);
    vec3 color = mix(vec3(0.), vColor, strength);
    gl_FragColor = vec4(color, 1.0);
}