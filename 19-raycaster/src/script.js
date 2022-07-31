import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

const getNormalizedMousePos = (e) => {
  return {
    // e.clientX 标识了鼠标的 X 位置, 单位是像素
    // *2 后 -1 ， 得到 [-1,1 ] 范围的数值
    x: (e.clientX / window.innerWidth) * 2 - 1,
    y: -(e.clientY / window.innerHeight) * 2 + 1,
  };
};

const gui = new dat.GUI();
const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene();

/**
 * Objects  定义 3 个红色的 Spheres
 */
const object1 = new THREE.Mesh(
  new THREE.SphereBufferGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" })
);
object1.position.x = -2;

const object2 = new THREE.Mesh(
  new THREE.SphereBufferGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" })
);

const object3 = new THREE.Mesh(
  new THREE.SphereBufferGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" })
);
object3.position.x = 2;

scene.add(object1, object2, object3);

/**
 * Sizes  老生常谈
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
 * Camera 老生常谈
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

// Controls 老生常谈
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer 老生常谈
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const raycaster = new THREE.Raycaster();

// const raycasterOrigin = new THREE.Vector3(-3, 0, 0);
// const raycasterDirection = new THREE.Vector3(10, 0, 0);
// raycasterDirection.normalize();

// raycaster.set(raycasterOrigin, raycasterDirection);

// const intersect = raycaster.intersectObject(object2)
// console.log(intersect)

// const intersects = raycaster.intersectObjects([object1, object2, object3])
// console.log(intersects)

/**
 * Animate
 */
const clock = new THREE.Clock();

const speeds = [0.3, 0.8, 1.4];

const mouse = new THREE.Vector2();
window.addEventListener("mousemove", (e) => {
  const { x, y } = getNormalizedMousePos(e);
  mouse.set(x, y);
});

let currentIntersect = null;

window.addEventListener("click", () => {
  if (currentIntersect) {
    console.log("click");
    switch (currentIntersect.object) {
      case object1:
        console.log("click obj1");
        break;
      case object2:
        console.log("click obj2");
        break;
      case object3:
        console.log("click obj3");
        break;
    }
  }
});

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  const objs = [object1, object2, object3];

  objs.forEach((obj, i) => {
    obj.position.y = Math.sin(elapsedTime * speeds[i]) * 1.5;
  });

  const raycasterOrigin = new THREE.Vector3(-3, 0, 0);
  const raycasterDirection = new THREE.Vector3(1, 0, 0);
  raycasterDirection.normalize();

  raycaster.set(raycasterOrigin, raycasterDirection);

  // 使用 camera 和 mouse 位置更新 picking ray
  raycaster.setFromCamera(mouse, camera);

  // 计算与 picking ray 相交的对象
  const intersects = raycaster.intersectObjects(objs);
  // console.log(intersects);

  // 设置为蓝色
  for (const intersect of intersects) {
    intersect.object.material.color.set("#0000ff");
  }

  // 设置回红色
  for (const obj of objs) {
    if (!intersects.find((intersect) => intersect.object === obj)) {
      obj.material.color.set("#ff0000");
    }
  }

  if (intersects.length) {
    if (!currentIntersect) {
      console.log("mouseenter");
    }
    currentIntersect = intersects[0];
  } else {
    if (currentIntersect) {
      console.log("mouseleave");
    }
    currentIntersect = null;
  }

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();