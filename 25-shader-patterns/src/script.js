import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import testVertexShader from './shaders/test/vertex.glsl'
import testFragmentShader from './shaders/test/fragment.glsl'

// const li =  [0, 0.03, 0.06, 0.09, 0.12, 0.15, 0.18, 0.91, 0.94, 0.97, 1]
const x = [0,0.03,0.06,0.12,1,  0,0.03,0.06,0.12,1, 0,0.03,0.06,0.12,1, 0,0.03,0.06,0.12,1]
const y = [1,1,1,1,1, 0.97,0.97,0.97,0.97,0.97, 0.94,0.94,0.94,0.94,0.94, 0.03,0.03,0.03,0.03,0.03]
const lisx = x.map((v) => Math.floor(v*10)/10)
const lisy = y.map((v) => Math.floor(v*10)/10)
const res = lisx.map(function(v, i) {
    return v * lisy[i];
});
console.log("res, ", res)


/**
 * Base
 */
// Debug
const gui = new dat.GUI()
const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()

/**
 * Test mesh
 */
// Geometry
const geometry = new THREE.PlaneGeometry(1, 1, 32, 32)

// Material
const material = new THREE.ShaderMaterial({
    vertexShader: testVertexShader,
    fragmentShader: testFragmentShader,
    side: THREE.DoubleSide
})

// Mesh
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

console.log("uv", geometry.attributes.uv)
const uv = geometry.getAttribute('uv')
console.log("uv", uv)

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
// camera.position.set(0.25, - 0.25, 1)
camera.position.set(0, 0, 1)

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
const tick = () =>
{
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()