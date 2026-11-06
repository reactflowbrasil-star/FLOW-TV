const sample = "https://storage.googleapis.com/gtv-videos-bucket/sample";

export const films = [
  {
    id: "bbb",
    title: "Big Buck Bunny",
    year: 2008,
    duration: "10 min",
    type: "Animação",
    rating: "Livre",
    poster: "https://storage.googleapis.com/gtv-videos-bucket/sample/images_480x270/BigBuckBunny.jpg",
    video: `${sample}/BigBuckBunny.mp4`,
    synopsis: "Um coelho gigante e bem-humorado tenta aproveitar a tranquilidade da floresta — até três roedores atrevidos aparecerem.",
    credit: "Big Buck Bunny © Blender Foundation. Licença CC BY 3.0.",
    source: "https://studio.blender.org/projects/big-buck-bunny/"
  },
  {
    id: "sintel",
    title: "Sintel",
    year: 2010,
    duration: "15 min",
    type: "Fantasia",
    rating: "10",
    poster: "https://storage.googleapis.com/gtv-videos-bucket/sample/images_480x270/Sintel.jpg",
    video: `${sample}/Sintel.mp4`,
    synopsis: "Uma jovem percorre um mundo fantástico em busca do pequeno dragão que se tornou seu companheiro.",
    credit: "Sintel © Blender Foundation. Licença CC BY 3.0.",
    source: "https://studio.blender.org/projects/sintel/"
  },
  {
    id: "elephants",
    title: "Elephants Dream",
    year: 2006,
    duration: "11 min",
    type: "Ficção científica",
    rating: "10",
    poster: "https://storage.googleapis.com/gtv-videos-bucket/sample/images_480x270/ElephantsDream.jpg",
    video: `${sample}/ElephantsDream.mp4`,
    synopsis: "Dois viajantes exploram uma máquina surreal que parece mudar de forma a cada corredor.",
    credit: "Elephants Dream © Blender Foundation. Licença CC BY 2.5.",
    source: "https://orange.blender.org/"
  },
  {
    id: "tears",
    title: "Tears of Steel",
    year: 2012,
    duration: "12 min",
    type: "Ficção científica",
    rating: "10",
    poster: "https://storage.googleapis.com/gtv-videos-bucket/sample/images_480x270/TearsOfSteel.jpg",
    video: `${sample}/TearsOfSteel.mp4`,
    synopsis: "Em uma Amsterdã futurista, um grupo tenta salvar o planeta enquanto revisita uma história de amor.",
    credit: "Tears of Steel © Blender Foundation. Licença CC BY 3.0.",
    source: "https://studio.blender.org/projects/tears-of-steel/"
  }
];
