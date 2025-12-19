import { MoodConfig, MoodType } from './types';

// Default theme used when no mood is selected (Grateful/Emerald base)
const DEFAULT_THEME = {
  background: 'bg-gradient-to-br from-emerald-50 via-teal-50 to-slate-100 dark:from-slate-900 dark:via-emerald-950 dark:to-teal-950',
  primaryText: 'text-emerald-950 dark:text-emerald-50',
  secondaryText: 'text-slate-600 dark:text-slate-400',
  accent: 'text-emerald-700 dark:text-emerald-300',
  border: 'border-emerald-100 dark:border-emerald-800/30',
  ui: {
    pill: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200',
    buttonPrimary: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200 dark:shadow-none dark:hover:bg-emerald-500',
    buttonSecondary: 'bg-white text-slate-600 border-slate-200 hover:text-emerald-600 hover:bg-emerald-50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:text-emerald-300 dark:hover:bg-slate-700',
    iconBg: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
    highlight: 'bg-emerald-800 dark:bg-emerald-500',
  }
};

export const MOOD_CONFIGS: MoodConfig[] = [
  { 
    type: MoodType.HAPPY, 
    icon: '✨', 
    color: 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-200 dark:border-amber-800 dark:hover:bg-amber-800/40', 
    description: "Bersukacita",
    theme: {
      background: 'bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-slate-900 dark:via-amber-950 dark:to-orange-950',
      primaryText: 'text-amber-950 dark:text-amber-50',
      secondaryText: 'text-amber-700/80 dark:text-amber-200/60',
      accent: 'text-amber-600 dark:text-amber-400',
      border: 'border-amber-200 dark:border-amber-800/30',
      ui: {
        pill: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200',
        buttonPrimary: 'bg-amber-500 text-white hover:bg-amber-600 shadow-amber-200 dark:shadow-none',
        buttonSecondary: 'bg-white text-amber-700 border-amber-200 hover:bg-amber-50 dark:bg-slate-800 dark:text-amber-200 dark:border-slate-700 dark:hover:bg-amber-900/20',
        iconBg: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
        highlight: 'bg-amber-500 dark:bg-amber-400',
      }
    }
  },
  { 
    type: MoodType.GRATEFUL, 
    icon: '🤲', 
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-200 dark:border-emerald-800 dark:hover:bg-emerald-800/40', 
    description: "Berterima kasih",
    theme: DEFAULT_THEME // Uses the emerald theme
  },
  { 
    type: MoodType.OPTIMISTIC, 
    icon: '🚀', 
    color: 'bg-cyan-100 text-cyan-800 border-cyan-200 hover:bg-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-200 dark:border-cyan-800 dark:hover:bg-cyan-800/40', 
    description: "Penuh Harapan",
    theme: {
      background: 'bg-gradient-to-br from-cyan-50 via-sky-50 to-white dark:from-slate-900 dark:via-cyan-950 dark:to-sky-950',
      primaryText: 'text-cyan-950 dark:text-cyan-50',
      secondaryText: 'text-cyan-800/70 dark:text-cyan-200/60',
      accent: 'text-cyan-700 dark:text-cyan-300',
      border: 'border-cyan-200 dark:border-cyan-800/30',
      ui: {
        pill: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-200',
        buttonPrimary: 'bg-cyan-600 text-white hover:bg-cyan-700 shadow-cyan-200 dark:shadow-none',
        buttonSecondary: 'bg-white text-cyan-700 border-cyan-200 hover:bg-cyan-50 dark:bg-slate-800 dark:text-cyan-200 dark:border-slate-700 dark:hover:bg-cyan-900/20',
        iconBg: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400',
        highlight: 'bg-cyan-600 dark:bg-cyan-400',
      }
    }
  },
  { 
    type: MoodType.CONFUSED, 
    icon: '🧭', 
    color: 'bg-violet-100 text-violet-800 border-violet-200 hover:bg-violet-200 dark:bg-violet-900/30 dark:text-violet-200 dark:border-violet-800 dark:hover:bg-violet-800/40', 
    description: "Mencari Petunjuk",
    theme: {
      background: 'bg-gradient-to-br from-violet-50 via-fuchsia-50 to-slate-50 dark:from-slate-900 dark:via-violet-950 dark:to-fuchsia-950',
      primaryText: 'text-violet-950 dark:text-violet-50',
      secondaryText: 'text-violet-900/70 dark:text-violet-200/60',
      accent: 'text-violet-700 dark:text-violet-300',
      border: 'border-violet-200 dark:border-violet-800/30',
      ui: {
        pill: 'bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-200',
        buttonPrimary: 'bg-violet-600 text-white hover:bg-violet-700 shadow-violet-200 dark:shadow-none',
        buttonSecondary: 'bg-white text-violet-700 border-violet-200 hover:bg-violet-50 dark:bg-slate-800 dark:text-violet-200 dark:border-slate-700 dark:hover:bg-violet-900/20',
        iconBg: 'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400',
        highlight: 'bg-violet-600 dark:bg-violet-400',
      }
    }
  },
  { 
    type: MoodType.ANXIOUS, 
    icon: '🌪️', 
    color: 'bg-indigo-100 text-indigo-800 border-indigo-200 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-200 dark:border-indigo-800 dark:hover:bg-indigo-800/40', 
    description: "Gelisah",
    theme: {
      background: 'bg-gradient-to-br from-indigo-50 via-violet-50 to-slate-100 dark:from-slate-900 dark:via-indigo-950 dark:to-violet-950',
      primaryText: 'text-indigo-950 dark:text-indigo-50',
      secondaryText: 'text-indigo-900/70 dark:text-indigo-200/60',
      accent: 'text-indigo-600 dark:text-indigo-300',
      border: 'border-indigo-200 dark:border-indigo-800/30',
      ui: {
        pill: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200',
        buttonPrimary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200 dark:shadow-none',
        buttonSecondary: 'bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50 dark:bg-slate-800 dark:text-indigo-200 dark:border-slate-700 dark:hover:bg-indigo-900/20',
        iconBg: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
        highlight: 'bg-indigo-600 dark:bg-indigo-400',
      }
    }
  },
  { 
    type: MoodType.RESTLESS, 
    icon: '〰️', 
    color: 'bg-lime-100 text-lime-800 border-lime-200 hover:bg-lime-200 dark:bg-lime-900/30 dark:text-lime-200 dark:border-lime-800 dark:hover:bg-lime-800/40', 
    description: "Hati Tidak Tenang",
    theme: {
      background: 'bg-gradient-to-br from-lime-50 via-green-50 to-emerald-50 dark:from-slate-900 dark:via-lime-950 dark:to-green-950',
      primaryText: 'text-lime-950 dark:text-lime-50',
      secondaryText: 'text-lime-900/70 dark:text-lime-200/60',
      accent: 'text-lime-700 dark:text-lime-300',
      border: 'border-lime-200 dark:border-lime-800/30',
      ui: {
        pill: 'bg-lime-100 text-lime-800 dark:bg-lime-900/40 dark:text-lime-200',
        buttonPrimary: 'bg-lime-600 text-white hover:bg-lime-700 shadow-lime-200 dark:shadow-none',
        buttonSecondary: 'bg-white text-lime-700 border-lime-200 hover:bg-lime-50 dark:bg-slate-800 dark:text-lime-200 dark:border-slate-700 dark:hover:bg-lime-900/20',
        iconBg: 'bg-lime-100 text-lime-600 dark:bg-lime-900/30 dark:text-lime-400',
        highlight: 'bg-lime-600 dark:bg-lime-400',
      }
    }
  },
  { 
    type: MoodType.GALAU, 
    icon: '😶‍🌫️', 
    color: 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200 hover:bg-fuchsia-200 dark:bg-fuchsia-900/30 dark:text-fuchsia-200 dark:border-fuchsia-800 dark:hover:bg-fuchsia-800/40', 
    description: "Hati Bimbang",
    theme: {
      background: 'bg-gradient-to-br from-fuchsia-50 via-slate-50 to-purple-50 dark:from-slate-900 dark:via-fuchsia-950 dark:to-purple-950',
      primaryText: 'text-fuchsia-950 dark:text-fuchsia-50',
      secondaryText: 'text-fuchsia-900/70 dark:text-fuchsia-200/60',
      accent: 'text-fuchsia-700 dark:text-fuchsia-300',
      border: 'border-fuchsia-200 dark:border-fuchsia-800/30',
      ui: {
        pill: 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/40 dark:text-fuchsia-200',
        buttonPrimary: 'bg-fuchsia-600 text-white hover:bg-fuchsia-700 shadow-fuchsia-200 dark:shadow-none',
        buttonSecondary: 'bg-white text-fuchsia-700 border-fuchsia-200 hover:bg-fuchsia-50 dark:bg-slate-800 dark:text-fuchsia-200 dark:border-slate-700 dark:hover:bg-fuchsia-900/20',
        iconBg: 'bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-900/30 dark:text-fuchsia-400',
        highlight: 'bg-fuchsia-600 dark:bg-fuchsia-400',
      }
    }
  },
  { 
    type: MoodType.TIRED, 
    icon: '🔋', 
    color: 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-200 dark:border-orange-800 dark:hover:bg-orange-800/40', 
    description: "Lelah Lahir Batin",
    theme: {
      background: 'bg-gradient-to-br from-orange-50 via-amber-50 to-stone-50 dark:from-slate-900 dark:via-orange-950 dark:to-amber-950',
      primaryText: 'text-orange-950 dark:text-orange-50',
      secondaryText: 'text-orange-900/70 dark:text-orange-200/60',
      accent: 'text-orange-700 dark:text-orange-300',
      border: 'border-orange-200 dark:border-orange-800/30',
      ui: {
        pill: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200',
        buttonPrimary: 'bg-orange-600 text-white hover:bg-orange-700 shadow-orange-200 dark:shadow-none',
        buttonSecondary: 'bg-white text-orange-700 border-orange-200 hover:bg-orange-50 dark:bg-slate-800 dark:text-orange-200 dark:border-slate-700 dark:hover:bg-orange-900/20',
        iconBg: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
        highlight: 'bg-orange-600 dark:bg-orange-400',
      }
    }
  },
  { 
    type: MoodType.ANGRY, 
    icon: '🔥', 
    color: 'bg-rose-100 text-rose-800 border-rose-200 hover:bg-rose-200 dark:bg-rose-900/30 dark:text-rose-200 dark:border-rose-800 dark:hover:bg-rose-800/40', 
    description: "Emosi memuncak",
    theme: {
      background: 'bg-gradient-to-br from-rose-50 via-orange-50 to-slate-100 dark:from-slate-900 dark:via-rose-950 dark:to-orange-950', // Warm but calming
      primaryText: 'text-rose-950 dark:text-rose-50',
      secondaryText: 'text-rose-900/70 dark:text-rose-200/60',
      accent: 'text-rose-600 dark:text-rose-300',
      border: 'border-rose-200 dark:border-rose-800/30',
      ui: {
        pill: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200',
        buttonPrimary: 'bg-rose-600 text-white hover:bg-rose-700 shadow-rose-200 dark:shadow-none',
        buttonSecondary: 'bg-white text-rose-700 border-rose-200 hover:bg-rose-50 dark:bg-slate-800 dark:text-rose-200 dark:border-slate-700 dark:hover:bg-rose-900/20',
        iconBg: 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400',
        highlight: 'bg-rose-600 dark:bg-rose-400',
      }
    }
  },
  { 
    type: MoodType.DISAPPOINTED, 
    icon: '🥀', 
    color: 'bg-stone-100 text-stone-800 border-stone-200 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-200 dark:border-stone-700 dark:hover:bg-stone-700', 
    description: "Kecewa",
    theme: {
      background: 'bg-gradient-to-br from-stone-100 via-orange-50 to-red-50 dark:from-slate-900 dark:via-stone-950 dark:to-orange-950',
      primaryText: 'text-stone-900 dark:text-stone-100',
      secondaryText: 'text-stone-600 dark:text-stone-400',
      accent: 'text-stone-700 dark:text-stone-300',
      border: 'border-stone-300 dark:border-stone-700',
      ui: {
        pill: 'bg-stone-200 text-stone-700 dark:bg-stone-800 dark:text-stone-300',
        buttonPrimary: 'bg-stone-600 text-white hover:bg-stone-700 shadow-stone-300 dark:shadow-none',
        buttonSecondary: 'bg-white text-stone-600 border-stone-300 hover:bg-stone-100 dark:bg-slate-800 dark:text-stone-300 dark:border-slate-700 dark:hover:bg-slate-700',
        iconBg: 'bg-stone-200 text-stone-600 dark:bg-stone-800 dark:text-stone-400',
        highlight: 'bg-stone-600 dark:bg-stone-400',
      }
    }
  },
  { 
    type: MoodType.LONELY, 
    icon: '🍂', 
    color: 'bg-slate-200 text-slate-700 border-slate-300 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700', 
    description: "Sendiri",
    theme: {
      background: 'bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200 dark:from-slate-950 dark:via-gray-900 dark:to-slate-900',
      primaryText: 'text-slate-800 dark:text-slate-100',
      secondaryText: 'text-slate-500 dark:text-slate-400',
      accent: 'text-slate-600 dark:text-slate-300',
      border: 'border-slate-300 dark:border-slate-700',
      ui: {
        pill: 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
        buttonPrimary: 'bg-slate-600 text-white hover:bg-slate-700 shadow-slate-300 dark:shadow-none',
        buttonSecondary: 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700',
        iconBg: 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
        highlight: 'bg-slate-600 dark:bg-slate-400',
      }
    }
  },
  { 
    type: MoodType.SAD, 
    icon: '🌧️', 
    color: 'bg-sky-100 text-sky-800 border-sky-200 hover:bg-sky-200 dark:bg-sky-900/30 dark:text-sky-200 dark:border-sky-800 dark:hover:bg-sky-800/40', 
    description: "Berduka",
    theme: {
      background: 'bg-gradient-to-br from-sky-50 via-blue-50 to-slate-100 dark:from-slate-900 dark:via-sky-950 dark:to-blue-950',
      primaryText: 'text-sky-950 dark:text-sky-50',
      secondaryText: 'text-sky-900/70 dark:text-sky-200/60',
      accent: 'text-sky-600 dark:text-sky-300',
      border: 'border-sky-200 dark:border-sky-800/30',
      ui: {
        pill: 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200',
        buttonPrimary: 'bg-sky-600 text-white hover:bg-sky-700 shadow-sky-200 dark:shadow-none',
        buttonSecondary: 'bg-white text-sky-700 border-sky-200 hover:bg-sky-50 dark:bg-slate-800 dark:text-sky-200 dark:border-slate-700 dark:hover:bg-sky-900/20',
        iconBg: 'bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400',
        highlight: 'bg-sky-600 dark:bg-sky-400',
      }
    }
  },
];

export const getMoodConfig = (type: MoodType): MoodConfig | undefined => {
  return MOOD_CONFIGS.find(m => m.type === type);
};

export const MOOD_LOADING_MESSAGES: Record<MoodType, string[]> = {
  [MoodType.HAPPY]: [
    "Menjaga senyummu agar tetap merekah...",
    "Mengumpulkan syukur dari setiap sudut hati...",
    "Semoga kebahagiaan ini menular ke sekitarmu...",
    "Nikmat mana lagi yang kau dustakan?",
    "Menjadikan bahagiamu sebagai ladang pahala..."
  ],
  [MoodType.GRATEFUL]: [
    "Mencatat nikmat yang tak terhitung...",
    "Menambah keberkahan dalam rasa cukup...",
    "Alhamdulillah atas segala hal...",
    "Barangsiapa bersyukur, niscaya akan Ditambah nikmat-Nya...",
    "Melihat ke bawah untuk mensyukuri yang ada..."
  ],
  [MoodType.OPTIMISTIC]: [
    "Menyalakan pelita harapan di hatimu...",
    "Pertolongan Allah itu sangat dekat...",
    "Menyiapkan langkah untuk masa depan yang cerah...",
    "Berprasangka baik pada Allah adalah kunci ketenangan...",
    "Hasbunallah Wanikmal Wakil..."
  ],
  [MoodType.CONFUSED]: [
    "Memohon petunjuk ke jalan yang lurus...",
    "Mengurai benang kusut dalam pikiran...",
    "Mencari cahaya di tengah keraguan...",
    "Istikharah cinta pada Sang Pemilik Hati...",
    "Ya Muqollibal Qulub, tetapkan hati ini..."
  ],
  [MoodType.ANXIOUS]: [
    "Tarik napas perlahan, Allah bersamamu...",
    "Mencari ketenangan di antara badai pikiran...",
    "Segala urusan ada dalam genggaman-Nya...",
    "Cukuplah Allah sebagai penolongmu...",
    "Kekhawatiran tidak mengubah takdir, doa yang mengubahnya..."
  ],
  [MoodType.RESTLESS]: [
    "Menurunkan ritme jantung yang berpacu...",
    "Mencari tempat bersandar yang paling kokoh...",
    "Biarkan Al-Quran membasuh kegelisahanmu...",
    "Ingatlah, hanya dengan mengingat Allah hati menjadi tenang...",
    "Sujudlah, maka hatimu akan lapang..."
  ],
  [MoodType.GALAU]: [
    "Mengurai benang kusut di hatimu...",
    "Mencari kepastian dari Sang Pemilik Hati...",
    "Biarkan Allah menuntun langkahmu yang ragu...",
    "Mungkin ini cara Allah memintamu mendekat...",
    "Hati yang bimbang akan tenang dengan dzikir...",
    "Menata kembali kepingan rasa..."
  ],
  [MoodType.TIRED]: [
    "Istirahatkan jiwamu sejenak pada-Nya...",
    "Dunia memang tempat berlelah, surga tempat istirahat...",
    "Mengisi ulang energi batin dengan kalam Ilahi...",
    "Lelahmu akan menjadi lillah...",
    "Allah tidak membebani seseorang melainkan sesuai kesanggupannya...",
    "Rebahkan lelahmu di atas sajadah..."
  ],
  [MoodType.ANGRY]: [
    "Meredam api dengan air wudhu...",
    "Menjernihkan hati yang sedang keruh...",
    "Kesabaran adalah cahaya yang terang...",
    "Orang kuat adalah yang mampu menahan amarahnya...",
    "Ganti amarahmu dengan istighfar..."
  ],
  [MoodType.DISAPPOINTED]: [
    "Mengobati hati yang sedang patah...",
    "Manusia berencana, Allah sebaik-baik perencana...",
    "Mencari hikmah di balik setiap kejadian...",
    "Boleh jadi kamu membenci sesuatu, padahal itu baik bagimu...",
    "Allah mengganti yang hilang dengan yang lebih baik..."
  ],
  [MoodType.LONELY]: [
    "Allah lebih dekat dari urat lehermu...",
    "Engkau tidak pernah benar-benar sendirian...",
    "Mendatangkan teman terbaik: Al-Quran...",
    "Allah adalah sebaik-baik teman curhat...",
    "Kesepian adalah undangan untuk bermunajat berdua dengan-Nya..."
  ],
  [MoodType.SAD]: [
    "Setiap air mata didengar oleh-Nya...",
    "Setelah kesulitan pasti ada kemudahan...",
    "Memeluk hatimu dengan ayat-ayat cinta...",
    "La Tahzan, Innallaha Ma'ana...",
    "Allah menyayangi hati yang sabar..."
  ]
};

export const getRandomLoadingMessage = (mood: MoodType): string => {
  const messages = MOOD_LOADING_MESSAGES[mood];
  if (!messages) return "Sedang mencari ayat penenang...";
  return messages[Math.floor(Math.random() * messages.length)];
};