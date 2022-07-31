import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import ky from "kyouka";

const gui = new dat.GUI({ width: 310 });  // Debug
const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene();

/*  Test cube 
const cube = new THREE.Mesh(
    new THREE.BoxBufferGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial()
)
scene.add(cube)
*/

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.01,
  100
);
camera.position.x = 3;
camera.position.y = 3;
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * radiusenderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

const dimension = 3;

const params = {
  count: 100000,
  size: 0.01,
  radius: 5,   // 星系半径
  branches: 3,
  spin: 1,
  randomness: 0.2,
  randomnessPower: 2,
  insideColor: "#ff6030",  // orange red
  outsideColor: "#1b3984", // deep blue
};

let geometry = null;
let materail = null;
let points = null;

// 星系创建，每次调用这个函数，都需要移除上一次创建的星系
const generateGalaxy = () => {
  if (points) {
    geometry.dispose();   // dispose： free the memory
    materail.dispose();
    scene.remove(points);
  }

  geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(params.count * dimension);  // *3(x/y/z)
  const colors = new Float32Array(params.count * dimension);  // *3(r/g/b)

  for (let i = 0; i < params.count; i++) {
    const i3 = i * dimension;
    const rdn_range_0_1 = ky.randomNumberInRange(0, 1)
    const radius_ =  rdn_range_0_1 * params.radius;  // 星系半径 * (0,1) 之间的的随机值
    const branchAngle =
      ((i % params.branches) / params.branches) * ky.deg2rad(360);
    const spinAngle = params.spin * radius_;  // 离星系中心越远，旋转越发散

    // 增加一些随机性
    const randomX =
      Math.pow(Math.random(), params.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      params.randomness * radius_;
    const randomY =
      Math.pow(Math.random(), params.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      params.randomness * radius_;
    const randomZ =
      Math.pow(Math.random(), params.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      params.randomness * radius_;
    positions[i3] = Math.cos(branchAngle + spinAngle) * radius_ + randomX;
    positions[i3 + 1] = randomY;
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius_ + randomZ;

    const colorInside = new THREE.Color(params.insideColor);
    const colorOutside = new THREE.Color(params.outsideColor);
    /* 
     * lerp(color, alpha) : 
     *   ① 参数是要变成的颜色 
     *   ② 是插值因子，因子越大，越接近 color 参数
     * 这里传入的 alpha 参数就是 rdn_range_0_1 这个随机值 ( 上面定义了 rdn_range_0_1 = radius_ / params.radius)
     * 核心逻辑是 ： 
     *    rdn_range_0_1 越小，距离星系中心越近，颜色越接近 colorInside(红色)，说明星系就炽热
     *    rdn_range_0_1 越大，距离星系中心越远，颜色越接近 colorOutside(蓝色)，说明星系就冷寂
    */
    const mixedColor = colorInside.clone();
    mixedColor.lerp(colorOutside, radius_ / params.radius); 
    colors[i3]     = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;
  }

  // shaders
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, dimension));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, dimension));

  materail = new THREE.PointsMaterial({
    size: params.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,   // 别忘了标识 Color 的顶点属性
  });

  points = new THREE.Points(geometry, materail);
  scene.add(points);
};

generateGalaxy();

// 每当参数变化，都需要调用 generateGalaxy 重新创建星系
gui
  .add(params, "count")
  .min(100)
  .max(1000000)
  .step(100)
  .onFinishChange(generateGalaxy); 
gui
  .add(params, "size")
  .min(0.001)
  .max(0.1)
  .step(0.001)
  .onFinishChange(generateGalaxy);
gui
  .add(params, "radius")
  .min(0.001)
  .max(20)
  .step(0.001)
  .onFinishChange(generateGalaxy);
gui
  .add(params, "branches")
  .min(2)
  .max(20)
  .step(1)
  .onFinishChange(generateGalaxy);
gui
  .add(params, "spin")
  .min(-3)
  .max(3)
  .step(0.001)
  .onFinishChange(generateGalaxy);
gui
  .add(params, "randomness")
  .min(0)
  .max(1)
  .step(0.002)
  .onFinishChange(generateGalaxy);
gui
  .add(params, "randomnessPower")
  .min(1)
  .max(10)
  .step(1)
  .onFinishChange(generateGalaxy);
gui.addColor(params, "insideColor").onFinishChange(generateGalaxy);
gui.addColor(params, "outsideColor").onFinishChange(generateGalaxy);
