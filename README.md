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
