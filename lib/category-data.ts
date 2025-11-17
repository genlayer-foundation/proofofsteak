import { CategorySubmission, CategoryTheme } from '@/components/category-grid'

export interface NextCategoryLink {
  href: string
  preText: string
  mainText: string
  subText: string
  gradientFrom: string
  gradientVia: string
  gradientTo: string
}

export interface CategoryConfig {
  hero: {
    title: string
    subtitle: string
    backgroundImage: string
  }
  theme: CategoryTheme
  submissions: CategorySubmission[]
  nextCategory?: NextCategoryLink
  cta?: {
    heading: string
    description: string
    buttonText: string
  }
}

// Steak Category
export const steakCategory: CategoryConfig = {
  hero: {
    title: 'PROOF OF STEAK',
    subtitle: 'DEVCONNECT 2025 · BUENOS AIRES',
    backgroundImage: '/hero-steak-hd.jpg',
  },
  theme: {
    emoji: '🥩',
    title: 'Steak',
    subtitle: 'Each submission is evaluated by an intelligent contract through a consensus of LLMs',
    primaryColor: 'amber',
    accentColor: 'orange',
    gradientFrom: 'from-amber-600',
    gradientVia: 'via-orange-500',
    gradientTo: 'to-amber-400',
  },
  cta: {
    heading: 'GOT A PRIME CUT?',
    description: 'Submit your best steak photo and let the AI jury decide if it deserves a spot on the leaderboard',
    buttonText: 'UPLOAD YOUR STEAK',
  },
  submissions: [
    {
      id: 1,
      image: '/perfectly-grilled-ribeye-steak-with-grill-marks.jpg',
      name: 'The Ethereal Ribeye',
      location: 'Don Julio, Palermo',
      votes: 847,
      submittedBy: 'vitalik.eth',
      timestamp: '2025-03-15',
    },
    {
      id: 2,
      image: '/argentinian-asado-beef-steak-medium-rare.jpg',
      name: 'Consensus Asado',
      location: 'La Cabrera, Buenos Aires',
      votes: 723,
      submittedBy: 'satoshi.btc',
      timestamp: '2025-03-14',
    },
    {
      id: 3,
      image: '/wagyu-beef-steak-with-chimichurri-sauce.jpg',
      name: 'Proof of Wagyu',
      location: 'El Mirasol, Puerto Madero',
      votes: 689,
      submittedBy: 'nakamoto.base',
      timestamp: '2025-03-16',
    },
    {
      id: 4,
      image: '/thick-cut-tomahawk-steak-on-board.jpg',
      name: 'Tomahawk Validator',
      location: 'Cabaña Las Lilas',
      votes: 654,
      submittedBy: 'buterin.eth',
      timestamp: '2025-03-15',
    },
    {
      id: 5,
      image: '/sirloin-steak-with-herbs-and-butter.jpg',
      name: 'Decentralized Sirloin',
      location: 'La Dorita, Palermo',
      votes: 612,
      submittedBy: 'crypto.punk',
      timestamp: '2025-03-17',
    },
    {
      id: 6,
      image: '/new-york-strip-steak-perfectly-cooked.jpg',
      name: 'Byzantine Strip',
      location: 'Siga La Vaca',
      votes: 589,
      submittedBy: 'hodler.xyz',
      timestamp: '2025-03-14',
    },
    {
      id: 7,
      image: '/filet-mignon-with-red-wine-sauce.jpg',
      name: 'Merkle Mignon',
      location: 'El Ferroviario',
      votes: 567,
      submittedBy: 'defi.eth',
      timestamp: '2025-03-16',
    },
    {
      id: 8,
      image: '/porterhouse-steak-with-garlic.jpg',
      name: 'Porterhouse Protocol',
      location: 'Don Julio, Palermo',
      votes: 534,
      submittedBy: 'web3.dev',
      timestamp: '2025-03-15',
    },
    {
      id: 9,
      image: '/t-bone-steak-with-rosemary.jpg',
      name: 'T-Bone Consensus',
      location: 'La Cabrera Norte',
      votes: 498,
      submittedBy: 'staker.sol',
      timestamp: '2025-03-17',
    },
  ],
  nextCategory: {
    href: '/veggies',
    preText: 'NOT INTO MEAT?',
    mainText: 'GO VEGGIE →',
    subText: "(We won't judge... much 🌱)",
    gradientFrom: 'from-green-600',
    gradientVia: 'via-green-500',
    gradientTo: 'to-green-400',
  },
}

// Mate Category
export const mateCategory: CategoryConfig = {
  hero: {
    title: 'PROOF OF MATE',
    subtitle: 'DEVCONNECT 2025 · BUENOS AIRES',
    backgroundImage: '/hero-mate-hd.jpg',
  },
  theme: {
    emoji: '🧉',
    title: 'Mate',
    subtitle: 'Each submission is evaluated by an intelligent contract through a consensus of LLMs',
    primaryColor: 'green',
    accentColor: 'emerald',
    gradientFrom: 'from-green-600',
    gradientVia: 'via-green-500',
    gradientTo: 'to-green-400',
  },
  cta: {
    heading: 'BREWED PERFECTION?',
    description: 'Submit your best mate photo and let the AI jury decide if it deserves a spot on the leaderboard',
    buttonText: 'UPLOAD YOUR MATE',
  },
  submissions: [
    {
      id: 1,
      image: '/placeholder.svg',
      name: 'The Perfect Mate',
      location: 'Café Tortoni, Buenos Aires',
      votes: 523,
      submittedBy: 'mate.eth',
      timestamp: '2025-03-15',
    },
  ],
  nextCategory: {
    href: '/gaucho',
    preText: 'FEELING ADVENTUROUS?',
    mainText: 'MEET THE GAUCHOS →',
    subText: '(Experience the Pampas spirit 🤠)',
    gradientFrom: 'from-amber-600',
    gradientVia: 'via-yellow-500',
    gradientTo: 'to-amber-400',
  },
}

// Veggies Category
export const veggiesCategory: CategoryConfig = {
  hero: {
    title: 'PROOF OF VEGGIES',
    subtitle: 'DEVCONNECT 2025 · BUENOS AIRES',
    backgroundImage: '/hero-veggies-hd.jpg',
  },
  theme: {
    emoji: '🥦',
    title: 'Veggie',
    subtitle: 'Each submission is evaluated by an intelligent contract through a consensus of LLMs',
    primaryColor: 'green',
    accentColor: 'emerald',
    gradientFrom: 'from-green-600',
    gradientVia: 'via-green-500',
    gradientTo: 'to-green-400',
  },
  cta: {
    heading: 'GOT GREENS?',
    description: 'Submit your best veggie photo and let the AI jury decide if it deserves a spot on the leaderboard',
    buttonText: 'UPLOAD YOUR VEGGIE',
  },
  submissions: [
    {
      id: 1,
      image: '/placeholder.svg',
      name: 'The Green Giant',
      location: 'Bio Restaurant, Palermo',
      votes: 412,
      submittedBy: 'vegan.eth',
      timestamp: '2025-03-16',
    },
  ],
  nextCategory: {
    href: '/mate',
    preText: 'NEED SOME ENERGY?',
    mainText: 'DRINK MATE →',
    subText: '(Join the true Argentine experience 🧉)',
    gradientFrom: 'from-green-600',
    gradientVia: 'via-green-500',
    gradientTo: 'to-green-400',
  },
}

// Gaucho Category
export const gauchoCategory: CategoryConfig = {
  hero: {
    title: 'PROOF OF GAUCHO',
    subtitle: 'DEVCONNECT 2025 · BUENOS AIRES',
    backgroundImage: '/hero-gaucho-hd.jpg',
  },
  theme: {
    emoji: '🤠',
    title: 'Gaucho',
    subtitle: 'Each submission is evaluated by an intelligent contract through a consensus of LLMs',
    primaryColor: 'amber',
    accentColor: 'yellow',
    gradientFrom: 'from-amber-600',
    gradientVia: 'via-yellow-500',
    gradientTo: 'to-amber-400',
  },
  cta: {
    heading: 'CAPTURED THE SPIRIT?',
    description: 'Submit your best gaucho photo and let the AI jury decide if it deserves a spot on the leaderboard',
    buttonText: 'UPLOAD YOUR GAUCHO',
  },
  submissions: [
    {
      id: 1,
      image: '/placeholder.svg',
      name: 'The True Gaucho',
      location: 'La Estancia, Pampa',
      votes: 667,
      submittedBy: 'gaucho.arg',
      timestamp: '2025-03-14',
    },
  ],
  nextCategory: {
    href: '/futbol',
    preText: 'READY FOR PASSION?',
    mainText: 'PLAY FUTBOL →',
    subText: "(It's not just a game here ⚽)",
    gradientFrom: 'from-blue-600',
    gradientVia: 'via-sky-500',
    gradientTo: 'to-blue-400',
  },
}

// Futbol Category
export const futbolCategory: CategoryConfig = {
  hero: {
    title: 'PROOF OF FUTBOL',
    subtitle: 'DEVCONNECT 2025 · BUENOS AIRES',
    backgroundImage: '/hero-futbol-hd.jpg',
  },
  theme: {
    emoji: '⚽',
    title: 'Futbol',
    subtitle: 'Each submission is evaluated by an intelligent contract through a consensus of LLMs',
    primaryColor: 'blue',
    accentColor: 'sky',
    gradientFrom: 'from-blue-600',
    gradientVia: 'via-sky-500',
    gradientTo: 'to-blue-400',
  },
  cta: {
    heading: 'SCORED A GOAL?',
    description: 'Submit your best futbol photo and let the AI jury decide if it deserves a spot on the leaderboard',
    buttonText: 'UPLOAD YOUR FUTBOL',
  },
  submissions: [
    {
      id: 1,
      image: '/placeholder.svg',
      name: 'La Bombonera Experience',
      location: 'La Boca, Buenos Aires',
      votes: 910,
      submittedBy: 'maradona.arg',
      timestamp: '2025-03-15',
    },
  ],
  nextCategory: {
    href: '/easter-eggs',
    preText: 'LOOKING FOR SECRETS?',
    mainText: 'FIND EASTER EGGS →',
    subText: '(Hidden gems await discovery 🥚)',
    gradientFrom: 'from-purple-600',
    gradientVia: 'via-violet-500',
    gradientTo: 'to-purple-400',
  },
}

// Easter Eggs Category
export const easterEggsCategory: CategoryConfig = {
  hero: {
    title: 'PROOF OF EASTER',
    subtitle: 'DEVCONNECT 2025 · BUENOS AIRES',
    backgroundImage: '/hero-easter-hd.jpg',
  },
  theme: {
    emoji: '🥚',
    title: 'Easter Egg',
    subtitle: 'Each submission is evaluated by an intelligent contract through a consensus of LLMs',
    primaryColor: 'purple',
    accentColor: 'violet',
    gradientFrom: 'from-purple-600',
    gradientVia: 'via-violet-500',
    gradientTo: 'to-purple-400',
  },
  cta: {
    heading: 'FOUND A SECRET?',
    description: 'Submit your best easter egg photo and let the AI jury decide if it deserves a spot on the leaderboard',
    buttonText: 'UPLOAD YOUR EASTER EGG',
  },
  submissions: [
    {
      id: 1,
      image: '/placeholder.svg',
      name: 'The Hidden Gem',
      location: 'Secret Location, Buenos Aires',
      votes: 333,
      submittedBy: 'mystery.eth',
      timestamp: '2025-03-17',
    },
  ],
  nextCategory: {
    href: '/',
    preText: 'BACK TO BASICS?',
    mainText: 'RETURN TO STEAK →',
    subText: "(You know you can't resist 🥩)",
    gradientFrom: 'from-amber-600',
    gradientVia: 'via-orange-500',
    gradientTo: 'to-amber-400',
  },
}
