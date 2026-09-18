import * as THREE from 'three/webgpu';
import {
  Fn,
  If,
  color,
  hash,
  instanceIndex,
  instancedArray,
  max,
  mix,
  mod,
  round,
  step,
  uint,
  uv,
  vec3,
  vec4
} from 'three/tsl';

export function createSimulation({ renderer, scene, params, count = 8192 }) {
  // STATE -----------------------------------------------------------------
  // Buffers de almacenamiento GPU: posición, velocidad, posición objetivo y color
  const positionBuffer = instancedArray(count, 'vec3');
  const velocityBuffer = instancedArray(count, 'vec3');
  const targetBuffer = instancedArray(count, 'vec3');
  const colorBuffer = instancedArray(count, 'vec3');

  // INITIALIZATION --------------------------------------------------------
  // Escribe el estado inicial de todas las partículas en GPU en paralelo
  const initParticles = Fn(() => {
    const i = instanceIndex;
    const p = positionBuffer.element(i);
    const v = velocityBuffer.element(i);
    const t = targetBuffer.element(i);
    const c = colorBuffer.element(i);

    const r1 = hash(i.add(uint(11)));
    const r2 = hash(i.add(uint(23)));
    const r3 = hash(i.add(uint(37)));
    const r4 = hash(i.add(uint(53)));
    const r5 = hash(i.add(uint(71)));
    const r6 = hash(i.add(uint(89)));

    const initPos = vec3(r1, r2, r3).sub(0.5).mul(params.boundsSize.mul(0.45));
    p.assign(initPos);
    t.assign(initPos);
    v.assign(vec3(r4, r5, r6).sub(0.5).mul(params.initialSpeed));
    c.assign(vec3(0.031, 0.663, 0.867)); // Azul Fórum inicial
  })().compute(count).setName('Initialize Particles');

  // UPDATE / COMPUTE SHADER ----------------------------------------------
  // Bucle físico en GPU:
  // posición + objetivo -> fuerza elástica + fricción -> aceleración -> velocidad -> posición
  const updateParticles = Fn(() => {
    const i = instanceIndex;
    const p = positionBuffer.element(i);
    const v = velocityBuffer.element(i);
    const target = targetBuffer.element(i);

    const dt = params.dt.mul(params.timeScale);
    const force = vec3(0.0).toVar();

    // 1) FUERZA ELÁSTICA HACIA LA FORMA OBJETIVO: F = k * (target - p)
    const toTarget = target.sub(p);
    force.addAssign(toTarget.mul(params.springStrength));

    // 2) FRICCIÓN LINEAL PARA ESTABILIDAD Y FLUIDEZ: F = -c * v
    force.addAssign(v.mul(params.dragCoefficient).mul(params.dragEnabled).mul(-1.0));

    // 3) VIENTO / DERIVA ADICIONAL
    force.addAssign(params.wind.mul(params.windEnabled));

    // INTEGRACIÓN SEMI-IMPLÍCITA (Euler)
    v.addAssign(force.mul(dt));

    const speed = v.length();
    If(speed.greaterThan(params.maxSpeed), () => {
      v.assign(v.normalize().mul(params.maxSpeed));
    });

    p.addAssign(v.mul(dt));
  })().compute(count).setName('Update Particles');

  // RENDER ---------------------------------------------------------------
  // SpriteNodeMaterial con sombreado de círculo y colores por partícula desde GPU
  const material = new THREE.SpriteNodeMaterial({
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    transparent: true
  });

  material.positionNode = positionBuffer.toAttribute();
  material.scaleNode = params.particleSize;
  material.colorNode = vec4(colorBuffer.toAttribute().xyz, 1.0);

  // Opacidad completa: la máscara UV no es compatible con este material instanciado en WebGPU.
  material.opacityNode = 1.0;

  const geometry = new THREE.PlaneGeometry(1, 1);
  const mesh = new THREE.InstancedMesh(geometry, material, count);
  mesh.frustumCulled = false;
  scene.add(mesh);

  function reset() {
    renderer.compute(initParticles);
  }

  function stepSimulation() {
    renderer.compute(updateParticles);
  }

  function updateTargets(posArray, colArray) {
    if (posArray) {
      targetBuffer.value.array.set(posArray);
      targetBuffer.value.needsUpdate = true;
    }
    if (colArray) {
      colorBuffer.value.array.set(colArray);
      colorBuffer.value.needsUpdate = true;
    }
  }

  function dispose() {
    geometry.dispose();
    material.dispose();
    scene.remove(mesh);
  }

  return {
    count,
    positionBuffer,
    velocityBuffer,
    targetBuffer,
    colorBuffer,
    updateTargets,
    reset,
    stepSimulation,
    dispose
  };
}
