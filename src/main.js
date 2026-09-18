import * as THREE from 'three/webgpu';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import WebGPU from 'three/addons/capabilities/WebGPU.js';
import './styles.css';

import { createParameters } from './simulation/parameters.js';
import { createSimulation } from './simulation/createSimulation.js';
import { createLabPanel } from './ui/labPanel.js';
import { createSlidePresenter } from './ui/slidePresenter.js';
import { generateSlideShape } from './simulation/shapeGenerators.js';

// Cantidad de partículas reducida a 8,192 (2^13) para lograr figuras nítidas, limpias y definidas
const PARTICLE_COUNT = 8192;

async function main() {
  const mount = document.querySelector('#app');

  if (!WebGPU.isAvailable()) {
    mount.appendChild(WebGPU.getErrorMessage());
    throw new Error('Este proyecto requiere WebGPU para ejecutar compute shaders.');
  }

  // THREE.JS MENTAL MODEL: scene + camera + renderer ---------------------
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#040608');

  const camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.05, 100);
  camera.position.set(0, 0, 10.5);

  const renderer = new THREE.WebGPURenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);
  mount.appendChild(renderer.domElement);
  await renderer.init();

  const orbit = new OrbitControls(camera, renderer.domElement);
  orbit.enableDamping = true;
  orbit.target.set(0, 0, 0);

  const params = createParameters();
  const simulation = createSimulation({ renderer, scene, params, count: PARTICLE_COUNT });

  // Arreglos reutilizables para actualización de objetivos sin recolocar memoria
  const posBuffer = new Float32Array(PARTICLE_COUNT * 3);
  const colBuffer = new Float32Array(PARTICLE_COUNT * 3);

  // LAB HELPERS (visibles solo en modo LAB con la tecla P) ----------------
  const attractorHelper = new THREE.Mesh(
    new THREE.SphereGeometry(0.12, 16, 12),
    new THREE.MeshBasicMaterial({ color: '#ffffff' })
  );
  scene.add(attractorHelper);
  const axes = new THREE.AxesHelper(1.5);
  scene.add(axes);

  let paused = false;
  let mode = 'PRESENTATION';
  let currentSlideIndex = 0;
  let slideTime = 0;

  // 1. MANEJAR CAMBIO DE DIAPOSITIVA Y REGENERAR FORMA OBJETIVO ----------
  function handleSlideChange(slide, prevSlide, index) {
    currentSlideIndex = index;
    slideTime = 0;

    // Configurar parámetros físicos para movimiento suave y pausado
    params.particleSize.value = slide.params.particleSize || 0.075;
    params.springStrength.value = 2.8;
    params.dragCoefficient.value = 1.35;
    params.maxSpeed.value = 3.2;

    // Generar la forma objetivo inicial del momento
    generateSlideShape(currentSlideIndex, PARTICLE_COUNT, 0, posBuffer, colBuffer);
    simulation.updateTargets(posBuffer, colBuffer);
  }

  // 2. INSTANCIAR CAPA DE PRESENTACIÓN ESCÉNICA --------------------------
  const slidePresenter = createSlidePresenter({
    onSlideChange: handleSlideChange
  });

  // 3. MODO LABORATORIO (TECLA P) ----------------------------------------
  const applyPreset = (id) => {
    params.windEnabled.value = 0;
    params.radialEnabled.value = 0;
    params.vortexEnabled.value = 0;
    params.dragEnabled.value = 1;
    params.initialSpeed.value = 0;
    params.springStrength.value = 0; // En pruebas de laboratorio, desactivar resorte
    params.dragCoefficient.value = 0.08;

    if (id === 'inertia') {
      params.initialSpeed.value = 0.8;
    } else if (id === 'wind') {
      params.windEnabled.value = 1;
      params.wind.value.set(1.5, 0, 0);
    } else if (id === 'attract') {
      params.radialEnabled.value = 1;
      params.radialStrength.value = 3.0;
    } else if (id === 'repel') {
      params.radialEnabled.value = 1;
      params.radialStrength.value = -3.0;
    } else if (id === 'vortex') {
      params.radialEnabled.value = 1;
      params.radialStrength.value = 1.0;
      params.vortexEnabled.value = 1;
      params.vortexStrength.value = 3.0;
    }
    simulation.reset();
    panel?.refresh();
  };

  const setMode = (next) => {
    mode = next;
    const isLab = mode === 'LAB';
    panel.setVisible(isLab);
    axes.visible = isLab;
    attractorHelper.visible = isLab;
    hud.style.display = isLab ? 'block' : 'none';
    slidePresenter.setLabMode(isLab);

    if (!isLab) {
      params.springStrength.value = 6.5;
      const current = slidePresenter.getSlide(slidePresenter.getCurrentIndex());
      if (current) handleSlideChange(current, null, slidePresenter.getCurrentIndex());
    }
  };

  const panel = createLabPanel({
    params,
    onReset: () => simulation.reset(),
    onPreset: applyPreset,
    onModeChange: () => setMode(mode === 'LAB' ? 'PRESENTATION' : 'LAB'),
    onPauseChange: () => (paused = !paused)
  });

  const hud = document.createElement('div');
  hud.className = 'hud';
  hud.innerHTML = '<strong>LAB</strong> · P: presentación · R: reset · 1–5: pruebas';
  document.body.append(hud);

  setMode('PRESENTATION');

  // CONTROLES DE TECLADO --------------------------------------------------
  addEventListener('keydown', (event) => {
    if (event.repeat) return;
    if (event.code === 'KeyP') {
      setMode(mode === 'LAB' ? 'PRESENTATION' : 'LAB');
    }
  });

  addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });

  simulation.reset();

  // FRAME ANIMATION LOOP --------------------------------------------------
  const clock = new THREE.Clock();

  renderer.setAnimationLoop(() => {
    const delta = Math.min(clock.getDelta(), 0.1);
    params.dt.value = delta;

    if (mode === 'PRESENTATION') {
      // Evolución temporal pausada (55% de velocidad para movimiento cinematográfico)
      slideTime += delta * 0.55;
      params.time.value = slideTime;

      // Actualizar dinámicas continuas para figuras vivas
      generateSlideShape(currentSlideIndex, PARTICLE_COUNT, slideTime, posBuffer, colBuffer);
      simulation.updateTargets(posBuffer, colBuffer);
    }

    if (!paused) simulation.stepSimulation();
    orbit.update();
    renderer.render(scene, camera);
  });
}

main().catch((error) => {
  console.error(error);
  const pre = document.createElement('pre');
  pre.style.cssText = 'position:fixed;inset:16px;white-space:pre-wrap;color:#fff;z-index:500';
  pre.textContent = String(error?.stack || error);
  document.body.append(pre);
});
