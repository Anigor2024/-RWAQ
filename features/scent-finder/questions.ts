import {
  CHARACTER_POSITIONING_OPTIONS,
  DEFAULT_SCENT_FINDER_ANSWERS,
  FAMILY_CHOICES,
  LONGEVITY_CHOICES,
  MATERIAL_CHOICES,
  MAX_MATERIAL_SELECTIONS,
  OCCASION_CHOICES,
  PRESENCE_CHOICES,
  PROJECTION_CHOICES,
  SCENT_FINDER_TOTAL_STEPS,
  SCENT_MATERIAL_KEYS,
  SCENT_PRESENCE_KEYS,
  SCENT_QUESTION_IDS,
  SEASON_CHOICES,
} from './question-options';
import type {
  ScentFinderAnswerState,
  ScentFinderQuestionDefinition,
  ScentFinderQuestionId,
  ScentPreferenceProfile,
} from './types';

export {
  CHARACTER_POSITIONING_OPTIONS,
  DEFAULT_SCENT_FINDER_ANSWERS,
  FAMILY_CHOICES,
  LONGEVITY_CHOICES,
  MATERIAL_CHOICES,
  MAX_MATERIAL_SELECTIONS,
  OCCASION_CHOICES,
  PRESENCE_CHOICES,
  PROJECTION_CHOICES,
  SCENT_FINDER_TOTAL_STEPS,
  SCENT_MATERIAL_KEYS,
  SCENT_PRESENCE_KEYS,
  SCENT_QUESTION_IDS,
  SEASON_CHOICES,
};

export const SCENT_FINDER_QUESTIONS: readonly ScentFinderQuestionDefinition[] =
  [
    {
      id: 'presence',
      stepNumber: 1,
      selectionMode: 'single',
      maxSelections: 1,
      eyebrow: {
        ar: 'المحطة الأولى · البصمة والحضور',
        en: 'Step I · Olfactory Presence',
      },
      question: {
        ar: 'ما طبيعة الحضور العطري الذي تبحث عنه؟',
        en: 'What kind of presence are you looking for?',
      },
      context: {
        ar: 'يبدأ اختيار العطر في رِواق من الأثر المعنوي الذي ترغب أن يسبقك أو يرافقك في المكان.',
        en: 'Every RWAQ composition begins with the atmosphere and emotional poise you wish to project.',
      },
      choices: [...PRESENCE_CHOICES],
    },
    {
      id: 'materials',
      stepNumber: 2,
      selectionMode: 'multi',
      maxSelections: MAX_MATERIAL_SELECTIONS,
      eyebrow: {
        ar: 'المحطة الثانية · الانجذاب العطري',
        en: 'Step II · Noble Raw Materials',
      },
      question: {
        ar: 'أيّ الخامات العطرية النبيلة تستوقف حواسك أكثر؟',
        en: 'Which materials draw you most?',
      },
      context: {
        ar: 'اختر حتى ثلاث خامات تشعر أنها الأقرب إلى ذائقتك العطرية.',
        en: 'Select up to three foundational raw materials from the RWAQ olfactory palette.',
      },
      choices: [...MATERIAL_CHOICES],
    },
    {
      id: 'family',
      stepNumber: 3,
      selectionMode: 'single',
      maxSelections: 1,
      eyebrow: {
        ar: 'المحطة الثالثة · العالم العطري',
        en: 'Step III · Olfactory World',
      },
      question: {
        ar: 'أيّ العوالم العطرية يشبه ذائقتك؟',
        en: 'Which olfactory territory feels most like yours?',
      },
      context: {
        ar: 'تتوزع ابتكارات الدار على ست عائلات عطرية مستلهمة من ثلاثية نَجد وصَحراء ولَيل.',
        en: 'Our eighteen creations span six olfactory families across the Najd, Sahra, and Layl trilogy.',
      },
      choices: [...FAMILY_CHOICES],
    },
    {
      id: 'occasion',
      stepNumber: 4,
      selectionMode: 'single',
      maxSelections: 1,
      eyebrow: {
        ar: 'المحطة الرابعة · المناسبة والمجلس',
        en: 'Step IV · Wearing Context',
      },
      question: {
        ar: 'في أيّ الأوقات أو المجالس ترغب بارتداء هذا العطر؟',
        en: 'Where do you envision wearing this fragrance most?',
      },
      context: {
        ar: 'يُضبط توازن النوتات في كل تركيبة لينسجم مع طقوس الارتداء اليومية أو الرسمية.',
        en: 'Each composition is calibrated for a distinct ritual of daily life, hospitality, or ceremony.',
      },
      choices: [...OCCASION_CHOICES],
    },
    {
      id: 'season',
      stepNumber: 5,
      selectionMode: 'single',
      maxSelections: 1,
      eyebrow: {
        ar: 'المحطة الخامسة · الأجواء والفصول',
        en: 'Step V · Season & Atmosphere',
      },
      question: {
        ar: 'أيّ الأجواء والفصول تستدعي هذا العطر في مخيلتك؟',
        en: 'Which season or atmospheric light calls for this scent?',
      },
      context: {
        ar: 'تتفاعل الزيوت العطرية عالية التركيز مع حرارة الجو وبرودته لتكشف عن أبعادٍ متباينة.',
        en: 'High-concentration extraits unfold differently across sunlit warmth, crisp winter air, and nightfall.',
      },
      choices: [...SEASON_CHOICES],
    },
    {
      id: 'projection',
      stepNumber: 6,
      selectionMode: 'single',
      maxSelections: 1,
      eyebrow: {
        ar: 'المحطة السادسة · مدى الفوحان',
        en: 'Step VI · Sillage & Projection',
      },
      question: {
        ar: 'كيف تفضّل أن يعلن عطرك عن حضوره في المكان؟',
        en: 'How should your fragrance enter the room?',
      },
      context: {
        ar: 'الفوحان هو المسافة الهوائية التي يرسمها العطر حولك عند الحركة والسكون.',
        en: 'Sillage defines the spatial radius and atmospheric trail your fragrance leaves around you.',
      },
      choices: [...PROJECTION_CHOICES],
    },
    {
      id: 'longevity',
      stepNumber: 7,
      selectionMode: 'single',
      maxSelections: 1,
      eyebrow: {
        ar: 'المحطة السابعة · الثبات والطابع',
        en: 'Step VII · Longevity & Character',
      },
      question: {
        ar: 'ما درجة الثبات والرسوخ التي تفضّلها على البشرة؟',
        en: 'What level of endurance and character do you prefer?',
      },
      context: {
        ar: 'خطوة أخيرة لتحديد مدى بقاء القاعدة العطرية وميل التركيبة على البشرة.',
        en: 'A final step to calibrate the endurance of the base notes and your preferred scent leaning.',
      },
      choices: [...LONGEVITY_CHOICES],
    },
  ];

export function isQuestionAnswered(
  questionId: ScentFinderQuestionId,
  answers: ScentFinderAnswerState
): boolean {
  switch (questionId) {
    case 'presence':
      return Boolean(answers.presence);
    case 'materials':
      return (
        answers.materials.length >= 1 &&
        answers.materials.length <= MAX_MATERIAL_SELECTIONS
      );
    case 'family':
      return Boolean(answers.family);
    case 'occasion':
      return Boolean(answers.occasion);
    case 'season':
      return Boolean(answers.season);
    case 'projection':
      return Boolean(answers.projection);
    case 'longevity':
      return Boolean(answers.longevity);
  }
}

export function isCompletePreferenceProfile(
  answers: ScentFinderAnswerState
): answers is ScentPreferenceProfile {
  return (
    Boolean(answers.presence) &&
    answers.materials.length >= 1 &&
    answers.materials.length <= MAX_MATERIAL_SELECTIONS &&
    Boolean(answers.family) &&
    Boolean(answers.occasion) &&
    Boolean(answers.season) &&
    Boolean(answers.projection) &&
    Boolean(answers.longevity)
  );
}
