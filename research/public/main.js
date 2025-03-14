import * as THREE from 'three'
import { Vector3 } from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

//import { FontLoader } from 'three/addons/loaders/FontLoader.js'
//import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'
//import typefaceFont from 'three/examples/fonts/helvetiker_regular.typeface.json'

/*
import RAPIER from 'https://cdn.skypack.dev/@dimforge/rapier3d-compat'
RAPIER.init().then(() => { _run_simulation(RAPIER) })
*/


class Karen {
    constructor(fov) {
        THREE.Cache.enabled = true // i think we want this
        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera( fov, window.innerWidth / window.innerHeight, 0.1, 1000 )
        this.renderer = new THREE.WebGLRenderer()
        this.renderer.setSize( window.innerWidth, window.innerHeight )
        document.body.appendChild( this.renderer.domElement )
        this.scene.add(this.camera) // should this be called always? (i use this to put a cross hair, or weapon in front of the camera)

        this.controls = new OrbitControls(this.camera, this.renderer.domElement) // put this inside Karen
        this.clock = new THREE.Clock()
        this.loader = new GLTFLoader()
        this.mixers = []

        // for enableResize function
        this.sizes = { 
            width: window.innerWidth,
            height: window.innerHeight
        }

        this.camera.position.z = 3
    }

    enableResize() {
        window.addEventListener('resize', () => {
            this.sizes.width = window.innerWidth
            this.sizes.height = window.innerHeight

            this.camera.aspect = this.sizes.width / this.sizes.height
            this.camera.updateProjectionMatrix()

            this.renderer.setSize(this.sizes.width, this.sizes.height)
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        })
    }

    run(animateFunction) {
        this.renderer.setAnimationLoop(animateFunction)
    }

    async loadModel(path) {
        return new Promise((resolve, reject) => {
            this.loader.load(
                path, 
                (gltf) => {
                    this.scene.add( gltf.scene )
                    if (gltf.animations.length > 0) {
                        const mixer = new THREE.AnimationMixer(gltf.scene)
                        this.mixers.push(mixer)
                        gltf.animations.forEach(clip => { mixer.clipAction(clip).play() })
                    }
                    resolve(gltf.scene)
                }, 
                undefined, 
                (err) => {
                    console.error(err)
                    reject(err)
                }
            )
        })
    }
}


function addLights(k) {
    const l1 = new THREE.AmbientLight(0xffffff, 4) // Soft white light
    k.scene.add(l1)

    const l2 = new THREE.DirectionalLight(0xffffff, 0.7)
    l2.position.set(10, 20, 0)
    l2.target.position.set(0,10,0)
    k.scene.add(l2)

    const l3 = new THREE.DirectionalLight(0xffffff, 0.7)
    l3.position.set(-5, 20, 8.66)
    l3.target.position.set(0,10,0)
    k.scene.add(l3)

    const l4 = new THREE.DirectionalLight(0xffffff, 0.7)
    l4.position.set(-5, 20, -8.66)
    l4.target.position.set(0,10,0)
    k.scene.add(l4)

    // just to see the lights
    const lh2 = new THREE.DirectionalLightHelper(l2, 1)
    k.scene.add(lh2)
    const lh3 = new THREE.DirectionalLightHelper(l3, 1)
    k.scene.add(lh3)
    const lh4 = new THREE.DirectionalLightHelper(l4, 1)
    k.scene.add(lh4)
}


function configureControls(k) {
    k.controls.autoRotate = true
    k.controls.autoRotateSpeed = 0.2
    //k.controls.minPolarAngle = Math.PI / 3
    //k.controls.maxPolarAngle = 2 * Math.PI / 3
    k.controls.enableRotate = false // dont allow rotate with mouse => no 
    k.controls.enableDamping = false // give sense of weight to controls
    k.controls.enablePan = false // enable moving around with right click
    k.controls.enableZoom = false
}

async function addPc(k) {
    let pc = await k.loadModel('models/low_poly_laptop/scene.gltf')
    k.camera.add(pc) // Attach PC to the camera so it moves with it
    pc.scale.set(0.025, 0.025, 0.025) 
    pc.position.set(-1.2, -0.5, -1.5) // Negative Z means "in front" (position is relative to camera)
    return pc
}

async function addAlien(k) {
    let alien = await k.loadModel('models/cute_ufo/scene.gltf')
    k.camera.add(alien)
    alien.position.set(0.4, 0, -0.4)
    alien.scale.set(1,1,1)
    alien.rotation.y -= 1.4
    alien.rotation.z += 0.2
}

async function addCalculator(k) {
    let calc = await k.loadModel('models/stylised_calculator/scene.gltf')
    k.camera.add(calc)
    calc.position.set(0.3, -0.2, -0.4)
    calc.scale.set(1,1,1)
    return calc
}

async function addMouse(k) {
    let m = await k.loadModel('models/low_poly_mouse/scene.gltf')
    k.camera.add(m)
    m.position.set(-0.2, -0.6, -1)
    m.scale.set(0.05,0.05,0.05)
    return m
}

async function addPokeball(k) {
    let p = await k.loadModel('models/pokemon_basic_pokeball/scene.gltf')
    //k.camera.add(p)
    p.position.set(-1, -1, -5)
    p.scale.set(0.01, 0.01, 0.01)
    return p
}


function rotate(thing, x, y , z) {
    thing.rotation.x += x
    thing.rotation.y += y
    thing.rotation.z += z
}

function move(thing, x, y, z) {
    thing.position.x += x
    thing.position.y += y
    thing.position.z += z
}


async function main() {
    let k = new Karen(75)
    k.enableResize()
    addLights(k)
    configureControls(k)
    addAlien(k)
    await k.loadModel('models/low_poly_sky/scene.gltf') //k.scene.background = new THREE.Color(0x0d2442)
    let earth = await k.loadModel('models/earth_cartoon/scene.gltf')
    let pc = await addPc(k)
    let calc = await addCalculator(k)
    let mouse = await addMouse(k)
    let pokeball = await addPokeball(k)

    function animate() {
        const delta = k.clock.getDelta()
        k.mixers.forEach(mixer => mixer.update(delta)) // Update animations

        earth.rotation.y += 0.0005
        rotate(pc, -0.001, 0.001, 0.002)
        rotate(calc, 0.001, 0.002, -0.001)
        rotate(mouse, -0.003, 0.0015, -0.0015)

        rotate(pokeball, 0.2, 0, 0)
        move(pokeball, -0.001, 0.002, 0.02)

        k.controls.update()
        k.renderer.render( k.scene, k.camera ) 
    }
    
    k.camera.layers.enableAll()
    k.run(animate)
}

main()
