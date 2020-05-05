import initARJS from './initAR'

const addDefaultObject = (smoothedRoot, onRenderFcts) => {
  const geometry = new THREE.TorusKnotGeometry(0.3, 0.1, 64, 16)
  const material = new THREE.MeshNormalMaterial()
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.y = 0.5
  smoothedRoot.add(mesh)
  onRenderFcts.push((delta) => {
    mesh.rotation.x += Math.PI * delta
  })
}

const init = () => {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    precision: 'mediump',
  })

  const clock = new THREE.Clock()

  const onRenderFcts = []

  renderer.setPixelRatio(window.devicePixelRatio)

  renderer.setClearColor(new THREE.Color('lightgrey'), 0)
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.domElement.style.position = 'absolute'
  renderer.domElement.style.top = '0px'
  renderer.domElement.style.left = '0px'
  document.body.appendChild(renderer.domElement)

  // init scene and camera
  const scene = new THREE.Scene()

  /**
   * Initialize a basic camera
   */

  // Create a camera
  const camera = new THREE.Camera()
  scene.add(camera)

  // Create a light
  const light = new THREE.AmbientLight(0xffffff)
  scene.add(light)

  const smoothedRoot = initARJS(scene, camera, onRenderFcts, renderer)
  addDefaultObject(smoothedRoot, onRenderFcts)
  onRenderFcts.push(() => {
    renderer.render(scene, camera)
  })

  const animate = () => {
    // keep looping
    requestAnimationFrame(animate)
    onRenderFcts.forEach(onRenderFct => onRenderFct(clock.getDelta()))
  }
  requestAnimationFrame(animate)
}

export default init
