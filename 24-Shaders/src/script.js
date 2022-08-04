import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'


import testVertexShader from './Shaders/Test/vertex.glsl'
import testFragmentShader from './Shaders/Test/fragment.glsl'

const gui = new dat.GUI()
const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const flagTexture = textureLoader.load('/textures/flag-algeria.jpg')

/**
 * Test mesh
 */
// Geometry
const geometry = new THREE.PlaneGeometry(1, 1, 32, 32)

const count = geometry.attributes.position.count;
const randoms = new Float32Array(count);

for(let i=0; i< count; i++) {
  randoms[i] = Math.random();
}

geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));

// console.log(geometry.attributes);

// Material
// const material = new THREE.RawShaderMaterial(
//   {
//     vertexShader: `
//       uniform mat4 projectionMatrix;
//       uniform mat4 viewMatrix;
//       uniform mat4 modelMatrix;

//       attribute vec3 position;

//       void main()
//       {
//         gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
//       }
//     `,
//     fragmentShader: `
//       precision highp float;

//       void main()
//       {
//         gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);
//       }
//     `
//   }
// )



// const material = new THREE.RawShaderMaterial(
// {
//   vertexShader: testVertexShader,
//   fragmentShader: testFragmentShader,
//   wireframe: false,
//   side: THREE.DoubleSide,
//   transparent: true,
//   uniforms:
//   {
//     uFrequency: {value: new THREE.Vector2(10, 8)},
//     uTime: {value: 0},
//     uColor: {value: new THREE.Color('orange')},
//     uTexture: {value: flagTexture}
//   }
// });
const material = new THREE.ShaderMaterial({
  vertexShader: testVertexShader,      // 上面导入的
  fragmentShader: testFragmentShader,  // 上面导入的
  wireframe: false,                    // 不显示网格
  side: THREE.DoubleSide,              // 双面
  transparent: true,                   // 开启透明
  uniforms:                            // 传入 uniforms
  {
    uFrequency: {value: new THREE.Vector2(10, 8)},  // 抖动频率, x轴10, y 轴 8
    uTime: {value: 0},         // 占个位置, 在 animate() 里会补充赋值
    uColor: {value: new THREE.Color('orange')},  // 传入的材质颜色
    uTexture: {value: flagTexture}               // 传入的 texture 质地
  }
});

console.log("geometry.",  geometry.attributes)


// Mesh
const mesh = new THREE.Mesh(geometry, material)
mesh.scale.y = 2/3;
scene.add(mesh)

/**
 * Shaders
 */


/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () =>
{
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0.25, - 0.25, 1)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const animate = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update controls
  controls.update()

  //Update uniform time
  // uTime.value 会被传入着色器 Shader 用作国旗的前后飘扬控制参数
  // console.log(elapsedTime) : 1.176, 1.32, 1.36, 1.43 ....
  material.uniforms.uTime.value = elapsedTime;

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(animate)
}

animate()


/**
 * Debug
 */
 gui
  .add(material.uniforms.uFrequency.value, 'x')
  .min(0)
  .max(20)
  .step(0.01)
  .name('frequencyX');

 gui
  .add(material.uniforms.uFrequency.value, 'y')
  .min(0)
  .max(20)
  .step(0.01)
  .name('frequencyY');

gui
  .addColor(material.uniforms.uColor, 'value')
  .onFinishChange(() => {material.needsUpdate = true})
  