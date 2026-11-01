import { Quiz } from '../types/game';

export const DEFAULT_QUIZZES: Quiz[] = [
  {
    id: 'quiz-general-trivia',
    title: '🌍 World & General Knowledge',
    description: 'Test your trivia wits across geography, history, and wonders of the world!',
    category: 'General',
    language: 'en',
    createdAt: 1730000000000,
    questions: [
      {
        id: 'q1-1',
        text: 'Which planet is known as the "Red Planet"?',
        options: ['Venus', 'Mars', 'Jupiter', 'Mercury'],
        correctAnswerIndex: 1,
        timeLimit: 20,
        points: 1000,
      },
      {
        id: 'q1-2',
        text: 'What is the largest ocean on Earth?',
        options: ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Pacific Ocean'],
        correctAnswerIndex: 3,
        timeLimit: 20,
        points: 1000,
      },
      {
        id: 'q1-3',
        text: 'In which city would you find the Colosseum?',
        options: ['Athens', 'Rome', 'Madrid', 'Cairo'],
        correctAnswerIndex: 1,
        timeLimit: 20,
        points: 1000,
      },
      {
        id: 'q1-4',
        text: 'How many continents are there on planet Earth?',
        options: ['5', '6', '7', '8'],
        correctAnswerIndex: 2,
        timeLimit: 15,
        points: 1000,
      },
      {
        id: 'q1-5',
        text: 'What element has the chemical symbol "Au"?',
        options: ['Silver', 'Gold', 'Copper', 'Aluminum'],
        correctAnswerIndex: 1,
        timeLimit: 20,
        points: 1000,
      },
    ],
  },
  {
    id: 'quiz-pop-culture',
    title: '🎬 Movies, Gaming & Pop Culture',
    description: 'From cinema icons to legendary gaming moments!',
    category: 'Entertainment',
    language: 'en',
    createdAt: 1730000001000,
    questions: [
      {
        id: 'q2-1',
        text: 'In The Matrix, what color pill does Neo take to wake up in reality?',
        options: ['Blue', 'Red', 'Green', 'Yellow'],
        correctAnswerIndex: 1,
        timeLimit: 20,
        points: 1000,
      },
      {
        id: 'q2-2',
        text: 'What is the name of Mario’s green-clad dinosaur companion in Super Mario?',
        options: ['Toad', 'Yoshi', 'Bowser', 'Luigi'],
        correctAnswerIndex: 1,
        timeLimit: 15,
        points: 1000,
      },
      {
        id: 'q2-3',
        text: 'Which animated movie features the song "Let It Go"?',
        options: ['Moana', 'Tangled', 'Frozen', 'Brave'],
        correctAnswerIndex: 2,
        timeLimit: 15,
        points: 1000,
      },
      {
        id: 'q2-4',
        text: 'Who wields the legendary enchanted hammer Mjolnir in Marvel movies?',
        options: ['Iron Man', 'Captain America', 'Thor', 'Hulk'],
        correctAnswerIndex: 2,
        timeLimit: 15,
        points: 1000,
      },
      {
        id: 'q2-5',
        text: 'What is the best-selling video game of all time with over 300 million copies?',
        options: ['Minecraft', 'Tetris', 'Grand Theft Auto V', 'Wii Sports'],
        correctAnswerIndex: 0,
        timeLimit: 20,
        points: 1000,
      },
    ],
  },
  {
    id: 'quiz-science-tech',
    title: '💻 Science, Space & Tech Geeks',
    description: 'Cutting-edge computing, astronomy, and nature discoveries.',
    category: 'Science & Tech',
    language: 'en',
    createdAt: 1730000002000,
    questions: [
      {
        id: 'q3-1',
        text: 'What protocol is used by browsers for real-time peer-to-peer data channel transfer?',
        options: ['WebSocket', 'RTCDataChannel', 'HTTP/3 Quic', 'Server-Sent Events'],
        correctAnswerIndex: 1,
        timeLimit: 20,
        points: 1000,
      },
      {
        id: 'q3-2',
        text: 'What does "CPU" stand for in computers?',
        options: [
          'Central Processing Unit',
          'Computer Power Unit',
          'Core Programming Utility',
          'Central Performance Ultra',
        ],
        correctAnswerIndex: 0,
        timeLimit: 20,
        points: 1000,
      },
      {
        id: 'q3-3',
        text: 'What is the speed of light in vacuum approximately?',
        options: ['300,000 km/s', '150,000 km/s', '1,000,000 km/s', '30,000 km/s'],
        correctAnswerIndex: 0,
        timeLimit: 20,
        points: 1000,
      },
      {
        id: 'q3-4',
        text: 'Who invented the World Wide Web in 1989 at CERN?',
        options: ['Alan Turing', 'Tim Berners-Lee', 'Steve Jobs', 'Bill Gates'],
        correctAnswerIndex: 1,
        timeLimit: 20,
        points: 1000,
      },
      {
        id: 'q3-5',
        text: 'Which programming language shares its name with a popular Indonesian coffee bean?',
        options: ['Python', 'Ruby', 'Java', 'Rust'],
        correctAnswerIndex: 2,
        timeLimit: 15,
        points: 1000,
      },
    ],
  },
  {
    id: 'quiz-family-fun',
    title: '🎉 Family Fun & Animal Kingdom',
    description: 'Exciting trivia for players of all ages!',
    category: 'Family',
    language: 'en',
    createdAt: 1730000003000,
    questions: [
      {
        id: 'q4-1',
        text: 'What is the tallest living mammal on Earth?',
        options: ['Elephant', 'Giraffe', 'Blue Whale', 'Ostrich'],
        correctAnswerIndex: 1,
        timeLimit: 20,
        points: 1000,
      },
      {
        id: 'q4-2',
        text: 'How many legs does an octopus have?',
        options: ['6', '8', '10', '12'],
        correctAnswerIndex: 1,
        timeLimit: 15,
        points: 1000,
      },
      {
        id: 'q4-3',
        text: 'What do bees collect from flowers to make delicious honey?',
        options: ['Leaves', 'Nectar', 'Sap', 'Seeds'],
        correctAnswerIndex: 1,
        timeLimit: 20,
        points: 1000,
      },
      {
        id: 'q4-4',
        text: 'Which bird is famous for being unable to fly and swimming in chilly waters?',
        options: ['Eagle', 'Penguin', 'Flamingo', 'Parrot'],
        correctAnswerIndex: 1,
        timeLimit: 15,
        points: 1000,
      },
    ],
  },
  // Portuguese Quizzes
  {
    id: 'quiz-conhecimentos-gerais-pt',
    title: '🌍 Conhecimentos Gerais & Mundo',
    description: 'Desafie seus conhecimentos em geografia, história e ciências!',
    category: 'Geral',
    language: 'pt',
    createdAt: 1730000004000,
    questions: [
      {
        id: 'q-pt-1',
        text: 'Qual planeta do Sistema Solar é conhecido como o "Planeta Vermelho"?',
        options: ['Vênus', 'Marte', 'Júpiter', 'Mercúrio'],
        correctAnswerIndex: 1,
        timeLimit: 20,
        points: 1000,
      },
      {
        id: 'q-pt-2',
        text: 'Qual é o maior oceano do planeta Terra?',
        options: ['Oceano Atlântico', 'Oceano Índico', 'Oceano Ártico', 'Oceano Pacífico'],
        correctAnswerIndex: 3,
        timeLimit: 20,
        points: 1000,
      },
      {
        id: 'q-pt-3',
        text: 'Quantos estados tem o Brasil (sem contar o Distrito Federal)?',
        options: ['24', '25', '26', '27'],
        correctAnswerIndex: 2,
        timeLimit: 20,
        points: 1000,
      },
      {
        id: 'q-pt-4',
        text: 'Qual elemento químico possui o símbolo "Au" na tabela periódica?',
        options: ['Prata', 'Ouro', 'Cobre', 'Alumínio'],
        correctAnswerIndex: 1,
        timeLimit: 20,
        points: 1000,
      },
    ],
  },
  {
    id: 'quiz-cultura-pop-pt',
    title: '🎬 Filmes, Séries & Cultura Pop',
    description: 'Dos maiores sucessos do cinema ao universo dos games!',
    category: 'Entretenimento',
    language: 'pt',
    createdAt: 1730000005000,
    questions: [
      {
        id: 'q-pt-pop-1',
        text: 'No filme Matrix, qual pílula Neo escolhe para descobrir a verdade?',
        options: ['Pílula Azul', 'Pílula Vermelha', 'Pílula Verde', 'Pílula Dourada'],
        correctAnswerIndex: 1,
        timeLimit: 20,
        points: 1000,
      },
      {
        id: 'q-pt-pop-2',
        text: 'Qual dinossauro é o fiel companheiro verde de Mario nos jogos da Nintendo?',
        options: ['Toad', 'Yoshi', 'Bowser', 'Donkey Kong'],
        correctAnswerIndex: 1,
        timeLimit: 15,
        points: 1000,
      },
      {
        id: 'q-pt-pop-3',
        text: 'Qual animação da Disney conta com a música icônica "Livre Estou" (Let It Go)?',
        options: ['Moana', 'Enrolados', 'Frozen', 'Valente'],
        correctAnswerIndex: 2,
        timeLimit: 15,
        points: 1000,
      },
    ],
  },
  // Spanish Quizzes
  {
    id: 'quiz-cultura-general-es',
    title: '🌍 Cultura General y el Mundo',
    description: '¡Pon a prueba tu mente con preguntas sobre ciencia, historia y geografía!',
    category: 'General',
    language: 'es',
    createdAt: 1730000006000,
    questions: [
      {
        id: 'q-es-1',
        text: '¿Qué planeta es conocido como el "Planeta Rojo"?',
        options: ['Venus', 'Marte', 'Júpiter', 'Saturno'],
        correctAnswerIndex: 1,
        timeLimit: 20,
        points: 1000,
      },
      {
        id: 'q-es-2',
        text: '¿Cuál es el océano más grande del planeta Tierra?',
        options: ['Océano Atlántico', 'Océano Índico', 'Océano Ártico', 'Océano Pacífico'],
        correctAnswerIndex: 3,
        timeLimit: 20,
        points: 1000,
      },
      {
        id: 'q-es-3',
        text: '¿En qué país se encuentra la antigua ciudad de Machu Picchu?',
        options: ['Colombia', 'Perú', 'México', 'Chile'],
        correctAnswerIndex: 1,
        timeLimit: 20,
        points: 1000,
      },
      {
        id: 'q-es-4',
        text: '¿Cuál es el metal más ligero y blando de la tabla periódica?',
        options: ['Hierro', 'Litio', 'Plata', 'Oro'],
        correctAnswerIndex: 1,
        timeLimit: 20,
        points: 1000,
      },
    ],
  },
  {
    id: 'quiz-cultura-pop-es',
    title: '🎬 Cine, Juegos y Pop',
    description: 'Preguntas legendarias sobre el cine, la música y los videojuegos.',
    category: 'Entretenimiento',
    language: 'es',
    createdAt: 1730000007000,
    questions: [
      {
        id: 'q-es-pop-1',
        text: 'En la película Matrix, ¿qué color de pastilla toma Neo para despertar en la realidad?',
        options: ['Azul', 'Roja', 'Verde', 'Amarilla'],
        correctAnswerIndex: 1,
        timeLimit: 20,
        points: 1000,
      },
      {
        id: 'q-es-pop-2',
        text: '¿Cómo se llama el dinosaurio verde amigo de Mario Bros?',
        options: ['Luigi', 'Yoshi', 'Bowser', 'Toad'],
        correctAnswerIndex: 1,
        timeLimit: 15,
        points: 1000,
      },
      {
        id: 'q-es-pop-3',
        text: '¿Quién empuña el martillo mágico Mjolnir en el Universo Marvel?',
        options: ['Iron Man', 'Capitán América', 'Thor', 'Hulk'],
        correctAnswerIndex: 2,
        timeLimit: 15,
        points: 1000,
      },
    ],
  },
];

const STORAGE_KEY = 'family_arena_quizzes_v1';

export function getStoredQuizzes(): Quiz[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_QUIZZES));
      return DEFAULT_QUIZZES;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return DEFAULT_QUIZZES;
    }

    // Ensure any quiz without language defaults to 'en'
    const loaded = parsed.map((q) => ({
      ...q,
      language: q.language || 'en',
    }));

    // If local storage only had English default quizzes, merge in the multi-language default quizzes
    const hasPt = loaded.some((q) => q.language === 'pt');
    const hasEs = loaded.some((q) => q.language === 'es');
    if (!hasPt || !hasEs) {
      const merged = [
        ...loaded,
        ...DEFAULT_QUIZZES.filter((dq) => (dq.language === 'pt' && !hasPt) || (dq.language === 'es' && !hasEs)),
      ];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      } catch {}
      return merged;
    }

    return loaded;
  } catch {
    return DEFAULT_QUIZZES;
  }
}

export function saveQuizzes(quizzesToSave: Quiz[]): Quiz[] {
  const current = getStoredQuizzes();
  const updated = [...current];

  for (const quiz of quizzesToSave) {
    const existingIndex = updated.findIndex((q) => q.id === quiz.id);
    if (existingIndex >= 0) {
      updated[existingIndex] = quiz;
    } else {
      updated.unshift(quiz);
    }
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save quizzes to local storage:', err);
  }
  return updated;
}

export function saveQuiz(quiz: Quiz): Quiz[] {
  return saveQuizzes([quiz]);
}

export function deleteQuiz(quizId: string): Quiz[] {
  const current = getStoredQuizzes();
  const updated = current.filter((q) => q.id !== quizId);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to delete quiz:', err);
  }
  return updated;
}

export function validateQuiz(data: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Quiz payload must be a valid JSON object.'] };
  }

  const q = data as Record<string, unknown>;

  if (!q.title || typeof q.title !== 'string' || q.title.trim().length === 0) {
    errors.push('Quiz title is required.');
  }

  if (!Array.isArray(q.questions) || q.questions.length === 0) {
    errors.push('Quiz must contain at least one question.');
  } else {
    q.questions.forEach((question, idx) => {
      const prefix = `Question #${idx + 1}:`;
      if (!question || typeof question !== 'object') {
        errors.push(`${prefix} Invalid question object.`);
        return;
      }

      if (!question.text || typeof question.text !== 'string' || question.text.trim().length === 0) {
        errors.push(`${prefix} Question text is required.`);
      }

      if (!Array.isArray(question.options) || question.options.length < 2) {
        errors.push(`${prefix} Must provide at least 2 options.`);
      } else {
        const emptyOption = question.options.some(
          (opt: unknown) => typeof opt !== 'string' || opt.trim().length === 0
        );
        if (emptyOption) {
          errors.push(`${prefix} All options must have text.`);
        }
      }

      const optLen = Array.isArray(question.options) ? question.options.length : 0;
      if (
        typeof question.correctAnswerIndex !== 'number' ||
        question.correctAnswerIndex < 0 ||
        question.correctAnswerIndex >= optLen
      ) {
        errors.push(`${prefix} Has invalid correct answer index.`);
      }

      // timeLimit: 0 means no limit, or > 0 seconds
      if (typeof question.timeLimit !== 'number' || question.timeLimit < 0) {
        errors.push(`${prefix} Time limit must be 0 (no limit) or greater.`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function exportQuizAsJSON(quiz: Quiz): string {
  return JSON.stringify(quiz, null, 2);
}

export function exportQuizzesAsJSON(quizzes: Quiz[]): string {
  return JSON.stringify(
    {
      format: 'family-arena-quiz-database',
      version: 1,
      exportedAt: Date.now(),
      quizCount: quizzes.length,
      quizzes,
    },
    null,
    2
  );
}

export interface ImportResult {
  quizzes: Quiz[];
  errors: string[];
  totalParsed: number;
}

export function importQuizzesFromJSON(jsonString: string): ImportResult {
  try {
    const parsed = JSON.parse(jsonString);
    let rawList: unknown[] = [];

    if (Array.isArray(parsed)) {
      rawList = parsed;
    } else if (parsed && typeof parsed === 'object') {
      const obj = parsed as Record<string, unknown>;
      if (Array.isArray(obj.quizzes)) {
        rawList = obj.quizzes;
      } else if (obj.questions && obj.title) {
        rawList = [obj];
      } else {
        return {
          quizzes: [],
          errors: ['Invalid file format: JSON does not contain any quizzes.'],
          totalParsed: 0,
        };
      }
    } else {
      return {
        quizzes: [],
        errors: ['Invalid file format: Not a JSON object or array.'],
        totalParsed: 0,
      };
    }

    const validQuizzes: Quiz[] = [];
    const errors: string[] = [];

    rawList.forEach((raw, idx) => {
      const validation = validateQuiz(raw);
      const rawObj = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
      const title = typeof rawObj.title === 'string' ? rawObj.title : `Quiz #${idx + 1}`;

      if (!validation.valid) {
        errors.push(`"${title}": ${validation.errors.join(' ')}`);
        return;
      }

      const importedQuiz: Quiz = {
        id: `quiz-imported-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
        title: String(rawObj.title || 'Imported Quiz').trim(),
        description: String(rawObj.description || '').trim(),
        category: String(rawObj.category || 'Imported').trim(),
        language: typeof rawObj.language === 'string' ? rawObj.language : 'en',
        createdAt: Date.now(),
        questions: (rawObj.questions as any[]).map((q: any, qIdx: number) => ({
          id: `q-imp-${Date.now()}-${idx}-${qIdx}`,
          text: String(q.text).trim(),
          options: q.options.map((opt: unknown) => String(opt).trim()),
          correctAnswerIndex: Number(q.correctAnswerIndex),
          timeLimit: typeof q.timeLimit === 'number' ? q.timeLimit : 20,
          points: Number(q.points) || 1000,
        })),
      };

      validQuizzes.push(importedQuiz);
    });

    return {
      quizzes: validQuizzes,
      errors,
      totalParsed: rawList.length,
    };
  } catch (err: any) {
    return {
      quizzes: [],
      errors: [`Invalid JSON file format: ${err.message}`],
      totalParsed: 0,
    };
  }
}

export function importQuizFromJSON(jsonString: string): { quiz: Quiz | null; error?: string; quizzes?: Quiz[] } {
  const res = importQuizzesFromJSON(jsonString);
  if (res.quizzes.length > 0) {
    return {
      quiz: res.quizzes[0],
      quizzes: res.quizzes,
      error: undefined,
    };
  }
  return {
    quiz: null,
    error: res.errors.length > 0 ? res.errors.join(' ') : 'No valid quizzes found in file.',
  };
}
