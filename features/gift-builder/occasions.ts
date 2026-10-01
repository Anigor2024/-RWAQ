import type {
  GiftOccasion,
  GiftOccasionDescriptor,
  GiftPresentation,
  GiftPresentationDescriptor,
  GiftSetSize,
  GiftSetSizeDescriptor,
  GiftStepDescriptor,
  GiftStepId,
} from './types';

export const GIFT_OCCASION_KEYS = [
  'birthday',
  'wedding',
  'graduation',
  'hospitality',
  'thank-you',
  'corporate',
  'just-because',
] as const satisfies readonly GiftOccasion[];

export const GIFT_SET_SIZES = [
  1,
  2,
  3,
] as const satisfies readonly GiftSetSize[];

export const GIFT_PRESENTATION_KEYS = [
  'signature-box',
] as const satisfies readonly GiftPresentation[];

export const GIFT_STEP_IDS = [
  'occasion',
  'size',
  'fragrances',
  'message',
  'review',
] as const satisfies readonly GiftStepId[];

export const GIFT_BUILDER_TOTAL_STEPS = GIFT_STEP_IDS.length;

export const GIFT_BUILDER_STEPS: readonly GiftStepDescriptor[] = [
  {
    id: 'occasion',
    stepNumber: 1,
    code: '01',
    eyebrow: {
      ar: 'الخطوة الأولى · سياق الإهداء',
      en: 'Step I · Occasion & Gesture',
    },
    title: {
      ar: 'ما المناسبة التي تُهدي لأجلها؟',
      en: 'Which occasion guides this gesture?',
    },
    subtitle: {
      ar: 'نوائم مقترحات الدار العطرية ونبرة الإهداء مع طبيعة اللحظة ومقامها.',
      en: 'We align our house recommendations and dedication tone with the character of your occasion.',
    },
  },
  {
    id: 'size',
    stepNumber: 2,
    code: '02',
    eyebrow: {
      ar: 'الخطوة الثانية · تكوين الصندوق',
      en: 'Step II · Coffret Composition',
    },
    title: {
      ar: 'اختر حجم الإهداء العطري',
      en: 'Select the scale of your coffret',
    },
    subtitle: {
      ar: 'إهداء مفرد، أو ثنائية متناغمة، أو ثلاثية تجمع عوالم نجد وصحراء وليل ضمن صندوق رِواق الحجري المشمول مجاناً.',
      en: 'Compose a single signature flacon, a harmonious duo, or a three-creation house trilogy in our complimentary limestone coffret.',
    },
  },
  {
    id: 'fragrances',
    stepNumber: 3,
    code: '03',
    eyebrow: {
      ar: 'الخطوة الثالثة · انتقاء العطور والأحجام',
      en: 'Step III · Fragrance & Format Curation',
    },
    title: {
      ar: 'انتقِ العطور وأحجام الزجاجات لكل موضع',
      en: 'Curate the creations and bottle formats for each slot',
    },
    subtitle: {
      ar: 'اختر العطر وحجم الزجاجة المتوفر لكل موضع في الصندوق، مع احتساب السعر الفعلي المباشر دون أي رسوم إضافية.',
      en: 'Select an available creation and bottle format for every slot, with transparent live pricing equal to the exact sum of your chosen variants.',
    },
  },
  {
    id: 'message',
    stepNumber: 4,
    code: '04',
    eyebrow: {
      ar: 'الخطوة الرابعة · بطاقة الإهداء',
      en: 'Step IV · Personal Dedication',
    },
    title: {
      ar: 'أضف كلمة خاصة على بطاقة الكتّان والبرونز',
      en: 'Inscribe a personal note on the linen dedication card',
    },
    subtitle: {
      ar: 'تُرفق بطاقة رِواق المختومة بالبرونز مجاناً مع كل هدية. يمكنك كتابة إهدائك الخاص أو طلب البطاقة فارغة لكتابتها يدوياً.',
      en: 'Every gift includes a complimentary bronze-crested RWAQ linen card. Compose a personal dedication or include the card blank for handwritten presentation.',
    },
  },
  {
    id: 'review',
    stepNumber: 5,
    code: '05',
    eyebrow: {
      ar: 'الخطوة الخامسة · المراجعة والاعتماد',
      en: 'Step V · Atelier Review',
    },
    title: {
      ar: 'مراجعة تفاصيل الإهداء قبل الإضافة إلى الحقيبة',
      en: 'Review your curated gift before adding to the bag',
    },
    subtitle: {
      ar: 'تأكّد من العطور المختارة وأحجامها وبطاقة الإهداء وتفاصيل التسعير الشامل لضريبة القيمة المضافة ١٥٪.',
      en: 'Confirm your selected creations, bottle formats, dedication card, and transparent Saudi VAT-inclusive pricing.',
    },
  },
];

export const GIFT_OCCASIONS: readonly GiftOccasionDescriptor[] = [
  {
    id: 'birthday',
    code: '01',
    label: {
      ar: 'عيد ميلاد',
      en: 'Birthday',
    },
    subtitle: {
      ar: 'احتفاءٌ بعامٍ جديد بتوقيعٍ عطري يبقى في الذاكرة',
      en: 'Marking a personal milestone with a lasting olfactory signature',
    },
    editorialNote: {
      ar: 'تلائمها التوليفات المتفردة التي تجمع دفء العنبر النجدي أو إشراقة الورد الطائفي مع ثباتٍ طويل.',
      en: 'Suited to distinctive creations pairing warm Najdi amber or radiant Taif rose with enduring presence.',
    },
    preferredProductOccasions: ['signature', 'evening'],
    preferredFamilies: ['woody-amber', 'floral-musk', 'spiced-oriental'],
    suggestedCardMessages: [
      {
        ar: 'عامٌ جديد يليق بحضورك المتفرّد، وتوقيعٌ عطري يرافق أجمل أيامك.',
        en: 'Wishing you a year matched to the grace of your presence, accompanied by an enduring signature.',
      },
      {
        ar: 'كل عام وأنت في أبهى حضور؛ اخترتُ لك من رِواق عطراً يشبه أثرَك الجميل.',
        en: 'To another year of quiet distinction—curated for you from the house of RWAQ.',
      },
    ],
  },
  {
    id: 'wedding',
    code: '02',
    label: {
      ar: 'زفاف',
      en: 'Wedding',
    },
    subtitle: {
      ar: 'مراسم احتفالية فاخرة تليق بليالي العمر وبداياته',
      en: 'Ceremonial opulence crafted for unforgettable beginnings',
    },
    editorialNote: {
      ar: 'تبرز فيها توليفات العود المعتّق والورد الطائفي والمسك النقي ذات الطابع الاحتفالي المهيب.',
      en: 'Anchored by ceremonial aged oud, Damascene & Taif rose, and luminous skin musk.',
    },
    preferredProductOccasions: ['ceremonial', 'evening', 'majlis'],
    preferredFamilies: ['smoky-oud', 'floral-musk', 'woody-amber'],
    suggestedCardMessages: [
      {
        ar: 'بارك الله لكما وجمع بينكما في خير؛ عطرٌ يخلّد ذكرى هذه الليلة المباركة.',
        en: 'May your union be blessed with enduring harmony and unforgettable moments.',
      },
      {
        ar: 'لبدايةٍ تفيض بالسكينة والجمال، هديةٌ من دار رِواق تليق بمقام فرحتكما.',
        en: 'For a beginning filled with grace and serenity, a ceremonial gift from RWAQ.',
      },
    ],
  },
  {
    id: 'graduation',
    code: '03',
    label: {
      ar: 'تخرّج',
      en: 'Graduation',
    },
    subtitle: {
      ar: 'تقديرٌ للإنجاز وبداية فصلٍ جديد من التمكين والطموح',
      en: 'Honoring achievement and the threshold of a distinguished new chapter',
    },
    editorialNote: {
      ar: 'نوصي بالتوليفات ذات الحضور الواثق من الأخشاب المصقولة والزعفران والسوسن والجلد.',
      en: 'Recommended with poised, architectural compositions of saffron, iris, leather, and dry woods.',
    },
    preferredProductOccasions: ['signature', 'ceremonial'],
    preferredFamilies: ['leather-iris', 'woody-amber', 'spiced-oriental'],
    suggestedCardMessages: [
      {
        ar: 'مبارك هذا الإنجاز المستحق؛ خطوةٌ واثقة نحو مستقبلٍ يليق بطموحك.',
        en: 'Congratulations on a milestone earned with dedication—may your next chapter carry unmistakable presence.',
      },
      {
        ar: 'فخورون بما حققته اليوم، وهذا تذكارٌ عطري يرافق انطلاقتك القادمة.',
        en: 'Proud of all you have accomplished today; a signature scent for the journey ahead.',
      },
    ],
  },
  {
    id: 'hospitality',
    code: '04',
    label: {
      ar: 'ضيافة',
      en: 'Hospitality',
    },
    subtitle: {
      ar: 'حفاوة البيت السعودي الأصيل وكرم الاستقبال في المجالس',
      en: 'The noble Saudi tradition of generosity, majlis welcoming, and warmth',
    },
    editorialNote: {
      ar: 'تتناغم معها روائح الدخون واللبان الحوجري والهيل والعود والقهوة السعودية.',
      en: 'Rooted in sacred Hojari frankincense, roasted cardamom, smoky oud, and warm amber.',
    },
    preferredProductOccasions: ['majlis', 'ceremonial', 'evening'],
    preferredFamilies: ['incense-resinous', 'smoky-oud', 'spiced-oriental'],
    suggestedCardMessages: [
      {
        ar: 'أهلاً بدارٍ يعمّرها الكرم وحسن اللقاء؛ هدية محبة وتقدير لمجلسكم العامر.',
        en: 'In gratitude for your generous hospitality and the warmth of your home.',
      },
      {
        ar: 'يبقى أثر الضيافة الكريمة طويلاً في النفس، كما يبقى العطر الأصيل في المكان.',
        en: 'True hospitality lingers in memory just as noble fragrance lingers in the air.',
      },
    ],
  },
  {
    id: 'thank-you',
    code: '05',
    label: {
      ar: 'شكراً',
      en: 'Thank You',
    },
    subtitle: {
      ar: 'امتنانٌ هادئ يعبّر عن التقدير بلغةٍ أبلغ من الكلمات',
      en: 'A gesture of quiet gratitude expressed with lasting refinement',
    },
    editorialNote: {
      ar: 'تناسبها العطور المتزنة ذات الطابع الدافئ والحميمي من العنبر والمسك والأخشاب الناعمة.',
      en: 'Ideally paired with balanced, comforting compositions of white amber, cashmere woods, and musk.',
    },
    preferredProductOccasions: ['signature', 'intimate'],
    preferredFamilies: ['woody-amber', 'floral-musk', 'incense-resinous'],
    suggestedCardMessages: [
      {
        ar: 'شكراً لموقفك النبيل وأثرك الطيب؛ هديةٌ بسيطة تعبّر عن عميق الامتنان.',
        en: 'With sincere appreciation for your kindness and thoughtful generosity.',
      },
      {
        ar: 'بعض المعروف لا توفيه الكلمات؛ عربون تقديرٍ وامتنان من القلب.',
        en: 'A token of deep gratitude for a gesture that will always be remembered.',
      },
    ],
  },
  {
    id: 'corporate',
    code: '06',
    label: {
      ar: 'هدية أعمال',
      en: 'Corporate Gift',
    },
    subtitle: {
      ar: 'إهداءٌ رسمي رفيع المستوى للشركاء وكبار الشخصيات',
      en: 'Executive protocol and diplomatic gifting of quiet authority',
    },
    editorialNote: {
      ar: 'ترتكز على العطور الرسمية الوقورة التي توازن بين الفخامة السعودية المعاصرة والرصانة المهنية.',
      en: 'Centered on dignified, unisex compositions balancing contemporary Saudi luxury with executive poise.',
    },
    preferredProductOccasions: ['ceremonial', 'majlis', 'signature'],
    preferredFamilies: ['woody-amber', 'leather-iris', 'smoky-oud'],
    suggestedCardMessages: [
      {
        ar: 'مع خالص التقدير لشراكتكم الكريمة وتطلعنا إلى مزيدٍ من النجاح المشترك.',
        en: 'With high regard for our partnership and continued shared excellence.',
      },
      {
        ar: 'تقديراً لثقتكم وجهودكم المتميزة، نهديكم هذا الإصدار المختار من دار رِواق.',
        en: 'In recognition of your distinguished leadership and valued collaboration.',
      },
    ],
  },
  {
    id: 'just-because',
    code: '07',
    label: {
      ar: 'بلا مناسبة',
      en: 'Just Because',
    },
    subtitle: {
      ar: 'لأن أجمل الهدايا هي تلك التي تأتي دون انتظار موعد',
      en: 'Because the most memorable gestures require no calendar occasion',
    },
    editorialNote: {
      ar: 'حرية كاملة لانتقاء العطر الأقرب إلى ذائقة من تحب من بين مجموعات نجد وصحراء وليل.',
      en: 'Complete freedom to curate an intimate personal discovery across Najd, Sahra, and Layl.',
    },
    preferredProductOccasions: ['intimate', 'signature', 'evening'],
    preferredFamilies: ['floral-musk', 'woody-amber', 'leather-iris'],
    suggestedCardMessages: [
      {
        ar: 'خطرتَ على البال، فأحببتُ أن يرافقك عطرٌ يشبه حضورك الهادئ.',
        en: 'Thought of you today and wished to share a scent that speaks with quiet beauty.',
      },
      {
        ar: 'هديةٌ بلا مناسبة، لأن التقدير الحقيقي لا ينتظر يوماً محدداً.',
        en: 'No occasion required—simply a quiet gesture of affection and thought.',
      },
    ],
  },
];

export const GIFT_SET_SIZE_DESCRIPTORS: readonly GiftSetSizeDescriptor[] = [
  {
    size: 1,
    code: 'I',
    title: {
      ar: 'إهداء مفرد فاخر',
      en: 'Solo Signature Creation',
    },
    subtitle: {
      ar: 'ابتكار عطري واحد في صندوق الحجر الجيري',
      en: 'One fragrance flacon in the limestone coffret',
    },
    description: {
      ar: 'مثالي عندما تعرف العطر المفضّل للمُهدى إليه أو ترغب في تقديم توقيعٍ عطري واضح ومباشر.',
      en: 'Ideal when gifting a known signature or presenting a singular, focused olfactory statement.',
    },
    slotCountLabel: {
      ar: 'زجاجة واحدة (١)',
      en: '1 Fragrance Flacon',
    },
  },
  {
    size: 2,
    code: 'II',
    title: {
      ar: 'ثنائية الرواق',
      en: 'Duo Harmony Coffret',
    },
    subtitle: {
      ar: 'ابتكاران عطريان بتناغم نهاري ومسائي',
      en: 'Two complementary creations for day & evening ritual',
    },
    description: {
      ar: 'توليفة متوازنة تجمع بين عطرين — كإهداء يجمع بين إشراقة الحضور اليومي وعمق السمر المسائي أو التطيّب الطبقي.',
      en: 'A balanced pairing of two creations—crafted for layering or transitioning from daytime poise to evening depth.',
    },
    slotCountLabel: {
      ar: 'زجاجتان عطريتان (٢)',
      en: '2 Fragrance Flacons',
    },
  },
  {
    size: 3,
    code: 'III',
    title: {
      ar: 'ثلاثية الدار',
      en: 'Trilogy House Coffret',
    },
    subtitle: {
      ar: 'ثلاثة ابتكارات تجسّد خزانة عطرية متكاملة',
      en: 'Three creations forming a complete olfactory wardrobe',
    },
    description: {
      ar: 'أرقى درجات الإهداء في دار رِواق؛ ثلاث زجاجات تتيح الجمع بين مجموعات نجد وصحراء وليل في صندوقٍ معماري واحد.',
      en: 'Our most ceremonial presentation—three flacons uniting the worlds of Najd, Sahra, and Layl in one architectural coffret.',
    },
    slotCountLabel: {
      ar: 'ثلاث زجاجات عطرية (٣)',
      en: '3 Fragrance Flacons',
    },
  },
];

export const SIGNATURE_BOX_PRESENTATION: GiftPresentationDescriptor = {
  id: 'signature-box',
  name: {
    ar: 'صندوق رِواق الحجري والبرونزي',
    en: 'RWAQ Signature Limestone & Bronze Coffret',
  },
  subtitle: {
    ar: 'تغليف الدار المعماري — مشمول مجاناً ضمن مراسم الإهداء',
    en: 'Architectural House Presentation — Complimentary with every gift',
  },
  description: {
    ar: 'صندوقٌ مكسوّ بملمس الحجر الجيري النجدي الدافئ ومزدان بختم رِواق البرونزي المصقول، مع بطانة داخلية مصممة لاحتضان الزجاجات المختارة وبطاقة إهداء من الكتّان الفاخر.',
    en: 'Crafted with a warm Najdi limestone-textured exterior, brushed bronze house crest, custom-fitted interior cradle, and a heavy cream-linen dedication card.',
  },
  complimentaryNote: {
    ar: 'مشمول مجاناً — تدفع فقط قيمة العطور المختارة',
    en: 'Complimentary — You pay only the exact price of your selected fragrances',
  },
  details: [
    {
      ar: 'صندوق خارجي بملمس الحجر الجيري وختم البرونز',
      en: 'Limestone-textured architectural box with bronze seal',
    },
    {
      ar: 'حشوة داخلية مخصصة لتثبيت زجاجة أو زجاجتين أو ثلاث زجاجات',
      en: 'Custom interior cradle fitted to 1, 2, or 3 flacons',
    },
    {
      ar: 'بطاقة إهداء من الكتّان الفاخر مع ظرف مختوم',
      en: 'Cream-linen dedication card with wax-inspired bronze crest envelope',
    },
  ],
};

export function getGiftOccasionDescriptor(
  occasion: GiftOccasion | null | undefined
): GiftOccasionDescriptor | null {
  if (!occasion) return null;
  return GIFT_OCCASIONS.find((item) => item.id === occasion) ?? null;
}

export function getGiftSetSizeDescriptor(
  setSize: GiftSetSize | null | undefined
): GiftSetSizeDescriptor | null {
  if (!setSize) return null;
  return GIFT_SET_SIZE_DESCRIPTORS.find((item) => item.size === setSize) ?? null;
}
