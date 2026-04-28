import * as THREE from "three";
import { OrbitControls } from 'jsm/controls/OrbitControls.js';
import { GLTFLoader } from "jsm/loaders/GLTFLoader.js";
import * as SkeletonUtils from "jsm/utils/SkeletonUtils.js";

// 3D megjelenítési méretek
const w = window.innerWidth / 1.73;
const h = window.innerHeight / 1.5;

// Three.js alapobjektumok
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
const clock = new THREE.Clock();

const controls = new OrbitControls(camera, renderer.domElement);
const loader = new GLTFLoader();

const FINGER_GROUP_SIZE = 4;

let mixers = [];
let fingerActions = [];
let isReady = false;

let recorderModel = null;

// 3D tér és kamera alapbeállítása
export function setSpace() {
  camera.position.z = 7;
  camera.position.y = 2500 / w * 1.73;
  camera.position.x = -1500 / w * 1.73;

  renderer.setPixelRatio(window.devicePixelRatio);

  renderer.domElement.style.display = "block";
  renderer.domElement.style.margin = "0 auto";

  document.getElementById("threed").appendChild(renderer.domElement);

  controls.enableDamping = true;
}

// Renderer elrejtése
export function rendererNull() {
  renderer.setSize(0, 0);
}

// Renderer teljes méretre állítása
export function rendererFull() {
  renderer.setSize(w, h);
}

// Animációs ciklus
function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();

  for (const mixer of mixers) {
    mixer.update(delta);
  }

  controls.update();
  renderer.render(scene, camera);
}

// Furulya és ujjak 3D modelljeinek betöltése
export function setRecorder(recorderName) {
  scene.clear();
  renderer.render(scene, camera);

  loader.load("./resources/Finger.glb", (gltf) => {
    const clips = gltf.animations;
    if (!clips || clips.length === 0) return;

    const original = gltf.scene;

    switch (recorderName) {
      case "szoprán":
        // Első ujjcsoport
        for (let i = 0; i < FINGER_GROUP_SIZE; i++) {
          setupFingerModel(
            original,
            clips,
            (i === 0) ? [-2.6, -0.3, -3] : [-2.35 + i * 2.2, -0.3, -3.75],
            [Math.PI * 1.75, Math.PI, 0],
            0x8d5524,
            i
          );
        }

        // Második ujjcsoport
        for (let i = FINGER_GROUP_SIZE; i < FINGER_GROUP_SIZE * 2 - 1; i++) {
          setupFingerModel(
            original,
            clips,
            [i * 2.03 - 1.5, -0.6, -0.5],
            [Math.PI / 3, 0, 0],
            0x6b3300,
            i
          );
        }
        break;

      case "ír_furulya":
        // Első ujjcsoport
        for (let i = 0; i < FINGER_GROUP_SIZE - 1; i++) {
          setupFingerModel(
            original,
            clips,
            [(-0.55 * (i ** 2) - (0.75 * i) - 2.2), -2.45 + 0.01 * i, -4],
            [Math.PI * 1.75, Math.PI, 0],
            0x8d5524,
            i
          );
        }

        // Második ujjcsoport
        for (let i = FINGER_GROUP_SIZE; i < FINGER_GROUP_SIZE * 2 - 1; i++) {
          setupFingerModel(
            original,
            clips,
            [(0.1 * (i ** 2)) + (1.2 * i) - 6.2, -2.8 + 0.01 * i, -0.5],
            [Math.PI / 3, 0, 0],
            0x6b3300,
            i
          );
        }
        break;

      default:
        console.error("Ismeretlen recorder név:", recorderName);
    }

    // Szoprán furulyához külön hüvelykujj modell tartozik
    if (recorderName === "szoprán") {
      loader.load("./resources/Thumb.glb", (thumbGltf) => {
        const thumbClips = thumbGltf.animations;
        const thumbScene = thumbGltf.scene;

        setupFingerModel(
          thumbScene,
          thumbClips,
          [10.5, -2.5, 3.60],
          [0, 0, Math.PI],
          0xcc6600,
          FINGER_GROUP_SIZE * 2 - 1,
          0.5
        );

        fingerActions.reverse();

        isReady = true;
        console.log("Minden betöltve, akciók száma:", fingerActions.length);
      });
    }
  });

  // Furulya modell betöltése
  loader.load("./resources/" + recorderName + ".glb", (gltf) => {
    recorderModel = gltf.scene;

    recorderModel.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = false;
        child.receiveShadow = false;
      }
    });

    renderer.toneMappingExposure = 0.3;

    recorderModel.position.set(9, -1.5, -2);
    recorderModel.rotation.y = Math.PI / 2;
    recorderModel.scale.set(9, 9.5, 9);

    scene.add(recorderModel);
  });

  // Alap megvilágítás
  const ambient = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambient);

  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 0;

  animate();
}

// Egy ujjmodell példányosítása és animációinak eltárolása
function setupFingerModel(original, clips, pos, rot, color, actionIdx, scaleValue = 1.0) {
  const model = SkeletonUtils.clone(original);

  model.scale.set(scaleValue, scaleValue, scaleValue);

  model.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = child.receiveShadow = true;
      child.material = child.material.clone();
      child.material.color.set(color);
    }
  });

  model.position.set(...pos);
  model.rotation.set(...rot);

  scene.add(model);

  const mixer = new THREE.AnimationMixer(model);
  mixers.push(mixer);

  // Ujj animációk mentése későbbi vezérléshez
  const action1 = mixer.clipAction(clips[1]);
  action1.setLoop(THREE.LoopOnce);
  action1.clampWhenFinished = true;
  fingerActions[actionIdx] = action1;

  const action0 = mixer.clipAction(clips[0]);
  action0.setLoop(THREE.LoopOnce);
  action0.clampWhenFinished = true;
  fingerActions[FINGER_GROUP_SIZE * 2 + actionIdx] = action0;
}

export { fingerActions, isReady };