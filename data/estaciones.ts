export type SeasonKey = "spring" | "summer" | "autumn" | "winter";

export type Station = {
  key: SeasonKey;
  number: string;
  name: string;
  label: string;
  gift: string;
  message: string;
  detail: string;
  image: string;
  colors: {
    wash: string;
    accent: string;
    ink: string;
  };
};

export const stations: Station[] = [
  {
    key: "spring",
    number: "01",
    name: "Primavera",
    label: "Lo que vuelve a florecer",
    gift: "Flores de LEGO",
    message: "Para que tengas cerca algo bonito que no se marchite.",
    detail: "Un pequeño jardín para esos días en los que todo empieza de nuevo.",
    image: "/placeholders/primavera-placeholder.svg",
    colors: { wash: "#f4ddd8", accent: "#ae6c70", ink: "#432d34" },
  },
  {
    key: "summer",
    number: "02",
    name: "Verano",
    label: "La luz que llevas contigo",
    gift: "Un body Diesel",
    message: "Para acompañar esa forma tuya de iluminar cualquier lugar.",
    detail: "Una elección con un poco de sol, un poco de atrevimiento y mucha personalidad.",
    image: "/placeholders/verano-placeholder.svg",
    colors: { wash: "#f2e0bd", accent: "#b77a3d", ink: "#4d3727" },
  },
  {
    key: "autumn",
    number: "03",
    name: "Otoño",
    label: "Todo lo que guardamos",
    gift: "Un bolso Jormands",
    message: "Para llevar tus planes, tus cosas y un poquito de todo lo que eres.",
    detail: "Un detalle pensado para acompañarte sin pedir permiso, como las mejores historias.",
    image: "/placeholders/otono-placeholder.svg",
    colors: { wash: "#e5d1bd", accent: "#98634d", ink: "#49352e" },
  },
  {
    key: "winter",
    number: "04",
    name: "Invierno",
    label: "Lo que permanece",
    gift: "Un cuadro",
    message: "Para que haya una imagen bonita esperándote cuando mires alrededor.",
    detail: "El último regalo es una pausa: algo para mirar despacio y hacer tuyo.",
    image: "/placeholders/invierno-placeholder.svg",
    colors: { wash: "#d9e2e6", accent: "#64808b", ink: "#2c3d44" },
  },
];
