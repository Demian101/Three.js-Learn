# Three.js-Learn
Record my process of learning Three.js/Blender/React



# Create a Scene & Cube

To have anything displayed with three.js, we need 3 parts: 

- a **scene**, a **camera**, and a **renderer**, so we get to render the scene with a camera.
- 场景、相机和渲染器 , 我们可以使用相机渲染场景

```js
// Creating the scene
const scene = new THREE.Scene()

// Creating the camera
const camera = new THREE.PerspectiveCamera(
  64,
  sizes.width / sizes.height,
  0.1,
  1000,
)

// Creating a renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
})

// Setting the renderer's width and height
renderer.setSize(sizes.width, sizes.height)
```



 **`PerspectiveCamera`** ，这是一个使用透视投影的相机。这种投影模式旨在模仿人眼看到的方式。

- 第一个属性 : **field of view** 视野,  FOV 是在显示器上看到的场景范围 ,如 65° ;
- 第二个是 **aspect ratio** 纵横比。您几乎总是希望使用元素的宽度除以高度，否则您会得到与在宽屏电视上播放旧电影相同的结果——图像看起来被压扁了。
- 后两个属性是近剪裁平面和远剪裁平面 ( **near** and **far** clipping plane )。这意味着比 near 更近 / 比 far 更远的对象将不会被渲染。您现在不必担心这一点，但您可能希望在应用程序中使用其他值以获得更好的性能。



## Create a Cube

```js
// Creating the geometry  盒装几何体
const geometry = new THREE.BoxGeometry(1, 1, 1)

// Creating the material  材质
const material = new THREE.MeshBasicMaterial({ color: 0x66ff22 })

// Create the cube with the geometry and the material
const cube = new THREE.Mesh(geometry, material)

// Add the cube to the scene
scene.add(cube)

// Move the camera backwards prior rendering
// 在渲染之前向后移动相机
camera.position.z = 3
```



**`BoxGeometry`** : 给定宽度、高度和深度的矩形立方体。

 A **mesh** is an object that takes a geometry, and applies a material to it .

默认情况下，当我们调用 `scene.add()`  时，我们添加的任何内容都将被放置到坐标 `(0, 0, 0)`。这将导致相机和立方体在彼此内部。为了避免这种情况，我们只需将相机移开一点。





**Further Reading**

- [Three.js Documentation for creating a scene](https://threejs.org/docs/index.html#manual/en/introduction/Creating-a-scene)
- [BoxGeometry - three.js docs](https://threejs.org/docs/index.html#api/en/geometries/BoxGeometry)
- [PerspectiveCamera - three.js docs](https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera)
- [Viewing Frustum](https://en.wikipedia.org/wiki/Viewing_frustum)
- [WebGLRenderer - three.js docs](https://threejs.org/docs/index.html#api/en/renderers/WebGLRenderer)





# Transforming Objects 变换对象

我们需要学习如何转换对象，因为我们将在接下来的课程中为对象设置动画，并且我们需要在设置动画之前移动对象。

变换对象有四个属性：`position`, `scale`, `rotation`, and `quaternion` ( 位置、比例、旋转和四元数) 。所有这些属性都将编译为矩阵

 从 Object3D 继承的所有类都具有这些属性。例如，`PerspectiveCamera` 或  `Mesh`。



旋转按 x、y 和 z 顺序进行

Object3D 实例有一个 lookAt(... 方法，该方法旋转对象，使其 z 轴面向提供的目标) - Target 必须是 Vector3

> 没看懂

```js
import './style.css'
import * as THREE from 'three'

const canvas = document.querySelector('.webgl')
const viewportSizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
  64,  // 64°
  viewportSizes.width / viewportSizes.height,
  0.1,
  1000,
)

const renderer = new THREE.WebGLRenderer({
  canvas,
})
renderer.setClearColor(new THREE.Color(0x080808))
renderer.setSize(viewportSizes.width, viewportSizes.height)

// ~ RED CUBE ~
const geometry = new THREE.BoxGeometry(1, 1, 1)
// const material = new THREE.MeshBasicMaterial({ color: 0x66ff22 })
// Changin material type so that light gets reflected on the box
const material = new THREE.MeshPhongMaterial({ color: 0x66ff22 })
const cube = new THREE.Mesh(geometry, material)

scene.add(cube)

// const axesHelper = new THREE.AxesHelper(1, 1, 1)
// scene.add(axesHelper)

// const group = new THREE.Group()
// scene.add(group)

// Adding a light for better 3D perception
{
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.72)
  directionalLight.position.set(-1, 2, 4)
  scene.add(directionalLight)
}

camera.position.x = 1
camera.position.z = 3

const animate = () => {
  // 每秒进行旋转
  requestAnimationFrame(animate)

  cube.rotation.x += 0.01
  cube.rotation.y += 0.01

  renderer.render(scene, camera)
}

animate()
```



`requestAnimationFrame` : 

- 对于动画函数，我们使用 requestAnimationFrame 而不是 setInterval。前者的优点是当用户导航到另一个浏览器选项卡时暂停动画，因此不会浪费他们宝贵的处理能力和电池寿命。





#  Animations 动画

<img src="http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-07-27-1.gif" style="zoom:50%;" />

```js
import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'

const canvas = document.querySelector('.webgl')
const viewportSizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
  64,
  viewportSizes.width / viewportSizes.height,
  0.1,
  1000,
)

const renderer = new THREE.WebGLRenderer({  canvas,  })
renderer.setClearColor(new THREE.Color(0x080808))
renderer.setSize(viewportSizes.width, viewportSizes.height)

const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshPhongMaterial({ color: 0x66ff22 })
const cube = new THREE.Mesh(geometry, material)

scene.add(cube)

// Adding a light for better 3D perception
{
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.72)
  directionalLight.position.set(-1, 2, 4)
  scene.add(directionalLight)
}

camera.position.z = 3

// let time = Date.now()
// const clock = new THREE.Clock()

gsap.to(cube.position, { duration: 1, delay: 1, x: 2 })

const animate = () => {
  // 如果帧率设置 60 (fps , frame per second) 的话 , 
  //   那么就会每秒调用  `requestAnimationFrame` 60 次
  requestAnimationFrame(animate)

  cube.rotation.x += 0.01   // 向右移动
  cube.rotation.y += 0.01   // 沿轴旋转

  renderer.render(scene, camera)
}

animate()
```



Tips : 

`renderer.setClearColor(new THREE.Color(0x080808))` : 

- 背景颜色

`const material = new THREE.MeshPhongMaterial({ color: 0x66ff22 })` 

- 立方体 cube 的颜色

`  const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.72)`

- 光 , FFFFFF 是白色





```js
const animate = () => { 
  requestAnimationFrame(animate)
}
```

- 这里有一个自调用  : JS 会在下一帧调用 `animate` 
- 如果帧率设置 60 (fps , frame per second) 的话 , 那么就会每秒调用  `requestAnimationFrame` 60 次



## `gasp` : 

- GSAP 是一个强大的 JavaScript 工具集，可将开发人员变成动画超级英雄。构建适用于所有主流浏览器的高性能动画

---

- `delay:1` :  延迟 1 s 启动 Animation ; 
- `duration: 3` : 从  `cube.position ` 移动到  `x: 2` & `y: 2` 历时 3 s
- `x: 2` / `y: 2` : 目标位置

```js
gsap.to(cube.position, { duration: 3, delay: 1, x: 2 })
gsap.to(cube.position, { duration: 3, delay: 1, y: 2 })

const animate = () => {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}

animate()
```

![](http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-07-27-4.gif)



---

如果想给立方体本身加一些 Animation : 

```js
gsap.to(cube.position, { duration: 3, delay: 1, x: 2 })

const animate = () => {
  requestAnimationFrame(animate)
  cube.rotation.x += 0.01
  renderer.render(scene, camera)
}

animate()
```

![](http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-07-27-5.gif)



```js
  ...
  cube.rotation.y += 0.01
}
```

![](http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-07-27-6.gif)



----







# Cameras

<img src="http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-07-27-7.gif" style="zoom:50%;" />

```js
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
...

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

const renderer = new THREE.WebGLRenderer({
  canvas,
})
renderer.setClearColor(new THREE.Color(0x080808))
renderer.setSize(viewportSizes.width, viewportSizes.height)

const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshPhongMaterial({ color: 0x66ff22 })
const cube = new THREE.Mesh(geometry, material)

scene.add(cube)

{
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.72)
  directionalLight.position.set(-1, 2, 4)
  scene.add(directionalLight)
}

camera.position.z = 3
camera.lookAt(cube.position)

const animate = () => {
  requestAnimationFrame(animate)
  // camera.lookAt(new THREE.Vector3())

  // Orbit Controls
  controls.update()
  renderer.render(scene, camera)
}

animate()
```



**`camera.lookAt(cube.position)`** :  看往何处

-----

## OrbitControls

```js

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
```

- OrbitControls (轨道控制) 允许相机围绕目标轨道运行。
- `controls.enableDamping = true` :  拖拽后没有摩擦的丝滑感觉, 类似拖尾效果



在对相机的变换进行任何手动更改后，必须在其后调用 `controls.update()` : 

```js
//controls.update() must be called after ANY manual changes to the camera's transform
camera.position.set( 0, 20, 100 );
controls.update();
```





# Resizing/Fullscreen 窗口大小/全屏

![](http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-07-27-9.gif)

```js
const handleResize = () => {
  viewportSizes.width = window.innerWidth
  viewportSizes.height = window.innerHeight

  camera.aspect = viewportSizes.width / viewportSizes.height
  camera.updateProjectionMatrix()
  renderer.setSize(viewportSizes.width, viewportSizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  // 如果窗口被扩展的过大，PixelRatio（像素比）没有跟上的话，render 对象就会有锯齿感
  // 当然，也没必要设置过大浪费渲染资源，最大设置为 2 就好了。
}


const handleDoubleClick = () => {
  if (!(document.fullscreenElement || document.webkitFullscreenElement)) {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen()
    } else if (canvas.webkitRequestFullscreen) {
      canvas.webkitRequestFullscreen()
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen()
    }
  }
}

// 监听浏览器的原生事件 —— 当窗口大小被调整时， 更新我们的视口大小（viewportSizes.width / ..）
window.addEventListener('resize', handleResize)

// 窗口的双击事件： 双击全屏
window.addEventListener('dblclick', handleDoubleClick)
```



或者直接使用回调写法 : 

```js
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
```



# Geometries

![](http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-07-27-10.gif)

```js
import ky from "kyouka";
...

const geometry = new THREE.BufferGeometry();

// const positionsArray = new Float32Array([0, 0, 0, 0, 1, 0, 1, 0, 0]);
const count = 50;   // 生成 50 个几何体
const positionsArray = new Float32Array(count * 3 * 3);
for (let i = 0; i < count * 3 * 3; i++) {
    positionsArray[i] = ky.randomNumberInRange(-0.5, 0.5) * 4;
}

// itemSize = 3 因为每个顶点有 3 个值（ x/y/z 分量）
const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);
geometry.setAttribute("position", positionsAttribute);  // 和某种 shader 有关
const material = new THREE.MeshBasicMaterial({
  color: 0xffff00,
  wireframe: true,    // 显示网格的信息
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

...
```



`BufferGeometry` : Buffer 几何体, 在创建多个 item 时, 拥有更好的性能



`Float32Array` 是 JS 的创建数组的数据类型 , 为什么要用 Float32Array  而不是 Array 呢 ? 

> glMatrix 主要是为 WebGL 开发的，它要求向量和矩阵作为 Float32Array 传递。因此，对于 WebGL 应用程序，从 Array 到 Float32Array 的潜在高昂的转换成本需要包含在任何性能测量中

- `Float32Array(count * 3 * 3) ` :  是什么意思 ? 
  - 我们要生成 50 个 triangles , 每个 triangle 有 3 个顶点 ; 
  - 一个顶点需要 3 个数字来定位坐标
- `ky.randomNumberInRange` :  `kyouka` 只是个为了生成范围内随机数的工具....
  - `(-0.5, 0.5) * 4`  表示从 (-2 , 2 ) 的范围内生成顶点的坐标 , 插入到 positionsArray 中



`BufferAttribute(positionsArray, 3)` : 

- itemSize = 3 因为每个顶点有 3 个值（ x/y/z 分量）



`setAttribute`  : `Sets an attribute to this geometry.`

- `'position'` 和某种 shader 着色器有关, 目前我们先这么用 ; 





# Debug UI

<img src="http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-07-27-092455.png" style="zoom:50%;" />

> 右侧的控制栏就是 Debug UI , 可以用来方便的控制 Renderer 的状态 ; 



```js
import * as dat from 'dat.gui'
import gsap from 'gsap'

// Debug
const gui = new dat.GUI({ closed: true })
// Debug object
const parameters = {
  color: 0x321dd4,
  spin() {
    gsap.to(cube.rotation, { y: cube.rotation.y + 4, duration: 2 })
  }
}

gui   // 如果面板上的 color 被人改变， 那么 onChange 触发修改 material 的颜色
  .addColor(parameters, 'color')
  .onChange(() => material.color.set(parameters.color))

gui.add(parameters, 'spin')   // 添加 spin(旋转) 方法，点击触发 gsap 的转一转



/* 
 * cube 定义区域
 * scene.add(cube)
 * ...
*/

// Debug
// gui.add(cube.position, 'y', -3, 3, 0.01)
// 链式调用：最小-3，最大 3，精度为 0.01 , 命名为 Elevation
// 自动判断 cube.visible ,发现是 Boolean 类型，应用 Checkbox 单选框
//    判断 material.wireframe , 发现是 Boolean 类型，应用 Checkbox 单选框
gui.add(cube.position, 'y').min(-3).max(3).step(0.01).name('Elevation')
gui.add(cube, 'visible')
gui.add(material, 'wireframe')
```

Tips : 

- 颜色需要  `gui.addColor`  , 而后跟一个 `onChange` 方法 ; 
- 链式调用





除了 dat.GUI , There are several tools we can use to debug Three.js applications:

- dat.GUI
- control.panel
- ControlKit
- Guify
- Oui

We'll be using `dat.GUi`:

```bash
npm i --save-dev dat.gui
```



我们可以将各种类型的元素添加到面板中 ( add to the panel) :

- **Range**  数据范围— for values with min/max
- **Color**  
- **Text**
- **Checkbox** 单选框 — for booleans
- **Select** 多选 — to select from a list of values
- **Button** — to trigger functions
- **Folder** — for organizing panels containing many elements ( 组织包含许多元素的面板, 没懂)



