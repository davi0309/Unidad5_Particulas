import * as THREE from 'three/webgpu';
import { uniform } from 'three/tsl';

// Uniforms are CPU-side values that TSL exposes to the GPU.
// Changing .value does not rebuild the compute shader.
export function createParameters() {
  return {
    dt: uniform(1 / 60),
    timeScale: uniform(0.65), // Movimiento más lento y cinematográfico
    initialSpeed: uniform(0.20),
    maxSpeed: uniform(3.2), // Límite de velocidad suave
    boundsSize: uniform(12.0),
    particleSize: uniform(0.075),

    // Forces baseline
    windEnabled: uniform(0.0),
    wind: uniform(new THREE.Vector3(0.0, 0.0, 0.0)),

    radialEnabled: uniform(0.0),
    attractor: uniform(new THREE.Vector3(0.0, 0.0, 0.0)),
    radialStrength: uniform(0.0),
    softening: uniform(0.35),

    vortexEnabled: uniform(0.0),
    vortexStrength: uniform(0.0),

    dragEnabled: uniform(1.0),
    dragCoefficient: uniform(1.35), // Mayor amortiguación para movimiento flotante y sin tirones

    // Fuerza de resorte suave hacia las figuras objetivo
    springStrength: uniform(2.8),

    // Extension uniforms for Multi-Slide Orchestration
    mode: uniform(0.0),
    attractor2: uniform(new THREE.Vector3(1.5, 0.0, 0.0)),
    attractor3: uniform(new THREE.Vector3(-1.5, 0.0, 0.0)),
    gridInfluence: uniform(0.0),
    pulse: uniform(0.0),
    time: uniform(0.0),
    colorSlow: uniform(new THREE.Color('#08a9dd')),
    colorFast: uniform(new THREE.Color('#ffb35a'))
  };
}
