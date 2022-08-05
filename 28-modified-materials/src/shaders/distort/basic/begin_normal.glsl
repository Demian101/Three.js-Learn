// float angle=(position.y + utime) * 0.9
float angle=sin(position.y+uTime) * 0.4;

mat2 rotateMat=rotate(angle);
objectNormal.xz=objectNormal.xz*rotateMat;