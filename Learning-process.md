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
- requestAnimationFrame 请求浏览器定时回调 `animate()` 函数 





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

## Perspective 透视摄像机

第一种也是我们最常用到的 PerspectiveCamera 透视摄像机

因为它和我们人眼成像的原理类似  ,看到的物体会呈现近大远小的透视效果 , 所以被广泛应用在三维渲染中

在渲染的时候 , 会将三维物体投影到二维屏幕上 : 

<img src="http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-07-28-150453.png" style="zoom:50%;" />





## Orthographic 正交投影摄像机

另一种相机是 OrthographicCamera 正交投影摄像机

它会将空间中的**所有物体平行投射到投影面上** , 因此不会像透视相机那样星现近大远小的效果

正交相机主要是被用在像 CAD 这类需要精确测量物体尺寸的应用场景中, 比如用正交投影我们可以轻易渲染出物体的三视图等等

正交相机的视锥 (Frustum) 是一个长方体 : 

<img src="http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-07-28-150740.png" style="zoom:50%;" />

因此要定义一个正交相机 , 需要指定它**前后左右上下**这六个面的位置

```js
const camera = new THREE.OrthographicCamera(
  -1, // left
  1,  // right
  1,  // top
  1,  // bottom
  1,  // near
  100,  // far
}
```



-----

## 实例



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

**`camera.lookAt(cube.position)`** :  让相机看向空间中的某一个点

![](http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-07-28-6.gif)

​	

-----

### OrbitControls

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





# Texture 质地/纹理

<img src="http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-07-28-023105.png" style="zoom:30%;" />



纹理对象 `Texture` 就是包含一张图片的对象

```js
// loading 管理器
const loadingManager = new THREE.LoadingManager();

// 从 loading 管理器 中加载 textureLoader
const textureLoader = new THREE.TextureLoader(loadingManager);

// 使用 textureLoader 加载 png, 命名为 colorTexture
const colorTexture = textureLoader.load("/textures/minecraft.png");

const geometry = new THREE.BoxBufferGeometry(1, 1, 1);

// // array: Float32Array(48) [0, 1, 1, 1, 0, 0, 1, 0, 0 ......
console.log(geometry.attributes.uv);  

// magFilter : 当纹素覆盖超过一个像素时，如何对纹理进行采样。
//   默认值为 THREE.LinearFilter，它采用四个最接近的纹素并在它们之间进行双线性插值。
//      可选 THREE.NearestFilter，它使用最接近的纹素的值。
colorTexture.minFilter = THREE.NearestFilter;
colorTexture.magFilter = THREE.NearestFilter;

// 是否为纹理生成 mipmap（如果可能）。默认为真。如果您手动创建 mipmap，请将其设置为 false。
// Mipmapping 是一种基于每个纹理应用的纹理渲染技术。
// 当启用 mipmapping（默认）时，GPU 将使用不同大小的纹理版本来渲染表面，具体取决于它与相机的距离。
colorTexture.generateMipmaps = false;

// Apply colorTexture
const material = new THREE.MeshBasicMaterial({ map: colorTexture });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
```



----



<img src="http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-07-27-11.gif" style="zoom:50%;" />

```js
const colorTextureImageSourcePath = '/textures/door/color.jpg'

// ...

const loadingManager = new THREE.LoadingManager()

loadingManager.onStart = (url, itemsLoaded, itemsTotal) =>
  console.log(
    `Started loading file: ${url}.\nLoaded ${itemsLoaded} of ${itemsTotal} files.`
  )
loadingManager.onLoad = () => console.log('Loading complete!')
loadingManager.onProgress = (url, itemsLoaded, itemsTotal) =>
  console.log(
    `Loaded file: ${url}.\nLoaded ${itemsLoaded} of ${itemsTotal} files.`
  )
loadingManager.onError = (url) =>
  console.log(`There was an error loading ${url}`)


const colorTextureLoader = new THREE.TextureLoader(loadingManager)
const colorTexture = colorTextureLoader.load(colorTextureImageSourcePath)

// colorTexture.repeat.x = 2
// colorTexture.repeat.y = 3
// colorTexture.wrapS = THREE.MirroredRepeatWrapping
// colorTexture.wrapT = THREE.MirroredRepeatWrapping
// colorTexture.magFilter = THREE.NearestFilter
```



**Textures** are images that will **cover the surface of geometries**. There are many types fof textures.

- **Color (or Albedo)** — It's the simplest one. It's applied on the geometry.
- **Alpha** — 白色部分可见而黑色部分不可见的灰度图像。 Grayscale image with white part visible and black part not visible.
- **Height (or Displacement)** — 灰度图像.  Grayscale image。移动顶点以创建一些浮雕。需要足够的细分 Move the vertices to create some relief. Requires enough subdivision.
- Normal — 提供详细信息。不需要细分。顶点不会移动。将光线引向面部方向。添加具有大量细分的高度纹理的性能更好。 Provide details. Does not require subdivision. The vertices won't move. Lure the light on the face orientation. Better perf that adding a height texture with lots of subdivisions.
- **Ambient Occlusion** — 灰度图像。在缝隙中添加假阴影。物理上不准确。有助于创建对比并查看细节。 Grayscale image. Add fake shadows to crevices. Physically inaccurate. Helps to create contrast and see details.
- **Metalness** —主要用于反射。当白色时，它传达金属感。黑色时，表示非金属。  Grayscale image. Mostly used for reflection. When white, it conveys metallic. When black, it conveys non-metallic.
- **Roughness** — 通常与金属度一起使用。白色时，它很粗糙。黑色时，它是光滑的。用于光消散 Grayscale image. Usually used with metalness. When white, it's rough. When black, it's smooth. Used for light dissipation.

纹理（尤其是金属度和粗糙度）遵循 PBR 原则——基于物理的渲染，这种技术倾向于遵循现实生活中的方向以实现逼真的结果。



## load textures

首先，我们需要获取图像的路径。将图像添加到静态文件夹并像这样导入 : 

```js
const colorTextureImageSourcePath = '/textures/door/color.jpg'

const colorTextureImage = new Image()
const colorTexture = new THREE.Texture(colorTextureImage)

colorTextureImage.addEventListener('load', () => {
  colorTexture.needsUpdate = true
})

colorTextureImage.src = colorTextureImageSourcePath

...
const material = new THREE.MeshBasicMaterial({ map: colorTexture })
...
```



## Using `TextureLoader`

TextureLoader 的一个实例可以加载多个纹理。

实例可传递三个函数： load, progress, error.

- load : 纹理加载状态 ; 
- progress : 纹理加载过程 ;
- error : 错误处理 ;



texture Websites : 

- https://poliigon.com
- https://3dtextures.me
- https://arroway-textures.ch/

自己 DIY Texture : 

- substance designer





# Material 材质

不同的材质, 在光照下会呈现不一样的效果 : 

<img src="http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-07-28-143127.png" style="zoom:50%;" />

通过材质, 可以给物体设置

- 颜色 
- 光泽度
- 贴图 等 ...



`MeshBasicMaterial` : 

- 不参与光照计算 (Unlit) , 因此不会产生阴影
- 使用这种材质的三维物体看上去也很不真实

`Phong/Lambert` : 

- 可以实现光照效果 , 这 2 种材质实现了图形学中最基本的光照模型 ; 
- 可通过 `shininess` 来调节物体表面的光泽度 ;
- 通过 `map` 给物体表面贴上纹理 

`ToonMaterial` : 卡通画材质 : 

<img src="http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-07-28-145735.png" style="zoom:30%;" />



## Physically Based 基于物理的渲染

**Physically Based rendering : 基于物理的渲染**

除了 `MeshBasicMaterial / Phong / Lambert` , Three.js 还提供效果更好的, 也是被更加使用广泛的基于物理的材质 ( 计算量更大, 但是效果更逼真) : 

- `MeshStandardMaterial` 
- `MeshPhysicalMaterial` 



比如 : 

### 1. map 贴 Texture : 

先用 map 属性, 给物体贴上纹理 Texture : 

```js
const material = new Three.MeshStandardMaterial({
  map: loadTexture('rock/albedo.png')
})
```

<img src="http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-07-28-144137.png" style="zoom:50%;" />



### 2. RoughnessMap 设定粗糙度

用 `roughnessMap` 采设定表面不同位置的粗糙程度 : 

```js
const material = new Three.MeshStandardMaterial({
  map: loadTexture('rock/albedo.png'),
  RoughnessMap: loadTexture('rock/roughness.png'),
})
```

<img src="http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-07-28-144336.png" style="zoom:50%;" />



### 3. normalMap 法线贴图

接着我们可以用 `normalMap` 也就是**法线贴图**来给**每个像素点 设置不同的法向量**

法线会影响光照的计算 , 因此我们可以用它来模拟物体表面凹凸不平的效果

```js
const material = new Three.MeshStandardMaterial({
  map: loadTexture('rock/albedo.png'),
  RoughnessMap: loadTexture('rock/roughness.png'),
  normalMap: loadTexture('rock/normal.png'),
})
```

<img src="http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-07-28-144821.png" style="zoom:50%;" />



### 4. displacementMap 位移贴图

进一步，我们可以使用 `displacementMap` 来指定一个位移贴图 ( 或者叫高度贴图)

它会依据贴图**上下偏移物体表面的顶点坐标**

从而做到真正的物体**表面的起伏**

```js
const material = new Three.MeshStandardMaterial({
  map: loadTexture('rock/albedo.png'),
  RoughnessMap: loadTexture('rock/roughness.png'),
  normalMap: loadTexture('rock/normal.png'),
  displacementMap: loadTexture('rock/height.png'),
})
```

<img src="http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-07-28-145252.png" style="zoom:50%;" />



### 5. aoMap 环境光遮罩

最后我们还可以通过 `aoMap(Ambient Occlusion)`  指定一个 “环境光遮罩” 的贴图

简单来说，它会让被遮蔽的区域 (比如坑洞) 看起来**更暗**

从而进一步提升场景的真实感

```js
const material = new Three.MeshStandardMaterial({
  map: loadTexture('rock/albedo.png'),
  RoughnessMap: loadTexture('rock/roughness.png'),
  normalMap: loadTexture('rock/normal.png'),
  displacementMap: loadTexture('rock/height.png'),
  aoMap:  loadTexture('rock/ao.png'),
})
```

<img src="http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-07-28-145611.png" style="zoom:50%;" />





----

## 实例

![](http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-07-28-1.gif)

Material : put color on 每一个可见像素

```js
/* 前面是 Texture ... */

// 6 张环境贴图, negative-x , positive-x , negative-y .....
// 如果 object 表面光滑, 则可以映照出环境的图片 .
const cubeTextureLoader = new THREE.CubeTextureLoader()
cubeTextureLoader.setPath('/textures/environmentMaps/1/')
const environmentMapTexture = cubeTextureLoader.load([
  'px.jpg',
  'nx.jpg',
  'py.jpg',
  'ny.jpg',
  'pz.jpg',
  'nz.jpg',
])

// Standard Material
const material = new THREE.MeshStandardMaterial()
// material.color = new THREE.Color(0xff0000)
material.metalness = 0.8  // 材料多少像金属; 木材或石头等非金属材料使用 0.0，金属使用 1.0
material.roughness = 0  // 粗糙度;  0.0 表示平滑镜面反射，1.0 表示完全漫反射。默认 1.0
material.side = THREE.DoubleSide  // 双面显示, FrontSide 只显示前面; BackSide 只背面
// material.matcap = matcaps8Texture
// material.opacity = 0.5
// material.transparent = true
// material.alphaMap = doorAlphaTexture
// material.map = colorTexture
// material.displacementMap = heightTexture
// material.displacementScale = 0.05
// material.metalnessMap = metalnessTexture
// material.roughnessMap = roughnessTexture
// material.normalMap = normalTexture
// material.normalScale.set(0.5, 0.5)
material.envMap = environmentMapTexture  // 环境贴图(px/nx... 那 6 张 png)

// Debug UI - gui 部分 ; 
gui.add(material, 'metalness').min(0).max(1).step(0.0001)
gui.add(material, 'roughness').min(0).max(1).step(0.0001)
gui.add(material, 'side', {
  Front: THREE.FrontSide,
  Back: THREE.BackSide,
  Double: THREE.DoubleSide,
});  // 为啥不起作用

// 在 Obj 里加入 Material ;
const sphere = new THREE.Mesh(
  new THREE.SphereBufferGeometry(0.5, 16, 16),
  material
)
sphere.position.x = -1.5
const plane = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(1, 1, 20, 20),
  material
)

const torus = new THREE.Mesh(
  new THREE.TorusBufferGeometry(0.3, 0.2, 16, 32),
  material
)
```



`material.envMap = environmentMapTexture` : 

- 上面代码中用到的环境贴图 ; 
- 更多可以见 : https://polyhaven.com/

<img src="http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-07-28-043251.png" style="zoom:50%;" />









## 环境贴图

environmentMapTexture





# 3D - Text

![](http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-07-28-2.gif)

```js
const fontLoader = new THREE.FontLoader()
const createText = (font) => {
  const textGeometry = new THREE.TextBufferGeometry('Mauricio Paternina', {
    font,
    size: 0.5,
    height: 0.2,
    curveSegments: 5,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 4
  })

  textGeometry.center()  // 居中

  const textMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
  textMaterial.wireframe = true
  gui.add(textMaterial, 'wireframe')  // Debug .. 
  const text = new THREE.Mesh(textGeometry, textMaterial)
  scene.add(text)

  addDonuts(100)
}

fontLoader.load('/fonts/helvetiker_regular.typeface.json', createText)


// Axis Helper 辅助中轴线，用来 Check Text 是否居中
const axesHelper = new THREE.AxesHelper()
scene.add(axesHelper)
```



`fontLoader` : 字体加载 ;

`MeshMatcapMaterial` : MeshMatcapMaterial 不响应光照 : 

<img src="http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-07-28-045135.png" style="zoom:30%;" />





# Lights 灯光

![](http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-07-28-3.gif)

> 如上图, 可以看到一个光源 , 和物体表面的反射 ( 可能看不清楚)

<img src="http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-07-28-054204.png" style="zoom:50%;" />

> 如上图,  看到光源 正发出黄色的光

```js

/**
 * Lights
 */
//Three.color='0xffffff' 白色, 光照强度 intensity = 0.5 
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// const pointLight = new THREE.PointLight(0xffffff, 0.5);
// pointLight.position.x = 2;
// pointLight.position.y = 3;
// pointLight.position.z = 4;
// scene.add(pointLight);

const dirLight = new THREE.DirectionalLight(0x00fffc, 0.3);
dirLight.position.set(1, 0.25, 0);
scene.add(dirLight);

const hemiLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3);
scene.add(hemiLight);

const pointLight = new THREE.PointLight(0xff9000, 0.3, 10, 2);
pointLight.position.set(1, -0.5, 1);
scene.add(pointLight);

const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1);
scene.add(rectAreaLight);
rectAreaLight.position.set(-1.5, 0, 1.5);
rectAreaLight.lookAt(new THREE.Vector3());

const spotLight = new THREE.SpotLight(
  0x78ff00,
  0.5,
  10,
  Math.PI * 0.1,
  0.25,
  1
);
spotLight.position.set(0, 2, 3);
spotLight.target.position.x = -0.75;
scene.add(spotLight);
scene.add(spotLight.target);


const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemiLight, 0.2);
scene.add(hemisphereLightHelper);

const directionalLightHelper = new THREE.DirectionalLightHelper(dirLight, 0.2);
scene.add(directionalLightHelper);

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
scene.add(pointLightHelper);

const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);

const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
scene.add(rectAreaLightHelper);

// 在下一帧对几个光源进行更新 , 前面可能有一些 bug , 所以要手动 update 下
window.requestAnimationFrame(() => {
  spotLightHelper.update();
  rectAreaLightHelper.position.copy(rectAreaLight.position);
  rectAreaLightHelper.quaternion.copy(rectAreaLight.quaternion);
  rectAreaLightHelper.update();
});
```



`xxxLightHelper`  : 各种样的 LightHelper 可以帮我们定位光源的位置 : 

![](http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-07-28-063238.png)



为什么总是要添加 Ambient Light ? 

- 在实际场景中, 因为光到处反射, 所以即使在物体背部, 也能看到它 ; 
- 但是 Three.js 很难模拟这种到处反射, 所以加一个昏暗的 Ambient 来模拟光的到处反射 ; 

<img src="http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-07-28-IMG_0773.jpg" style="zoom:40%;" />





# Shaow 阴影

![](http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-07-28-4.gif)

https://threejs.org/docs/#api/en/lights/shadows/DirectionalLightShadow

```js
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
directionalLight.position.set(2, 2, -1);
directionalLight.castShadow = true;  // default false
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 6;
directionalLight.shadow.camera.top = 2;
directionalLight.shadow.camera.right = 2;
directionalLight.shadow.camera.bottom = -2;
directionalLight.shadow.camera.left = -2;

scene.add(directionalLight);

const dirLightCameraHelper = new THREE.CameraHelper(
  directionalLight.shadow.camera
);
scene.add(dirLightCameraHelper);

gui.add(directionalLight, "intensity").min(0).max(1).step(0.001);
gui.add(directionalLight.position, "x").min(-5).max(5).step(0.001);
gui.add(directionalLight.position, "y").min(-5).max(5).step(0.001);
gui.add(directionalLight.position, "z").min(-5).max(5).step(0.001);
dirLightCameraHelper.visible = false;

directionalLight.shadow.radius = 10;

const spotLight = new THREE.SpotLight(0xffffff, 0.3, 10, Math.PI * 0.3);
spotLight.position.set(0, 2, 2);
spotLight.castShadow = true;
scene.add(spotLight);
scene.add(spotLight.target);

spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
spotLight.shadow.camera.fov = 30;
spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 6;

const spotLightHelper = new THREE.CameraHelper(spotLight.shadow.camera);
scene.add(spotLightHelper);
spotLightHelper.visible = false;

const pointLight = new THREE.PointLight(0xffffff, 0.3);
pointLight.castShadow = true;
pointLight.position.set(-1, 1, 0);
scene.add(pointLight);

pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;

pointLight.shadow.camera.near = 0.1;
pointLight.shadow.camera.far = 5;

const pointLightHelper = new THREE.CameraHelper(pointLight.shadow.camera);
scene.add(pointLightHelper);
pointLightHelper.visible = false;
```



`DirectionalLight.castShadow`

- 动态阴影: If set to `true`  , light will cast dynamic shadows. **Warning**: This is expensive





# 应用 - 猎人小屋

![](http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-07-28-5.gif)









# Particles / Sprite

## Geometry Points (球形) 几何点 : 

![](http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-07-29-2.gif)

```js
import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const gui = new dat.GUI();
const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene();

const textureLoader = new THREE.TextureLoader();

const particleGeometry = new THREE.SphereBufferGeometry(1, 32, 32);

// Material  : 
const particleMaterial = new THREE.PointsMaterial()

particleMaterial.size = 0.02
particleMaterial.Attenuation = true

// Points : 
const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};




/* 通用部分 */
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

/* Renderer */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/* Animate */
const clock = new THREE.Clock();

const animate = () => {
  const elapsedTime = clock.getElapsedTime();
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
animate();  // end of file.
```





## 随机点 (边缘问题)

<img src="http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-07-29-3.gif" style="zoom:67%;" />

```js
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
particleMaterial.vertexColors = true  // 为颜色添加顶点

// Points : 
const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);
```



边缘处理 : 如果不做处理 , 可以明显地看到正方形的边缘 : 

<img src="http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-07-29-083007.png" style="zoom:50%;" />

```js
/* 如下 3 个方法都可以处理 粒子的相互覆盖 / 穿越问题, 但是综合起来 , 
  depthWrite = false 效果是最好的 */ 
// particleMaterial.alphaTest = 0.001
// particleMaterial.depthTest = false
particleMaterial.depthWrite = false
```

综合来看 , depthWrite 是一个较好的选择 ; 











## particles 运动

<img src="http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-07-29-1.gif" style="zoom:80%;" />



```js
const particleTexture = textureLoader.load("/textures/particles/11.png");

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

/**
 * Animate
 */
const clock = new THREE.Clock();

const animate = () => {
  const elapsedTime = clock.getElapsedTime();

  // particles.rotation.y = elapsedTime * 0.2;

  for (let i = 0; i < count; i++) {
    const group = i * dimension;
    const yAxis = group + 1;
    const xValue = particleGeometry.attributes.position.array[group];
    particleGeometry.attributes.position.array[yAxis] = Math.sin(
      elapsedTime + xValue
    );
  }

  particleGeometry.attributes.position.needsUpdate = true;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

animate();
```





# Galaxy Generator 星系发生器

![](http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-07-30-1.gif)



```js
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
```



`dispose` ： free the memory

- 用来释放内存 , 防止生成的星系相互覆盖 ; 

`insideColor -> outsideColor  `  :营造星球从星系内部 ( 灼热/ 红色 ) 到 星系外部 (冷寂 / 深蓝) 的颜色变化 ; 

- `Lerp()` : 将此颜色的 RGB 值线性插值到传递参数的 RGB 值

```js
const mixedColor = colorInside.clone();
mixedColor.lerp(colorOutside, radius_ / params.radius);
  colors[i3]     = mixedColor.r;
  colors[i3 + 1] = mixedColor.g;
  colors[i3 + 2] = mixedColor.b;
```





# raycaster 光线投射器

- Detect if there is a wall in front of the player ; 检测玩家面前是否有墙
- Test if the laser gun hit something. 测试激光枪是否击中某物。
- Test if something is currently under the mouse to simulate mouse events. 测试当前是否有东西在鼠标下方以模拟鼠标事件
- Show an alert message if the spaceship is heading towards a planet   如果飞船正驶向行星，则显示警报消息



<img src="http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-07-30-064037.png" style="zoom:50%;" />

```js
const getNormalizedMousePos = (e) => {
  return {
    // e.clientX 标识了鼠标的 X 位置, 单位是像素
    // *2 后 -1 ， 得到 [-1,1 ] 范围的数值
    x: (e.clientX / window.innerWidth) * 2 - 1,
    y: -(e.clientY / window.innerHeight) * 2 + 1,
  };
};


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
```





# Physics ! 物理 !

引入 library : `CANNON.js` 

```
schteppe/cannon.js @ GitHub
https://schteppe.github.io/cannon.js/
```

文档地址 : 

- https://pmndrs.github.io/cannon-es/docs/modules.html





## 创建世界

```js
const world=new CANNON.World()    //创建 cannon世界
world.gravity.set(0,-9.82,0)    //设置重力方向

// 创建CANNON 球体
const sphereBody = new CANNON.Body({
  mass:1,
  position:new CANNON.Vec3(0,3,0),
  shape:new CANNON.Sphere(0.5)
})

// 将物体加入 世界中
world.addBody(sphere)

// 设置步进时间
world.step(1/60,deltaTime,3)

// 绑定 THREEjs - CANNONjs 两个球体位置关联
sphere.position.copy(sphereBody.position)

// 创建平台 Plat floor
const floorBody = new CANNON.Body({
  mass:0,
  shape:new CANNON.Plane()
})
world.addBody(floorBody)


// 给小球和平台添加材质
const defaultMat=new CANNON.Material('default')
const defaultContactMaterial=new CANNON.ContactMaterial(defaultMat,defaultMat,{
  friction:0.6,
  restitution:0.3
})
world.addContactMaterial(defaultContactMaterial)
```



## 给一个小球一个方向力

```js

const sphereBody=new CANNON.Body({
  mass:1,
  position:new CANNON.Vec3(0,3,0),
  shape:new CANNON.Sphere(0.5),
  material:defaultContactMaterial
})
sphereBody.applyLocalForce(new Vec3(150,0,0))
world.addBody(sphereBody)
```

<img src="https://img-blog.csdnimg.cn/eac2a5c1d5f742b8a4594d5fd57cbf72.gif" style="zoom:40%;" />





## gui 链式创建多个球体

```js
const guiObj={}
guiObj.createSphere = () => {
  createSphere( Math.random()*0.5, 
    {
      x: (Math.random()-0.5)*3,
      y: 3,
      z: (Math.random()-0.5)*3
    }),
}
gui.add(guiObj,'createSphere')
```



创建方块  :

```js
const box=new THREE.BoxBufferGeometry(1,1,1)
const boxMaterial=new THREE.MeshStandardMaterial({
  roughness:0.4,
  metalness:0.3,
})
const createBox=(width,height,depth,position)=>{
  const mesh=new Mesh(box,boxMaterial)
   mesh.scale.set(width,height,depth)
  mesh.castShadow=true
  mesh.position.copy(position)
  const body=new CANNON.Body({
    mass:1,
    position:new Vec3().copy(position),
    shape:new CANNON.Box(new CANNON.Vec3(width,height,depth)),
    material:defaultContactMaterial
  })
  objsToUpdate.push({mesh,body})
  scene.add(mesh)
  world.addBody(body)
}
 
/* ...
   ...
   ... */
guiObj.createBox=()=>{
   createBox(Math.random()*0.5,Math.random()*0.5,Math.random()*0.5,{x:(Math.random()-0.5)*3,y:3,z:(Math.random()-0.5)*3})
}
gui.add(guiObj,'createBox')
```











## 碰撞检测性能优化

### 1. 粗测阶段(BroadPhase)

`cannon.js` 会一直测试物体是否与其他物体发生碰撞，这非常消耗CPU性能，这一步成为 BroadPhase。当然我们可以选择不同的BroadPhase 来更好的提升性能。 

- `NaiveBroadphase` (默认) —— 测试所有的刚体相互间的碰撞。
- `GridBroadphase` —— 使用四边形栅格覆盖 world，仅针对同一栅格或相邻栅格中的其他刚体进行碰撞测试。
- `SAPBroadphase(Sweep And Prune)` —— 在多个步骤的任意轴上测试刚体。

默认 broadphase 为 NaiveBroadphase，建议切换到 SAPBroadphase。

当然如果物体移动速度非常快，最后还是会产生一些bug。

切换到SAPBroadphase只需如下代码

```js
world.broadphase=new CANNON.SAPBroadphase(world)
```



### 2. 睡眠Sleep

虽然我们使用改进的 BroadPhase 算法，但所有物体还是都要经过测试，即便是那些不再移动的刚体。

因此我们需要当刚体移动非常非常缓慢以至于看不出其有在移动时，我们说这个刚体进入睡眠，除非有一股力施加在刚体上来唤醒它使其开始移动，否则我们不会进行测试。

只需以下一行代码即可

```js
world.allowSleep=true
```

当然我们也可以通过Body的sleepSpeedLimit属性或sleepTimeLimit属性来设置刚体进入睡眠模式的条件。

- sleepSpeedLimit ——如果速度小于此值，则刚体被视为进入睡眠状态。
- sleepTimeLimit —— 如果刚体在这几秒钟内一直处于沉睡，则视为处于睡眠状态。
  



## 添加碰撞音效 

通过collide 来监听 碰撞事件 ,

碰撞强度可以通过 `contact`属性中的 `getImpactVelocityAlongNormal()`方法获取到

因此我们只要当碰撞强度大于某个值时再触发音效就行了

```js
const playHitSound=(collision)=>{
  if(collision.contact.getImpactVelocityAlongNormal()>1.5){
    hitSound.currentTime=0;
    hitSound.volume=Math.random()
    hitSound.play();
  }
}
```



## Web Worker

由于 JavaScript 是单线程模型，即所有任务只能在同一个线程上面完成，前面的任务没有做完，后面的就只能等待，这对于日益增强的计算能力来说不是一件好事。所以在 HTML5 中引入了 Web Worker 的概念，来为 JavaScript 创建多线程环境，将其中一些任务分配给 Web Worker 运行，二者可以同时运行，互不干扰。Web Worker 是运行在后台的  JavaScript，独立于其他脚本，不会影响页面的性能。

在计算机中做物理运算的是 CPU ，负责 WebGL 图形渲染的是GPU。现在我们的所有事情都是在 CPU 中的同一个线程完成的，所以该线程可能很快就过载，而解决方案就是使用 worker。

我们通常把进行物理计算的部分放到 worker 里面，具体可看这个例子的源码






# 导入 3D models



```js
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'


/**
 * Floor 地板
 */
const floor = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#444444',
        metalness: 0,
        roughness: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)



/** 
 * Loader 3D model  
 */

/* gltfLoader */
const gltfLoader = new GLTFLoader()
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')
gltfLoader.setDRACOLoader(dracoLoader)


let mixer = null;

gltfLoader.load('/models/Fox/glTF/Fox.gltf', gltf => {
    console.log(gltf)
    const fox = gltf.scene
    console.log(fox)
    fox.scale.set(0.025, 0.025, 0.025)
    scene.add(fox)
    mixer = new THREE.AnimationMixer(scene)
    const action = mixer.clipAction(gltf.animations[0])
    action.play()
})



const clock = new THREE.Clock()
let previousTime = 0

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    if(mixer) {
        mixer.update(deltaTime)
    }
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}
tick()
```



`DRACOLoader` : 

- 使用 Draco 库压缩的几何图形加载器。 Draco 是一个开源库，用于压缩和解压缩 3D meshes and point clouds.







## Realistic Render

真实感渲染, 从 `gLTF`  导入的模型颜色有问题, 真实感缺失 ;

![](http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-07-31-QQ20220731-173136.gif)



```js
const gltfLoader = new GLTFLoader();
gltfLoader.load("/models/hamburger.glb", (gltf) => {
  const burger = gltf.scene;
  burger.scale.set(0.3, 0.3, 0.3);
  burger.position.set(0, -1, 0);
  scene.add(burger);
  updateAllMats();
});

/* TextureLoader */
const cubeTextureLoader = new THREE.CubeTextureLoader();
const envMap = cubeTextureLoader.load([
  "/textures/environmentMaps/0/px.jpg",
  "/textures/environmentMaps/0/nx.jpg",
  "/textures/environmentMaps/0/py.jpg",
  "/textures/environmentMaps/0/ny.jpg",
  "/textures/environmentMaps/0/pz.jpg",
  "/textures/environmentMaps/0/nz.jpg",
]);
scene.background = envMap;
scene.environment = envMap;
envMap.encoding = THREE.sRGBEncoding;


/* gltfLoader.load 中调用的 updateAllMats (更新 Material) */
const updateAllMats = () => {
  scene.traverse((child) => {
    if (
      child instanceof THREE.Mesh &&
      child.material instanceof THREE.MeshStandardMaterial
    ) {
      console.log(child);
      child.material.envMap = envMap;
      child.material.envMapIntensity = debug.envMapIntensity;
      child.material.needsUpdate = true;
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
};


/* gui 更新也会调用 onFinishChange 来更新 Material ; */
gui
  .add(debug, "envMapIntensity")
  .min(0)
  .max(10)
  .step(0.001)
  .onFinishChange(updateAllMats);
```









# Shader

> Shader 是一种运行在 GPU上用着色器语言写的小程序, 简称着色器。 而 WebGL 中的 Shader 其实本质就是是 OpenGL ES 2.0的着色器语言，简称 GLSL ES

1. 它的语法虽然与C或C++非常相似, 但是绝对不能把它当成C或者C++来写，它是一门独立的数字处理语言（不含字符，指针等），有一定的规范要求，并且需要深刻理解渲染管线流程

2. 这种程序其实跟写一个普通的 C 语言程序类似，都是把代码经过编译然后链接成程序，然后在 GPU 上运行 （详细内容参考：《WebGL Programming guide》, OpenGL蓝宝书或者橙宝书等）

3. 另一方面要了解 GPU 上运行着色器程序的机制，首先GPU的核是非常多的（正确的说法是处理单元，用核这个概念形象引入CPU的架构来理解的），那么如果是给N个像素点着色，CPU则会按顺序执行N个指令，但是对于GPU来说，N个指令是并行计算执行的。怎么理解这个并行概念呢？举个例子就是：调用绘制指令绘制三角形的时候，三个顶点数据同时被GPU中的某三个核来执行顶点着色器（VertexShader）, 只不过它们得到的数据不一样，是分别三个点，执行完成后再执行片元着色器（FragmentShader）。 所有的Shader执行都是并行的，因此GPU的运行效率非常高，而且非常擅长矩阵计算（4阶以内）。那么这里有会有一个缺点：并行过程中顶点是无法相互联系的。这一点使编写shader的难度增加了许多。

4. 关于图形渲染管线流程这里就不多讲述，主要的流程是： Application Stage -> Geometry Stage -> Rasterizer Stage. 而Shader着色处理主要是发生在几何阶段和光栅化阶段，而这个着色过程也叫GPU的渲染管线流程。（全面的渲染管线流程请参阅《RealTime Rendering 3rd》, 最新的可以看第四版）

5. GPU的渲染管线流程：

   - 顶点着色器（Vertex Shader）【可编程】
   - 片元着色器（Fragment Shader） 【可编程】
   - 裁剪 （Clipping） 【可配置，或自定裁剪面】
   - 屏幕映射 （Screen Mapping） 【硬件完全固定】
   - 三角形设定 （Triangle Setup）【硬件完全固定】
   - 三角形遍历 （Triangle Traversal）【硬件完全固定】
   - 像素着色器 （Pixel Shader）【可编程，但WebGL中不存在】
   - 合并阶段 （Merger）【可配置】

   `因此在WebGL中想要进行着色处理，只能使用顶点着色器和片元着色器`

> 在使用 Threejs 引擎的API生成的所有场景对象都经过 Shader 处理（SVG渲染器接口和CSS2D/3D渲染器接口除外）, 跟其他的图形引擎工具一样，将许多通用的 Shader 代码进行封装再重新接口化。那么我们在开发图形应用就不需要花大量的时间去处理 Shader 着色的问题。



1. 从目前 Threejs 给我们开放的接口文档中，已经相对全面提供了很多处理物体着色的方法，而且自由度也非常高。但是应对多变且要求更高更复杂的需求的时候，通用的接口可能已经无法满足，那么就需要我们自定义 Shader 编程。

2. 那么 Threejs 开放出来的自定义 Shader，主要有两个渠道：

   - **ShaderMaterial / RawShaderMaterial** 自定义Shader材质

     主要应用在场景中物体对象的材质上的，因此 Shader 的着色效果只限制在物体身上

   - WebGLRenderTarget 渲染缓冲区（可选深度缓冲或者是模板缓冲）

     主要应用于全屏背景渲染着色，简单可理解为把当前绘制的帧画面进行后期处理，那么 Shader 的着色对象可作用在场景的所有对象身上

   （特殊渠道：可以在封装好的材质对象的编译前修改内部的 Shader 代码； 使用原生WebGL接口编写）



----

 **Threejs 中编写自定义 Shader 的基础要求**

1. 最好将：《WebGL Programming guide》 看一遍，或者其他的GLSL着色器语言开发书籍都可以, 把里面的基础例子理解并实现一遍。主要是了解GLSL的基础语法应用和特性。（达成`初步入门 - 阶段1`）
2. 线性代数的基础部分：（达成`初步入门 - 阶段2`）
   - 向量计算（加减法，点乘，叉乘等）、矩阵计算（乘法，变换，求逆，行列式，正交化等），及其几何意义。主要是基础部分，因为在Shader中频繁使用高阶的矩阵计算会出现性能问题，高阶矩阵处理可以在CPU中计算好后在传入Shader中也可以。
3. C / C++ 语法入门。不需要熟悉特定的API方法，只需要会运用一般的数字计算的语法、结构体、宏定义等即可。（达成`初步入门 - 阶段3`）





## 几何形状的装配和光栅化

在顶点着色器和片元着色器之间，有两个进程：

1. 图形装配；将顶点坐标装配成几何图形，又称图元(primitives)，图形类别由绘制方法的参数mode决定
2. 光栅化；将装配好的几何图形转换成片元块

大概流程是：当顶点着色器获取到缓冲区中的坐标时，坐标数据经过处理后赋值给 gl_Position, 此时已放入图形装配区；接下来继续执行顶点着色器，直至将所有的顶点数据传完，则开始根据mode参数类型来装配图形，然后通过光栅化把图形转变成图元，即可得到想要的像素块。

> 这个过程中如果有多余的顶点出现，则会在装配过程中舍弃

光栅化结束后，程序则开始逐片元调用片元着色器，每调用一次则处理一个片元，直至最后一个片元被处理。

> 片元着色其中有一个坐标变量：gl_FragCoord, 这个变量的1、2分量表示片元在窗口坐标系统中的坐标值，在编写shader的时候可以适当应用。

在顶点着色器和片元着色器之间，还有特别注意一种变量：varying 虽然说是varying变量是用于将顶点着色器的数据传递给片元着色器的，但这并不是简单的传递，而是经过内插过程(interpolation process), 一般采用的都是线性插值，其内插值不可能大于较大的顶点值，编写复杂shader的时候这里要注意。

（达成`正式入门 - 阶段2`）



###  纹理映射

将图片贴到几何体表面的图片则称之为纹理图像或纹理(texture)，根据纹理图像，为之前光栅化好的每个片元添加上对应的图像颜色则称为纹素(texel)

使用纹理映射的主要步骤有：

- 准备好图像以映射至几何图形
- 为几何图形指定映射方式
- 加载纹理图像，加以配置方便在 webgl 中使用
- `在片元着色器中提取纹理中的纹素，对应设置给片元`

> 上面所说的映射方式则是使用纹理坐标，在webgl系统中纹理坐标是二维的，为了区分 x,y 坐标，webgl使用 s,t 坐标( st 坐标系统),如下图; 另外这个坐标系统还有另外一个名称：**uv坐标**。针对GLSL中的语法，st分量可以访问纹理，这里使用st更加合适。 

<img src="http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-08-02-055141.png" style="zoom:70%;" />

> 取样器的作用实质是输入纹理坐标，返回纹理颜色。但是由于纹理像素是有大小的，取样器的纹理坐标很可能并不落在某个像素中心，则取样通常不是直接取纹理图像中的某个像素颜色，而是通过附近的若干个像素计算而得。

> webgl支付的纹理类型有两种：1.`二维纹理(gl.TEXTURE_2D)`, 2.`立方体纹理(gl.TEXTURE_CUBE_MAP)`

> 设置纹理图像参数时，需要指定纹素的格式，这个跟图片的格式有关：如jpg、bmp则指定为gl.RGB,PNG则是gl.RGBA,而类似灰度图等则用gl.LUMINANCE(L,L,L,1L:luminamce)或者gl.LUMINANCE_ALPHA(L,L,L,a).(luminance被称为发光率，指一个表面的光亮程度，通常使用物体表面r,g,b颜色分量值的加权平均来计算)

> 传递纹理坐标的时候，一定注意从顶点着色器的varying变量再传递给片元着色器，如上文所说，其间需要有内插值。

**多重纹理的使用：**

- 激活多个纹理单元
- 片元着色器中创建多个采用器，传递给采用器时要使用对应的纹理编号
- 确保多个纹理单元已经准备完成后，在片元着色器中提取各个纹素的颜色将它们相乘即可

（达成`正式入门 - 阶段3`）

....

https://gitee.com/zDawnING/ThreejsDocs



----

Shaders 以不同功能进行分类。

- **顶点着色器 Vertex shader**
- **像素着色器 Pixel shader**
- 几何着色器 Geometry shader
- 计算着色器 Compute shader
- 细分曲面着色器 Tessellation / hull shader



**为什么我们需要 Shader ？**

当我们在屏幕上绘制或显示一些物体时，这些物体的显示形式是图元 Primitives 或者网格 Mesh。

比如游戏中一个几何模型角色 或 一个贴在网格上的纹理角色，做阴影效果时先绘制网格, 再计算阴影，

比如一个发射物体发射前需要先绘制该物体外形网格。这些物体都可归结为网格 Mesh 

它可被分解为图元 Privitive，即 Privitive 是 Mesh 的基本单位。图元 Privitive 有三角形、直线或点。



当我们在屏幕上画一个三角形时，我们首先要绘制顶点 Vertex ，因为网格 Mesh 由顶点 Vertex 组成

此时就要用到 Vertex shader 顶点着色器, 我们将顶点信息 给 顶点着色器，以显示顶点信息。

其次是在这些顶点组成的区域之间填充颜色，此时用到像素着色器 Pixel shader 或 Fragment shader。

fragment（片段）有助于定义像素的最终颜色。



曲面细分着色器 Tessellation shader 或 Hull shader 是较后加入到 OpenGL4.0 和 DirectX 3d 11的。

Tessellation shader 主要用于细分网格。在 2016 年的 WWDC（Apple开发者大会）中，苹果发布会中讲到 Metal（苹果的图形API）上新的曲面细分管线 Tessellation pipeline，这个细分管线是 fixed function shader，固定渲染管线是嵌入硬件中不可外界编程的。



几何着色器 Geometry shader 可以操作几何上的图元。几何着色器以图元 Primitive 作为输入，就像顶点着色器以顶点作为输入。

在渲染管线顺序中，几何着色器就夹在顶点着色器和像素着色器中间。接下来是 Compute shader。Compute shader 是一个通用的着色器，它使用在渲染管线之外，即它不是用来绘制一个图元或渲染像素的。那它是用与什么的呢？ Compute shader 利用 GPUs 的并行计算处理能力来做通用计算任务。





## 顶点着色器 Vertex Shader

顶点着色器主要负责处理顶点数据，大部分就是在处理顶点的矩阵变换，将顶点的位置通过 MVP 矩阵乘法最终变换到裁剪空间。

**输入**：顶点着色器的输入数据一般是我们传入的 `attribute`、`uniforms` 变量。

**输出**：一般顶点着色器的运算结果输出是设置 `gl_Position`，也可以设置一些变量比如`gl_PointSize`或者 `varying`变量





## 片元着色器 fragment Shader

片元着色器在整个渲染中起到了非常大的作用，一般颜色，贴图采样，光照，阴影等计算都会在片元着色器中计算。

**输入**：片元着色器的输入数据一般是我们从顶点着色器传入的`varying`或者全局的`uniforms`变量。

**输出**：一般片元着色器的运算结果输出是设置`gl_FragColor`





## shader是如何运行的

想要了解 shader 是如何运行的，我们就要先知道整个 webgl 的运行机制。webgl 的一次绘制，需要经过大致的以下几个阶段。

- 创建 webgl 的应用程序 Program，从文本编译并使用 shader
- 将三维几何数据通过 attribute 传送给 GPU
- GPU 执行顶点着色器，处理顶点数据
- GPU 执行片元着色器，处理颜色等数据
- 将执行结果写入缓冲区（用于显示到屏幕或者后处理）

我们可以看到，shader 的执行是需要链接、编译后执行的，所以 shader 在运行时其实本身是不能修改的，但是我们可以修改一些数据参数值。







## 代码分析

为啥需要 Shader ? 

1. Threejs Material are limited ;
2. Add custom post-process ;

如下 ,我们想实现类似国旗飘扬的效果 , 但是 Material 里面是没有提供类似材质的 , 故需要自定义 Shader 来完成 . 

![](http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-08-02-2.gif)



```js
// script.js

import testVertexShader from './Shaders/Test/vertex.glsl'
import testFragmentShader from './Shaders/Test/fragment.glsl'

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

const animate = () => {
  const elapsedTime = clock.getElapsedTime()
  controls.update() 

  // Update uniform time
  // uTime.value 会被传入着色器 Shader 用作国旗的前后飘扬控制参数
  // console.log(elapsedTime) : 1.176, 1.32, 1.36, 1.43 ....
  material.uniforms.uTime.value = elapsedTime;

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(animate)
}
```



**`vertex.glsl`**

- uniform : 
  - uniform 变量是**外部程序**传递给（vertex 和 fragment）shader的变量。因此它是application通过函数glUniform**（）函数赋值的。在（vertex和fragment）shader程序内部，uniform变量就像是C语言里面的常量（const ），它不能被shader程序修改。（shader只能用，不能改）
  - 如果uniform变量在vertex和fragment两者之间声明方式完全一样，则它可以在vertex和fragment共享使用。（相当于一个被vertex和fragment shader共享的全局变量）
- attributes : 
  - attribute变量是只能在 vertex shader 顶点着色器中使用的变量。（不能在 fragment shader 中声明和使用 attribute 变量 ) 
  - 一般用 attribute 变量来表示一些顶点的数据，如：顶点坐标，法线，纹理坐标，顶点颜色等。
- **varying 变量** 
  - varying 是 vertex shader 和 fragment shader 之间**做数据传递用**的。
  - 一般 vertex shader 修改 varying 变量的值，然后fragment shader使用该varying变量的值。
  - 因此 varying 变量在 vertex 和 fragment shader 二者之间的声明必须是一致的。application ( 如 js ) 不能使用此变量

```glsl

uniform vec2 uFrequency;
uniform float uTime;

// attribute vec2 uv;
// attribute vec2 normal;

varying vec2 vUv;
varying float vElevation;

void main(){
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // modelPosition.z += sin(modelPosition.x * uFrequency.x - uTime * 2.0) * 0.1 ;
    // modelPosition.z += sin(modelPosition.y * uFrequency.y - uTime * 2.0) * 0.1 ;
    // modelPosition.z += 0.1 * aRandom;

    float elevation = sin(modelPosition.x * uFrequency.x - uTime * 2.0) * 0.1;
    elevation += sin(modelPosition.y * uFrequency.y - uTime * 2.0) * 0.1;

    modelPosition.z += elevation;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    // gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
    gl_Position = projectionPosition;

    //Send varying
    // vRandom = aRandom;
    vUv = uv; 

    vElevation = elevation;
}
```

如 attribute 的注释, 现在推测不需要显式地声明需要 attributes 了, 是否是因为 shader 可以直接调用 geometry 的 attributes 了 ? 

因为如果去掉注释 : 

```js
attribute vec2 uv;
attribute vec2 normal;

void main() {  
  vUv = uv; 
}

会报错: ERROR: 0:71: 'uv' : redefinition
ERROR: 0:71: 'normal' : redefinition
```



`console.log("geometry.",  geometry.attributes) : `

<img src="http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-08-02-122432.png" style="zoom:50%;" />





**`Fragment.glsl`**

```glsl
// precision mediump float;

varying vec2 vUv;

uniform vec3 uColor;
uniform sampler2D uTexture;

// varying float vRandom;
varying float vElevation;

void main(){
    // 传入的 uTexture 和 vUv
    vec4 textureColor = texture2D(uTexture, vUv);
    // gl_FragColor = vec4(0.75, vRandom, 0.5, 1.0) ;
    // gl_FragColor = vec4(uColor, 1.0);
    // 根据海拔高度（z 轴高度）进行亮度的明暗变化
    vec4 color = vec4(vElevation * uColor, 1.0) + 0.5;
    // textureColor.rgb *= vElevation * 2.0 + 0.5;

    gl_FragColor = textureColor * color;
    // gl_FragColor = textureColor;
    // gl_FragColor = vec4(vUv, 1.0, 1.0);
}
```





## Shader 使用 attributes

```js
/* 通过如下 setAttribute 将随机数组添加进 geometry 的 attribute.aRandom 里面
 * Shader 可以去使用这个属性, 过程如下 : 
 * 在 Shader-vertex 顶点着色器中, 可以通过  `attribute float aRandom;`  来调用使用 ,
 * 如果想传递给 Fragment 片元着色器, 也可以通过
 *   void main(){
 *     vRandom = aRandom; .. }
 *  在 Fragment.glsl 中 : 
 *    varying float vRandom;       来使用顶点着色器传过来的 vRandom
*/
const geometry = new THREE.PlaneGeometry(1, 1, 32, 32)
const count = geometry.attributes.position.count;
const randoms = new Float32Array(count);
for(let i=0; i< count; i++) {
  randoms[i] = Math.random();
}
geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));
```



```glsl
// vertex.glsl
attribute float aRandom;
void main(){
  modelPosition.z += 0.1 * aRandom;
  ... 
}
```



```glsl
// fragment.glsl
varying float vRandom;
void main(){
  gl_FragColor = vec4(0.75, vRandom, 0.5, 1.0) ;
  ... 
}
```









#  Shader Patterns



从  Shader Patterns 看 UV 原理 : 

## uv 展开/贴图/映射

在美术建模时 , 如果模型表面的细节是在模型上绘制的, 那么在导出的时要变成 2D 的 UV 贴图供开发使用。

则此时需要利用工具将模型表面细节变成 UV 贴图 , 这个过程叫 UV 展开。

类似下图 : 

<img src="http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-08-03-071505.jpg" style="zoom:20%;" />

----

**UV 贴图**：和上面的展开过程相反 , UV 贴图是将图片 (jpg/png) 应用到 3D 对象的一个或多个面，来添加细致细节的方法。

随着 3D 模型的面的增长，为每个面创建贴图是不现实的 —— 解决方法：**UV映射**



**UV 映射**的本质是：把一张 2D 平面图像的不同区域映射(投影)到 3D 模型的不同面上。

这里的 U 、V 表示 2D 纹理的坐标 ( 因为 x，y，z已经表示模型空间中的3D图形的轴了 , 所以用 u, v 来表示)

 

UV 映射的贴图上每个点的位置信息 ( u, v ) 与 3D 模型是相互联系的, 来决定表面纹理贴图的位置。 

UV 会将图像上每一个点精确对应到模型物体的表面, 在点与点之间的间隙位置由软件进行图像光滑插值处理。 

----

**维基** : **UV映射**是在[三维建模](https://zh.m.wikipedia.org/wiki/三维建模)中将2D图像投影到3D表面以进行[纹理映射](https://zh.m.wikipedia.org/wiki/纹理映射)的过程。字母U和V用来表示[纹理贴图](https://zh.m.wikipedia.org/wiki/纹理贴图)上的[坐标轴](https://zh.m.wikipedia.org/wiki/坐标轴)，

> UV纹理允许使用普通图像中的颜色（或其他表面属性）绘制构成3D对象的多边形。该图像称为UV纹理。[[1\]](https://zh.m.wikipedia.org/zh-hans/UV映射#cite_note-mullen-1)UV映射的过程涉及将图像中的像素分配给多边形的表面，通常以“编程方式”复制贴图上的一部分并将其粘贴到对象的一部分部分来实现。[[2\]](https://zh.m.wikipedia.org/zh-hans/UV映射#cite_note-murdock-2)UV映射是[投影映射](https://zh.m.wikipedia.org/wiki/投影映射)的替代方法（例如，使用模型的任意一对XYZ坐标或任何位置变换）；它只映射到[纹理空间](https://zh.m.wikipedia.org/w/index.php?title=纹理空间&action=edit&redlink=1)而不是进入物体的几何空间。渲染时使用UV纹理坐标来确定如何绘制三维表面。



UV 坐标的范围是 0~1





## 代码究极详解

首先 ,创建一个 PlaneGeometry [平面缓冲几何体](https://threejs.org/docs/#api/zh/geometries/PlaneGeometry)

```js
// PlaneGeometry(width, height, widthSegments, heightSegments)
const geometry = new THREE.PlaneGeometry(1, 1, 32, 32)

const uv = geometry.getAttribute('uv')
console.log("uv", uv)
// [0, 1, 0.03125, 1,  0.0625, 1,  0.09375, 1,  0.125,1 ...., 
// [u0,v0, u1,v1, u2,v2...]
```



打印 uv : 

```js
uv: 
Float32BufferAttribute {
  array: Float32Array(2178), 
  itemSize: 2, 
  count: 1089
…}


array: Float32Array(2178) [0, 1, 0.03125, 1, 0.0625, 1, 0.09375, 1, 0.125, 1, 0.15625, 1, 0.1875, 1, 0.21875, 1, 0.25, 1, 0.28125, 1, 0.3125, 1, 0.34375, 1, 0.375, 1, 0.40625, 1, 0.4375, 1, 0.46875, 1, 0.5, 1, 0.53125, 1, 0.5625, 1, 0.59375, 1, 0.625, 1, 0.65625, 1, 0.6875, 1, 0.71875, 1, 0.75, 1, 0.78125, 1, 0.8125, 1, 0.84375, 1, 0.875, 1, 0.90625, 1, 0.9375, 1, 0.96875, 1,  1, 1, 
                           
                           0, 0.96875, 0.03125, 0.96875, 0.0625, 0.96875, 0.09375, 0.96875, 0.125, 0.96875, 0.15625, 0.96875, 0.1875, 0.96875, 0.21875, 0.96875, 0.25, 0.96875, 0.28125, 0.96875, 0.3125, 0.96875, 0.34375, 0.96875, 0.375, 0.96875, 0.40625, 0.96875, 0.4375, 0.96875, 0.46875, 0.96875, 0.5, 0.96875, …]
```

- `count: 1089` : 说明有 1089 个 (u, v) 对   ( 33*33 == 1089 )
- `itemSize: 2` : 说明每个 (u, v) 对里有 2 个元素 ( 有点废话...) 
  - 上面这 2 个参数的作用是我猜的 ( 溜了
- 展开数组 `uv.array` , 根据其坐标分组 ( 为了方便观察 , 我们只取小数点后 2 位) : 
  - (0, 1) , (0.03, 1) , (0.06, 1) ....  (1, 1)
  - (0, 0.97) , (0.03, 0.97) , (0.06, 0.97) ... (1, 0.97) 
  - (0, 0.93) , (0.03, 0.93) , (0.06, 0.93) ... (1, 0.93) 
  - ....
  - (0, 0) , (0.03, 0) , (0.06, 0) ....  (1, 0)
  - 画成坐标图即如下 : 



uv 在着色器中被应用时 , 通常会将 (u, v) 坐标对拆分成 `vUv.x` 和 `vUv.y`  :

对这组 uv 数据 `(0, 1) , (0.03, 1) , (0.06, 1) ....  (1, 1)` 来说, 拆分后 , 对应的就是 : 

- `vUv.x`  : [0, 0.03. 0.06, ... , 1] 
- `vUv.y`  : [1, 1, 1, ... , 1]

对于 uv 对 (0, 0.97) , (0.03, 0.97) 来说 : 

- `vUv.x` : [0, 0.03] 
- `vUv.y` : [0.97, 0.97 ]

> 好吧我承认连续整 2 遍有点弱智, 只是不希望自己之后忽然看不懂了....

```glsl
varying vec2 vUv;
vUv.x ...   // [0, 0.03. 0.06, ... , 1] 
vUv.y ...   // [1, 1, 1, ... , 1]
```



建立了如上面的概念之后 , 来看如何在着色器中应用 UV 进行代码编写实现 图-1 效果 : 

<img src="http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-08-03-080235.png" style="zoom:30%;" />

```glsl
// 上图的代码实现是 : 
void main() {
    gl_FragColor = vec4(vUv.x, vUv.y, 1, 1.); 
```

看不懂, 为啥是 ` vec4(x, y, 1)` 呢 ? 下面来逐一分析 



对于片元着色器来说 , 参数 `gl_FragColor` 很重要 : 

- 前三个参数表示片元像素颜色值 R / G / B，
- 第四个参数是片元像素透明度 A ，`1.0`表示不透明, `0.0`表示完全透明。 ( 别忘了设置 `transparent = true`)



首先来看看设置不同的 `gl_FragColor`  时的颜色组合 : 

<img src="http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-08-03-082129.png" style="zoom:50%;" />

对比发现 , 图-1 : 

- 左上是 蓝绿混合 : `vec4(0, 1, 1, 1.);`
- 右上是 红蓝绿 混合 : `vec4(1, 1, 1, 1.);`  ( 因为 `(1, 1, 1 )` 即  `#FFFFFF` 是白色) 
- 左下是 蓝  `vec4(0, 0, 1, 1.);`
- 右下是 蓝红混合 ;   `vec4(1, 0, 1, 1.);`



下面我们来看, 为什么传入 `vUv.x, vUv.y` 就能达到这种混合效果 : 

```js
vec4(vUv.x, vUv.y, 1, 1.); 
// vUv.x :  [0, 0.03. 0.06, ... , 1] 
// vUv.y :  [1, 1, 1, ... , 1]
```

如下图 , 只取左侧的 Top (上部分) 这一个长条来看 , 是由 [蓝+绿] -> [白] 渐变的 , 这种渐变要求 `vec4(0,1,1) -> vec(1,1,1)` 

观察右侧 UV 坐标图 , 在 Top (上部分) : 

- `vUv.x `是由  `[0] -> [1]`  渐变的 ( `[0, 0.03. 0.06, ... , 1]`  )
- `vUv.y` 保持 `[1]`  不变 ,  x/y 的变化 , 正好符合  `vec4(0,1,1)蓝绿  ->  vec(1,1,1)白`  的变化规律

<img src="http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-08-03-IMG_0784.jpg" style="zoom:40%;" />

再看下图 : 

> 不赘述了, 道理都是一样的 ~ 

<img src="http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-08-03-IMG_0785.jpg" style="zoom:50%;" />



## Other Patterns

由上 -> 下白黑渐变 : 

<img src="http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-08-03-092419.png" style="zoom:50%;" />

```glsl
varying vec2 vUv;

vec4 pat4(){
    float strength=vUv.y;
    return vec4(vec3(strength),1.); // 即 vec4(vUv.y, vUv.y, vUv.y, 1)
}

void main(){
  gl_FragColor=pat4();
}
```

讲解: 

- ` vec4(vUv.y, vUv.y, vUv.y, 1)` , 从上到下 ,  vUv.y 是由 1 -> 0 的 ; 
- 即 `vec4(1,1,1, 1) 白 ->  vec4(0,0,0, 1) 黑`



----

由上 -> 下**黑白**渐变 : 

<img src="http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-08-03-093140.png" style="zoom:50%;" />

- 需要用 `invert`  函数 , 

```glsl
vec4 pat5(){
    float strength=invert(vUv.y);
    return vec4(vec3(strength),1.);
}
```



-----

白色区域很大 : 

<img src="http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-08-03-093217.png" style="zoom:50%;" />

- `vUv.y * 10` 
  - vec4 会在内部进行 (0, 1) 标准化吗 ? .. 

```glsl
vec4 pat6(){
    float strength=vUv.y*10.;
    return vec4(vec3(strength),1.);
}
```



----

<img src="http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-08-03-093516.png" style="zoom:50%;" />

Mod 取余数 , 

如果是 python , 结果有两个数字,第一个为商, 第二个为余数

如 mod (1.1, 1) 商事 1, 余数是 0.1 



```glsl
vec4 pat7(){
  float strength=mod(vUv.y*10., 1.);
  return vec4(vec3(strength),1.);
}
```



----

<img src="http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-08-03-144425.png" style="zoom:50%;" />

- step 函数: 
  - `> 0.5` 的取 1 , 
  - `< 0.5` 的取 0 

```glsl
vec4 pat8(){
    float strength=mod(vUv.y*10.,1.);
    strength=step(0.5, strength);
    return vec4(vec3(strength),1.);
}
```



----

<img src="/Users/soda/Library/Application Support/typora-user-images/image-20220803224623864.png" alt="image-20220803224623864" style="zoom:50%;" />

只需要将 step 的参数调整即可 : 

```glsl
vec4 pat9() {
    float strength=mod(vUv.y*10.,1.);
    strength=step(0.8, strength);
    return vec4(vec3(strength),1.);
}
```



----

<img src="http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-08-03-144820.png" alt="image-20220803224818658" style="zoom:50%;" />

- clamp : 把一个值限制在一个上限和下限之间，当值超出范围时，使用最大 / 最小值进行代替 ; 

```glsl
vec4 pat11(){
    float strengthX=step(.8,mod(vUv.x*10.,1.));
    float strengthY=step(.8,mod(vUv.y*10.,1.));
    float strength=clamp(strengthX+strengthY, 0., 1.);
    return vec4(vec3(strength),1.);
}
```



----

<img src="http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-08-03-145046.png" style="zoom:50%;" />

- 加法改乘法

```glsl
vec4 pat12(){
    float strengthX=step(.8, mod(vUv.x*10.,1.));
    float strengthY=step(.8, mod(vUv.y*10.,1.));
    return vec4(vec3(strengthX*strengthY),1.);
}
```



<img src="http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-08-04-024133.png" style="zoom:60%;" />

```glsl
vec4 pat17(){
    float strength=min(abs(vUv.x-.5),abs(vUv.y-.5));
    return vec4(vec3(strength),1.);
}
```







----



<img src="http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-08-03-150854.png" style="zoom:50%;" />

- floor : 不超过 x 的最大整数 : 
  - 如 floor(3.2) == 3 

```glsl
// vUv.x:  [0, 0.03, 0.06, 0.09, 0.12, ... , 1]
/* 
const li =  [0, 0.03, 0.06, 0.09, 0.12, 0.15, 0.18, 0.91, 0.94, 0.97, 1]
const lis = li.map((v) => Math.floor(v*10)/10)
console.log(lis)

[0, 0, 0, 0, 0.1, 0.1, 0.1, 0.9, 0.9, 0.9, 1]
*/
vec4 pat21(){
    float strength=floor(vUv.x*10.)/10.;
    return vec4(vec3(strength),1.);   // [0, 0, 0, 0, 0.1, 0.1, 0.1, ... , 0.9, 0.9, 0.9, 1]
}
```



-----

<img src="http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-08-04-014101.png" style="zoom:50%;" />

```glsl
/*
 vUv.x: const x = [0,0.03,0.06,0.12,1,  0,0.03,0.06,0.12,1, 0,0.03,0.06,0.12,1, 0,0.03,0.06,0.12,1]
 vUv.y: const y = [1,1,1,1,1, 0.97,0.97,0.97,0.97,0.97, 0.94,0.94,0.94,0.94,0.94, 0.03,0.03,0.03,0.03,0.03]
 const lisx = x.map((v) => Math.floor(v*10)/10)
 const lisy = y.map((v) => Math.floor(v*10)/10)
 const res = lisx.map(function(v, i) {
    return v * lisy[i];
 });
 console.log("res, ", res)

res: [0, 0, 0, 0.1, 1,
      0, 0, 0, 0.09000000000000001, 0.9,
      0, 0, 0, 0.09000000000000001, 0.9,
      0, 0, 0, 0, 0]
*/

vec4 pat22(){
    float strength=floor(vUv.x*10.)/10. * floor(vUv.y*10.)/10.;
    return vec4(vec3(strength),1.);
}
```



----

![](http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-08-04-020815.png)

```glsl
float random(vec2 st){
    return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);
}

vec4 pat23(){
    float strength=random(vUv);
    return vec4(vec3(strength),1.);
}
```



----

![](http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-08-04-020940.png)

```glsl
vec4 pat24(){
    float strength=random(grid(vUv,10.,10.,0.,0.));
    return vec4(vec3(strength),1.);
}
```



----

<img src="http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-08-04-021224.png" style="zoom:50%;" />

```glsl
vec4 pat26(){
    float strength=length(vUv);
    return vec4(vec3(strength),1.);
}
```



<img src="http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-08-04-025115.png" style="zoom:50%;" />

```glsl
vec4 pat27(){
    float strength=distance(vUv,vec2(0.5, 0.5));
    return vec4(vec3(strength),1.);
}
```





-----



<img src="http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-08-04-021503.png" style="zoom:50%;" />

```glsl
vec4 pat27(){
    float strength=distance(vUv,vec2(.5));
    return vec4(vec3(strength),1.);
}
```

----

<img src="http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-08-04-021625.png" style="zoom:50%;" />

```glsl
vec4 pat30(){
    float strength=.15/distance(vec2(vUv.x,(vUv.y-.5)*5.+.5),vec2(.5));
    return vec4(vec3(strength),1.);
}
```



----



<img src="http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-08-04-021659.png" style="zoom:50%;" />

```glsl
vec4 pat31(){
    float strength=.15/distance(vec2(vUv.x,(vUv.y-.5)*5.+.5),vec2(.5));
    strength*=.15/distance(vec2(vUv.y,(vUv.x-.5)*5.+.5),vec2(.5));
    return vec4(vec3(strength),1.);
}
```



<img src="http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-08-04-025815.png" style="zoom:50%;" />

- 旋转, 比较复杂, 我们直接使用这个函数 : 

```glsl
#define PI 3.1415926535897932384626433832795

vec2 rotate(vec2 uv,float rotation,vec2 mid){
    return vec2(
        cos(rotation)*(uv.x-mid.x)+sin(rotation)*(uv.y-mid.y)+mid.x,
        cos(rotation)*(uv.y-mid.y)-sin(rotation)*(uv.x-mid.x)+mid.y
    );
}

vec4 pat32(){
    vec2 rUv=rotate(vUv,PI*.25,vec2(.5));
    float strength=.15/distance(vec2(rUv.x,(rUv.y-.5)*5.+.5),vec2(.5));
    strength*=.15/distance(vec2(rUv.y,(rUv.x-.5)*5.+.5),vec2(.5));
    return vec4(vec3(strength),1.);
}
```







----

<img src="http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-08-04-021858.png" style="zoom:50%;" />

```glsl
vec4 pat33(){
    float strength=step(.5,distance(vUv,vec2(.5))+.25);
    return vec4(vec3(strength),1.);
}
```



----

<img src="http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-08-04-021945.png" style="zoom:50%;" />

```glsl
vec4 pat37(){
    vec2 wavedUv=vec2(vUv.x,vUv.y+sin(vUv.x*30.)*.1);
    float strength=invert(step(.01,abs(distance(wavedUv,vec2(.5))-.25)));
    return vec4(vec3(strength),1.);
}
```



----

<img src="http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-08-04-022058.png" style="zoom:50%;" />

```glsl
vec4 pat38(){
    vec2 wavedUv=vec2(vUv.x+sin(vUv.y*30.)*.1,vUv.y+sin(vUv.x*30.)*.1);
    float strength=invert(step(.01,abs(distance(wavedUv,vec2(.5))-.25)));
    return vec4(vec3(strength),1.);
}
```



----

<img src="http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-08-04-022148.png" style="zoom:50%;" />

```glsl
vec4 pat39(){
    vec2 wavedUv=vec2(vUv.x+sin(vUv.y*100.)*.1,vUv.y+sin(vUv.x*100.)*.1);
    float radius=.25;
    float strength=invert(step(.01,abs(distance(wavedUv,vec2(.5))-radius)));
    return vec4(vec3(strength),1.);
}
```



----

<img src="http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-08-04-022305.png" style="zoom:50%;" />

```glsl
vec4 pat40(){
    float strength=angle(vUv);
    return vec4(vec3(strength),1.);
}
```



----

<img src="http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-08-04-022401.png" style="zoom:50%;" />

```glsl
vec4 pat43(){
    float angle=angleOffset(vUv,.5)/(PI*2.)+.5;
    float strength=mod(angle*20.,1.);
    return vec4(vec3(strength),1.);
}
```



-----

<img src="http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-08-04-022441.png" style="zoom:50%;" />

```glsl
vec4 pat45(){
    float angle=angleOffset(vUv,.5)/(PI*2.)+.5;
    float radius=.25+sin(angle*100.)*.02;
    float strength=invert(step(.01,abs(distance(vUv,vec2(.5))-radius)));
    return vec4(vec3(strength),1.);
}
```





Perlin Noise : 

<img src="http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-08-04-022522.png" style="zoom:50%;" />

```glsl
vec4 permute(vec4 x){
    return mod(((x*34.)+1.)*x,289.);
}

float cnoise(vec2 P){
    vec4 Pi=floor(P.xyxy)+vec4(0.,0.,1.,1.);
    vec4 Pf=fract(P.xyxy)-vec4(0.,0.,1.,1.);
    Pi=mod(Pi,289.);// To avoid truncation effects in permutation
    vec4 ix=Pi.xzxz;
    vec4 iy=Pi.yyww;
    vec4 fx=Pf.xzxz;
    vec4 fy=Pf.yyww;
    vec4 i=permute(permute(ix)+iy);
    vec4 gx=2.*fract(i*.0243902439)-1.;// 1/41 = 0.024...
    vec4 gy=abs(gx)-.5;
    vec4 tx=floor(gx+.5);
    gx=gx-tx;
    vec2 g00=vec2(gx.x,gy.x);
    vec2 g10=vec2(gx.y,gy.y);
    vec2 g01=vec2(gx.z,gy.z);
    vec2 g11=vec2(gx.w,gy.w);
    vec4 norm=1.79284291400159-.85373472095314*vec4(dot(g00,g00),dot(g01,g01),dot(g10,g10),dot(g11,g11));
    g00*=norm.x;
    g01*=norm.y;
    g10*=norm.z;
    g11*=norm.w;
    float n00=dot(g00,vec2(fx.x,fy.x));
    float n10=dot(g10,vec2(fx.y,fy.y));
    float n01=dot(g01,vec2(fx.z,fy.z));
    float n11=dot(g11,vec2(fx.w,fy.w));
    vec2 fade_xy=fade(Pf.xy);
    vec2 n_x=mix(vec2(n00,n01),vec2(n10,n11),fade_xy.x);
    float n_xy=mix(n_x.x,n_x.y,fade_xy.y);
    return 2.3*n_xy;
}

vec4 pat46(){
    float strength=cnoise(vUv*10.);
    return vec4(vec3(strength),1.);
}
```



<img src="http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-08-04-022601.png" style="zoom:50%;" />

```glsl
vec4 pat47(){
    float strength=step(0.,cnoise(vUv*10.));
    return vec4(vec3(strength),1.);
}
```



<img src="http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-08-04-022644.png" style="zoom:50%;" />

```glsl
vec4 pat48(){
    float strength=invert(abs(cnoise(vUv*10.)));
    return vec4(vec3(strength),1.);
}
```



<img src="http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-08-04-022722.png" style="zoom:50%;" />

```glsl
vec4 pat49(){
    float strength=sin(cnoise(vUv*10.)*20.);
    return vec4(vec3(strength),1.);
}
```



<img src="http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-08-04-022826.png" style="zoom:50%;" />

```glsl
vec4 pat50(){
    float strength=step(.9,sin(cnoise(vUv*10.)*20.));
    return vec4(vec3(strength),1.);
}
```







# Raging Sea

![](http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-08-04-1.gif)

```js
import waterVertexShader from "./shaders/water/vertex.glsl";
import waterFragmentShader from "./shaders/water/fragment.glsl";

const waterGeometry = new THREE.PlaneGeometry(2, 2, 512, 512);

// Material
const waterMaterial = new THREE.ShaderMaterial({
  vertexShader: waterVertexShader,
  fragmentShader: waterFragmentShader,
  uniforms: {
    uTime: { value: 0, },  // 传递的时间参数，控制着波浪的振动频率

    uBigWavesElevation: { value: 0.2, }, // 振幅（海拔）
    uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5), },
    uBigWavesSpeed: { value: 0.75, },  // 波浪的振动速度

    uDepthColor: { value: new THREE.Color(debug.depthColor), },     // 深度色
    uSurfaceColor: { value: new THREE.Color(debug.surfaceColor), }, // 海面色
    uColorOffset: { value: 0.08, },   // 色偏移
    uColorMultiplier: { value: 5, },  // 色倍率

    /* small Parameter 的意义在于，给大波加一些小波，类似下图 */
    uSmallWavesElevation: { value: 0.15 }, 
    uSmallWavesFrequency: { value: 3 },
    uSmallWavesSpeed: { value: 0.2 },
    uSmallIterations: { value: 4 },
  },
});


/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  waterMaterial.uniforms.uTime.value = elapsedTime;

  // Update controls
  controls.update();
  renderer.render(scene, camera);     // Render
  window.requestAnimationFrame(tick); // Call tick again on the next frame
};
```



```glsl
vec4 permute(vec4 x) {  return mod(((x*34.)+1.)*x,289.);  }
vec4 taylorInvSqrt(vec4 r) {  return 1.79284291400159-.85373472095314*r;  }
vec3 fade(vec3 t) {  return t*t*t*(t*(t*6.-15.)+10.);  }

float cnoise(vec3 P) {  .......  }

void main() {
    vec4 modelPosition = modelMatrix * vec4(position,1.);
    float elevation = sin(modelPosition.x * uBigWavesFrequency.x + uTime*uBigWavesSpeed)
                       * sin(modelPosition.z*uBigWavesFrequency.y+uTime*uBigWavesSpeed)
                       * uBigWavesElevation;
    for(float i=1.0; i <= uSmallIterations; i++){
        elevation -= abs(cnoise(vec3(
            modelPosition.xz * uSmallWavesFrequency * i, uTime * uSmallWavesSpeed)
        ) * uSmallWavesElevation/i);
    }
    modelPosition.y += elevation;
    vec4 viewPosition = viewMatrix*modelPosition;
    vec4 projectedPosition = projectionMatrix*viewPosition;
    gl_Position=projectedPosition;
    vElevation=elevation;
}
```



small Parameter 的意义在于，给大波加一些小波，类似下图的绿色线  :

<img src="http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-08-04-IMG_0786.jpg" style="zoom:40%;" />







# Animate Galaxxy 星系动画

![](http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-08-05-1.gif)

粒子自旋 : 中心自旋较快, 外围自旋较慢 ;

粒子尺寸衰减 : 

- 默认情况下, 拉远镜头时粒子的大小尺寸不变 ; 
- 但是我们想营造一种近大远小的效果: 
  - Solution : We are going to take the code from the Three.js depedency in
    `/node_modules/three/src/renderers/shaders/ShaderLib/point_vert.glsl.js` 

```js
    gl_PointSize *= (1.0 / -viewPosition.z);  // three/src/renderers/shaders/ShaderLib/point_vert.glsl.js
```



`gl_FragCoord` : 

- 内置变量 `gl_FragCoord` 表示 WebGL 在 canvas 画布上渲染的所有片元或者说像素的坐标，坐标原点是 canvas 画布的左上角，x 轴水平向右，y 竖直向下，gl_FragCoord 坐标的单位是像素，值是 `vec2(x,y)` , 通过 `gl_FragCoord.x`、`gl_FragCoord.y` 方式可以分别访问片元坐标的纵横坐标。
- <img src="http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-08-05-IMG_0787.jpg" style="zoom:30%;" />

`atan` : arctan 反正切函数







# Modified materials

https://thebookofshaders.com/08/

到目前为止，我们一直在创建全新的 shader materials 着色器材质。

**但是 , 如果我们想修改 Three.js 内置材质呢？** 也许我们对 `MeshStandardMaterial`  的结果很满意，但我们想给它添加顶点动画。

如果我们要重写整个 MeshStandardMaterial，处理灯光、环境贴图、基于物理的渲染、所有类型的纹理等将花费太多时间。

相反，我们将从 MeshStandardMaterial 开始，并尝试将我们的代码集成到它的 shaders 着色器中。



有两种方法：

1. 通过使用在编译着色器之前触发的 Three.js hook，让我们可以向 shader 中注入我们的代码。

2. 通过将 Material 重新创建为全新的 Material，但遵循 Three.js 代码中所做的操作，然后使用相同的参数以及我们要添加的参数

然第二个选项完全可以接受，但我们需要在 Three.js 源代码中花费大量时间来了解如何正确设置所有内容。

相反，我们将使用第一种技术。我们仍然会花一些时间在 Three.js 代码上，但是会容易得多。

在本课中，我们将使模型顶点以一种有趣的方式扭曲，但材质的所有基本特征仍然有效，如阴影、纹理、法线贴图等。

![](http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-08-05-2.gif)

>  著名的 Lee Perry-Smith 头部模型





对于 `MeshStandardMaterial` , 但我们想修改它的 Shader 着色器。

首先需要访问其原始着色器 , 为此，我们可以在材质上使用 `onBeforeCompile` 属性。 

如果我们为它分配一个函数，这个函数将在编译之前以着色器选项作为第一个参数被调用：

( 这给了我们机会修改 build-in 的 Shader, 修改完后 , 系统再编译 Shader 进行着色 ) 

- 如下, 可以访问 `vertexShader、fragmentShader 和 uniforms ` ，我们可以修改它们并查看结果。

```js
material.onBeforeCompile = (shader) => {
    console.log(shader)
}
console.log 内容 :
> uniforms: {diffuse: {…}, opacity: {…}, map: {…}, uvTransform: {…}, uv2Trans
> vertexShader: "\n  #include <common>\n  uniform float uTime;\n\nmat2 
> fragmentShader: "#if DEPTH_PACKING == 3200\n\tuniform float opacity;\n#
```





`cat ./node_modules/three/src/renderers/shaders/ShaderChunk/begin_vertex.glsl.js`  : 

```js
export default /* glsl */`
vec3 transformed = vec3( position );
`;
```



`begin_vertex.glsl.js` is handling the position first by creating a variable named `transformed` 

Try to replace `#include <begin_ vertex>` 

```js
material.onBeforeCompile = function(shader) {
  shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', '')
}
```







# Post-Processing

![](http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-08-05-131954.png)

后处理是关于在最终图像（渲染)上添加效果。人们大多在电影制作中使用这种技术，但我们也可以在 WebGL 中做到这一点。

后处理可以很微妙地改善图像或创造巨大的效果。 以下是您可以使用后处理的一些示例：

- Depth of field  景深
- Bloom  盛开
- God ray  神光
- Motion blur  运动模糊
- Glitch effect  毛刺效应
- Outlines  大纲
- Color variations  颜色变化
- Antialiasing  抗锯齿 
- Reflections and refractions  反射和折射
- Etc.



我们将使用与真实模型渲染课程相同的设置，使用 Leonardo Carrion 的 [**Damaged Helmet**](https://github.com/KhronosGroup/glTF-Sample-Models/tree/master/2.0/DamagedHelmet) 模型。这是一个流行的模型，具有许多细节和良好的纹理，与我们的 post-processing 相得益彰。



## Render target

我们不是在画布 canvas 中渲染，而是在我们所谓的  `render target` 渲染目标中进行渲染。render target 将为我们提供与通常纹理非常相似的纹理。以更简单的方式，我们在屏幕上渲染纹理而不是 canvas 画布。 

The 术语 Term  `render target`  只是 Three.js 特定称呼。其他上下文大多使用 “buffer” 。

然后将此纹理应用于面向相机并覆盖整个视图的平面。该平面使用具有特殊 Fragment Shader 的材质，可以进行后处理效果。如果后处理效果包括使图像变红，它只会乘以该 fragment shader 中像素的红色值。

大多数后期处理效果不仅仅是调整颜色值，但你明白了。

在 Three.js 中，这些“效果”被称为“ passes”。从现在开始，我们将使用该术语 term。



## Ping-pong buffering

我们可以在后期处理中进行多次处理：一次进行运动模糊，一次进行颜色更改，一次进行景深处理，等等。

因为我们可以进行多次处理，所以后期处理需要两个 render targets 。原因是我们无法在 drawing 绘制的同时获取渲染目标的纹理 Texture 。Solution是 : 

- 在第一个渲染目标中绘制，同时从第二个渲染目标中获取纹理。
- 在下一轮，切换那些渲染目标，从第二个获取纹理，并在第一个上绘制。
- 再下一次 "passes" 时，再次切换，一次又一次。这就是我们所说的乒乓缓冲。



### Final "pass" on the canvas

最后的 pass  不会放在 render target  中，因为我们可以将它直接放在画布上，这样用户就可以看到最终结果。



我们所要做的就是使用 EffectComposer 类来为我们处理大部分繁重的工作。







## GlitchPass

![](http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-08-05-12.gif)

> 增加一个类似黑客入侵的闪动效果

```js
import { GlitchPass } from "three/examples/jsm/postprocessing/GlitchPass.js";

const glitchPass = new GlitchPass();
composer.addPass(glitchPass);
//glitchPass.goWild = true;
//glitchPass.enabled = false;
```



## RGB Shift Shader 

> 这个比较特殊, 只能当做着色器来使用 ;
>
> 色调移位 Shift , 看起来就像摄像机发生了 Error , 哈哈

<img src="http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-08-05-141313.png" style="zoom:30%;" />

```js
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { RGBShiftShader } from "three/examples/jsm/shaders/RGBShiftShader.js";

// 设置 sRGBEncoding, 否则场景会很暗 ;
const renderTarget = new THREE.WebGLRenderTarget(800, 600, {
  minFilter: THREE.LinearFilter,
  magFilter: THREE.LinearFilter,
  format: THREE.RGBAFormat,
  encoding: THREE.sRGBEncoding,
});

const composer = new EffectComposer(renderer, renderTarget);

const rgbShiftPass = new ShaderPass(RGBShiftShader);
composer.addPass(rgbShiftPass);
rgbShiftPass.enabled = false;
```







## unrealBloomPass

<img src="http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-08-06-010003.png" alt="image-20220806085959624" style="zoom:30%;" />

> 不真实爆炸💥 
>
> React 版本 : https://codesandbox.io/s/github/onion2k/r3f-by-example/tree/develop/examples/effects/emissive-bloom?file=/src/index.js:412-427

```js
const unrealBloomPass = new UnrealBloomPass();
composer.addPass(unrealBloomPass);
unrealBloomPass.enabled = false;

unrealBloomPass.strength = 0.3;
unrealBloomPass.radius = 1;
unrealBloomPass.threshold = 0.6;

gui.add(unrealBloomPass, "enabled");
gui.add(unrealBloomPass, "strength").min(0).max(2).step(0.001);
gui.add(unrealBloomPass, "radius").min(0).max(2).step(0.001);
gui.add(unrealBloomPass, "threshold").min(0).max(1).step(0.001);
```



## Tint(色调) Shader

<img src="http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-08-06-011400.png" style="zoom:50%;" />

```js
const TintShader = {
  uniforms: {
    tDiffuse: {
      value: null,
    },
    uTint: {
      value: new THREE.Vector3(),
    },
  },
  vertexShader: tintVertexShader,  // 看下面
  fragmentShader: tintFragmentShader, // 看下面
};

const tintPass = new ShaderPass(TintShader);
composer.addPass(tintPass);
tintPass.enabled = false;

gui.add(tintPass.material.uniforms.uTint.value, "x").min(-1).max(1).step(0.001)
  .name("red");
gui.add(tintPass.material.uniforms.uTint.value, "y").min(-1).max(1).step(0.001)
  .name("green");
gui.add(tintPass.material.uniforms.uTint.value, "z").min(-1).max(1).step(0.001)
  .name("blue");
```



```glsl
/* vertex.glsl */
varying vec2 vUv;
void main(){
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.);
    vUv=uv;
}

/* fragment.glsl */
uniform sampler2D tDiffuse;
uniform vec3 uTint;
varying vec2 vUv;

void main(){
    vec4 color=texture2D(tDiffuse,vUv);
    color.rgb+=uTint;
    gl_FragColor=color;
}
```







## displacement

![](http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-08-06-2.gif)

> 开始出现扭曲效果 ; 

```js
import displacementVertexShader from "./shaders/displacement/vertex.glsl";
import displacementFragmentShader from "./shaders/displacement/fragment.glsl";

// Displacement
const DisplacementShader = {
  uniforms: {
    tDiffuse: { value: null, },
    uTime: {  value: 0,  },
    uNormalMap: { value: null,},
  },
  vertexShader: displacementVertexShader,
  fragmentShader: displacementFragmentShader,
};

const displacementPass = new ShaderPass(DisplacementShader);
composer.addPass(displacementPass);

displacementPass.material.uniforms.uNormalMap.value = textureLoader.load(
  "/textures/interfaceNormalMap.png"
);
```



```glsl
/* fragment.glsl */
uniform sampler2D tDiffuse;
uniform float uTime;
uniform sampler2D uNormalMap;

varying vec2 vUv;

void main(){
    vec3 normalColor=texture2D(uNormalMap,vUv).xyz*2.-1.;
    vec2 newUv=vUv+normalColor.xy*.1;
    vec4 color=texture2D(tDiffuse,newUv);
    
    vec3 lightDirection=normalize(vec3(-1.,1.,0.));
    float lightness=clamp(dot(normalColor,lightDirection),0.,1.);
    color.rgb+=lightness*2.;
    
    gl_FragColor=color;
}

/* vertex.glsl */
varying vec2 vUv;

void main(){
    gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);
    vUv=uv;
}
```



加一个金属面罩的视角感 : 

<img src="http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-08-06-021430.png" alt="image-20220806101428236" style="zoom:50%;" />

```js
displacementPass.material.uniforms.uNormalMap.value = textureLoader.load(
  "/textures/interfaceNormalMap.png"
);
```







# Performance Tips

![](http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-08-06-024538.png)

正如我们在第一节课中所说，您至少应该以 60fps 的体验为目标。一些用户甚至可能具有应该以更高帧速率运行体验的配置。这些通常是游戏玩家，在性能和帧速率方面更加苛刻。

可能有两个主要限制：

- 中央处理器 CPU
- 图形处理器 GPU

您需要密切关注性能并在具有不同设置的多个设备上进行测试，如果您的网站应该与移动设备兼容，请不要忘记移动设备。

如果您还关注网站的整体权重，这将有所帮助。当我们在本地开发时，加载速度非常快，但是一旦上线，这取决于用户连接和服务器速度。我们需要保持资产尽可能轻。

有很多技巧可以提高性能和重量，我们已经看到了其中的大部分



## Monitor FPS

Chrome 曾经有一个不错的 FPS meter ( FPS 仪表)，但现在没有了。相反，我们可以使用像 stats.js 这样的 JavaScript FPS meter。

使用 `npm install --save stats.js`  将其添加到依赖项中。

导入并实例化

```js
import Stats from 'stats.js'

const stats = new Stats()
stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom)
```



Call it's  `begin()` and `end()` methods in the `tick` function

```js
const tick = () => {
    stats.begin()

    // ...

    stats.end()
}
```

**JavaScript**

Copy

You should get a nice looking FPS meter.



## Disable FPS limit

无论屏幕功能如何，都有一种解锁 Chrome 帧速率的方法。

即使在良好的计算机上，这也将启用帧速率监控。例如，如果您在一台好计算机上进行开发，并且看到 60fps，您可能会认为这没问题。但也许你的网站在那台好电脑上只能以70~80fps的速度运行，但在其他电脑上帧率会降到 60fps 以下，你不会知道的。

如果你解锁帧率限制，你会发现性能不够好，为了安全起见，你应该在这台电脑上以 150~200fps 的速度运行。

要解锁 Chrome framerate：

- 完全关闭它——如果您在 Chrome 上查看本课程，请在其他地方写下以下说明。
- 打开终端。
- 打开以下 Github gist 并启动正确的命令——Mac 或 Windows：https://gist.github.com/brunosimon/c15e7451a802fa8e34c0678620022f7d

Chrome 应该在没有帧速率限制的情况下打开。您可以通过再次打开 FPS **meter** 来测试它。如果它不起作用，请关闭它并重试。如果它仍然不起作用，你将不得不没有它。

当心;这样做会从您的计算机中汲取更多电量，并可能导致 Chrome 崩溃。



## 监控绘图调用

绘制调用是 GPU 绘制三角形的动作。当我们有一个包含许多对象、几何图形、材质等的复杂场景时，将会有很多绘制调用。

通常，我们可以说绘制调用越少越好。我们将看到一些减少这些问题的技巧，但首先，我们想监控它们。

有一个很棒的 Chrome 扩展名为 Spector.js 可以帮助你。

安装扩展：https://chrome.google.com/webstore/detail/spectorjs/denbgaamihkadbghdceggmchnflmhpmk

在 WebGL 页面上，单击扩展图标将其激活。

再次单击以打开扩展面板。

单击红色圆圈以记录帧。



## Renderer informations

The `renderer` can provide some information about what's in the scene and what's being drawn.

Just log the `renderer.info` to get this information:



# loading progress 加载进度

> https://threejs-journey.com/lessons/34#animate

到目前为止，我们所拥有的只是页面上的 WebGL 画布，一旦准备好就会显示出来。

在本课中，我们将学习如何添加一个非常简单的加载器 Loader ，该加载器由一个在加载资产时填充的条组成。整个场景将是黑色的，并且只有在所有内容都加载了后 , 漂亮的淡入淡出后才会显示。

对于加载器，我们将使用 HTML 和 CSS。这是了解如何将 HTML 与 WebGL 结合起来的绝佳机会。



```js
/**
 * Loaders
 */
const loadingBarEl = document.querySelector(".loading-bar");
const loadingManager = new THREE.LoadingManager(
  async () => {
    await ky.sleep(500);
    gsap.to(overlay.material.uniforms.uAlpha, {
      value: 0,
      duration: 3,
      delay: 1,
    });
    loadingBarEl.classList.add("ended");
    loadingBarEl.style.transform = "";
  },
  (url, loaded, total) => {
    const progress = loaded / total;
    loadingBarEl.style.transform = `scaleX(${progress})`;
  }
);
const gltfLoader = new GLTFLoader(loadingManager);
const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager);
```







# Mixing HTML and WebGL

<img src="http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-08-06-043254.png" style="zoom:50%;" />

在 `webgl` 和 `loading-bar` 后面添加 `class-point` ( 3 个点, 用来给 3D Model 添加文字说明 )

```html
<canvas class="webgl"></canvas>

<div class="loading-bar"></div>

<div class="point point-0">
    <div class="label">1</div>
    <div class="text">Lorem ipsum, dolor sit amet consectetur adipisicing elit</div>
</div>	
```

> text 不应在页面上可见，因为它隐藏在 ` <canvas>` 后面。



## Points 处理

每个点对象都有两个属性：

Each point object will have two properties:  3D position 和对 HTML 元素的引用 ( the 3D position and a reference to the HTML element)

```js
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

// 使用 for 循环, 更新 Points 位置:
const tick = () => {
    // Update controls
    controls.update()

    // Go through each point
    for(const point of points) {

    }
}
```



为了得到 Point 的位置, 我们需要得到该点**我们需要得到该点的 3D 场景位置的 2D 屏幕位置。(the 2D screen position of the 3D scene position)**。

因为要对位置进行修改, 所以先 clone 一份 Point 现在的位置 : 

```js
const screenPosition = point.position.clone()
```

要获取 2D 屏幕位置，我们需要调用 `project(...) ` 方法并使用相机作为参数：

```js
  for(const point of points) {        
    const screenPosition = point.position.clone()
    screenPosition.project(camera)
    console.log(screenPosition.x)
```

要从投影的屏幕位置到屏幕上的像素(To go from that projected screen position to the pixels on the screen)，我们需要乘以渲染大小的一半，并且我们已经在 sizes 对象中有这个值

> 没看懂

```js
        const translateX = screenPosition.x * sizes.width * 0.5
```





```js
    for(const point of points) {
        const screenPosition = point.position.clone()
        screenPosition.project(camera)

        const translateX = screenPosition.x * sizes.width * 0.5
        const translateY = - screenPosition.y * sizes.height * 0.5
        point.element.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`
    }
```

> 在 CSS 中，正 translateY 下降，而在 Three.js 中，正 y 上升。



## Raycaster

为了测试 Point 点前面是否有东西，我们将使用 `Raycaster` 。

我们将从相机射出一条射线到点。如果没有相交的对象，我们显示点 Point 。如果有东西，我们测试交叉点的距离: 

- 如果交点比点远，说明物体在点的后面，我们可以显示出来。
- 如果相交点比该点近，则相交对象在该点的前面，我们将其 ( 点) 隐藏。
  - 这样一来 , 我们转动头盔时, 如果用户转到了头盔的背部 , 就隐藏正面的点 Point , 这很合理 ; 



```js
const raycaster = new THREE.Raycaster();

const tick = () => {
  controls.update();

  if (sceneReady) { 
    for (const point of points) {
      const screenPos = point.position.clone(); 
      screenPos.project(camera);
      raycaster.setFromCamera(screenPos, camera);
```



检测是否有 intersection ( 交叉点) , 有交叉点说明 Point 前面有东西挡着 : 

```js
    for (const point of points) {
      
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
```



> intersectObjects(...) 方法返回一个交集数组。这些交叉点按距离排序，最近的在前。这意味着如果有多个交叉点，我们不必测试所有交叉点，我们可以只测试第一个。

<img src="http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-08-07-IMG_0789.jpg" style="zoom:50%;" />

如上图,  只有 Point distance > intersection 的距离时, 说明 Point 应该被遮盖 : 此时移除 `active` 属性 ; 

否则, 说明应该显示 Point ,添加 Active css 属性







# Blender - Baking

当您在 Blender 等 3D 软件中进行渲染时，它通常看起来比您导入到 Three.js 中的模型更好，无论您多么努力地尝试获得完全相同的照明和颜色。这是因为制作渲染时使用的技术。

Ray Tracing  (光线追踪) 包括向渲染的每个像素投射多条光线。这些光线从我们正在渲染的几何图形开始。接下来，他们测试场景中每个光线的方向，以查看几何体的哪一部分被照亮，并测试从几何体反射回来的光线的方向是否与场景中的其他物体发生碰撞。

然后，对于这些碰撞中的每一个，当它们从其他物体反弹时，会投射更多的光线。它会像这样持续多次。然后计算这些碰撞收集的所有信息以定义该像素的最终颜色

Ray Tracing  (光线追踪) 的目标是模拟现实生活中的照明并启用间接照明和柔和阴影等视觉效果。例如，如果将红色物体靠近白色物体放置，您会看到白色物体被染成红色，因为光线从红色表面反射到白色表面。同样，当表面靠近白色物体时，您会看到红色物体看起来更亮。

这个过程会产生美丽逼真的渲染，但进行一次渲染可能需要几分钟甚至几小时。



当我们使用 WebGL 进行渲染时，我们需要尽可能快地进行渲染以获得**良好的帧速率**。我们没有那么奢侈的时间花几十分钟在一帧的渲染上。所以 WebGL 中的渲染使用了更便宜的技术，这些技术看起来不太完美，但至少保持了不错的帧速率。

baking (烘焙?) 的想法是我们**将这些光线追踪渲染保存到纹理中**，然后在 WebGL 中使用，而不是使用 Three.js 提供的经典渲染技术。

这是烘焙纹理的示例：

<img src="http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-08-07-140134.png" style="zoom:50%;" />

> 可以看出光线都被做好了 ;



这就是 Three.js 中的结果：

- 没有光，没有实时阴影。只是上面的示例中看到的纹理 , 被放置在几何图形上。
- 我们将直接在 Meshes 上看到 Ray Tracing 渲染，看起来很棒。当我们在场景中移动时，性能会很棒，因为我们所做的只是在几何体上显示纹理。

不幸的是，有一些缺点：

- 我们必须在 3D 软件中 Baking (烘焙) 所有内容，这是一个漫长的过程。
- 我们必须加载纹理，如果您有一个包含大量对象的复杂场景，您将需要大量纹理。这不利于加载，但也可能导致体验开始时短暂冻结，因为我们需要将这些纹理加载到 GPU 中。
- 灯光不是动态的。我们不能移动灯光，也不能实时改变它们的强度或颜色。我们必须在 3D 软件中完成并重新烘焙所有内容。
- 选择是否使用烘焙取决于您和项目。请记住，您仍然可以混合烘焙和非烘焙材料，但很难保持均匀的结果。





To create that baked scene, we need to go through multiple steps:

- 在 3D 软件中创建 scene .
- 优化所有对象，因为我们需要干净的几何形状并且只需要我们可以看到的表面。
- UV unwrap everything.
- Bake the render into **texture**(s). 
- 导出场景和纹理。 如果我们这样做，我们将只有一个大纹理。但是，如果有很多对象并且我们想要更好的质量，我们可以有多个纹理。
- Import everything in Three.js and apply the texture on the mesh.

As a bonus, we will also add some details in Three.js to give more life to the scene like a cool portal effect with fireflies floating around.
