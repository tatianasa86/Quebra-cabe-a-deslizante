import { ThemeItem } from '../types';
import alpineLakeCabin from '../assets/images/alpine_lake_cabin_1788738615006.jpg';
import cosmicSpaceAstronaut from '../assets/images/cosmic_space_astronaut_1788738647647.jpg';
import cyberpunkNeonCity from '../assets/images/cyberpunk_neon_city_1788738659878.jpg';
import detectiveDogLibrary from '../assets/images/detective_dog_library_1788738510488.jpg';
import magicalFairyCottage from '../assets/images/magical_fairy_cottage_1788738602523.jpg';
import tropicalRiverValley from '../assets/images/tropical_river_valley_1788738637888.jpg';

export const INITIAL_THEMES: ThemeItem[] = [
  {
    id: 'cosmic-astronaut',
    name: 'Astronauta no Espaço',
    title: 'Edição Astronauta Cósmico',
    url: cosmicSpaceAstronaut,
    thumb: cosmicSpaceAstronaut,
  },
  {
    id: 'fairy-cottage',
    name: 'Cabana Encantada',
    title: 'Edição Cabana Encantada na Floresta',
    url: magicalFairyCottage,
    thumb: magicalFairyCottage,
  },
  {
    id: 'tropical-mountain-river',
    name: 'Vale Tropical',
    title: 'Edição Vale Tropical & Rio de Pedras',
    url: tropicalRiverValley,
    thumb: tropicalRiverValley,
  },
  {
    id: 'cyberpunk-neon-city',
    name: 'Metrópole Cyberpunk',
    title: 'Edição Cyberpunk Futurista',
    url: cyberpunkNeonCity,
    thumb: cyberpunkNeonCity,
  },
  {
    id: 'detective-dog',
    name: 'Cão Detetive',
    title: 'Edição Cão Detetive na Biblioteca',
    url: detectiveDogLibrary,
    thumb: detectiveDogLibrary,
  },
  {
    id: 'alpine-lake-sunset',
    name: 'Lago Alpino & Barco',
    title: 'Edição Lago Alpino ao Entardecer',
    url: alpineLakeCabin,
    thumb: alpineLakeCabin,
  },
  {
    id: 'tropical-island',
    name: 'Ilha Tropical',
    title: 'Edição Ilha Tropical',
    url: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?auto=format&fit=crop&w=900&q=80',
    thumb: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?auto=format&fit=crop&w=160&q=70',
  },
  {
    id: 'golden-retriever',
    name: 'Golden Retriever',
    title: 'Edição Filhote Golden Retriever',
    url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=900&q=80',
    thumb: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=160&q=70',
  },
  {
    id: 'aurora-borealis',
    name: 'Aurora Boreal',
    title: 'Edição Aurora Boreal Mágica',
    url: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=900&q=80',
    thumb: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=160&q=70',
  },
  {
    id: 'sunset-beach',
    name: 'Praia Dourada',
    title: 'Edição Pôr do Sol na Praia',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80',
    thumb: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=160&q=70',
  },
  {
    id: 'cute-kitten',
    name: 'Gatinho Curioso',
    title: 'Edição Gatinho Fofo',
    url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=900&q=80',
    thumb: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=160&q=70',
  },
  {
    id: 'nature',
    name: 'Lago Alpino',
    title: 'Edição Lago Alpino',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80',
    thumb: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=160&q=70',
  },
  {
    id: 'cabin',
    name: 'Cabana de Inverno',
    title: 'Edição Cabana & Lago Nevado',
    url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=900&q=80',
    thumb: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=160&q=70',
  },
  {
    id: 'bamboo-forest',
    name: 'Floresta de Bambu',
    title: 'Edição Floresta Zen de Bambu',
    url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=900&q=80',
    thumb: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=160&q=70',
  },
  {
    id: 'coral-reef',
    name: 'Fundo do Mar',
    title: 'Edição Vida Marinha & Tartaruga',
    url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=900&q=80',
    thumb: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=160&q=70',
  },
  {
    id: 'paris-sunset',
    name: 'Paris Romântica',
    title: 'Edição Paris ao Crepúsculo',
    url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=80',
    thumb: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=160&q=70',
  },
  {
    id: 'castle',
    name: 'Vale Místico',
    title: 'Edição Montanhas Verdes',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80',
    thumb: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=160&q=70',
  },
  {
    id: 'waterfall',
    name: 'Cachoeira Secreta',
    title: 'Edição Cachoeira Tropical',
    url: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=900&q=80',
    thumb: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=160&q=70',
  },
  {
    id: 'desert-dunes',
    name: 'Dunas Douradas',
    title: 'Edição Deserto ao Entardecer',
    url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=900&q=80',
    thumb: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=160&q=70',
  },
  {
    id: 'cosmic',
    name: 'Cósmico',
    title: 'Edição Galáxia & Estrelas',
    url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=900&q=80',
    thumb: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=160&q=70',
  },
];
