import * as THREE from '../three.module.js';

function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({ canvas });

  // camera
  const fov = 40;
  const aspect = 2;
  const near = 0.1;
  const far = 1000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 10;

  // new scene
  const scene = new THREE.scene();
  scene.background = new THREE.color(0x050505);

  const objects = [];
  const radius = 1;
  const widthSegments = 6;
  const heightSegments = 6;
  const sphereGeometry = new THREE.SphereBufferGeometry(
    radius,
    widthSegments,
    heightSegments,
  );

  {
    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
  }

  const rand = (min, max) => min + Math.random() * (max - min);
  let particles;
  const MAX = 100;
  function setupScene() {
    particles = new THREE.Group();
    const geo = new THREE.SphereBufferGeometry(0.1);
    const mat = new THREE.MeshLambertMaterial({ color: 'red' });
    for (let i = 0; i < MAX; i++) {
      const particle = new THREE.Mesh(geo, mat);
      particle.velocity = new THREE.Vector3(
        rand(-0.01, 0.01),
        0.06,
        rand(-0.01, 0.01),
      );
      particle.acceleration = new THREE.Vector3(0, -0.001, 0);
      particle.position.x = rand(-1, 1);
      particle.position.z = rand(-1, 1);
      particle.position.y = rand(-1, -3);
      particles.add(particle);
    }
    particles.position.z = -4;
    scene.add(particles);
  }

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize; // returns true if resized
  }

  function render(time) {
    time *= 0.001; // convert time to seconds
    particles.children.forEach(p => {
      p.velocity.add(p.acceleration);
      p.position.add(p.velocity);
    });
    renderer.render(scene, camera);

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

main();
