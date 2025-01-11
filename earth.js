import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { getFresnelMat } from "./src/getFresnelMat.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 7.5;
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#bg"),
    antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);

const sunlight = new THREE.DirectionalLight({color: 0xf6cd8b,intensity: 10.0});
sunlight.position.x = 2;
sunlight.position.y = 0;
sunlight.position.z = 2;
scene.add(sunlight);

renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

const controls = new OrbitControls(camera, renderer.domElement);

const earthGroup = new THREE.Group();
earthGroup.rotation.z = -23.4 * Math.PI / 180;

const geometry = new THREE.IcosahedronGeometry(1.5,48);
const material = new THREE.MeshPhongMaterial({
    map: new THREE.TextureLoader().load("./textures/00_earthmap1k.jpg"),
    specularMap: new THREE.TextureLoader().load("./textures/02_earthspec1k.jpg"),
    bumpMap: new THREE.TextureLoader().load("./textures/01_earthbump1k.jpg"),
    bumpScale: 10,
});

const earth = new THREE.Mesh(geometry,material);
// earth.position.y = -3;
earthGroup.add(earth);

const nightMat = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load("./textures/03_earthlights1k.jpg"),
    blending: THREE.AdditiveBlending,
});

const nightEarth = new THREE.Mesh(geometry,nightMat);
earthGroup.add(nightEarth);

const cloudsMat = new THREE.MeshPhongMaterial({
    map: new THREE.TextureLoader().load("./textures/04_earthcloudmap.jpg"),
    transparent: true,
    opacity: 0.8,
    alphaMap: new THREE.TextureLoader().load("./textures/05_earthcloudmaptrans.jpg"),
    blending: THREE.AdditiveBlending,
});

const cloudEarth = new THREE.Mesh(geometry, cloudsMat);
cloudEarth.scale.setScalar(1.01);
earthGroup.add(cloudEarth);

const fresnelMat = getFresnelMat();
const glowMesh = new THREE.Mesh(geometry, fresnelMat);
glowMesh.scale.setScalar(1.011);
earthGroup.add(glowMesh);

scene.add(earthGroup);  

function addStar() {
    const geometry = new THREE.SphereGeometry(0.25, 24, 24);
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const star = new THREE.Mesh(geometry, material);
    const [x, y, z] = Array(3)
        .fill()
        .map(() => THREE.MathUtils.randFloatSpread(400));
    star.position.set(x, y, z);
    scene.add(star);
}

Array(2000).fill().forEach(addStar);

function animate() {
    requestAnimationFrame(animate);
    earthGroup.rotation.y += 0.002;
    cloudEarth.rotation.y += 0.0021;
    renderer.render(scene, camera);
}
animate();







