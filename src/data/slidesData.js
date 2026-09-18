/**
 * Datos y parámetros de las 13 diapositivas de la charla:
 * "RELEVO GENERACIONAL: LA VENTAJA QUE NADIE ESTÁ APROVECHANDO"
 * 
 * Los textos se conservan exactamente iguales al guion oficial del cliente.
 */

export const SLIDES = [
  {
    id: "relevo-generacional",
    kicker: "Future Leaders Forum · Fórum UPB",
    title: "RELEVO GENERACIONAL: LA VENTAJA QUE NADIE ESTÁ APROVECHANDO",
    subtitle: "@centrodeeventosupb",
    image: null,
    layout: "center-hero",
    params: {
      mode: 0, // Latente orbital
      radialStrength: 1.2,
      vortexStrength: 0.45,
      wind: [0.0, 0.0, 0.0],
      particleSize: 0.045,
      dragCoefficient: 0.12,
      colorSlow: '#08a9dd', // Azul Fórum
      colorFast: '#e96daa', // Magenta
      speedLimit: 4.5
    }
  },
  {
    id: "auditorio-grados",
    kicker: "Espacio",
    title: "¿Un gran auditorio solo para hacer grados?",
    subtitle: "",
    image: "./assets/slide-02-grados.webp",
    fallbackImage: "./assets/ceremonia-grados-placeholder.png",
    layout: "split-right-image",
    params: {
      mode: 1, // Matriz / retícula rígida (asientos)
      radialStrength: 0.1,
      vortexStrength: 0.0,
      wind: [0.0, 0.0, 0.0],
      particleSize: 0.035,
      dragCoefficient: 0.85,
      colorSlow: '#9aa0a6',
      colorFast: '#08a9dd',
      speedLimit: 1.2
    }
  },
  {
    id: "universidad-mundo",
    kicker: "Encuentro",
    title: "Los eventos no llegaron a la Universidad. La Universidad decidió encontrarse con el mundo.",
    subtitle: "",
    image: null,
    layout: "editorial-flow",
    params: {
      mode: 2, // Corrientes opuestas de encuentro
      radialStrength: 0.8,
      vortexStrength: 0.8,
      wind: [1.8, 0.0, 0.0],
      particleSize: 0.04,
      dragCoefficient: 0.15,
      colorSlow: '#08a9dd',
      colorFast: '#f7353f',
      speedLimit: 5.5
    }
  },
  {
    id: "academia-industria-ciudad",
    kicker: "Tres fuerzas",
    title: "Academia + Industria + Ciudad",
    subtitle: "",
    image: "./assets/slide-04-actores.webp",
    layout: "split-right-image",
    params: {
      mode: 3, // Tríada orbital
      radialStrength: 2.2,
      vortexStrength: 1.6,
      wind: [0.0, 0.0, 0.0],
      particleSize: 0.042,
      dragCoefficient: 0.14,
      colorSlow: '#08a9dd',
      colorFast: '#f7353f',
      speedLimit: 5.0
    }
  },
  {
    id: "impacto",
    kicker: "Impacto",
    title: "Los eventos nunca fueron el objetivo. El impacto sí.",
    subtitle: "",
    image: "./assets/slide-05-impacto.webp",
    layout: "impact-center",
    params: {
      mode: 4, // Explosión / onda de choque
      radialStrength: -5.0,
      vortexStrength: 0.2,
      wind: [0.0, 0.0, 0.0],
      particleSize: 0.05,
      dragCoefficient: 0.28,
      colorSlow: '#f7353f',
      colorFast: '#ffb35a',
      speedLimit: 7.0
    }
  },
  {
    id: "comunidad",
    kicker: "Comunidad",
    title: "Un evento trae personas. Una comunidad trae transformación.",
    subtitle: "",
    image: null,
    layout: "editorial-center",
    params: {
      mode: 5, // Red celular orgánica
      radialStrength: 1.5,
      vortexStrength: 0.6,
      wind: [0.2, 0.1, 0.0],
      particleSize: 0.038,
      dragCoefficient: 0.16,
      colorSlow: '#08a9dd',
      colorFast: '#e96daa',
      speedLimit: 4.2
    }
  },
  {
    id: "confianza",
    kicker: "Confianza",
    title: "El talento crece a la velocidad de la confianza.",
    subtitle: "",
    image: null,
    layout: "vertical-ascent",
    params: {
      mode: 6, // Flujo laminar ascendente
      radialStrength: 0.4,
      vortexStrength: 0.3,
      wind: [0.0, 3.2, 0.0],
      particleSize: 0.04,
      dragCoefficient: 0.12,
      colorSlow: '#ffb35a',
      colorFast: '#08a9dd',
      speedLimit: 6.0
    }
  },
  {
    id: "nuevas-rutas",
    kicker: "Rutas",
    title: "La experiencia construye el camino. Las nuevas generaciones descubren nuevas rutas.",
    subtitle: "",
    image: "./assets/slide-08-rutas.webp",
    layout: "split-right-image",
    params: {
      mode: 7, // Bifurcación en rutas
      radialStrength: 1.0,
      vortexStrength: 1.2,
      wind: [1.6, 0.4, 0.0],
      particleSize: 0.04,
      dragCoefficient: 0.14,
      colorSlow: '#08a9dd',
      colorFast: '#f7353f',
      speedLimit: 5.2
    }
  },
  {
    id: "vision-generaciones",
    kicker: "Relevo",
    title: "Una visión. Dos generaciones.",
    subtitle: "",
    image: null,
    layout: "dual-harmony",
    params: {
      mode: 8, // Dipolo orbital binario (Alma y Lorena)
      radialStrength: 2.4,
      vortexStrength: 2.0,
      wind: [0.0, 0.0, 0.0],
      particleSize: 0.045,
      dragCoefficient: 0.15,
      colorSlow: '#ffb35a',
      colorFast: '#08a9dd',
      speedLimit: 5.0
    }
  },
  {
    id: "trabajan-juntas",
    kicker: "Composición",
    title: "El crecimiento no ocurre cuando una generación reemplaza a otra. Ocurre cuando trabajan juntas.",
    subtitle: "",
    image: null,
    layout: "editorial-center",
    params: {
      mode: 9, // Ondas armónicas entrelazadas
      radialStrength: 1.4,
      vortexStrength: 1.0,
      wind: [0.0, 0.0, 0.0],
      particleSize: 0.042,
      dragCoefficient: 0.15,
      colorSlow: '#08a9dd',
      colorFast: '#e96daa',
      speedLimit: 4.8
    }
  },
  {
    id: "presente-joven",
    kicker: "Presente",
    title: "Los jóvenes no son el futuro. Son el presente que muchas organizaciones aún no ven.",
    subtitle: "",
    image: null,
    layout: "impact-bold",
    params: {
      mode: 10, // Foco frontal de alta energía
      radialStrength: 2.8,
      vortexStrength: 1.8,
      wind: [0.0, 0.0, 1.2],
      particleSize: 0.055,
      dragCoefficient: 0.18,
      colorSlow: '#f7353f',
      colorFast: '#08a9dd',
      speedLimit: 6.5
    }
  },
  {
    id: "futuro-construido",
    kicker: "Futuro construido",
    title: "El futuro no se hereda. Se construye.",
    subtitle: "",
    image: "./assets/slide-12-futuro.webp",
    layout: "split-right-image",
    params: {
      mode: 11, // Estructura arquitectónica 3D
      radialStrength: 0.8,
      vortexStrength: 0.4,
      wind: [0.0, 0.0, 0.0],
      particleSize: 0.038,
      dragCoefficient: 0.45,
      colorSlow: '#f7f7f4',
      colorFast: '#08a9dd',
      speedLimit: 2.5
    }
  },
  {
    id: "qr-cierre",
    kicker: "Continuidad",
    title: "@centrodeeventosupb",
    subtitle: "Conéctate con la experiencia y revive las memorias del evento",
    image: "./assets/slide-13-cierre.webp",
    qrs: [
      { src: "./assets/qr-memory.png", label: "Memorias del Evento" },
      { src: "./assets/qr-social.png", label: "Redes Fórum UPB" }
    ],
    layout: "qr-close",
    params: {
      mode: 12, // Doble halo de cierre
      radialStrength: 1.8,
      vortexStrength: 1.2,
      wind: [0.0, 0.0, 0.0],
      particleSize: 0.042,
      dragCoefficient: 0.18,
      colorSlow: '#08a9dd',
      colorFast: '#ffb35a',
      speedLimit: 4.5
    }
  }
];
