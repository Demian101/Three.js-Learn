import './style.css'
import * as dat from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { RedFormat } from 'three'

import firefliesVertexShader from './Shaders/Fireflies/vertex.glsl'
import firefliesFragmentShader from './Shaders/Fireflies/fragment.glsl'
import portalVertexShader from './Shaders/Portal/vertex.glsl'
import portalFragmentShader from './Shaders/Portal/fragment.glsl'

import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer.js'
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass.js'
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import {ShaderPass} from 'three/examples/jsm/postprocessing/ShaderPass.js'

import {GammaCorrectionShader} from 'three/examples/jsm/shaders/GammaCorrectionShader.js'
import {SMAAPass} from 'three/examples/jsm/postprocessing/SMAAPass.js'



import Stats from 'Stats.js'

/**
 * Stats
 */
 const stats = new Stats()
 stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
 document.body.appendChild(stats.dom)
/**
 * Base
 */
// Debug
const gui = new dat.GUI({
    width: 400
})

const debugObject =
{
    clearColor: '#56514e',
    portalColorStart: '#00fffb',
    portalColorEnd: '#f7efe8',
}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(debugObject.clearColor)

/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader()

const bakedTexture = textureLoader.load('Grotte/Baked.jpg')
bakedTexture.flipY = false;
bakedTexture.encoding = THREE.sRGBEncoding;
const leafTexture = textureLoader.load('Grotte/LeafsBaked.jpg')
leafTexture.flipY = false;
leafTexture.encoding = THREE.sRGBEncoding;
const trunkHalfTexture = textureLoader.load('Grotte/trunkHalfBaseColor.jpg')
trunkHalfTexture.flipY = false;
trunkHalfTexture.encoding = THREE.sRGBEncoding;
const trunkTexture = textureLoader.load('Grotte/trunkBaseColor.jpg')
trunkTexture.flipY = false;
trunkTexture.encoding = THREE.sRGBEncoding;

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

/**
 * Materials
 */


const bakedMaterial = new THREE.MeshBasicMaterial({
     map: bakedTexture
});
const bakedLeafMaterial = new THREE.MeshBasicMaterial({
     map: leafTexture
});
const trunkHalfMaterial = new THREE.MeshBasicMaterial({
    map: trunkHalfTexture
});
const trunkMaterial = new THREE.MeshBasicMaterial({
    map: trunkTexture
});

const PortalLightMaterial = new THREE.ShaderMaterial({
    uniforms: 
    {
        uTime: {value: 0.0},
        uColorStart: { value: new THREE.Color(debugObject.portalColorStart)},
        uColorEnd: { value: new THREE.Color(debugObject.portalColorEnd)}
    },
    vertexShader: portalVertexShader,
    fragmentShader: portalFragmentShader
})


const PoleLightMaterial = new THREE.MeshBasicMaterial({
    color: 0xFF8E36,
    // transparent: true,
    // blending: THREE.AdditiveBlending,
    // opacity: 0.9
})
// GLTF loader
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

gltfLoader.load(
    'Grotte/portalMerged.glb',
    (gltf) =>
    {
        

        const baked = gltf.scene.children.filter((child) => child.name.includes('Baked'))
        baked[0].material = bakedMaterial
        baked[2].material = bakedMaterial

        const grassMeshs = gltf.scene.children.filter((child) => (child.name.includes('Grass')))
        for(let child of grassMeshs) child.material = bakedLeafMaterial;

        const trunkHalfMeshs = gltf.scene.children.filter((child) => child.name.includes('TrunckHalf'))
        for(let child of trunkHalfMeshs) child.material =  trunkHalfMaterial;

        const trunkMesh = gltf.scene.children.find((child => child.name.includes('Cylinder')))
        trunkMesh.material = trunkMaterial;

        const PoleLight = gltf.scene.children.filter((child) => child.name.includes('Light'))

        PoleLight[0].material = PoleLightMaterial; 
        PoleLight[1].material = PoleLightMaterial; 

        const PortalLight = gltf.scene.children.find((child) => child.name.includes('Circle'))
        PortalLight.material = PortalLightMaterial;
        

        scene.add(gltf.scene);
    }
)

/**
 * Particles
 */
const firefliesGeometry = new THREE.BufferGeometry()
const firefliesCount = 30;
const firefliesVertex = new Float32Array(firefliesCount * 3)
const firefliesScale = new Float32Array(firefliesCount)

for (let i = 0; i < firefliesCount; i++) {
    firefliesVertex[i * 3 + 0] = (Math.random() - 0.5) * 4
    firefliesVertex[i * 3 + 1] = Math.random() * 2
    firefliesVertex[i * 3 + 2] = (Math.random() - 0.5) * 4   


    //Scale Array
    firefliesScale[i] = (Math.random() + 0.5) * 2.0;
}

firefliesGeometry.setAttribute('position', new THREE.BufferAttribute(firefliesVertex, 3))
firefliesGeometry.setAttribute('aScale', new THREE.BufferAttribute(firefliesScale, 1))


const firefliesShader = new THREE.ShaderMaterial({
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    uniforms: 
    {
        uSize: {value: 20.0},
        uPixelRatio: {value: Math.min(window.devicePixelRatio, 2)},
        uEmissive: {value: 2.0},
        uTime: {value: 0.0}
    },
    vertexShader: firefliesVertexShader,
    fragmentShader: firefliesFragmentShader,
    transparent: true
    
});

const firefliesParticles = new THREE.Points(
    firefliesGeometry,
    firefliesShader
);



scene.add(firefliesParticles)

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

    //Update fireflies ratio
    firefliesShader.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 4
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputEncoding = THREE.sRGBEncoding

/**
 * PostProcess
 */
//Handles all the browsers
let RenderTargetClass = null;

if(renderer.getPixelRatio() === 1 && renderer.capabilities.isWebGL2)
{
    RenderTargetClass = THREE.WebGLRenderTarget
    RenderTargetClass.samples = 1;
    console.log('Using WebGLMultisampleRenderTarget')
}
else
{
    RenderTargetClass = THREE.WebGLRenderTarget
    console.log('Using WebGLRenderTarget')
}

const renderTarget = new RenderTargetClass(
    800,
    600,
    {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat
    }
)


const effectComposer = new EffectComposer(renderer, renderTarget);
effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
effectComposer.setSize(sizes.width, sizes.height);

const renderPass = new RenderPass(scene, camera);
effectComposer.addPass(renderPass);

const unrealBloomPass = new UnrealBloomPass();
unrealBloomPass.enabled = true;
unrealBloomPass.strength = 0.05;
unrealBloomPass.radius = 2;
unrealBloomPass.threshold = 0.8;
// effectComposer.addPass(unrealBloomPass);

const gammaCorrectionShader = new ShaderPass(GammaCorrectionShader);
effectComposer.addPass(gammaCorrectionShader);

//SMAA pass
if(renderer.getPixelRatio() == 1 && !renderer.capabilities.isWebGL2)
{
    const smaaPass = new SMAAPass();
    effectComposer.addPass(smaaPass);

    console.log('Using SMAA');
}

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    stats.begin();
    const elapsedTime = clock.getElapsedTime()



    firefliesShader.uniforms.uTime.value = elapsedTime;
    PortalLightMaterial.uniforms.uTime.value = elapsedTime;

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)
    // effectComposer.render();

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
    stats.end()
}

tick()

/**
 * Debug
 */

const sceneUI = gui.addFolder('Scene');
const firefliesUI = gui.addFolder('FireFlies');
const portalUI = gui.addFolder('Portal');


sceneUI.close();
firefliesUI.close();
portalUI.close();

sceneUI
    .addColor(debugObject, 'clearColor')
    .onChange(() => scene.background = new THREE.Color(debugObject.clearColor))


firefliesUI
    .add(firefliesShader.uniforms.uSize, 'value')
    .min(0.001)
    .max(50.0)
    .step(0.001)
    .name('FireFliesSize')

firefliesUI
    .add(firefliesShader.uniforms.uEmissive, 'value')
    .min(0.001)
    .max(10.0)
    .step(0.001)
    .name('FireFliesEmissive')


portalUI
    .addColor(debugObject, 'portalColorStart')
    .onFinishChange(() => PortalLightMaterial.uniforms.uColorStart.value = new THREE.Color(debugObject.portalColorStart))


portalUI
    .addColor(debugObject, 'portalColorEnd')
    .onFinishChange(() => PortalLightMaterial.uniforms.uColorEnd.value = new THREE.Color(debugObject.portalColorEnd))




