import * as THREE from "three";

const objectCount = 3000;

function createObjectProperties(){
    const arr = [];
    for (let i = 0; i < objectCount; i ++){
        arr.push(
            {
                position: {
                    x: Math.random() * 10000 - 5000,
                    y: Math.random() * 6000 - 3000,
                    z: Math.random() * 8000 - 4000
                },
                rotation: {
                    x: Math.random() * 2 * Math.PI,
                    y: Math.random() * 2 * Math.PI,
                    z: Math.random() * 2 * Math.PI
                },
                scale: Math.random() * 200 + 100
            }
        )
    }
    return arr;
}

const objectProperties = createObjectProperties();

function getMesh(material, needsAnimatedColor = false){
    const size = 0.35;
    const geometry = new THREE.IcosahedronGeometry(size, 1);
    const mesh = new THREE.InstancedMesh(geometry, material, objectCount); 

    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    let properties;
    for (let i = 0; i < objectCount; i++){
        properties = objectProperties[i];
        dummy.position.x = properties.position.x;
        dummy.position.y = properties.position.y;
        dummy.position.z = properties.position.z;

        dummy.rotation.x = properties.rotation.x;
        dummy.rotation.y = properties.rotation.y;
        dummy.rotation.z = properties.rotation.z;

        dummy.scale.set(properties.scale, properties.scale, properties.scale);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
        if (needsAnimatedColor) { mesh.setColorAt(i, color.setScalar(0.1 + 0.9 * Math.random())); }
    }
    return mesh;
}

export function developScene({ renderer, material, clearColor, needsAnimatedColor=true}){
    const w = window.innerWidth;
    const h = window.innerHeight;
    const camera = new THREE.PerspectiveCamera( 75, w / h, 1, 10000);
    // camera.position.x = 5000;
    // camera.position.y = 3000;
    camera.position.z = 2000;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(clearColor, 0.0002);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x555555, 1.0));
    const mesh = getMesh(material, needsAnimatedColor);
    scene.add(mesh);

    const fbo = new THREE.WebGLRenderTarget(w, h);

    const rotationSpeed = new THREE.Vector3(0.1, -0.2, 0.15);
    const update = (delta) => {
        mesh.rotation.x += delta * rotationSpeed.x;
        mesh.rotation.y += delta * rotationSpeed.y;
        mesh.rotation.z += delta * rotationSpeed.z;
        if (needsAnimatedColor) {
          material.color.setHSL(0.1 + 0.5 * Math.sin(0.0002 * Date.now()), 1, 0.5);
        }
    }
    const render = (delta, rtt) => {
        update(delta);
    
        renderer.setClearColor(clearColor);
    
        if (rtt) {
          renderer.setRenderTarget(fbo);
          renderer.clear();
          renderer.render(scene, camera);
        } else {
          renderer.setRenderTarget(null);
          renderer.render(scene, camera);
        }
      };
    
      return { fbo, render, update }; 
};