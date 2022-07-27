import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'

const canvas = document.querySelector('.webgl')
const viewportSizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

const scene = new THREE.Scene()

/**
 * Creates a PerspectiveCamera.
 * @param {number} FOV - The field of view: the extent of the scene that is seen on the display at any given moment. The value is in degrees.
 * @param {number} aspectRatio - The size of the view: sizes.width / sizes.height.
 * @param {number} near - The near clipping plane.
 * @param {number} far - The far clipping plane.
 */
// function THREE.PerspectiveCamera(fieldOfView, aspectRatio, near, far) {}
const camera = new THREE.PerspectiveCamera(
  64,
  viewportSizes.width / viewportSizes.height,
  0.1,
  1000,
)

const renderer = new THREE.WebGLRenderer({
  canvas,
})
renderer.setClearColor(new THREE.Color(0xAA0808))
renderer.setSize(viewportSizes.width, viewportSizes.height)

const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshPhongMaterial({ color: 0x66ff22 })
const cube = new THREE.Mesh(geometry, material)

scene.add(cube)

// Adding a light for better 3D perception
{
  const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.72)
  directionalLight.position.set(-1, 2, 4)
  scene.add(directionalLight)
}

camera.position.z = 3

gsap.to(cube.position, { duration: 3, delay: 1, x: 2 })
// gsap.to(cube.position, { duration: 3, delay: 1, y: 2 })

const animate = () => {
  // const currentTime = Date.now()
  // const deltaTime = currentTime - time
  // time = currentTime

  // const elapsedTime = clock.getElapsedTime()

  requestAnimationFrame(animate)

  // cube.rotation.x += 0.001 * deltaTime
  // cube.rotation.y += 0.001 * deltaTime
  // cube.rotation.x = elapsedTime
  // cube.position.x = Math.sin(elapsedTime)
  // cube.rotation.y = elapsedTime
  // cube.rotation.x += 0.01
  cube.rotation.y += 0.01
  // cube.rotation.z += 0.01

  renderer.render(scene, camera)
}

animate()
