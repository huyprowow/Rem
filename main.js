import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { TGALoader } from "three/examples/jsm/loaders/TGALoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
/*
- tao ra 1 scene
- tao ra 1 camera
- tao ra 1 renderer
- load texture
- load material
- load object
- them light
- them orbit control
*/

const fieldOfView = 40;
const aspectRatio = window.innerWidth / window.innerHeight;
const nearPlane = 0.1;
const farPlane = 1000;
// let texture;
// let material;
// let object;

//scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

/*
          directionalLight
      RemModel
*/
const directionalLight = new THREE.DirectionalLight(0xffffff, 100);
directionalLight.castShadow = true;
directionalLight.position.set(5, 5, 2);

scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 100);
// ambientLight.castShadow = true;
ambientLight.position.set(5, 5, 0);
scene.add(ambientLight);

const spotLight = new THREE.SpotLight(0xffffff, 5);
spotLight.position.set(0, 0, 0);
spotLight.castShadow = true;
scene.add(spotLight);

// var keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(50, 100%, 75%)'), 1.0);
// keyLight.position.set(-100, 0, 100);
// var fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 75%)'), 0.75);
// fillLight.position.set(100, 0, 100);
// var backLight = new THREE.DirectionalLight(0xffffff, 1.0);
// backLight.position.set(100, 0, -100).normalize();
// scene.add(keyLight);
// scene.add(fillLight);
// scene.add(backLight);

/*      pLight2
pLight3  RemModel   pLight4
          pLight1
*/
let pLight1 = new THREE.PointLight(0xffffff, 3);
pLight1.position.set(0, 3, 5);
// scene.add(pLight1);
// let pLight2 = new THREE.PointLight(0xffffff,3);
// pLight2.position.set(5,1,0);
// scene.add(pLight2);
// let pLight3 = new THREE.PointLight(0xffffff,3);
// pLight3.position.set(0,1,-5);
// scene.add(pLight3);
// let pLight4 = new THREE.PointLight(0xffffff,3);
// pLight4.position.set(-5,5,0);
// scene.add(pLight4);

// floor (de dung)
let floorGeometry = new THREE.PlaneGeometry(5000, 5000, 1, 1);
let floorMaterial = new THREE.MeshPhongMaterial({
  color: 0x000000,
  shininess: 2,
});
let floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -0.5 * Math.PI; // radians (-pi/2 = 90 do)
floor.receiveShadow = true;
floor.position.y = -0.5;
scene.add(floor);
//camera
const camera = new THREE.PerspectiveCamera(
  fieldOfView,
  aspectRatio,
  nearPlane,
  farPlane
);

camera.position.x = 0;
camera.position.y = 0.5;
camera.position.z = 4;

//process,error
//- (xu li log % load xong)
const onProgress = (xhr) => {
  //   console.log(xhr)
  if (xhr.lengthComputable) {
    const percentComplete = (xhr.loaded / xhr.total) * 100;
    console.log(`${Math.round(percentComplete, 2)}% downloaded`);
  }
};
//- (xu li load loi)
const onError = (err) => {
  console.log("err: " + err);
};
//load texture bo (xuat dang jpg k dung tga nua)
// const manager = new THREE.LoadingManager();
// manager.addHandler(/\.tga$/i, new TGALoader());

//load material
const mtlLoader = new MTLLoader();
mtlLoader.setPath("public/Rem/");
mtlLoader.load("rem.mtl", (materials) => {
  materials.preload();

  console.log(materials);
  // console.log(manager)

  //load object
  const objLoader = new OBJLoader();
  objLoader.setMaterials(materials);
  objLoader.setPath("public/Rem/");
  objLoader.load(
    "rem.obj",
    (object) => {
      // object
      object.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      // object.scale.set(0.8, 0.8, 0.8);
      // console.log(object);
      // object.rotateY(0.2);
      object.position.y = -0.5; //cho no cham dat
      scene.add(object);
    },
    onProgress,
    onError
  );
});

//renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//controls
const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 0.5, 4);
// controls.target.set(0, 0, 4);
controls.update();

//devtool
// if (typeof __THREE_DEVTOOLS__ !== 'undefined') {
//     __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent('observe', { detail: scene }));
//     __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent('observe', { detail: renderer }));
//   }

window.addEventListener("resize", () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
});

const draw = () => {
  renderer.render(scene, camera);
  controls.update();
  requestAnimationFrame(draw);
};
draw();
