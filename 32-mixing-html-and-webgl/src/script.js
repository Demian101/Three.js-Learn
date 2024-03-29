import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { gsap } from "gsap";
import ky from "kyouka";

/**
 * Loaders
 */
let sceneReady = false;

/*
  现在遇到的问题是在加载场景时关键点是可见的。一个简单的解决方法是创建一个变量为 false 并在一切准备就绪后将其设置为 true。
  在 tick 函数中，我们只会在此变量为 true 时更新点。
  创建一个 sceneReady 变量为 false ，并在 loadingManager 成功函数中，在 2000 毫秒后将其设置为 true 
*/
const loadingBarElement = document.querySelector(".loading-bar");
const loadingManager = new THREE.LoadingManager(
  // Loaded
  async () => {
    // Wait a little
    await ky.sleep(500);
    // Animate overlay
    gsap.to(overlayMaterial.uniforms.uAlpha, {
      duration: 3,
      value: 0,
      delay: 1,
    });

    // Update loadingBarElement
    loadingBarElement.classList.add("ended");
    loadingBarElement.style.transform = "";

    await ky.sleep(2000);
    sceneReady = true;
  },

  // Progress
  (itemUrl, itemsLoaded, itemsTotal) => {
    // Calculate the progress and update the loadingBarElement
    const progressRatio = itemsLoaded / itemsTotal;
    loadingBarElement.style.transform = `scaleX(${progressRatio})`;
  }
);
const gltfLoader = new GLTFLoader(loadingManager);
const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager);

// 3 个 hover 上去， 可以显示详细信息的 Points
// document.querySelector(...) to retrieve the element from the HTML.
const points = [
  {
    position: new THREE.Vector3(1.55, 0.3, -0.6),
    element: document.querySelector(".point-0"),
  },
  {
    position: new THREE.Vector3(0.5, 0.8, -1.6),
    element: document.querySelector(".point-1"),
  },
  {
    position: new THREE.Vector3(1.6, -1.3, -0.7),
    element: document.querySelector(".point-2"),
  },
];

/**
 * Base
 */
const debugObject = {};
const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene();

 /*
  *  Overlay
  */
const overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1);
const overlayMaterial = new THREE.ShaderMaterial({
  // wireframe: true,
  transparent: true,
  uniforms: {
    uAlpha: { value: 1 },
  },
  vertexShader: `
        void main()
        {
            gl_Position = vec4(position, 1.0);
        }
    `,
  fragmentShader: `
        uniform float uAlpha;

        void main()
        {
            gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
        }
    `,
});
const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial);
scene.add(overlay);

/**
 * Update all materials
 */
const updateAllMaterials = () => {
  scene.traverse((child) => {
    if (
      child instanceof THREE.Mesh &&
      child.material instanceof THREE.MeshStandardMaterial
    ) {
      // child.material.envMap = environmentMap
      child.material.envMapIntensity = debugObject.envMapIntensity;
      child.material.needsUpdate = true;
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
};

/**
 * Environment map
 */
const environmentMap = cubeTextureLoader.load([
  "/textures/environmentMaps/0/px.jpg",
  "/textures/environmentMaps/0/nx.jpg",
  "/textures/environmentMaps/0/py.jpg",
  "/textures/environmentMaps/0/ny.jpg",
  "/textures/environmentMaps/0/pz.jpg",
  "/textures/environmentMaps/0/nz.jpg",
]);

environmentMap.encoding = THREE.sRGBEncoding;

scene.background = environmentMap;
scene.environment = environmentMap;

debugObject.envMapIntensity = 5;

/**
 * Models
 */
gltfLoader.load("/models/DamagedHelmet/glTF/DamagedHelmet.gltf", (gltf) => {
  gltf.scene.scale.set(2.5, 2.5, 2.5);
  gltf.scene.rotation.y = Math.PI * 0.5;
  scene.add(gltf.scene);

  updateAllMaterials();
});

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight("#ffffff", 3);
directionalLight.castShadow = true;
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.normalBias = 0.05;
directionalLight.position.set(0.25, 3, -2.25);
scene.add(directionalLight);

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
camera.position.set(4, 1, -4);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 3;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const raycaster = new THREE.Raycaster();

/**
 * Animate
 */
const tick = () => {
  // Update controls
  controls.update();

  // 使用 for 循环, 更新 3 个 Points 的位置:
  if (sceneReady) { 
    for (const point of points) {
      const screenPos = point.position.clone(); 
      screenPos.project(camera);

      // 为了测试 Point 点前面是否有东西，我们将使用 `Raycaster` 。
      // 这样一来 , 我们转动头盔时, 如果用户转到了头盔的背部 , 就隐藏正面的点 Point , 这很合理 ; 
      raycaster.setFromCamera(screenPos, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);
      if (intersects.length === 0) {
        point.element.classList.add("active");
      } else {
        const intersectionDistance = intersects[0].distance; // (第 1 个) 交点距离
        const pointDistance = point.position.distanceTo(camera.position);  // 点到摄像机的距离
        if (intersectionDistance < pointDistance) {
          point.element.classList.remove("active");
        } else {
          point.element.classList.add("active");
        }
      }

      const tx = (screenPos.x * sizes.width) / 2;
      const ty = (screenPos.y * sizes.height) / -2;
      point.element.style.setProperty("--tx", `${tx}px`);
      point.element.style.setProperty("--ty", `${ty}px`);
    }
  }

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
