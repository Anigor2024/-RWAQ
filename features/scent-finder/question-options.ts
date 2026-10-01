import type {
  GenderPositioning,
  LocalizedString,
  LongevityLevel,
  OccasionSuitability,
  OlfactoryFamilyKey,
  ProjectionLevel,
  SeasonSuitability,
} from '@/types';
import type {
  ScentFinderAnswerState,
  ScentFinderQuestionId,
  ScentMaterialKey,
  ScentPresenceArchetype,
  ScentQuestionChoice,
} from './types';

export const SCENT_FINDER_TOTAL_STEPS = 7;
export const MAX_MATERIAL_SELECTIONS = 3;

export const SCENT_QUESTION_IDS = [
  'presence',
  'materials',
  'family',
  'occasion',
  'season',
  'projection',
  'longevity',
] as const satisfies readonly ScentFinderQuestionId[];

export const SCENT_PRESENCE_KEYS = [
  'quiet-intimate',
  'warm-magnetic',
  'deep-mysterious',
  'refined-ceremonial',
  'radiant-expressive',
] as const satisfies readonly ScentPresenceArchetype[];

export const SCENT_MATERIAL_KEYS = [
  'oud',
  'taif-rose',
  'saffron',
  'frankincense',
  'musk',
  'amber',
  'leather',
  'iris',
  'sandalwood',
  'coffee-spice',
] as const satisfies readonly ScentMaterialKey[];

export const DEFAULT_SCENT_FINDER_ANSWERS: ScentFinderAnswerState = {
  materials: [],
  character: 'unisex',
};

export const PRESENCE_CHOICES: readonly ScentQuestionChoice<ScentPresenceArchetype>[] =
  [
    {
      value: 'quiet-intimate',
      code: 'I',
      label: {
        ar: 'هادئ وحميمي',
        en: 'Quiet & Intimate',
      },
      subtitle: {
        ar: 'حضورٌ قريب من البشرة يهمس بالسكينة والنقاء دون ضجيج.',
        en: 'Close to the skin — composed with serene clarity and quiet confidence.',
      },
      sensoryCue: {
        ar: 'حجر بازلت بارد · كتان نقي · ضوء الفجر',
        en: 'Honed Basalt · Pure Linen · Dawn Light',
      },
    },
    {
      value: 'warm-magnetic',
      code: 'II',
      label: {
        ar: 'دافئ وجاذب',
        en: 'Warm & Magnetic',
      },
      subtitle: {
        ar: 'هالةٌ غنية تفيض بدفء العنبر والتوابل المشرقة والأخشاب.',
        en: 'An enveloping aura of golden spices, sunlit woods, and warm rock amber.',
      },
      sensoryCue: {
        ar: 'حجر ترافرتين دافئ · خيوط زعفران · شمس الأصيل',
        en: 'Warm Travertine · Crimson Saffron · Late Afternoon Sun',
      },
    },
    {
      value: 'deep-mysterious',
      code: 'III',
      label: {
        ar: 'عميق وغامض',
        en: 'Deep & Mysterious',
      },
      subtitle: {
        ar: 'عمقٌ ليليّ مهيب يتشكّل من العود المدخّن والراتنجات والجلد.',
        en: 'Nocturnal gravitas shaped by smoked agarwood, desert resins, and dark leather.',
      },
      sensoryCue: {
        ar: 'جمار الصحراء · دخان اللبان · جلد مصقول',
        en: 'Desert Embers · Incense Smoke · Burnished Leather',
      },
    },
    {
      value: 'refined-ceremonial',
      code: 'IV',
      label: {
        ar: 'مهيب ورسمي',
        en: 'Refined & Ceremonial',
      },
      subtitle: {
        ar: 'حضورٌ معماري موقّر يليق بالمجالس الكبرى والمراسم الرفيعة.',
        en: 'Architectural poise conceived for formal protocol, hospitality, and the Majlis.',
      },
      sensoryCue: {
        ar: 'أروقة الدرعية · عود ملكي · برونز مصقول',
        en: 'Najdi Colonnades · Royal Agarwood · Brushed Bronze',
      },
    },
    {
      value: 'radiant-expressive',
      code: 'V',
      label: {
        ar: 'مشرق ومعبّر',
        en: 'Radiant & Expressive',
      },
      subtitle: {
        ar: 'توازنٌ معاصر يجمع إشراقة الافتتاحية وعمق القاعدة المخملية.',
        en: 'Luminous modern contrast balancing radiant florals or iris with velvet depth.',
      },
      sensoryCue: {
        ar: 'ندى المرتفعات · ورد طائفي · مسك مخملي',
        en: 'Highland Dew · Taif Rose · Velvet Skin Musk',
      },
    },
  ];

export const MATERIAL_CHOICES: readonly ScentQuestionChoice<ScentMaterialKey>[] =
  [
    {
      value: 'oud',
      code: '01',
      label: {
        ar: 'العود المعتّق',
        en: 'Aged Agarwood (Oud)',
      },
      subtitle: {
        ar: 'عمق خشبي راتنجي دافئ ومصقول يمنح العطر هيبةً وثباتاً.',
        en: 'Resinous dark wood polished with modern restraint and enduring gravitas.',
      },
      sensoryCue: {
        ar: 'خشبي داكن · راتنجي · مهيب',
        en: 'Dark Woody · Resinous · Commanding',
      },
    },
    {
      value: 'taif-rose',
      code: '02',
      label: {
        ar: 'الورد الطائفي',
        en: 'First-Harvest Taif Rose',
      },
      subtitle: {
        ar: 'إشراقة ورد الجبال في قطفته الأولى ممزوجةً بعمق مخملي.',
        en: 'Luminous mountain rose harvested at dawn with rich velvet tension.',
      },
      sensoryCue: {
        ar: 'زهري ندي · مخملي · مشرق',
        en: 'Dewy Floral · Velvet · Radiant',
      },
    },
    {
      value: 'saffron',
      code: '03',
      label: {
        ar: 'الزعفران الأحمر',
        en: 'Crimson Saffron',
      },
      subtitle: {
        ar: 'ذهب الصحراء الأحمر؛ توابل دافئة ذات مسحة جلدية نبيلة.',
        en: 'Golden desert spice with a warm, subtly leathery ceremonial glow.',
      },
      sensoryCue: {
        ar: 'تابلي دافئ · ذهبي · جلدي ناعم',
        en: 'Warm Spice · Golden · Soft Leathery',
      },
    },
    {
      value: 'frankincense',
      code: '04',
      label: {
        ar: 'اللبان الحوجري والمرّ',
        en: 'Hojari Frankincense & Myrrh',
      },
      subtitle: {
        ar: 'أثر الدخان العطري النقي والراتنجات البلسمية الهادئة.',
        en: 'Translucent incense smoke and sacred desert resins with mineral clarity.',
      },
      sensoryCue: {
        ar: 'بلسمي · دخاني شفاف · معدني دافئ',
        en: 'Balsamic · Translucent Smoke · Mineral',
      },
    },
    {
      value: 'musk',
      code: '05',
      label: {
        ar: 'المسك المخملي',
        en: 'Velvet Skin Musk',
      },
      subtitle: {
        ar: 'نقاءٌ ناعم يلتصق بالبشرة ويمنح العطر هالةً حميمية صافية.',
        en: 'Second-skin softness creating an intimate, luminous halo.',
      },
      sensoryCue: {
        ar: 'نقي · مخملي · قريب من البشرة',
        en: 'Pure · Velvety · Skin-Close',
      },
    },
    {
      value: 'amber',
      code: '06',
      label: {
        ar: 'العنبر الصخري واللابدانوم',
        en: 'Rock Amber & Labdanum',
      },
      subtitle: {
        ar: 'دفءٌ ذهبي عميق يستحضر حرارة الصخور النجدية عند الغروب.',
        en: 'Deep resinous golden warmth evoking sun-warmed Arabian stone.',
      },
      sensoryCue: {
        ar: 'ذهبي دافئ · راتنجي · غني',
        en: 'Golden Warmth · Resinous · Rich',
      },
    },
    {
      value: 'leather',
      code: '07',
      label: {
        ar: 'الجلد المصقول والشامواه',
        en: 'Burnished Leather & Suede',
      },
      subtitle: {
        ar: 'بصمة جلدية معاصرة تتراوح بين الشامواه الناعم والجلد المدخّن.',
        en: 'Tactile sophistication ranging from supple suede to smoky saddle leather.',
      },
      sensoryCue: {
        ar: 'جلدي مصقول · مدخّن · أنيق',
        en: 'Supple Suede · Smoked · Architectural',
      },
    },
    {
      value: 'iris',
      code: '08',
      label: {
        ar: 'السوسن الجاف (الأيرس)',
        en: 'Florentine Iris & Orris',
      },
      subtitle: {
        ar: 'ملمس بودري نبيل يمنح التركيبة رصانةً وأناقةً معمارية.',
        en: 'Silky, rooty orris butter lending cool, sculptural refinement.',
      },
      sensoryCue: {
        ar: 'بودري جاف · حريري · رصين',
        en: 'Dry Powdery · Silky · Sculptural',
      },
    },
    {
      value: 'sandalwood',
      code: '09',
      label: {
        ar: 'خشب الصندل والأرز',
        en: 'Sandalwood & Atlas Cedar',
      },
      subtitle: {
        ar: 'أخشابٌ كريمية وجافة تبني هيكل العطر بثباتٍ متزن.',
        en: 'Creamy sandalwood and dry cedarwood forming a calm architectural spine.',
      },
      sensoryCue: {
        ar: 'خشبي كريمي · جاف · متزن',
        en: 'Creamy Woods · Dry Cedar · Poised',
      },
    },
    {
      value: 'coffee-spice',
      code: '10',
      label: {
        ar: 'القهوة الشقراء والهيل',
        en: 'Arabian Coffee & Cardamom',
      },
      subtitle: {
        ar: 'إشراقة الهيل الأخضر والقهوة السعودية والتوابل الدافئة.',
        en: 'Crushed green cardamom, roasted blonde coffee, and warm Majlis spices.',
      },
      sensoryCue: {
        ar: 'هيل أخضر · قهوة محمصة · حفاوة',
        en: 'Green Cardamom · Roasted Coffee · Hospitality',
      },
    },
  ];

export const FAMILY_CHOICES: readonly ScentQuestionChoice<OlfactoryFamilyKey>[] =
  [
    {
      value: 'woody-amber',
      code: 'I',
      label: {
        ar: 'أخشاب وعنبر صخري',
        en: 'Woody Amber',
      },
      subtitle: {
        ar: 'تراكيب دافئة تجمع خشب الأرز والصندل بالعنبر الصخري والزعفران.',
        en: 'Sun-warmed cedar, sandalwood, and golden rock amber with architectural poise.',
      },
      sensoryCue: {
        ar: 'عالم نَجد · دفء الحجر الجيري',
        en: 'World of Najd · Sunlit Limestone Warmth',
      },
    },
    {
      value: 'smoky-oud',
      code: 'II',
      label: {
        ar: 'عود مدخّن وجلد',
        en: 'Smoky Oud & Leather',
      },
      subtitle: {
        ar: 'حضورٌ مهيب من العود المعتّق والجلد المدخّن والأخشاب الداكنة.',
        en: 'Commanding depth of aged agarwood, burnished leather, and charred woods.',
      },
      sensoryCue: {
        ar: 'عالم صَحراء · وهج الجمار والليل',
        en: 'World of Sahra · Twilight Embers & Depth',
      },
    },
    {
      value: 'floral-musk',
      code: 'III',
      label: {
        ar: 'ورد طائفي ومسك',
        en: 'Taif Rose & Floral Musk',
      },
      subtitle: {
        ar: 'توازنٌ مخملي بين الورد الطائفي والياسمين الليلي والمسك النقي.',
        en: 'Highland Taif rose and nocturnal florals resting on a veil of pure skin musk.',
      },
      sensoryCue: {
        ar: 'عالم لَيل · ندى المرتفعات والسكينة',
        en: 'World of Layl · Highland Dew & Stillness',
      },
    },
    {
      value: 'spiced-oriental',
      code: 'IV',
      label: {
        ar: 'توابل وقهوة شقراء',
        en: 'Spiced Oriental',
      },
      subtitle: {
        ar: 'حفاوة الهيل الأخضر والزعفران والقهوة المحمّصة فوق قاعدة عنبرية.',
        en: 'Radiant cardamom, crimson saffron, and roasted coffee over warm amber resins.',
      },
      sensoryCue: {
        ar: 'عالم نَجد · كرم المجالس السعودية',
        en: 'World of Najd · Ceremonial Majlis Warmth',
      },
    },
    {
      value: 'incense-resinous',
      code: 'V',
      label: {
        ar: 'لبان حوجري وراتنجات',
        en: 'Incense & Resins',
      },
      subtitle: {
        ar: 'دخان اللبان النقي والمرّ العربي والراتنجات الصحراوية العتيقة.',
        en: 'Sacred Hojari frankincense, golden myrrh, and translucent desert smoke.',
      },
      sensoryCue: {
        ar: 'عالم صَحراء · الدخان العطري في الأروقة',
        en: 'World of Sahra · Sacred Colonnade Smoke',
      },
    },
    {
      value: 'leather-iris',
      code: 'VI',
      label: {
        ar: 'جلد مصقول وسوسن',
        en: 'Suede Leather & Iris',
      },
      subtitle: {
        ar: 'حوارٌ معاصر بين نعومة السوسن البودري وعمق الجلد المصقول.',
        en: 'A contemporary dialogue between silky orris butter and supple dark suede.',
      },
      sensoryCue: {
        ar: 'عالم لَيل · أناقة البازلت المصقول',
        en: 'World of Layl · Honed Basalt Elegance',
      },
    },
  ];

export const OCCASION_CHOICES: readonly ScentQuestionChoice<OccasionSuitability>[] =
  [
    {
      value: 'signature',
      code: 'I',
      label: {
        ar: 'توقيع يومي راقٍ',
        en: 'Daily Signature',
      },
      subtitle: {
        ar: 'حضورٌ متزن يرافقك في العمل واللقاءات اليومية بأناقةٍ واثقة.',
        en: 'A poised, versatile companion that defines your everyday presence.',
      },
      sensoryCue: {
        ar: 'حضور يومي · اتزان · أناقة هادئة',
        en: 'Everyday Poise · Balanced · Effortless',
      },
    },
    {
      value: 'majlis',
      code: 'II',
      label: {
        ar: 'المجالس والضيافة',
        en: 'The Majlis & Hospitality',
      },
      subtitle: {
        ar: 'نفحاتٌ دافئة من الزعفران والعود والهيل تليق بحفاوة اللقاء.',
        en: 'Warm, welcoming compositions crafted for gatherings and Saudi hospitality.',
      },
      sensoryCue: {
        ar: 'حفاوة · دفء التوابل · حضور رحب',
        en: 'Warm Hospitality · Spiced Woods · Generous',
      },
    },
    {
      value: 'evening',
      code: 'III',
      label: {
        ar: 'أمسيات خاصة',
        en: 'Evening Soirées',
      },
      subtitle: {
        ar: 'تراكيب آسرة تتكشف طبقاتها الغنية مع هدوء المساء والأضواء الخافتة.',
        en: 'Magnetic, multifaceted extraits that bloom after twilight.',
      },
      sensoryCue: {
        ar: 'سمر ليلي · جاذبية · عمق مخملي',
        en: 'After Dusk · Magnetic · Velvet Depth',
      },
    },
    {
      value: 'ceremonial',
      code: 'IV',
      label: {
        ar: 'مراسم ومناسبات رسمية',
        en: 'Ceremonial & Protocol',
      },
      subtitle: {
        ar: 'فخامة العود والراتنجات النبيلة للمناسبات الكبرى والمحافل الرسمية.',
        en: 'Regal agarwood and noble resins reserved for milestone occasions and protocol.',
      },
      sensoryCue: {
        ar: 'وقار رسمي · فخامة · أثر طويل',
        en: 'Formal Gravitas · Regal · Enduring Trail',
      },
    },
    {
      value: 'intimate',
      code: 'V',
      label: {
        ar: 'لقاءات حميمية هادئة',
        en: 'Intimate & Personal Moments',
      },
      subtitle: {
        ar: 'عطرٌ قريب للذات وللأوقات الخاصة التي تطلب السكينة والصفاء.',
        en: 'A close, contemplative scent for private hours and quiet reflection.',
      },
      sensoryCue: {
        ar: 'سكينة · خصوصية · دفء قريب',
        en: 'Stillness · Private Sanctuary · Skin-Warmth',
      },
    },
  ];

export const SEASON_CHOICES: readonly ScentQuestionChoice<SeasonSuitability>[] =
  [
    {
      value: 'all-season',
      code: 'I',
      label: {
        ar: 'جميع الفصول والأوقات',
        en: 'All Seasons & Climates',
      },
      subtitle: {
        ar: 'تركيبة متوازنة تتكيف بانسجام مع مختلف درجات الحرارة على مدار العام.',
        en: 'Architectural equilibrium designed to perform gracefully year-round.',
      },
      sensoryCue: {
        ar: 'مرونة عالية · اعتدال · طوال العام',
        en: 'Year-Round Equilibrium · Versatile',
      },
    },
    {
      value: 'autumn-winter',
      code: 'II',
      label: {
        ar: 'دفء الخريف والشتاء',
        en: 'Autumn & Winter Warmth',
      },
      subtitle: {
        ar: 'كثافة العود والعنبر والجلد التي تمنح الأجواء الباردة دفئاً مهيباً.',
        en: 'Rich resins, smoked woods, and spices that thrive in crisp, cool air.',
      },
      sensoryCue: {
        ar: 'ليالي الشتاء · كثافة راتنجية · دفء عميق',
        en: 'Crisp Desert Nights · Rich Resins · Deep Warmth',
      },
    },
    {
      value: 'spring-summer',
      code: 'III',
      label: {
        ar: 'إشراقة الربيع والصيف',
        en: 'Spring & Summer Radiance',
      },
      subtitle: {
        ar: 'نفحاتٌ متنفسة من الورد الطائفي والحمضيات والمسك تلائم الأجواء الدافئة.',
        en: 'Airy florals, luminous citrus-spice, and clean musk suited for warm days.',
      },
      sensoryCue: {
        ar: 'ضوء النهار · نضارة زهرية · خفة راقية',
        en: 'Sunlit Air · Luminous Florals · Breathable',
      },
    },
    {
      value: 'evening',
      code: 'IV',
      label: {
        ar: 'سكون الليل والأمسيات',
        en: 'Nocturnal & Evening Air',
      },
      subtitle: {
        ar: 'إصدارات صُمّمت لتزدهر تحت نسيم الليل وفي القاعات المبرّدة.',
        en: 'Crafted specifically for starlit evenings and climate-controlled interiors.',
      },
      sensoryCue: {
        ar: 'نسيم الليل · غموض · حضور مسائي',
        en: 'Starlit Breeze · Nocturnal · After-Hours',
      },
    },
  ];

export const PROJECTION_CHOICES: readonly ScentQuestionChoice<ProjectionLevel>[] =
  [
    {
      value: 'intimate',
      code: 'I',
      label: {
        ar: 'هالة قريبة وخاصة',
        en: 'Intimate & Skin-Close',
      },
      subtitle: {
        ar: 'يكتشفه من يقترب منك؛ حضورٌ هادئ يلتصق بالبشرة دون أن يفرض نفسه.',
        en: 'Discovered only up close — a private whisper that stays near the wearer.',
      },
      sensoryCue: {
        ar: 'مدى قريب · همس عطري · خصوصية',
        en: 'Close Radius · Subtle Whisper · Personal',
      },
    },
    {
      value: 'moderate',
      code: 'II',
      label: {
        ar: 'حضور متوازن وواثق',
        en: 'Balanced & Poised',
      },
      subtitle: {
        ar: 'فوحانٌ مدروس يرافق خطواتك بأناقة ويملأ محيطك القريب باتزان.',
        en: 'A measured, noticeable trail that accompanies your movement with grace.',
      },
      sensoryCue: {
        ar: 'مدى متوسط · اتزان معماري · حضور أنيق',
        en: 'Measured Sillage · Architectural Balance',
      },
    },
    {
      value: 'commanding',
      code: 'III',
      label: {
        ar: 'أثر لافت ومهيب',
        en: 'Commanding & Expansive',
      },
      subtitle: {
        ar: 'إسقاطٌ عطري واضح يسبق حضورك في الرواق ويترك بصمةً في المكان.',
        en: 'An unmistakable spatial presence that fills the colonnade and lingers in the air.',
      },
      sensoryCue: {
        ar: 'فوحان عالٍ · بصمة واضحة · حضور مهيب',
        en: 'Expansive Trail · Bold Signature · Resonant',
      },
    },
  ];

export const LONGEVITY_CHOICES: readonly ScentQuestionChoice<LongevityLevel>[] =
  [
    {
      value: 'moderate',
      code: 'I',
      label: {
        ar: 'ثبات متزن ومريح',
        en: 'Measured Endurance (6–8 Hours)',
      },
      subtitle: {
        ar: 'يتكشف بنعومة على مدار ساعات اللقاء ثم يستقر كأثرٍ خفيف ونقي.',
        en: 'Evolves gracefully through your engagement before settling into a clean skin veil.',
      },
      sensoryCue: {
        ar: '٦ – ٨ ساعات · تحوّل ناعم · خفة متزنة',
        en: '6–8 Hours · Graceful Evolution · Clean Dry-down',
      },
    },
    {
      value: 'long-lasting',
      code: 'II',
      label: {
        ar: 'ثبات طويل الأمد',
        en: 'Long-Lasting Presence (10–12 Hours)',
      },
      subtitle: {
        ar: 'تركيز إكسترايت يحافظ على وضوح النوتات الأساسية من الصباح حتى المساء.',
        en: 'High-concentration extrait maintaining structural clarity from day into night.',
      },
      sensoryCue: {
        ar: '١٠ – ١٢ ساعة · ثبات ممتد · وضوح عطري',
        en: '10–12 Hours · Full-Day Poise · Rich Heart',
      },
    },
    {
      value: 'eternal',
      code: 'III',
      label: {
        ar: 'ثبات فائق وعميق',
        en: 'Eternal Resinous Trail (14+ Hours)',
      },
      subtitle: {
        ar: 'خلاصات راتنجية وعود معتّق يدوم أثرها على البشرة والأنسجة ليومٍ كامل.',
        en: 'Deep agarwood, amber, and noble resins that endure on skin and fabric beyond a day.',
      },
      sensoryCue: {
        ar: '+١٤ ساعة · رسوخ راتنجي · أثر خالد',
        en: '14+ Hours · Deep Resinous Anchor · Unyielding',
      },
    },
  ];

export const CHARACTER_POSITIONING_OPTIONS: ReadonlyArray<{
  value: GenderPositioning;
  label: LocalizedString;
}> = [
  {
    value: 'unisex',
    label: {
      ar: 'توقيع متوازن للجنسين',
      en: 'Universal Unisex Signature',
    },
  },
  {
    value: 'masculine-leaning',
    label: {
      ar: 'طابع مهيب وجاف (يميل للخشونة الراقية)',
      en: 'Dry & Architectural (Masculine-Leaning)',
    },
  },
  {
    value: 'feminine-leaning',
    label: {
      ar: 'طابع زهري مخملي (يميل للنعومة المشرقة)',
      en: 'Luminous & Velvety (Feminine-Leaning)',
    },
  },
];
