import type { Collection } from '@/types';

export const SEED_COLLECTIONS: Collection[] = [
  {
    id: 'col-najd',
    slug: 'najd',
    romanCode: 'I',
    name: {
      ar: 'نَجد',
      en: 'NAJD',
    },
    tagline: {
      ar: 'دفء الهضبة وهيبة المعمار النجدي عند الأصيل',
      en: 'Architectural warmth of the central plateau at dusk',
    },
    accordSummary: {
      ar: 'أخشاب دافئة · عنبر صخري · زعفران أحمر',
      en: 'Warm Woods · Rock Amber · Red Saffron',
    },
    editorialDescription: {
      ar: 'تستلهم مجموعة نَجد حضورها من التباين النبيل بين صخور طويق الدافئة ونسمات المساء الباردة. تلتقي فيها خيوط الزعفران المعتّق مع خشب الأرز والعنبر الجاف في توازنٍ يجمع الوقار بالحميمية.',
      en: 'Inspired by the noble contrast of sun-warmed limestone and cool evening air across the central plateau. Aged saffron threads meet dry cedarwood and golden amber in a study of quiet authority.',
    },
    originInspiration: {
      ar: 'الدرعية وهضبة نجد · المملكة العربية السعودية',
      en: 'Diriyah & The Najd Plateau · Saudi Arabia',
    },
    image: {
      url: '/images/rwaq/collection_najd_amber_1790732060898.jpg',
      alt: {
        ar: 'زجاجة عطر من مجموعة نجد على حجر الترافرتين مع خيوط الزعفران وخشب الأرز',
        en: 'Najd collection amber perfume flacon on raw travertine stone with saffron threads and cedarwood',
      },
      aspectRatio: '3:4',
    },
    featuredProductSlugs: [
      'sara-extrait',
      'maqam-saffron',
      'sidr-amber',
      'rihab-vetiver',
      'mihrab-sandalwood',
      'ahd-leather',
    ],
    sortOrder: 1,
  },
  {
    id: 'col-sahra',
    slug: 'sahra',
    romanCode: 'II',
    name: {
      ar: 'صَحراء',
      en: 'SAHRA',
    },
    tagline: {
      ar: 'أفق الرمال الممتد ودخان العود المعتّق',
      en: 'Untamed horizons of charred agarwood and saddle leather',
    },
    accordSummary: {
      ar: 'جلد مصقول · دخان اللبان · عود قديم',
      en: 'Burnished Leather · Frankincense Smoke · Aged Oud',
    },
    editorialDescription: {
      ar: 'تحيةٌ لصمت الصحراء المهيب حين تنطفئ الجمار ويبقى أثر البخور عالقاً في العباءة. توليفة عميقة من العود الكمبودي واللبان الحوجري والجلد المدبوغ، صُممت لمن يترك أثراً لا يُنسى.',
      en: 'An ode to the vast desert silence after the embers fade and incense clings to woven wool. Resinous agarwood, Hojari frankincense, and supple leather crafted for commanding presence.',
    },
    originInspiration: {
      ar: 'الربع الخالي ورمال الدهناء · المملكة العربية السعودية',
      en: 'Rub’ al Khali & Dahna Sands · Saudi Arabia',
    },
    image: {
      url: '/images/rwaq/collection_sahra_oud_1790732070469.jpg',
      alt: {
        ar: 'زجاجة عطر صحراء الداكنة بجانب رقائق العود الطبيعي والجلد ورمال الصحراء',
        en: 'Sahra dark glass perfume flacon beside raw agarwood oud chips, burnished leather, and desert sand',
      },
      aspectRatio: '4:3',
    },
    featuredProductSlugs: [
      'athar-oud',
      'zill-smoke',
      'jamr-embers',
      'washm-leather',
      'sarab-resins',
      'raml-amber',
    ],
    sortOrder: 2,
  },
  {
    id: 'col-layl',
    slug: 'layl',
    romanCode: 'III',
    name: {
      ar: 'لَيل',
      en: 'LAYL',
    },
    tagline: {
      ar: 'سكينة السمر وهمس الورد الطائفي تحت النجوم',
      en: 'Nocturnal intimacy of Taif rose and dark velvet musk',
    },
    accordSummary: {
      ar: 'مسك أبيض معتّق · ورد طائفي · تين داكن',
      en: 'Aged White Musk · Taif Rose · Dark Fig',
    },
    editorialDescription: {
      ar: 'تُعبّر مجموعة لَيل عن الساعات المتأخرة التي تهدأ فيها المدينة وتصفو فيها الحواس. يمتزج الورد الطائفي المقطّر مع التين الأسود والمسك الصافي ليمنح حضوراً مخملياً قريباً من الروح.',
      en: 'Layl captures the unhurried nocturnal hours when the senses sharpen. First-harvest Taif rose absolute intertwines with dark fig nectar and clean skin musk for an intimate, magnetic trail.',
    },
    originInspiration: {
      ar: 'مرتفعات الطائف وسماء العُلا الليلية · المملكة العربية السعودية',
      en: 'Taif Highlands & AlUla Night Skies · Saudi Arabia',
    },
    image: {
      url: '/images/rwaq/collection_layl_musk_1790732079960.jpg',
      alt: {
        ar: 'زجاجة عطر ليل على حجر البازلت الداكن مع بتلات الورد الطائفي والتين والمسك',
        en: 'Layl smoked glass perfume bottle on honed basalt stone with dark Taif rose petals and fig',
      },
      aspectRatio: '3:4',
    },
    featuredProductSlugs: [
      'wajd-nocturne',
      'sukoon-musk',
      'nafas-jasmine',
      'hala-ambergris',
      'sahar-rose-oud',
      'ghasaq-incense',
    ],
    sortOrder: 3,
  },
];
