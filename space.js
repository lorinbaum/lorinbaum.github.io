import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js'
import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js';
import { Lensflare, LensflareElement } from 'https://unpkg.com/three@0.126.1/examples/jsm/objects/Lensflare.js';

const turbo = false;
let controls;
const orbit = true;

// TODO: determine the user position through location access
const userPos = { // munich
  // lat: 48.137154,
  // lon: 11.576124
  lat: 0, // latitude should always be 0. "Unfixable", apparent oscillations appear otherwise
  lon: 10
}

async function main() {

  const renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize( window.innerWidth, window.innerHeight);
  document.getElementById("webgl").appendChild(renderer.domElement);
  const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 16000);
  camera.position.set(0, 0, 200);

  const loader = new THREE.TextureLoader();
  const scene = new THREE.Scene();

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;
  controls.enableRotate = true;
  controls.enablePan = true;

  {
    const color = 0xFFFFFF;
    const intensity = 1.5;
    const light = new THREE.PointLight(color, intensity);
    light.position.set(0, 0, 0);
    scene.add(light);

    const textureFlare = loader.load("assets/lensflare0.png");
    const lensflare = new Lensflare();
		lensflare.addElement(new LensflareElement(textureFlare, 400, 0));
    light.add(lensflare);

    const ambientLight = new THREE.AmbientLight(color, intensity);
    ambientLight.intensity = 0.1;
    scene.add(ambientLight);
  }

  const radius = 1;
  const widthSegments = 32;
  const heightSegments = 32;
  const sphereGeometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);

  const solarSystem = new THREE.Object3D();
  scene.add(solarSystem);

  const sunMaterial = new THREE.MeshPhongMaterial({emissive: 0xFFFFFF});
  const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
  sunMesh.scale.set(69.634, 69.634, 69.634);
  solarSystem.add(sunMesh);

  const earthSystem = new THREE.Object3D();
  solarSystem.add(earthSystem);

  const earthMaterial = new THREE.MeshPhongMaterial({
    map: loader.load("assets/earthDayMap2K.jpg"),
    bumpMap: loader.load("assets/earthBumpMap2K.jpg"),
    bumpScale: 0.005,
    specularMap: loader.load("assets/earthSpecularMap2K.jpg"),
    specular: 0x222222
  });
  const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
  earthMesh.scale.set(0.6371, 0.6371, 0.6371);
  earthMesh.rotation.x = radians(23.4);
  earthSystem.add(earthMesh);

  const cloudMaterial = new THREE.MeshPhongMaterial({
    map: loader.load("assets/earthClouds2K.jpg"),
    transparent: true,
    alphaMap: loader.load("assets/earthClouds2K.jpg")
  });
  const cloudMesh = new THREE.Mesh(sphereGeometry, cloudMaterial);
  cloudMesh.scale.set(0.645, 0.645, 0.645);
  cloudMesh.rotation.x = radians(23.4);
  earthSystem.add(cloudMesh);

  const moonMaterial = new THREE.MeshPhongMaterial({color: 0x555555, emissive: 0x111111});
  const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
  moonMesh.scale.set(0.17371, 0.17371, 0.17371);
  // earthSystem.add(moonMesh);
  /* Moon calc */
  // const moonDistance = 38.44; // semimajor axis
  // const moonInclination = radians(5.14);
  // const moonMaxY = Math.sin(moonInclination) * moonDistance;

  const earthPosX = Math.sin(radians(earthPosition())) * 14960;
  const earthPosZ = Math.cos(radians(earthPosition())) * 14960;
  const camDist = 5; // distance from Earth factor
  // + 90 because then position is on Greenwich longitude
  const tiltAngleHere = map(Math.sin(radians(earthRotation() + userPos.lon)), -1, 1, -23.4, 23.4);
  const totalAngle = tiltAngleHere + userPos.lat;
  const camEarthOffsetX = Math.sin(radians(earthRotation() + 90 + userPos.lon)) * Math.cos(radians(totalAngle));;
  const camEarthOffsetY = Math.sin(radians(totalAngle));
  const camEarthOffsetZ = Math.cos(radians(earthRotation() + 90 + userPos.lon)) * Math.cos(radians(totalAngle));;
  const camX = earthPosX + camEarthOffsetX * camDist;
  const camY = camEarthOffsetY * camDist;
  const camZ = earthPosZ + camEarthOffsetZ * camDist;
  camera.position.set(camX, camY, camZ);
  camera.lookAt(Math.sin(radians(earthPosition())) * 14960, 0, Math.cos(radians(earthPosition())) * 14960);



  function render(time) {
    time /= 2000; // from ms to s

    const earthPosX = Math.sin(radians(earthPosition())) * 14960;
    const earthPosZ = Math.cos(radians(earthPosition())) * 14960;
    earthSystem.position.set(earthPosX, 0, earthPosZ);

    // const moonAngleNow;
    // const moonPosY = map(moonAngleNow, 0, 2 * Math.PI, -moonMaxY, moonMaxY);
    // moonMesh.position.set(Math.sin(radians(earthPosition())) * 38.44, 0, Math.cos(radians(earthPosition())) * 38.44);



    if (orbit) {
      controls.target = new THREE.Vector3(earthPosX, 0, earthPosZ);
    } else {
      camera.lookAt(Math.sin(radians(earthPosition())) * 14960, 0, Math.cos(radians(earthPosition())) * 14960);
      if (turbo) {
        const camDist = 50; // distance from Earth factor
        const tiltAngleHere = map(Math.sin(time + radians(userPos.lon)), -1, 1, -23.4, 23.4);
        const totalAngle = tiltAngleHere + userPos.lat;
        const camEarthOffsetX = Math.sin(time + radians(userPos.lon + 90)) * Math.cos(radians(totalAngle));
        const camEarthOffsetY = Math.sin(radians(totalAngle));
        const camEarthOffsetZ = Math.cos(time + radians(userPos.lon + 90)) * Math.cos(radians(totalAngle));
        const camX = earthPosX + camEarthOffsetX * camDist;
        const camY = camEarthOffsetY * camDist;
        // const camY = 0;
        const camZ = earthPosZ + camEarthOffsetZ * camDist;
        camera.position.set(camX, camY, camZ);
        earthMesh.rotation.y = time;
        cloudMesh.rotation.y = time;
      } else {
        const camDist = 5; // distance from Earth factor
        // + 90 because then position is on Greenwich longitude
        const tiltAngleHere = map(Math.sin(radians(earthRotation() + userPos.lon)), -1, 1, -23.4, 23.4);
        const totalAngle = tiltAngleHere + userPos.lat;
        const camEarthOffsetX = Math.sin(radians(earthRotation() + 90 + userPos.lon)) * Math.cos(radians(totalAngle));;
        const camEarthOffsetY = Math.sin(radians(totalAngle));
        const camEarthOffsetZ = Math.cos(radians(earthRotation() + 90 + userPos.lon)) * Math.cos(radians(totalAngle));;
        const camX = earthPosX + camEarthOffsetX * camDist;
        const camY = camEarthOffsetY * camDist;
        const camZ = earthPosZ + camEarthOffsetZ * camDist;
        camera.position.set(camX, camY, camZ);
      }
    }

    earthMesh.rotation.y = radians(earthRotation());
    cloudMesh.rotation.y = radians(earthRotation());

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

  window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  })
}


function radians(deg) {
  return deg * Math.PI / 180;
}

function map(x, s1, e1, s2, e2) {
  return (x - s1) * (e2 - s2) / (e1 - s1) + s2;
}

function earthRotation() { // returns rotation of earth in degrees 0 to 360
  // NOTE: 270 rotation for earth means longitude 0 crosses x Axis. x Axis extending from there counts to positive. Positive rotation rotates counterclockwhise when looked at from northpole
  const timeNow = new Date(Date.now());
  // timeNow.setHours(8);
  // timeNow.setMinutes(0);

  const offsetHours = map(earthPosition(), 0, 360, 0, 24) // this offset is created by the rotation of earth around the sun. eg 180 days later the same spot is night when it was day before if there was no rotation of earth.

  const utcNoRot = new Date();
  const offsetMinutes = offsetHours % 1 * 60;
  const offsetSeconds = offsetMinutes & 1 * 60;

  utcNoRot.setHours(6 - offsetHours); // if no rotation is applied utc = 6am therefore hours = 6 by default.
  utcNoRot.setMinutes(0 - offsetMinutes);
  utcNoRot.setSeconds(0 - offsetSeconds);

  const timeNowUTC = new Date(timeNow.getUTCFullYear(), timeNow.getUTCMonth(), timeNow.getUTCDate(), timeNow.getUTCHours(), timeNow.getUTCMinutes(), timeNow.getUTCSeconds());

  const timeDif = new Date(timeNowUTC.getTime() - utcNoRot.getTime());

  const timeDifHours = timeDif.getHours() + timeDif.getMinutes() / 60 + timeDif.getSeconds() / 3600; // no understanding as to why timeDif.getHours gets added / substracted some amount

  const rotation = map(timeDifHours, 0, 24, 0, 360);

  return rotation;
}

function earthPosition() { // returns angle sun - earth in degrees 0 to 360
  const monthDays = [31, 28, 31, 30, 31, 30, 31 ,31, 30, 31, 30, 31];
  const timeNow = new Date(Date.now());
  let day = timeNow.getDate();
  const month = timeNow.getMonth() + 1;
  const year = timeNow.getFullYear();
  let dayOfYear = 0;
  if (month == 12 && day > 21) {
    dayOfYear = day() - 21;
  } else {
    for (let i = 0; i < month - 1; i++) {
      dayOfYear += monthDays[i];
    }
    if (year % 4 == 0 && month > 2) {
      dayOfYear ++;
    }
    dayOfYear += 10;
    dayOfYear += day;
  }
  let daysInYear;
  if (year % 4 == 0 && month > 2) {
    daysInYear = 366;
  } else {
    daysInYear = 365;
  }
  return map(dayOfYear, 0, daysInYear, 0, 360);
}


main();
// earthPosition();
// earthRotation();


let fullscreen = document.fullscreenElement;
if (fullscreen != null) {
  fullscreen = true;
} else {
  fullscreen = false;
}
const help = document.getElementById("helpText");
$("#help").button()
.mouseover(function() {
  help.style.visibility = "visible";
  help.style.opacity = "1";
})
.mouseout(function() {
  help.style.opacity = "0";
  setTimeout(function() {}, 200);
  help.style.visibility = "hidden";
});
$("#fileInputLabel").button();
$("#buttonFullscreen").click(toggleFullscreen);

function toggleFullscreen() {
  const elem = document.body;
  if (fullscreen) {
    fullscreen = false;
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { /* Safari */
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE11 */
      document.msExitFullscreen();
    }
    document.getElementById("buttonFullscreen").src ="assets/icons/iconFullscreen.svg";
  } else {
    fullscreen = true;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
      elem.msRequestFullscreen();
    }
    document.getElementById("buttonFullscreen").src = "assets/icons/iconFullscreenClose.svg";
  }
}
