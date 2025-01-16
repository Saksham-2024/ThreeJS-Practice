import * as THREE from "three";
import { developScene } from "./animation.js";
import { getTransition } from "./Transition.js";

const clock = new THREE.Clock();
let transition;
init();
animate();

function init() {
  const container = document.getElementById("container");

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  const materialA = new THREE.MeshBasicMaterial({
    color: 0xFFFFFF,
    wireframe: true,
    clearColor: 0xefefef
  });
  const materialB = new THREE.MeshStandardMaterial({
    color: 0xFF9900,
    flatShading: true,
  });
  const sceneA = developScene({
    renderer,
    material: materialA,
    clearColor: 0x000000
  });
  const sceneB = developScene({
    renderer,
    material: materialB,
    clearColor: 0x000000,
    needsAnimatedColor: true,
  });

  transition = getTransition({ renderer, sceneA, sceneB });
}

function animate() {
  requestAnimationFrame(animate);
  transition.render(clock.getDelta());
}
