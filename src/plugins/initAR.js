// Initialisation of AR JS
const initARJS = (scene, camera, onRenderFcts, renderer) => {
  /**
   * handle arToolkitSource
   */
  const arToolkitSource = new THREEx.ArToolkitSource({
    // to read from the webcam
    sourceType: 'webcam'
  })

  function onResize() {
    arToolkitSource.onResizeElement()
    arToolkitSource.copyElementSizeTo(renderer.domElement)
    if (arToolkitContext.arController !== null) {
      arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas)
    }
  }
  arToolkitSource.init(() => {
    onResize()
  })

  // handle resize
  window.addEventListener('resize', () => {
    onResize()
  })

  /**
   * initialize arToolkitContext
   */
  // create atToolkitContext
  const arToolkitContext = new THREEx.ArToolkitContext({
    cameraParametersUrl: `${THREEx.ArToolkitContext.baseURL}../data/data/camera_para.dat`,
    detectionMode: 'mono',
    maxDetectionRate: 30
  })
  // initialize it
  arToolkitContext.init(() => {
    // copy projection matrix to camera
    camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix())
  })

  // update artoolkit on every frame
  onRenderFcts.push(() => {
    if (arToolkitSource.ready === false) return
    arToolkitContext.update(arToolkitSource.domElement)
    scene.visible = camera.visible
  })

  /**
   * Create a ArMarkerControls
   */
  const markerRoot = new THREE.Group
  scene.add(markerRoot)
  const artoolkitMarker = new THREEx.ArMarkerControls(arToolkitContext, markerRoot, {
    type: 'nft',
    descriptorsUrl: 'NFTData/pinball',
    changeMatrixMode: 'cameraTransformMatrix'
  })

  scene.visible = false

  // build a smoothedControls
  const smoothedRoot = new THREE.Group()
  scene.add(smoothedRoot)
  const smoothedControls = new THREEx.ArSmoothedControls(smoothedRoot, {
    lerpPosition: 0.4,
    lerpQuaternion: 0.3,
    lerpScale: 1,
  })

  return smoothedRoot
}

export default initARJS
