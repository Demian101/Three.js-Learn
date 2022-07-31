import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import ky from "kyouka";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();
const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene();

const textureLoader = new THREE.TextureLoader();
const particleTexture = textureLoader.load('/textures/particles/2.png')


// const particleGeometry = new THREE.SphereBufferGeometry(1, 32, 32);
const particleGeometry = new THREE.BufferGeometry();

const count = 50000

const positions = new Float32Array(count*3);  // x/y/z 坐标
const colors = new Float32Array(count*3);  // R、G、B 坐标，所以也是 3 

for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 5 ; // random() 的范围是 0 ~ 1， 故 -0.5 ；
  colors[i] = Math.random();
}

particleGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)  // xyz
);
particleGeometry.setAttribute(
  "color",
  new THREE.BufferAttribute(colors, 3)  // xyz
);


// Material  : 
const particleMaterial = new THREE.PointsMaterial()

particleMaterial.size = 0.02
particleMaterial.Attenuation = false 
particleMaterial.color = new THREE.Color('yellow') // #ff88cc
particleMaterial.transparent = true
particleMaterial.alphaMap = particleTexture  // 使用纹理，定义粒子的形状
// particleMaterial.alphaTest = 0.001
// particleMaterial.depthTest = false
particleMaterial.depthWrite = false
particleMaterial.vertexColors = true

// Points : 
const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);


/*
// const particleTexture = textureLoader.load("/textures/particles/2.png");

const particleGeometry = new THREE.BufferGeometry();
const dimension = 3;
const count = 20000;
const total = dimension * count;
const positions = new Float32Array(total);
const colors = new Float32Array(total);
for (let i = 0; i < total; i++) {
  positions[i] = ky.randomNumberInRange(-0.5, 0.5) * 10;
  colors[i] = ky.randomNumberInRange(0, 1);
}
particleGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, dimension)
);
particleGeometry.setAttribute(
  "color",
  new THREE.BufferAttribute(colors, dimension)
);

const particleMaterial = new THREE.PointsMaterial({
  size: 0.1,
  // color: new THREE.Color("#ff88cc"),
  alphaMap: particleTexture,
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  vertexColors: true,
});
const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);
*/

/**
 * Sizes
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
  0.1,
  100
);
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
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

  // particles.rotation.y = elapsedTime * 0.2;

  // for (let i = 0; i < count; i++) {
  //   const group = i * dimension;
  //   const yAxis = group + 1;
  //   const xValue = particleGeometry.attributes.position.array[group];
  //   particleGeometry.attributes.position.array[yAxis] = Math.sin(
  //     elapsedTime + xValue
  //   );
  // }

  // particleGeometry.attributes.position.needsUpdate = true;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
