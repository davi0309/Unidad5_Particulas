import * as THREE from 'three/webgpu';

/**
 * Generadores matemáticos de formas icónicas y estructuradas para las 13 diapositivas.
 * Reemplaza toda dispersión aleatoria por contornos geométricos, siluetas nítidas
 * y animaciones cinemáticas precisas.
 */

function hexToRgb(hex) {
  const c = new THREE.Color(hex);
  return [c.r, c.g, c.b];
}

// Muestreo determinista uniforme en [0..1]
function frac(x) {
  return x - Math.floor(x);
}

export function generateSlideShape(slideIndex, count, time = 0, posArray, colArray) {
  const p = posArray || new Float32Array(count * 3);
  const c = colArray || new Float32Array(count * 3);

  switch (slideIndex) {
    case 0: // DIAPOSITIVA 1: Dos personas nítidas dándose la mano
      generateHandshake(count, time, p, c);
      break;

    case 1: // DIAPOSITIVA 2: Auditorio con sillería cartesiana
      generateAuditoriumSeats(count, time, p, c);
      break;

    case 2: // DIAPOSITIVA 3: Planeta esférico chocado por bola y dispersión
      generatePlanetCollision(count, time, p, c);
      break;

    case 3: // DIAPOSITIVA 4: Tres figuras (Libro/Birrete, Engranaje rotando, Skyline)
      generateThreeForcesFigures(count, time, p, c);
      break;

    case 4: // DIAPOSITIVA 5: Plano horizontal + partículas blancas ascendentes con estela
      generateImpactShootingStars(count, time, p, c);
      break;

    case 5: // DIAPOSITIVA 6: Vórtice con grupos entrantes y succión en embudo hacia abajo
      generateVortexSuction(count, time, p, c);
      break;

    case 6: // DIAPOSITIVA 7: Flujo laminar vertical de confianza
      generateAscendingFlow(count, time, p, c);
      break;

    case 7: // DIAPOSITIVA 8: Caminos ramificados estructurados
      generateBranchingRoutes(count, time, p, c);
      break;

    case 8: // DIAPOSITIVA 9: Dos ojos con párpados, iris y pupilas mirando a los lados y centro
      generateTwoEyes(count, time, p, c);
      break;

    case 9: // DIAPOSITIVA 10: Arquitectura que sube desde abajo apoyándose
      generateBuildingArchitecture(count, time, p, c);
      break;

    case 10: // DIAPOSITIVA 11: Capullo de flor que se abre y florece
      generateBloomingFlower(count, time, p, c);
      break;

    case 11: // DIAPOSITIVA 12: Bolas Abuelo, Padre, Hijo -> transferencia -> Muro de ladrillos trabado
      generateGenerationsToBrickWall(count, time, p, c);
      break;

    case 12: // DIAPOSITIVA 13: Marco proscenio de teatro/salón
      generateTheaterProscenium(count, time, p, c);
      break;

    default:
      generateAuditoriumSeats(count, time, p, c);
      break;
  }

  return { positions: p, colors: c };
}

// ==========================================================================
// 1. DOS PERSONAS DÁNDOSE LA MANO (SILUETAS HUMANAS NÍTIDAS)
// ==========================================================================
function generateHandshake(count, time, p, c) {
  const gold = hexToRgb('#ffb35a'); // Senior / Experiencia
  const cyan = hexToRgb('#08a9dd'); // Joven / Futuro
  const white = [1.0, 1.0, 1.0];

  const half = Math.floor(count * 0.44);
  const handsCount = count - half * 2;

  // Función para muestrear el contorno y cuerpo de una persona
  function plotPerson(i, total, isRight, offsetIndex) {
    const idx = (offsetIndex + i) * 3;
    const u = i / total;
    const sign = isRight ? 1 : -1;
    const baseX = sign * 1.65;

    let x, y, z = 0;

    if (u < 0.22) {
      // 1. Cabeza (Círculo sólido definido)
      const t = (u / 0.22) * Math.PI * 2 * 12;
      const rad = 0.38 * Math.sqrt(frac(u * 17));
      x = baseX + Math.cos(t) * rad;
      y = 1.35 + Math.sin(t) * rad;
      z = (frac(u * 29) - 0.5) * 0.15;
    } else if (u < 0.52) {
      // 2. Torso y hombros
      const v = (u - 0.22) / 0.30;
      const torsoY = 0.95 - v * 1.45;
      const width = 0.45 * Math.sin(v * Math.PI * 0.8 + 0.3);
      const across = (frac(u * 31) - 0.5) * width;
      x = baseX + across;
      y = torsoY;
      z = (frac(u * 37) - 0.5) * 0.15;
    } else if (u < 0.76) {
      // 3. Piernas rectas y firmes
      const v = (u - 0.52) / 0.24;
      const legOffset = frac(u * 41) > 0.5 ? -0.16 : 0.16;
      x = baseX + legOffset;
      y = -0.5 - v * 1.7;
      z = (frac(u * 43) - 0.5) * 0.15;
    } else {
      // 4. Brazo extendido hacia el centro (encuentro)
      const v = (u - 0.76) / 0.24;
      const shoulderX = baseX - sign * 0.25;
      const shoulderY = 0.65;
      const handX = 0.0;
      const handY = 0.0;

      // Curva natural del brazo
      x = shoulderX * (1 - v) + handX * v;
      y = shoulderY * (1 - v) + handY * v - Math.sin(v * Math.PI) * 0.18;
      z = (frac(u * 47) - 0.5) * 0.12;
    }

    p[idx] = x;
    p[idx + 1] = y;
    p[idx + 2] = z;

    const baseCol = isRight ? cyan : gold;
    c[idx] = baseCol[0];
    c[idx + 1] = baseCol[1];
    c[idx + 2] = baseCol[2];
  }

  // Persona izquierda
  for (let i = 0; i < half; i++) {
    plotPerson(i, half, false, 0);
  }

  // Persona derecha
  for (let i = 0; i < half; i++) {
    plotPerson(i, half, true, half);
  }

  // Unión de las manos en el centro (Apretón luminoso que pulsa)
  const offset = half * 2;
  const pulse = 1.0 + Math.sin(time * 3.5) * 0.15;

  for (let i = 0; i < handsCount; i++) {
    const idx = (offset + i) * 3;
    const u = i / handsCount;
    const th = u * Math.PI * 2 * 9;
    const rad = 0.32 * Math.sqrt(frac(u * 19)) * pulse;

    p[idx] = Math.cos(th) * rad;
    p[idx + 1] = Math.sin(th) * rad * 0.7;
    p[idx + 2] = (frac(u * 23) - 0.5) * 0.2;

    // Resplandor blanco/dorado
    c[idx] = white[0];
    c[idx + 1] = 0.95;
    c[idx + 2] = 0.85;
  }
}

// ==========================================================================
// 2. AUDITORIO: RETÍCULA CARTESIANA DE ASIENTOS CON PASILLO
// ==========================================================================
function generateAuditoriumSeats(count, time, p, c) {
  const seatColor = hexToRgb('#7a8d9e');
  const aisleColor = hexToRgb('#08a9dd');

  const rows = 32;
  const cols = Math.floor(count / rows);

  for (let i = 0; i < count; i++) {
    const idx = i * 3;
    const r = Math.floor(i / cols);
    const col = i % cols;

    let x = ((col / cols) - 0.5) * 8.4;
    // Pasillo central
    if (x >= 0) x += 0.45;
    else x -= 0.45;

    const y = ((r / rows) - 0.5) * 4.6;
    const z = (r / rows) * 1.8 - 0.9;

    p[idx] = x;
    p[idx + 1] = y;
    p[idx + 2] = z;

    if (Math.abs(x) < 0.7) {
      c[idx] = aisleColor[0];
      c[idx + 1] = aisleColor[1];
      c[idx + 2] = aisleColor[2];
    } else {
      c[idx] = seatColor[0];
      c[idx + 1] = seatColor[1];
      c[idx + 2] = seatColor[2];
    }
  }
}

// ==========================================================================
// 3. PLANETA Y BOLA COLISIONADORA CON DISPERSIÓN
// ==========================================================================
function generatePlanetCollision(count, time, p, c) {
  const planetBlue = hexToRgb('#08a9dd');
  const meteorRed = hexToRgb('#f7353f');
  const white = [1.0, 1.0, 1.0];

  const collisionTime = 1.9;
  const isPost = time >= collisionTime;
  const tPost = Math.max(0, time - collisionTime);

  const planetCount = Math.floor(count * 0.72);
  const meteorCount = count - planetCount;

  // Planeta central (Esfera de Fibonacci bien estructurada)
  const goldenRatio = (1 + Math.sqrt(5)) / 2;
  for (let i = 0; i < planetCount; i++) {
    const idx = i * 3;
    const theta = 2 * Math.PI * i / goldenRatio;
    const phi = Math.acos(1 - 2 * (i + 0.5) / planetCount);
    const r = 1.75;

    let x = r * Math.sin(phi) * Math.cos(theta);
    let y = r * Math.sin(phi) * Math.sin(theta);
    let z = r * Math.cos(phi);

    if (isPost) {
      // Dispersión explosiva radial
      const speed = 2.0 + frac(i * 1.618) * 3.5;
      x += (x / r) * speed * tPost;
      y += (y / r) * speed * tPost;
      z += (z / r) * speed * tPost;
    }

    p[idx] = x;
    p[idx + 1] = y;
    p[idx + 2] = z;

    if (isPost && i % 4 === 0) {
      c[idx] = white[0];
      c[idx + 1] = white[1];
      c[idx + 2] = white[2];
    } else {
      c[idx] = planetBlue[0];
      c[idx + 1] = planetBlue[1];
      c[idx + 2] = planetBlue[2];
    }
  }

  // Bola colisionadora / Meteorito
  for (let i = 0; i < meteorCount; i++) {
    const idx = (planetCount + i) * 3;
    const theta = 2 * Math.PI * i / goldenRatio;
    const phi = Math.acos(1 - 2 * (i + 0.5) / meteorCount);
    const r = 0.65;

    // Trayectoria entrante desde (4.8, 3.4, 0) hacia el centro (0, 0, 0)
    const travelT = Math.min(1.0, time / collisionTime);
    const cx = 4.8 * (1 - travelT);
    const cy = 3.4 * (1 - travelT);
    const cz = 0.0;

    let x = cx + r * Math.sin(phi) * Math.cos(theta);
    let y = cy + r * Math.sin(phi) * Math.sin(theta);
    let z = cz + r * Math.cos(phi);

    if (isPost) {
      const speed = 2.8 + frac(i * 2.718) * 4.2;
      const dirX = Math.sin(phi) * Math.cos(theta) + 0.4;
      const dirY = Math.sin(phi) * Math.sin(theta) + 0.3;
      const dirZ = Math.cos(phi);
      x += dirX * speed * tPost;
      y += dirY * speed * tPost;
      z += dirZ * speed * tPost;
    }

    p[idx] = x;
    p[idx + 1] = y;
    p[idx + 2] = z;

    c[idx] = meteorRed[0];
    c[idx + 1] = meteorRed[1];
    c[idx + 2] = meteorRed[2];
  }
}

// ==========================================================================
// 4. TRES FUERZAS: ACADEMIA (BIRRETE/LIBRO), INDUSTRIA (ENGRANAJE), CIUDAD (SKYLINE)
// ==========================================================================
function generateThreeForcesFigures(count, time, p, c) {
  const third = Math.floor(count / 3);

  const colAcademia = hexToRgb('#08a9dd'); // Cian
  const colIndustria = hexToRgb('#f7353f'); // Coral
  const colCiudad = hexToRgb('#ffb35a');    // Amarillo/Oro

  // 1) ACADEMIA (Izquierda: Birrete académico con borla y órbitas)
  const cx1 = -3.2, cy1 = 0.1;
  for (let i = 0; i < third; i++) {
    const idx = i * 3;
    const u = i / third;

    let x, y, z;
    if (u < 0.50) {
      // Rombo superior del birrete
      const t = (u / 0.50) * Math.PI * 2;
      const rad = 1.15;
      // Rombo girado 45°
      x = cx1 + Math.cos(t) * rad;
      y = cy1 + 0.4 + Math.sin(t) * rad * 0.45;
      z = 0;
    } else if (u < 0.75) {
      // Borla colgante
      const v = (u - 0.50) / 0.25;
      x = cx1 + 0.8 + Math.sin(v * Math.PI * 3 + time * 3) * 0.1;
      y = cy1 + 0.3 - v * 0.9;
      z = 0.05;
    } else {
      // Órbitas concéntricas de conocimiento
      const t = (u - 0.75) / 0.25 * Math.PI * 2 + time * 1.8;
      const rad = 1.35;
      x = cx1 + Math.cos(t) * rad;
      y = cy1 - 0.2 + Math.sin(t) * rad * 0.3;
      z = Math.sin(t) * 0.5;
    }

    p[idx] = x;
    p[idx + 1] = y;
    p[idx + 2] = z;

    c[idx] = colAcademia[0];
    c[idx + 1] = colAcademia[1];
    c[idx + 2] = colAcademia[2];
  }

  // 2) INDUSTRIA (Centro: Engranaje mecánico con 8 dientes rotando)
  const cx2 = 0.0, cy2 = 0.6;
  const gearRot = time * 2.2;
  for (let i = third; i < third * 2; i++) {
    const idx = i * 3;
    const u = (i - third) / third;

    let x, y, z = 0;
    if (u < 0.65) {
      // Corona exterior con 8 dientes rectangulares
      const th = u / 0.65 * Math.PI * 2;
      // Diente rectangular marcado
      const tooth = Math.sin(th * 8) > 0.15 ? 0.36 : 0.0;
      const r = 1.05 + tooth;
      const rotTh = th + gearRot;

      x = cx2 + Math.cos(rotTh) * r;
      y = cy2 + Math.sin(rotTh) * r;
    } else {
      // Eje central interior y radios
      const th = (u - 0.65) / 0.35 * Math.PI * 2 + gearRot;
      const r = 0.38;
      x = cx2 + Math.cos(th) * r;
      y = cy2 + Math.sin(th) * r;
    }

    p[idx] = x;
    p[idx + 1] = y;
    p[idx + 2] = z;

    c[idx] = colIndustria[0];
    c[idx + 1] = colIndustria[1];
    c[idx + 2] = colIndustria[2];
  }

  // 3) CIUDAD (Derecha: Skyline de rascacielos rectangulares con ventanas)
  const cx3 = 3.2, cy3 = -0.7;
  const buildings = [
    { x: -0.9, w: 0.38, h: 1.6 },
    { x: -0.45, w: 0.42, h: 2.8, hasSpire: true },
    { x: 0.05, w: 0.45, h: 2.2 },
    { x: 0.55, w: 0.38, h: 1.4 }
  ];

  const cityCount = count - third * 2;
  for (let i = third * 2; i < count; i++) {
    const idx = i * 3;
    const u = (i - third * 2) / cityCount;
    const bIndex = Math.floor(u * buildings.length);
    const b = buildings[Math.min(bIndex, buildings.length - 1)];

    const subU = frac(u * buildings.length);
    const px = cx3 + b.x + (frac(subU * 7) - 0.5) * b.w;
    const py = cy3 + subU * b.h;

    let x = px;
    let y = py;
    let z = (frac(u * 11) - 0.5) * 0.15;

    // Aguja del edificio principal
    if (b.hasSpire && subU > 0.88) {
      x = cx3 + b.x;
      y = cy3 + b.h + (subU - 0.88) * 4.0;
    }

    p[idx] = x;
    p[idx + 1] = y;
    p[idx + 2] = z;

    c[idx] = colCiudad[0];
    c[idx + 1] = colCiudad[1];
    c[idx + 2] = colCiudad[2];
  }
}

// ==========================================================================
// 5. PLANO HORIZONTAL + PARTÍCULAS BLANCAS ASCENDENTES CON ESTELA
// ==========================================================================
function generateImpactShootingStars(count, time, p, c) {
  const planeCount = Math.floor(count * 0.72);
  const shootCount = count - planeCount;

  const baseCol = hexToRgb('#16222f');
  const white = [1.0, 1.0, 1.0];
  const gold = hexToRgb('#ffb35a');

  // 1) Plano base reticular horizontal
  const cols = 48;
  const rows = Math.floor(planeCount / cols);
  for (let i = 0; i < planeCount; i++) {
    const idx = i * 3;
    const r = Math.floor(i / cols);
    const col = i % cols;

    const x = ((col / cols) - 0.5) * 9.2;
    const z = ((r / rows) - 0.5) * 4.5;
    const y = -2.5;

    p[idx] = x;
    p[idx + 1] = y;
    p[idx + 2] = z;

    c[idx] = baseCol[0];
    c[idx + 1] = baseCol[1];
    c[idx + 2] = baseCol[2];
  }

  // 2) Partículas que se vuelven blancas y suben dejando estela
  for (let i = 0; i < shootCount; i++) {
    const idx = (planeCount + i) * 3;
    const u = i / shootCount;
    const columnId = Math.floor(u * 16); // 16 columnas de cohetes
    const colU = (columnId / 16) - 0.5;

    const speed = 3.2;
    const cycle = (time * speed + columnId * 0.6) % 6.0;

    const x = colU * 8.0;
    const y = -2.5 + cycle;
    const z = (frac(columnId * 1.3) - 0.5) * 2.0;

    p[idx] = x;
    p[idx + 1] = y;
    p[idx + 2] = z;

    // Cabeza blanca y estela dorada
    if (cycle > 2.0) {
      c[idx] = white[0];
      c[idx + 1] = white[1];
      c[idx + 2] = white[2];
    } else {
      c[idx] = gold[0];
      c[idx + 1] = gold[1];
      c[idx + 2] = gold[2];
    }
  }
}

// ==========================================================================
// 6. VÓRTICE CON GRUPOS ENTRANTES Y SUCCIÓN HACIA ABAJO
// ==========================================================================
function generateVortexSuction(count, time, p, c) {
  const colVortex = hexToRgb('#08a9dd');
  const colCluster = hexToRgb('#e96daa');

  const suctionProg = Math.min(1.0, Math.max(0.0, (time - 1.2) * 0.7));

  for (let i = 0; i < count; i++) {
    const idx = i * 3;
    const u = i / count;
    const group = i % 4;

    // Espiral arquimediana de doble brazo
    const angle = u * Math.PI * 10 + time * 2.8 + group * (Math.PI / 2);
    let radius = 0.2 + (1 - u) * 3.8;

    // A medida que avanza, los grupos se compactan en el vórtice
    radius = Math.max(0.12, radius - time * 0.4);

    let x = Math.cos(angle) * radius;
    let z = Math.sin(angle) * radius;

    // Succión hacia abajo tipo embudo / tornado 3D
    let y = 0.6 - (Math.pow(1.0 / (radius + 0.35), 1.2) * 0.6) * (1.0 + suctionProg * 3.2);

    p[idx] = x;
    p[idx + 1] = y;
    p[idx + 2] = z;

    if (group === 0) {
      c[idx] = colCluster[0];
      c[idx + 1] = colCluster[1];
      c[idx + 2] = colCluster[2];
    } else {
      c[idx] = colVortex[0];
      c[idx + 1] = colVortex[1];
      c[idx + 2] = colVortex[2];
    }
  }
}

// ==========================================================================
// 7. FLUJO LAMINAR ASCENDENTE (CONFIANZA)
// ==========================================================================
function generateAscendingFlow(count, time, p, c) {
  const colGold = hexToRgb('#ffb35a');
  const colCyan = hexToRgb('#08a9dd');

  const streams = 8;
  for (let i = 0; i < count; i++) {
    const idx = i * 3;
    const u = i / count;
    const s = i % streams;
    const streamX = ((s / streams) - 0.5) * 7.2;

    const speed = 2.4;
    const y = ((time * speed + u * 12.0) % 8.0) - 4.0;
    const wave = Math.sin(y * 1.8 + time * 2.2 + s) * 0.25;

    p[idx] = streamX + wave;
    p[idx + 1] = y;
    p[idx + 2] = Math.cos(y * 1.8 + time * 2.2 + s) * 0.25;

    const blend = (y + 4.0) / 8.0;
    c[idx] = colGold[0] * (1 - blend) + colCyan[0] * blend;
    c[idx + 1] = colGold[1] * (1 - blend) + colCyan[1] * blend;
    c[idx + 2] = colGold[2] * (1 - blend) + colCyan[2] * blend;
  }
}

// ==========================================================================
// 8. CAMINOS RAMIFICADOS (NUEVAS RUTAS ESTRUCTURADAS)
// ==========================================================================
function generateBranchingRoutes(count, time, p, c) {
  const colStem = hexToRgb('#08a9dd');
  const colBranch = hexToRgb('#f7353f');

  const grow = Math.min(1.0, time * 0.45);

  for (let i = 0; i < count; i++) {
    const idx = i * 3;
    const u = i / count;
    const tier = i % 4; // Tronco, Ramas principales, Sub-ramas, Extremos

    let x, y, z = 0;
    if (tier === 0) {
      // 1. Tronco central vertical
      const t = (u % 0.25) / 0.25 * grow;
      x = 0;
      y = -2.4 + t * 1.8;
    } else if (tier === 1) {
      // 2. Ramas primarias bifurcadas a 45°
      const t = (u % 0.25) / 0.25 * grow;
      const sign = (i % 2 === 0 ? 1 : -1);
      x = sign * (t * 2.0);
      y = -0.6 + t * 1.4;
    } else if (tier === 2) {
      // 3. Ramas secundarias
      const t = (u % 0.25) / 0.25 * grow;
      const fork = (i % 4 < 2 ? 1 : -1);
      const subFork = (i % 2 === 0 ? 0.8 : 2.4);
      x = fork * subFork + Math.sin(t * Math.PI) * 0.3;
      y = 0.8 + t * 1.2;
    } else {
      // 4. Brotes exteriores en abanico
      const t = (u % 0.25) / 0.25 * grow;
      const angle = ((i % 8) / 8) * Math.PI * 2;
      x = Math.cos(angle) * (2.2 + t * 1.8);
      y = 0.5 + Math.sin(angle) * (1.2 + t * 1.2);
    }

    p[idx] = x;
    p[idx + 1] = y;
    p[idx + 2] = z;

    c[idx] = tier === 0 ? colStem[0] : colBranch[0];
    c[idx + 1] = tier === 0 ? colStem[1] : colBranch[1];
    c[idx + 2] = tier === 0 ? colStem[2] : colBranch[2];
  }
}

// ==========================================================================
// 9. DOS OJOS CON PÁRPADOS, IRIS Y PUPILA MIRANDO A LOS LADOS Y AL CENTRO
// ==========================================================================
function generateTwoEyes(count, time, p, c) {
  const half = Math.floor(count / 2);
  const eyeWhite = [0.95, 0.95, 0.95];
  const irisCyan = hexToRgb('#08a9dd');
  const pupilDark = [0.04, 0.04, 0.06];

  // Ciclo de mirada sincronizada: Izquierda -> Centro -> Derecha -> Centro (con parpadeo)
  const cycle = (time * 1.3) % 6.0;
  let gazeX = 0;
  let eyelidScale = 1.0;

  if (cycle < 1.6) {
    gazeX = -0.42; // Mira a la izquierda
  } else if (cycle < 3.0) {
    gazeX = 0.0;   // Mira al centro
  } else if (cycle < 4.6) {
    gazeX = 0.42;  // Mira a la derecha
  } else if (cycle < 5.4) {
    gazeX = 0.0;   // Vuelve al centro
  } else {
    // Parpadeo suave
    eyelidScale = Math.sin((cycle - 5.4) / 0.6 * Math.PI) * 0.15 + 0.05;
  }

  const eyeCenters = [-2.1, 2.1];
  for (let e = 0; e < 2; e++) {
    const cx = eyeCenters[e];
    const offset = e * half;

    for (let i = 0; i < half; i++) {
      const idx = (offset + i) * 3;
      const u = i / half;

      let x, y, z = 0;
      if (u < 0.48) {
        // 1. Contorno almendrado del párpado superior e inferior
        const t = (u / 0.48) * Math.PI; // 0 a PI
        const signY = (i % 2 === 0 ? 1 : -1);
        const w = 1.4;
        const h = 0.75 * eyelidScale;

        x = cx + Math.cos(t) * w;
        y = 0.2 + Math.sin(t) * h * signY;
        z = 0;

        p[idx] = x;
        p[idx + 1] = y;
        p[idx + 2] = z;

        c[idx] = eyeWhite[0];
        c[idx + 1] = eyeWhite[1];
        c[idx + 2] = eyeWhite[2];
      } else if (u < 0.82) {
        // 2. Iris circular que se mueve con gazeX
        const t = (u - 0.48) / 0.34 * Math.PI * 2 * 14;
        const rad = 0.38 * Math.sqrt(frac(u * 23));

        x = cx + gazeX + Math.cos(t) * rad;
        y = 0.2 + Math.sin(t) * rad * eyelidScale;
        z = 0.05;

        p[idx] = x;
        p[idx + 1] = y;
        p[idx + 2] = z;

        c[idx] = irisCyan[0];
        c[idx + 1] = irisCyan[1];
        c[idx + 2] = irisCyan[2];
      } else {
        // 3. Pupila negra central
        const t = (u - 0.82) / 0.18 * Math.PI * 2 * 16;
        const rad = 0.16 * Math.sqrt(frac(u * 29));

        x = cx + gazeX + Math.cos(t) * rad;
        y = 0.2 + Math.sin(t) * rad * eyelidScale;
        z = 0.10;

        p[idx] = x;
        p[idx + 1] = y;
        p[idx + 2] = z;

        c[idx] = pupilDark[0];
        c[idx + 1] = pupilDark[1];
        c[idx + 2] = pupilDark[2];
      }
    }
  }
}

// ==========================================================================
// 10. ARQUITECTURA QUE SE APOYA Y SUBE DESDE ABAJO
// ==========================================================================
function generateBuildingArchitecture(count, time, p, c) {
  const colStone = hexToRgb('#08a9dd');
  const colBeam = hexToRgb('#ffb35a');

  // Altura máxima a la que se ha construido la arquitectura
  const buildProgress = Math.min(1.0, time * 0.38);
  const currentHeight = -2.4 + buildProgress * 4.4;

  const colPositions = [-2.7, -0.9, 0.9, 2.7];

  for (let i = 0; i < count; i++) {
    const idx = i * 3;
    const u = i / count;

    let x, y, z = 0;
    if (u < 0.60) {
      // 4 Columnas verticales
      const colId = Math.floor((u / 0.60) * 4);
      const colX = colPositions[Math.min(colId, 3)];
      const targetY = -2.2 + frac(u * 17) * 3.4;

      // Si aún no se construye esa altura, las partículas van subiendo desde el suelo
      y = Math.min(targetY, currentHeight);
      x = colX + (frac(u * 23) - 0.5) * 0.32;

      p[idx] = x;
      p[idx + 1] = y;
      p[idx + 2] = z;

      c[idx] = colStone[0];
      c[idx + 1] = colStone[1];
      c[idx + 2] = colStone[2];
    } else {
      // Entablamento superior y techo triangular
      const targetY = 1.35 + (u > 0.85 ? (1 - Math.abs((u - 0.85) / 0.15 - 0.5) * 2) * 1.1 : 0);
      y = Math.min(targetY, currentHeight);
      x = ((u - 0.60) / 0.40 - 0.5) * 6.2;

      p[idx] = x;
      p[idx + 1] = y;
      p[idx + 2] = z;

      c[idx] = colBeam[0];
      c[idx + 1] = colBeam[1];
      c[idx + 2] = colBeam[2];
    }
  }
}

// ==========================================================================
// 11. CAPULLO DE FLOR QUE SE ABRE Y FLORECE
// ==========================================================================
function generateBloomingFlower(count, time, p, c) {
  // Transición de capullo cerrado a flor abierta
  const bloom = Math.min(1.0, Math.max(0.0, (time - 0.8) * 0.5));

  const colPetal = hexToRgb('#e96daa'); // Magenta floral
  const colPistil = hexToRgb('#ffb35a'); // Pistilo oro

  const pistilCount = Math.floor(count * 0.18);
  const petalCount = count - pistilCount;

  // 1) Pistilo central (Núcleo radiante)
  for (let i = 0; i < pistilCount; i++) {
    const idx = i * 3;
    const u = i / pistilCount;
    const th = u * Math.PI * 2 * 11;
    const rad = 0.42 * Math.sqrt(frac(u * 13));

    p[idx] = Math.cos(th) * rad;
    p[idx + 1] = Math.sin(th) * rad;
    p[idx + 2] = 0.05;

    c[idx] = colPistil[0];
    c[idx + 1] = colPistil[1];
    c[idx + 2] = colPistil[2];
  }

  // 2) Pétalos: Inicia cerrado como lágrima vertical y se despliega en 5 pétalos
  for (let i = 0; i < petalCount; i++) {
    const idx = (pistilCount + i) * 3;
    const u = i / petalCount;
    const th = u * Math.PI * 2;

    // Forma del capullo cerrado (vertical y esbelto)
    const budX = Math.cos(th) * 0.55;
    const budY = Math.sin(th) * 1.5;

    // Forma de flor abierta (Rosa polar de 5 pétalos)
    const petalRad = 0.6 + 1.9 * Math.abs(Math.cos(th * 2.5));
    const bloomX = Math.cos(th) * petalRad;
    const bloomY = Math.sin(th) * petalRad;

    const x = budX * (1 - bloom) + bloomX * bloom;
    const y = budY * (1 - bloom) + bloomY * bloom;
    const z = Math.sin(petalRad * 1.5) * bloom * 0.4;

    p[idx] = x;
    p[idx + 1] = y;
    p[idx + 2] = z;

    c[idx] = colPetal[0];
    c[idx + 1] = colPetal[1];
    c[idx + 2] = colPetal[2];
  }
}

// ==========================================================================
// 12. TRES GENERACIONES -> TRANSFERENCIA -> INTERRUMPIDA EN MURO DE LADRILLOS
// ==========================================================================
function generateGenerationsToBrickWall(count, time, p, c) {
  const colBrick = hexToRgb('#f7353f');  // Terracota
  const colMortar = hexToRgb('#ffffff'); // Argamasa blanca

  const isWallPhase = time >= 2.1;
  const wallProgress = Math.min(1.0, Math.max(0.0, (time - 2.1) * 0.8));

  if (!isWallPhase) {
    // FASE 1: Tres esferas (Abuelo: -3.4, Padre: 0.0, Hijo: +3.4)
    const third = Math.floor(count / 3);
    const centers = [-3.4, 0.0, 3.4];
    const colors = [hexToRgb('#ffb35a'), hexToRgb('#08a9dd'), hexToRgb('#e96daa')];

    for (let g = 0; g < 3; g++) {
      const cx = centers[g];
      const start = g * third;
      const end = (g === 2 ? count : (g + 1) * third);
      const col = colors[g];

      for (let i = start; i < end; i++) {
        const idx = i * 3;
        const u = (i - start) / (end - start);

        let x, y, z;
        // Corriente de transferencia activa
        if (i % 6 === 0 && g < 2) {
          const flowT = (time * 1.6 + frac(u * 11)) % 1.0;
          x = cx * (1 - flowT) + (centers[g + 1]) * flowT;
          y = 0.8 + Math.sin(flowT * Math.PI) * 0.45;
          z = 0;
        } else {
          // Esfera regular
          const th = u * Math.PI * 2 * 13;
          const phi = Math.acos(1 - 2 * frac(u * 17));
          const r = 0.82;
          x = cx + r * Math.sin(phi) * Math.cos(th);
          y = 0.8 + r * Math.sin(phi) * Math.sin(th);
          z = r * Math.cos(phi);
        }

        p[idx] = x;
        p[idx + 1] = y;
        p[idx + 2] = z;

        c[idx] = col[0];
        c[idx + 1] = col[1];
        c[idx + 2] = col[2];
      }
    }
  } else {
    // FASE 2: Interrupción y construcción activa de un muro de ladrillos trabados
    const rows = 14;
    const bricksPerRow = 20;
    const totalBricks = rows * bricksPerRow;
    const partsPerBrick = Math.floor(count / totalBricks);

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const bIdx = Math.floor(i / partsPerBrick);
      const row = Math.floor(bIdx / bricksPerRow);
      const col = bIdx % bricksPerRow;

      // Desfase de traba en filas alternas
      const stagger = (row % 2 === 0 ? 0.0 : 0.2);
      const brickW = 0.38;
      const brickH = 0.24;

      const bx = ((col / bricksPerRow) - 0.5) * 7.6 + stagger;
      const by = -2.0 + row * brickH;

      const u = frac(i * 1.618);
      const x = bx + (frac(u * 7) - 0.5) * brickW;
      const y = by + (frac(u * 11) - 0.5) * brickH;
      const z = (frac(u * 13) - 0.5) * 0.15;

      p[idx] = x;
      p[idx + 1] = y;
      p[idx + 2] = z;

      // Líneas de argamasa blanca en los bordes
      if (frac(u * 7) > 0.82 || frac(u * 11) > 0.82) {
        c[idx] = colMortar[0];
        c[idx + 1] = colMortar[1];
        c[idx + 2] = colMortar[2];
      } else {
        c[idx] = colBrick[0];
        c[idx + 1] = colBrick[1];
        c[idx + 2] = colBrick[2];
      }
    }
  }
}

// ==========================================================================
// 13. SALÓN O TEATRO (MARCO PROSCENIO ARQUITECTÓNICO)
// ==========================================================================
function generateTheaterProscenium(count, time, p, c) {
  const colGold = hexToRgb('#ffb35a');
  const colVelvet = hexToRgb('#08a9dd');

  const half = Math.floor(count * 0.45);
  const rowsCount = count - half;

  // 1) Arco proscenio superior y columnas de teatro
  for (let i = 0; i < half; i++) {
    const idx = i * 3;
    const u = i / half;

    let x, y, z = 0;
    if (u < 0.55) {
      // Arco superior abovedado
      const th = (u / 0.55) * Math.PI; // 0 a PI
      x = Math.cos(th) * 4.6;
      y = 1.3 + Math.sin(th) * 2.3;
    } else {
      // Columnas laterales
      const v = (u - 0.55) / 0.45;
      const side = (i % 2 === 0 ? -1 : 1);
      x = side * 4.6;
      y = -2.4 + v * 3.7;
    }

    p[idx] = x;
    p[idx + 1] = y;
    p[idx + 2] = z;

    c[idx] = colGold[0];
    c[idx + 1] = colGold[1];
    c[idx + 2] = colGold[2];
  }

  // 2) Gradería semicircular de asientos (anfiteatro)
  for (let i = 0; i < rowsCount; i++) {
    const idx = (half + i) * 3;
    const u = i / rowsCount;
    const row = Math.floor(u * 6); // 6 filas de asientos
    const radius = 2.4 + row * 0.36;
    const th = -Math.PI * 0.85 + frac(u * 19) * Math.PI * 0.70;

    const x = Math.cos(th) * radius;
    const y = -2.5 + Math.sin(th) * radius * 0.38;
    const z = row * 0.18 - 0.4;

    p[idx] = x;
    p[idx + 1] = y;
    p[idx + 2] = z;

    c[idx] = colVelvet[0];
    c[idx + 1] = colVelvet[1];
    c[idx + 2] = colVelvet[2];
  }
}
