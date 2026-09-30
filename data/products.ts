import { createMoney } from '@/lib/money';
import type { Product } from '@/types';

export const SEED_PRODUCTS: Product[] = [
  // ==========================================================================
  // COLLECTION I: نَجد | NAJD (6 Products)
  // ==========================================================================
  {
    id: 'prod-sara',
    slug: 'sara-extrait',
    sku: 'RWQ-NJD-001',
    name: {
      ar: 'سَرى',
      en: 'SARA',
    },
    subtitle: {
      ar: 'خلاصة عطرية · مسير الليل في نجد',
      en: 'Extrait de Parfum · Night Journey Across Najd',
    },
    shortDescription: {
      ar: 'افتتاحية مشرقة من الهيل والزعفران النجدي تستقر على قاعدة عميقة من العنبر الصخري وخشب الصندل المعتّق.',
      en: 'A luminous opening of green cardamom and red saffron settling into warm rock amber and aged sandalwood.',
    },
    editorialDescription: {
      ar: 'يُجسد عطر سَرى لحظة السكينة التي تعقب الغروب فوق هضبة نجد؛ حين تلتقي حرارة الحجر الجيري بنسمات المساء الأولى. تبدأ التركيبة بإشراقة الهيل الأخضر وخيوط الزعفران الأحمر، قبل أن تتدرج بهدوء نحو قلب خشبي من الأرز الأطلسي وجوزة الطيب، وتستقر أخيراً على قاعدة دافئة من العنبر الصخري وخشب الصندل.',
      en: 'SARA captures the poised stillness across the Najd plateau just after sundown, when sun-warmed limestone meets cool desert air. Green cardamom and crimson saffron ignite the opening before unfolding into Atlas cedarwood, wild orris, and a resonant foundation of rock amber and aged Mysore sandalwood.',
    },
    inspiration: {
      ar: 'أروقة الدرعية الحجرية عند الغسق ودفء الضيافة في المجالس النجدية.',
      en: 'Limestone colonnades of Diriyah at dusk and the ceremonial warmth of the Najdi majlis.',
    },
    applicationRitual: {
      ar: 'يوضع على نقاط النبض من مسافة قريبة ليسمح لتركيز الإكسترايت بالتفاعل مع حرارة البشرة بهدوء.',
      en: 'Mist onto pulse points and allow the 30% Extrait concentration to warm naturally without rubbing.',
    },
    whenToWear: {
      ar: 'توقيع يومي راقٍ ومثالي لأمسيات الخريف والشتاء والمناسبات الرسمية.',
      en: 'A year-round signature tailored for evening gatherings, formal occasions, and cool seasons.',
    },
    collectionId: 'col-najd',
    collectionSlug: 'najd',
    collectionName: {
      ar: 'نَجد',
      en: 'NAJD',
    },
    olfactoryFamilyKey: 'woody-amber',
    concentration: {
      ar: 'إكسترايت دي بارفان (30%)',
      en: 'Extrait de Parfum (30%)',
    },
    price: createMoney(680),
    image: {
      url: '/images/rwaq/products/rwaq_prod_najd_saffron_1790766970563.jpg',
      alt: {
        ar: 'زجاجة عطر سرى من رِواق مع خيوط الزعفران الأحمر والهيل على حجر الترافرتين النجدي',
        en: 'SARA Extrait de Parfum flacon by RWAQ with red saffron threads and cardamom on Najdi travertine',
      },
      aspectRatio: '3:4',
    },
    gallery: [
      {
        url: '/images/rwaq/products/rwaq_prod_najd_saffron_1790766970563.jpg',
        alt: {
          ar: 'زجاجة عطر سرى من رِواق مع خيوط الزعفران الأحمر والهيل',
          en: 'SARA Extrait de Parfum flacon by RWAQ with red saffron threads and cardamom',
        },
        aspectRatio: '3:4',
      },
      {
        url: '/images/rwaq/collection_najd_amber_1790732060898.jpg',
        alt: {
          ar: 'الإلهام المعماري والمكاني لمجموعة نجد من رِواق',
          en: 'Architectural and material inspiration for the RWAQ Najd Collection',
        },
        aspectRatio: '3:4',
      },
    ],
    notes: {
      top: [
        { ar: 'زعفران أحمر', en: 'Red Saffron' },
        { ar: 'هيل أخضر', en: 'Green Cardamom' },
        { ar: 'برغموت جاف', en: 'Dry Bergamot' },
      ],
      heart: [
        { ar: 'خشب الأرز الأطلسي', en: 'Atlas Cedarwood' },
        { ar: 'جوزة الطيب', en: 'Nutmeg' },
        { ar: 'سوسن بري', en: 'Wild Orris' },
      ],
      base: [
        { ar: 'عنبر صخري', en: 'Rock Amber' },
        { ar: 'خشب الصندل', en: 'Mysore Sandalwood' },
        { ar: 'نجيل الهند المدخن', en: 'Smoked Vetiver' },
      ],
      olfactoryFamily: {
        ar: 'عنبر خشبي تابل',
        en: 'Warm Spicy Woody Amber',
      },
    },
    accords: [
      {
        key: 'warm-spice',
        label: { ar: 'توابل دافئة', en: 'Warm Spice' },
        intensity: 92,
      },
      {
        key: 'amber',
        label: { ar: 'عنبر صخري', en: 'Rock Amber' },
        intensity: 88,
      },
      {
        key: 'woody',
        label: { ar: 'أخشاب جافة', en: 'Dry Woods' },
        intensity: 84,
      },
    ],
    ingredientHighlights: [
      {
        name: { ar: 'الزعفران الأحمر', en: 'Red Saffron' },
        origin: { ar: 'خيوط منتقاة من القطفة الأولى', en: 'First-harvest crimson stigmas' },
        description: {
          ar: 'يمنح الافتتاحية دفئاً ذهبياً ولمسة جلدية ناعمة.',
          en: 'Imparts a golden, leathery warmth to the opening accord.',
        },
      },
      {
        name: { ar: 'العنبر الصخري', en: 'Rock Amber' },
        origin: { ar: 'تركيبة راتنجية معتّقة', en: 'Aged resinous accord' },
        description: {
          ar: 'يثبّت العطر لساعات طويلة بهدوء وعمق.',
          en: 'Anchors the fragrance on skin with enduring, radiant depth.',
        },
      },
    ],
    variants: [
      {
        id: 'var-sara-100',
        sku: 'RWQ-NJD-001-100',
        sizeMl: 100,
        concentration: {
          ar: 'إكسترايت دي بارفان (30%)',
          en: 'Extrait de Parfum (30%)',
        },
        price: createMoney(680),
        inStock: true,
        stockQuantity: 42,
      },
      {
        id: 'var-sara-50',
        sku: 'RWQ-NJD-001-50',
        sizeMl: 50,
        concentration: {
          ar: 'إكسترايت دي بارفان (30%)',
          en: 'Extrait de Parfum (30%)',
        },
        price: createMoney(460),
        inStock: true,
        stockQuantity: 30,
      },
    ],
    genderPositioning: 'unisex',
    season: 'all-season',
    occasion: 'signature',
    longevity: 'eternal',
    projection: 'commanding',
    inStock: true,
    isNew: false,
    isBestSeller: true,
    isFeatured: true,
    createdAt: '2026-01-15T10:00:00.000Z',
    updatedAt: '2026-09-01T10:00:00.000Z',
  },
  {
    id: 'prod-maqam',
    slug: 'maqam-saffron',
    sku: 'RWQ-NJD-002',
    name: {
      ar: 'مَقام',
      en: 'MAQAM',
    },
    subtitle: {
      ar: 'بارفان أبسولو · القهوة السعودية والعود الملكي',
      en: 'Parfum Absolu · Roasted Cardamom Coffee & Royal Oud',
    },
    shortDescription: {
      ar: 'احتفاءٌ بكرم الضيافة السعودية؛ تحميص القهوة الشقراء مع الهيل والزعفران على قاعدة غنية من العود والعنبر.',
      en: 'A tribute to ceremonial Saudi hospitality: blonde roasted coffee, crushed cardamom, saffron, and royal oud.',
    },
    editorialDescription: {
      ar: 'يمثل عطر مَقام ذروة التركيز العطري في دار رِواق (35% بارفان أبسولو). يستحضر مراسم القهوة السعودية الشقراء الممزوجة بالهيل المطحون والزعفران، مع قلب دافئ من التمر المجدول والعنبر وقاعدة فاخرة من العود الملكي والفانيليا الدخانية.',
      en: 'MAQAM is RWAQ’s highest-concentration creation (35% Parfum Absolu). Inspired by ceremonial Saudi hospitality, blonde roasted coffee, crushed cardamom, and saffron unfold into Medjool date, amber, and royal aged oud.',
    },
    inspiration: {
      ar: 'مراسم القهوة السعودية والعود في المناسبات الكبرى.',
      en: 'Ceremonial Saudi coffee and oud rituals of high protocol.',
    },
    applicationRitual: {
      ar: 'بفضل تركيزه البالغ 35%، تكفي لمسة واحدة على نقاط النبض لحضورٍ يمتد لساعات طويلة.',
      en: 'Crafted at 35% Parfum Absolu concentration; a single application delivers extraordinary longevity.',
    },
    whenToWear: {
      ar: 'المناسبات الاحتفالية الكبرى والأمسيات الفاخرة.',
      en: 'Ceremonial occasions, formal receptions, and winter nights.',
    },
    collectionId: 'col-najd',
    collectionSlug: 'najd',
    collectionName: {
      ar: 'نَجد',
      en: 'NAJD',
    },
    olfactoryFamilyKey: 'spiced-oriental',
    concentration: {
      ar: 'بارفان أبسولو (35%)',
      en: 'Parfum Absolu (35%)',
    },
    price: createMoney(890),
    image: {
      url: '/images/rwaq/products/rwaq_prod_najd_coffee_1790766983637.jpg',
      alt: {
        ar: 'زجاجة عطر مقام من رِواق مع الهيل والقهوة السعودية الشقراء والعود الملكي',
        en: 'MAQAM Parfum Absolu flacon by RWAQ with cardamom pods, blonde Saudi coffee, and royal oud',
      },
      aspectRatio: '3:4',
    },
    gallery: [
      {
        url: '/images/rwaq/products/rwaq_prod_najd_coffee_1790766983637.jpg',
        alt: {
          ar: 'زجاجة عطر مقام من رِواق مع الهيل والقهوة السعودية الشقراء',
          en: 'MAQAM Parfum Absolu flacon by RWAQ with cardamom and Saudi coffee',
        },
        aspectRatio: '3:4',
      },
    ],
    notes: {
      top: [
        { ar: 'قهوة سعودية شقراء', en: 'Blonde Saudi Coffee Accord' },
        { ar: 'هيل مطحون', en: 'Crushed Cardamom Pods' },
        { ar: 'زعفران', en: 'Saffron' },
      ],
      heart: [
        { ar: 'تمر مجدول وعنبر', en: 'Medjool Date & Amber' },
        { ar: 'خشب الأرز', en: 'Dry Cedarwood' },
      ],
      base: [
        { ar: 'عود ملكي', en: 'Royal Aged Oud' },
        { ar: 'فانيليا دخانية', en: 'Smoked Madagascar Vanilla' },
        { ar: 'صندل دافئ', en: 'Warm Sandalwood' },
      ],
      olfactoryFamily: {
        ar: 'شرقي عنبري فاخر',
        en: 'Ceremonial Amber & Spiced Oud',
      },
    },
    accords: [
      {
        key: 'cardamom-coffee',
        label: { ar: 'قهوة شقراء وهيل', en: 'Cardamom & Blonde Coffee' },
        intensity: 94,
      },
      {
        key: 'royal-oud',
        label: { ar: 'عود ملكي', en: 'Royal Oud' },
        intensity: 91,
      },
      {
        key: 'amber-vanilla',
        label: { ar: 'عنبر وفانيليا دخانية', en: 'Amber & Smoked Vanilla' },
        intensity: 85,
      },
    ],
    ingredientHighlights: [
      {
        name: { ar: 'القهوة السعودية الشقراء والهيل', en: 'Blonde Saudi Coffee & Cardamom' },
        origin: { ar: 'توليفة مستوحاة من الضيافة السعودية', en: 'Ceremonial roasting accord' },
        description: {
          ar: 'افتتاحية دافئة ومبتكرة تمنح العطر هويته الفريدة.',
          en: 'An unmistakable aromatic opening celebrating Saudi generosity.',
        },
      },
    ],
    variants: [
      {
        id: 'var-maqam-100',
        sku: 'RWQ-NJD-002-100',
        sizeMl: 100,
        concentration: {
          ar: 'بارفان أبسولو (35%)',
          en: 'Parfum Absolu (35%)',
        },
        price: createMoney(890),
        inStock: true,
        stockQuantity: 15,
      },
      {
        id: 'var-maqam-50',
        sku: 'RWQ-NJD-002-50',
        sizeMl: 50,
        concentration: {
          ar: 'بارفان أبسولو (35%)',
          en: 'Parfum Absolu (35%)',
        },
        price: createMoney(620),
        inStock: true,
        stockQuantity: 22,
      },
    ],
    genderPositioning: 'unisex',
    season: 'autumn-winter',
    occasion: 'ceremonial',
    longevity: 'eternal',
    projection: 'commanding',
    inStock: true,
    isNew: false,
    isBestSeller: true,
    isFeatured: true,
    createdAt: '2026-02-18T10:00:00.000Z',
    updatedAt: '2026-09-01T10:00:00.000Z',
  },
  {
    id: 'prod-sidr',
    slug: 'sidr-amber',
    sku: 'RWQ-NJD-003',
    name: {
      ar: 'سِدر',
      en: 'SIDR',
    },
    subtitle: {
      ar: 'خلاصة عطرية · عسل السدر الجبلي وخشب الأرز',
      en: 'Extrait de Parfum · Royal Sidr Honey & Dry Cedar',
    },
    shortDescription: {
      ar: 'توازنٌ دافئ بين رحيق عسل السدر البري وأوراق السدر الجافة مع قاعدة نبيلة من خشب الأرز الأطلسي والعنبر.',
      en: 'Golden mountain Sidr honey and crushed jujube leaves balanced by dry Atlas cedarwood and resinous amber.',
    },
    editorialDescription: {
      ar: 'يحتفي عطر سِدر بأشجار السدر العريقة في أودية نجد؛ حيث تمتزج الحلاوة الطبيعية غير المتكلفة لعسل السدر البري مع جفاف الأخشاب العطرية وشمع العسل الطبيعي وحبوب التونكا المحمّصة.',
      en: 'SIDR pays homage to ancient jujube trees rooted in Najdi valleys. Unrefined golden Sidr honey and beeswax are tempered by dry cedarwood, toasted tonka bean, and smoky vetiver.',
    },
    inspiration: {
      ar: 'أودية طويق الخضراء بعد المطر ومواسم قطاف عسل السدر.',
      en: 'Wadis of Tuwaiq after desert rain and the seasonal harvest of wild Sidr honey.',
    },
    applicationRitual: {
      ar: 'يوضع على المعصمين والرقبة ليمنح هالة ذهبية دافئة ومريحة.',
      en: 'Apply to wrists and neck for a warm, golden-amber envelope.',
    },
    whenToWear: {
      ar: 'مثالي لأوقات المساء، الخريف، واللقاءات العائلية والودية.',
      en: 'Ideal for autumn afternoons, evening gatherings, and refined hospitality.',
    },
    collectionId: 'col-najd',
    collectionSlug: 'najd',
    collectionName: {
      ar: 'نَجد',
      en: 'NAJD',
    },
    olfactoryFamilyKey: 'woody-amber',
    concentration: {
      ar: 'إكسترايت دي بارفان (30%)',
      en: 'Extrait de Parfum (30%)',
    },
    price: createMoney(780),
    image: {
      url: '/images/rwaq/products/rwaq-prod-najd-sidr-honey.jpg',
      alt: {
        ar: 'زجاجة عطر سدر من رِواق مع عسل السدر الذهبي وخشب الأرز على حجر الترافرتين',
        en: 'SIDR Extrait de Parfum flacon by RWAQ with golden Sidr honey and Atlas cedarwood on travertine',
      },
      aspectRatio: '3:4',
    },
    gallery: [
      {
        url: '/images/rwaq/products/rwaq-prod-najd-sidr-honey.jpg',
        alt: {
          ar: 'زجاجة عطر سدر من رِواق',
          en: 'SIDR Extrait de Parfum flacon by RWAQ',
        },
        aspectRatio: '3:4',
      },
    ],
    notes: {
      top: [
        { ar: 'أوراق السدر الخضراء', en: 'Crushed Sidr Leaf' },
        { ar: 'برغموت صقلي', en: 'Sicilian Bergamot' },
      ],
      heart: [
        { ar: 'عسل السدر الجبلي', en: 'Royal Sidr Honey Accord' },
        { ar: 'شمع العسل الطبيعي', en: 'Raw Beeswax' },
        { ar: 'قرفة سيلانية', en: 'Ceylon Cinnamon Bark' },
      ],
      base: [
        { ar: 'خشب الأرز الجاف', en: 'Dry Atlas Cedarwood' },
        { ar: 'عنبر ذهبي', en: 'Golden Amber Resin' },
        { ar: 'حبوب التونكا المحمّصة', en: 'Toasted Tonka Bean' },
      ],
      olfactoryFamily: {
        ar: 'عنبر عسلي خشبي',
        en: 'Honeyed Woody Amber',
      },
    },
    accords: [
      {
        key: 'sidr-honey',
        label: { ar: 'عسل السدر', en: 'Sidr Honey' },
        intensity: 90,
      },
      {
        key: 'dry-cedar',
        label: { ar: 'خشب الأرز', en: 'Atlas Cedar' },
        intensity: 87,
      },
      {
        key: 'amber',
        label: { ar: 'عنبر دافئ', en: 'Warm Amber' },
        intensity: 83,
      },
    ],
    ingredientHighlights: [
      {
        name: { ar: 'عسل السدر البري', en: 'Wild Sidr Honey Accord' },
        origin: { ar: 'مستوحى من مناحل الأودية الجبلية', en: 'Mountain valley apiary inspiration' },
        description: {
          ar: 'يمنح غنىً عنبرياً دافئاً دون حلاوة مفرطة.',
          en: 'Delivers rich, ambered texture without cloying sweetness.',
        },
      },
    ],
    variants: [
      {
        id: 'var-sidr-100',
        sku: 'RWQ-NJD-003-100',
        sizeMl: 100,
        concentration: {
          ar: 'إكسترايت دي بارفان (30%)',
          en: 'Extrait de Parfum (30%)',
        },
        price: createMoney(780),
        inStock: true,
        stockQuantity: 24,
      },
      {
        id: 'var-sidr-75',
        sku: 'RWQ-NJD-003-75',
        sizeMl: 75,
        concentration: {
          ar: 'إكسترايت دي بارفان (30%)',
          en: 'Extrait de Parfum (30%)',
        },
        price: createMoney(640),
        inStock: true,
        stockQuantity: 18,
      },
    ],
    genderPositioning: 'unisex',
    season: 'autumn-winter',
    occasion: 'majlis',
    longevity: 'long-lasting',
    projection: 'moderate',
    inStock: true,
    isNew: true,
    isBestSeller: false,
    isFeatured: false,
    createdAt: '2026-05-12T10:00:00.000Z',
    updatedAt: '2026-09-01T10:00:00.000Z',
  },
  {
    id: 'prod-rihab',
    slug: 'rihab-vetiver',
    sku: 'RWQ-NJD-004',
    name: {
      ar: 'رِحاب',
      en: 'RIHAB',
    },
    subtitle: {
      ar: 'عطر مركز · نجيل الهند والهيل المحمّص',
      en: 'Eau de Parfum Intense · Smoked Vetiver & Roasted Cardamom',
    },
    shortDescription: {
      ar: 'اتساعٌ عطري منعش ودافئ في آن؛ يلتقي فيه الهيل الأخضر وورق التين مع جذور نجيل الهند وخشب الصندل.',
      en: 'Expansive and poised: crushed cardamom and fig leaf anchored by earthy vetiver root and sandalwood.',
    },
    editorialDescription: {
      ar: 'يعبّر عطر رِحاب عن اتساع الأفنية النجدية المفتوحة للسماء. يجمع بين حيوية الهيل والليمون المجفف وأوراق التين الخضراء، ثم يستقر على قاعدة رصينة من نجيل الهند الجاف وخشب الصندل.',
      en: 'RIHAB evokes open sky-lit courtyards framed by limestone arcades. Vibrant green cardamom and fig leaf transition seamlessly into dry vetiver root, cedar, and sandalwood.',
    },
    inspiration: {
      ar: 'الأفنية النجدية الواسعة وبساتين النخيل المحيطة بوادي حنيفة.',
      en: 'Sunlit courtyards and palm groves bordering Wadi Hanifah.',
    },
    applicationRitual: {
      ar: 'مثالي للاستخدام الصباحي والمسائي بفضل توازنه المنعش والخشبي.',
      en: 'Mist generously before stepping out; designed for effortless day-to-evening poise.',
    },
    whenToWear: {
      ar: 'توقيع نهاري ومسائي لجميع الفصول، خصوصاً الربيع والصيف.',
      en: 'Versatile across all seasons, especially radiant in spring and summer.',
    },
    collectionId: 'col-najd',
    collectionSlug: 'najd',
    collectionName: {
      ar: 'نَجد',
      en: 'NAJD',
    },
    olfactoryFamilyKey: 'spiced-oriental',
    concentration: {
      ar: 'أو دي بارفان إنتنس (25%)',
      en: 'Eau de Parfum Intense (25%)',
    },
    price: createMoney(650),
    image: {
      url: '/images/rwaq/collection_najd_amber_1790732060898.jpg',
      alt: {
        ar: 'زجاجة عطر رحاب من رِواق — مجموعة نجد',
        en: 'RIHAB Eau de Parfum Intense by RWAQ — Najd Collection',
      },
      aspectRatio: '3:4',
    },
    gallery: [
      {
        url: '/images/rwaq/collection_najd_amber_1790732060898.jpg',
        alt: {
          ar: 'زجاجة عطر رحاب من رِواق',
          en: 'RIHAB Eau de Parfum Intense by RWAQ',
        },
        aspectRatio: '3:4',
      },
    ],
    notes: {
      top: [
        { ar: 'هيل محمّص', en: 'Roasted Cardamom' },
        { ar: 'أوراق التين الأخضر', en: 'Green Fig Leaf' },
        { ar: 'ليمون عُماني مجفف', en: 'Dried Black Lime Zest' },
      ],
      heart: [
        { ar: 'إبرة الراعي العطرية', en: 'Aromatic Geranium' },
        { ar: 'كزبرة محمّصة', en: 'Toasted Coriander Seed' },
      ],
      base: [
        { ar: 'نجيل الهند الهايتي', en: 'Haitian Vetiver' },
        { ar: 'خشب الصندل', en: 'Sandalwood' },
        { ar: 'مسك خشبي', en: 'Woody Cashmeran' },
      ],
      olfactoryFamily: {
        ar: 'تابلي خشبي منعش',
        en: 'Aromatic Spiced Vetiver',
      },
    },
    accords: [
      {
        key: 'vetiver',
        label: { ar: 'نجيل الهند', en: 'Earthy Vetiver' },
        intensity: 90,
      },
      {
        key: 'cardamom',
        label: { ar: 'هيل وتوابل', en: 'Cardamom Spice' },
        intensity: 85,
      },
      {
        key: 'green-fig',
        label: { ar: 'أوراق خضراء', en: 'Green Fig Leaf' },
        intensity: 76,
      },
    ],
    ingredientHighlights: [
      {
        name: { ar: 'نجيل الهند الهايتي', en: 'Haitian Vetiver' },
        origin: { ar: 'جذور مقطّرة بالبخار', en: 'Steam-distilled roots' },
        description: {
          ar: 'يمنح ثباتاً ترابياً أنيقاً يوازن انتعاش التوابل.',
          en: 'Grounds the bright spice opening with refined earthy structure.',
        },
      },
    ],
    variants: [
      {
        id: 'var-rihab-100',
        sku: 'RWQ-NJD-004-100',
        sizeMl: 100,
        concentration: {
          ar: 'أو دي بارفان إنتنس (25%)',
          en: 'Eau de Parfum Intense (25%)',
        },
        price: createMoney(650),
        inStock: true,
        stockQuantity: 34,
      },
      {
        id: 'var-rihab-50',
        sku: 'RWQ-NJD-004-50',
        sizeMl: 50,
        concentration: {
          ar: 'أو دي بارفان إنتنس (25%)',
          en: 'Eau de Parfum Intense (25%)',
        },
        price: createMoney(450),
        inStock: true,
        stockQuantity: 40,
      },
    ],
    genderPositioning: 'masculine-leaning',
    season: 'spring-summer',
    occasion: 'signature',
    longevity: 'long-lasting',
    projection: 'moderate',
    inStock: true,
    isNew: false,
    isBestSeller: false,
    isFeatured: false,
    createdAt: '2026-03-04T10:00:00.000Z',
    updatedAt: '2026-09-01T10:00:00.000Z',
  },
  {
    id: 'prod-mihrab',
    slug: 'mihrab-sandalwood',
    sku: 'RWQ-NJD-005',
    name: {
      ar: 'مِحراب',
      en: 'MIHRAB',
    },
    subtitle: {
      ar: 'خلاصة عطرية · الصندل المعتّق واللبان النجدي',
      en: 'Extrait de Parfum · Aged Mysore Sandalwood & Olibanum',
    },
    shortDescription: {
      ar: 'سكينةٌ روحية من خشب الصندل الكريمي واللبان النقي مع لمسة دافئة من المرّ وجوزة الطيب.',
      en: 'Meditative warmth of creamy aged sandalwood, pure olibanum tears, and spiced myrrh.',
    },
    editorialDescription: {
      ar: 'يستحضر عطر مِحراب السكينة المعمارية في المساجد والأروقة الطينية القديمة؛ حيث يندمج خشب الصندل الغني مع اللبان الأبيض والمرّ ليصنع هالة من الوقار والهدوء العميق.',
      en: 'MIHRAB reflects the quiet reverence of traditional mud-brick and limestone sanctuaries, blending creamy sandalwood with white olibanum and warm myrrh.',
    },
    inspiration: {
      ar: 'العمارة النجدية التاريخية وضوء النوافذ الجصية المزخرفة.',
      en: 'Historic Najdi geometry and filtered light through carved gypsum screens.',
    },
    applicationRitual: {
      ar: 'يوضع بهدوء على نقاط النبض قبل المجالس وأوقات التأمل.',
      en: 'Apply to pulse points for a serene, meditative aura that endures.',
    },
    whenToWear: {
      ar: 'المناسبات الرسمية، صلوات الجمعة، والأمسيات الهادئة.',
      en: 'Ceremonial gatherings, cultural occasions, and tranquil evenings.',
    },
    collectionId: 'col-najd',
    collectionSlug: 'najd',
    collectionName: {
      ar: 'نَجد',
      en: 'NAJD',
    },
    olfactoryFamilyKey: 'incense-resinous',
    concentration: {
      ar: 'إكسترايت دي بارفان (30%)',
      en: 'Extrait de Parfum (30%)',
    },
    price: createMoney(850),
    image: {
      url: '/images/rwaq/product_flacon_studio_1790732089787.jpg',
      alt: {
        ar: 'زجاجة عطر محراب من رِواق على قاعدة من الحجر الجيري النجدي',
        en: 'MIHRAB Extrait de Parfum flacon by RWAQ on a Najdi limestone pedestal',
      },
      aspectRatio: '3:4',
    },
    gallery: [
      {
        url: '/images/rwaq/product_flacon_studio_1790732089787.jpg',
        alt: {
          ar: 'زجاجة عطر محراب من رِواق',
          en: 'MIHRAB Extrait de Parfum flacon by RWAQ',
        },
        aspectRatio: '3:4',
      },
    ],
    notes: {
      top: [
        { ar: 'لبان أبيض نقي', en: 'White Olibanum' },
        { ar: 'جوزة الطيب', en: 'Fresh Nutmeg' },
      ],
      heart: [
        { ar: 'خشب الصندل المعتّق', en: 'Aged Mysore Sandalwood' },
        { ar: 'مرّ حجازي', en: 'Warm Myrrh Resin' },
      ],
      base: [
        { ar: 'خشب الأرز', en: 'Cedarwood' },
        { ar: 'جاوي سيامي (بنزوين)', en: 'Siam Benzoin' },
        { ar: 'عنبر دافئ', en: 'Warm Amber' },
      ],
      olfactoryFamily: {
        ar: 'خشبي بلسمي وبخور',
        en: 'Sacred Sandalwood & Olibanum',
      },
    },
    accords: [
      {
        key: 'sandalwood',
        label: { ar: 'صندل معتّق', en: 'Creamy Sandalwood' },
        intensity: 95,
      },
      {
        key: 'olibanum',
        label: { ar: 'لبان أبيض', en: 'White Olibanum' },
        intensity: 88,
      },
      {
        key: 'benzoin',
        label: { ar: 'راتنج البلسم', en: 'Warm Benzoin' },
        intensity: 81,
      },
    ],
    ingredientHighlights: [
      {
        name: { ar: 'خشب الصندل المعتّق', en: 'Aged Sandalwood' },
        origin: { ar: 'لبّ الخشب العطري المعتّق', en: 'Heartwood distillation' },
        description: {
          ar: 'يمنح ملمساً مخملياً كريمياً يدوم طويلاً على البشرة.',
          en: 'Creates a velvety, meditative woodiness with exceptional skin longevity.',
        },
      },
    ],
    variants: [
      {
        id: 'var-mihrab-100',
        sku: 'RWQ-NJD-005-100',
        sizeMl: 100,
        concentration: {
          ar: 'إكسترايت دي بارفان (30%)',
          en: 'Extrait de Parfum (30%)',
        },
        price: createMoney(850),
        inStock: true,
        stockQuantity: 20,
      },
      {
        id: 'var-mihrab-75',
        sku: 'RWQ-NJD-005-75',
        sizeMl: 75,
        concentration: {
          ar: 'إكسترايت دي بارفان (30%)',
          en: 'Extrait de Parfum (30%)',
        },
        price: createMoney(710),
        inStock: true,
        stockQuantity: 16,
      },
    ],
    genderPositioning: 'unisex',
    season: 'all-season',
    occasion: 'ceremonial',
    longevity: 'eternal',
    projection: 'moderate',
    inStock: true,
    isNew: false,
    isBestSeller: true,
    isFeatured: false,
    createdAt: '2026-02-25T10:00:00.000Z',
    updatedAt: '2026-09-01T10:00:00.000Z',
  },
  {
    id: 'prod-ahd',
    slug: 'ahd-leather',
    sku: 'RWQ-NJD-006',
    name: {
      ar: 'عَهد',
      en: 'AHD',
    },
    subtitle: {
      ar: 'بارفان أبسولو · الزعفران الملكي والجلد النجدي',
      en: 'Parfum Absolu · Imperial Saffron & Supple Suede',
    },
    shortDescription: {
      ar: 'بصمةٌ من الفخامة الهادئة تجمع الزعفران الأحمر والجلد الناعم مع السوسن البري والعود الخفيف.',
      en: 'Quiet authority woven from imperial red saffron, supple suede leather, wild iris, and polished oud.',
    },
    editorialDescription: {
      ar: 'يمثل عطر عَهد وعداً بالأصالة والوقار؛ حيث تتناغم خيوط الزعفران الأحمر مع ملمس الجلد المدبوغ بنعومة وزبدة السوسن، مستقرةً على قاعدة غنية من العود النجدي والعنبر.',
      en: 'AHD is a study in noble leather and iris — uniting crimson saffron with supple suede, pallida iris root, and a refined dry-down of polished agarwood.',
    },
    inspiration: {
      ar: 'المخطوطات الجلدية النادرة وتفاصيل الأبواب النجدية المنحوتة.',
      en: 'Leather-bound manuscripts and carved wooden portals of historic Najd.',
    },
    applicationRitual: {
      ar: 'لمسة واحدة على المعصم تمنح حضوراً رسمياً واثقاً.',
      en: 'A single mist on the wrists delivers an unmistakable, tailored signature.',
    },
    whenToWear: {
      ar: 'الاجتماعات الرفيعة، المناسبات الرسمية، وأمسيات الشتاء.',
      en: 'Executive protocol, formal evenings, and autumn-winter wear.',
    },
    collectionId: 'col-najd',
    collectionSlug: 'najd',
    collectionName: {
      ar: 'نَجد',
      en: 'NAJD',
    },
    olfactoryFamilyKey: 'leather-iris',
    concentration: {
      ar: 'بارفان أبسولو (34%)',
      en: 'Parfum Absolu (34%)',
    },
    price: createMoney(920),
    image: {
      url: '/images/rwaq/products/rwaq_prod_najd_saffron_1790766970563.jpg',
      alt: {
        ar: 'زجاجة عطر عهد من رِواق مع الزعفران الأحمر والجلد الفاخر',
        en: 'AHD Parfum Absolu flacon by RWAQ with imperial saffron and suede',
      },
      aspectRatio: '3:4',
    },
    gallery: [
      {
        url: '/images/rwaq/products/rwaq_prod_najd_saffron_1790766970563.jpg',
        alt: {
          ar: 'زجاجة عطر عهد من رِواق',
          en: 'AHD Parfum Absolu flacon by RWAQ',
        },
        aspectRatio: '3:4',
      },
    ],
    notes: {
      top: [
        { ar: 'زعفران ملكي', en: 'Imperial Red Saffron' },
        { ar: 'فلفل أسود مدغشقري', en: 'Madagascar Black Pepper' },
      ],
      heart: [
        { ar: 'جلد سويدي ناعم', en: 'Supple Suede Accord' },
        { ar: 'سوسن فلورنسي', en: 'Florentine Orris' },
      ],
      base: [
        { ar: 'عود مصقول', en: 'Polished Agarwood' },
        { ar: 'عنبر جاف', en: 'Dry Ambergris Accord' },
        { ar: 'خشب الغاياك', en: 'Guaiac Wood' },
      ],
      olfactoryFamily: {
        ar: 'جلدي سوسني بالتوابل',
        en: 'Saffron Suede & Iris',
      },
    },
    accords: [
      {
        key: 'suede-leather',
        label: { ar: 'جلد سويدي', en: 'Supple Suede' },
        intensity: 93,
      },
      {
        key: 'saffron',
        label: { ar: 'زعفران ملكي', en: 'Imperial Saffron' },
        intensity: 89,
      },
      {
        key: 'orris',
        label: { ar: 'سوسن بري', en: 'Florentine Orris' },
        intensity: 82,
      },
    ],
    ingredientHighlights: [
      {
        name: { ar: 'الجلد السويدي والسوسن', en: 'Suede & Florentine Orris' },
        origin: { ar: 'تناغم جلدي مخملي', en: 'Velvet leather accord' },
        description: {
          ar: 'يوازن قوة الجلد بنعومة السوسن البودرية الراقية.',
          en: 'Softens leather authority with cool, powdery iris sophistication.',
        },
      },
    ],
    variants: [
      {
        id: 'var-ahd-100',
        sku: 'RWQ-NJD-006-100',
        sizeMl: 100,
        concentration: {
          ar: 'بارفان أبسولو (34%)',
          en: 'Parfum Absolu (34%)',
        },
        price: createMoney(920),
        inStock: true,
        stockQuantity: 14,
      },
      {
        id: 'var-ahd-50',
        sku: 'RWQ-NJD-006-50',
        sizeMl: 50,
        concentration: {
          ar: 'بارفان أبسولو (34%)',
          en: 'Parfum Absolu (34%)',
        },
        price: createMoney(650),
        inStock: true,
        stockQuantity: 19,
      },
    ],
    genderPositioning: 'masculine-leaning',
    season: 'autumn-winter',
    occasion: 'majlis',
    longevity: 'eternal',
    projection: 'commanding',
    inStock: true,
    isNew: true,
    isBestSeller: false,
    isFeatured: false,
    createdAt: '2026-06-10T10:00:00.000Z',
    updatedAt: '2026-09-01T10:00:00.000Z',
  },

  // ==========================================================================
  // COLLECTION II: صَحراء | SAHRA (6 Products)
  // ==========================================================================
  {
    id: 'prod-athar',
    slug: 'athar-oud',
    sku: 'RWQ-SHR-001',
    name: {
      ar: 'أثَر',
      en: 'ATHAR',
    },
    subtitle: {
      ar: 'خلاصة عطرية · حضور العود والجلد المصقول',
      en: 'Extrait de Parfum · Resinous Oud & Burnished Leather',
    },
    shortDescription: {
      ar: 'توقيع عطري مهيب يمزج العود المعتّق بدخان اللبان الحوجري ولمسة من الجلد الفاخر الذي يزداد عمقاً مع الوقت.',
      en: 'A commanding signature blending aged agarwood with Hojari frankincense smoke and burnished saddle leather.',
    },
    editorialDescription: {
      ar: 'صُمم عطر أثَر لمن يبحث عن حضورٍ مهيب لا يخطئه الحس. يفتتح بنفحات اللبان الحوجري النقي والفلفل الأسود، ليكشف عن قلب غني من الجلد المصقول والقريضة العنبرية، قبل أن يستقر على قاعدة عميقة من العود المعتّق وقطران البتولا.',
      en: 'ATHAR is composed for unmistakable presence. Translucent Hojari frankincense and black pepper give way to a heart of burnished leather and amber labdanum, settling into an enduring base of aged agarwood and smoky birch tar.',
    },
    inspiration: {
      ar: 'وهج الجمار الهادئ في صحراء الدهناء وأثر البخور العالق في العباءة.',
      en: 'Fading desert embers across the Dahna sands and incense smoke lingering on woven wool.',
    },
    applicationRitual: {
      ar: 'رشّة واحدة أو اثنتان على المعصمين والياقة تكفيان لمرافقتك طوال الأمسية.',
      en: 'One or two sprays on pulse points and collar provide a commanding trail throughout the evening.',
    },
    whenToWear: {
      ar: 'مثالي للمجالس الكبرى، الليالي الباردة، والمناسبات الرسمية.',
      en: 'Tailored for majlis gatherings, cooler evenings, and formal protocol occasions.',
    },
    collectionId: 'col-sahra',
    collectionSlug: 'sahra',
    collectionName: {
      ar: 'صَحراء',
      en: 'SAHRA',
    },
    olfactoryFamilyKey: 'smoky-oud',
    concentration: {
      ar: 'إكسترايت دي بارفان (32%)',
      en: 'Extrait de Parfum (32%)',
    },
    price: createMoney(820),
    image: {
      url: '/images/rwaq/products/rwaq_prod_sahra_incense_1790766997373.jpg',
      alt: {
        ar: 'زجاجة عطر أثر من رِواق بجانب رقائق العود المعتق ودخان اللبان الحوجري والجلد المصقول',
        en: 'ATHAR Extrait de Parfum flacon by RWAQ beside aged agarwood chips, Hojari frankincense smoke, and burnished leather',
      },
      aspectRatio: '3:4',
    },
    gallery: [
      {
        url: '/images/rwaq/products/rwaq_prod_sahra_incense_1790766997373.jpg',
        alt: {
          ar: 'زجاجة عطر أثر من رِواق بجانب رقائق العود المعتق',
          en: 'ATHAR Extrait de Parfum flacon by RWAQ beside aged agarwood chips',
        },
        aspectRatio: '3:4',
      },
      {
        url: '/images/rwaq/collection_sahra_oud_1790732070469.jpg',
        alt: {
          ar: 'عالم مجموعة صحراء العطري من رِواق',
          en: 'RWAQ Sahra Collection olfactory world',
        },
        aspectRatio: '4:3',
      },
    ],
    notes: {
      top: [
        { ar: 'لبان حوجري', en: 'Hojari Frankincense' },
        { ar: 'فلفل أسود', en: 'Black Pepper' },
      ],
      heart: [
        { ar: 'جلد مصقول', en: 'Burnished Leather' },
        { ar: 'قريضة عنبرية (لابدانوم)', en: 'Amber Labdanum' },
        { ar: 'ورق البردي', en: 'Cypriol Nagarmotha' },
      ],
      base: [
        { ar: 'عود معتّق', en: 'Aged Agarwood (Oud)' },
        { ar: 'قطران البتولا', en: 'Birch Tar Smoke' },
        { ar: 'عنبر رمادي', en: 'Ambroxan & Benzoin' },
      ],
      olfactoryFamily: {
        ar: 'عود جلدي مدخّن',
        en: 'Smoky Leather & Resinous Oud',
      },
    },
    accords: [
      {
        key: 'oud',
        label: { ar: 'عود معتّق', en: 'Aged Oud' },
        intensity: 95,
      },
      {
        key: 'leather',
        label: { ar: 'جلد مصقول', en: 'Burnished Leather' },
        intensity: 88,
      },
      {
        key: 'incense',
        label: { ar: 'دخان اللبان', en: 'Frankincense Smoke' },
        intensity: 85,
      },
    ],
    ingredientHighlights: [
      {
        name: { ar: 'العود المعتّق', en: 'Aged Agarwood' },
        origin: { ar: 'خشب راتنجي معتّق بعناية', en: 'Matured resinous heartwood' },
        description: {
          ar: 'يمنح القاعدة عمقاً خشبياً دافئاً دون حدة.',
          en: 'Provides a deep, polished woody foundation free of harsh edges.',
        },
      },
      {
        name: { ar: 'اللبان الحوجري', en: 'Hojari Frankincense' },
        origin: { ar: 'راتنج عطري نقي', en: 'Pure aromatic desert resin' },
        description: {
          ar: 'يضفي هالة دخانية شفافة ترفع فوحان العطر.',
          en: 'Creates an airy, vertical trail of translucent incense smoke.',
        },
      },
    ],
    variants: [
      {
        id: 'var-athar-100',
        sku: 'RWQ-SHR-001-100',
        sizeMl: 100,
        concentration: {
          ar: 'إكسترايت دي بارفان (32%)',
          en: 'Extrait de Parfum (32%)',
        },
        price: createMoney(820),
        inStock: true,
        stockQuantity: 28,
      },
      {
        id: 'var-athar-50',
        sku: 'RWQ-SHR-001-50',
        sizeMl: 50,
        concentration: {
          ar: 'إكسترايت دي بارفان (32%)',
          en: 'Extrait de Parfum (32%)',
        },
        price: createMoney(580),
        inStock: true,
        stockQuantity: 20,
      },
    ],
    genderPositioning: 'unisex',
    season: 'autumn-winter',
    occasion: 'majlis',
    longevity: 'eternal',
    projection: 'commanding',
    inStock: true,
    isNew: false,
    isBestSeller: true,
    isFeatured: true,
    createdAt: '2026-01-20T10:00:00.000Z',
    updatedAt: '2026-09-01T10:00:00.000Z',
  },
  {
    id: 'prod-zill',
    slug: 'zill-smoke',
    sku: 'RWQ-SHR-002',
    name: {
      ar: 'ظِل',
      en: 'ZILL',
    },
    subtitle: {
      ar: 'خلاصة عطرية · المرّ العربي والأخشاب المحروقة',
      en: 'Extrait de Parfum · Arabian Myrrh & Charred Woods',
    },
    shortDescription: {
      ar: 'ملاذٌ ظليل من المرّ العربي والراتنجات الدافئة مع نفحات من نجيل الهند الجاف وأوراق التبغ المعتّقة.',
      en: 'A shaded sanctuary of Arabian myrrh, warm desert resins, dry vetiver root, and cured tobacco leaf.',
    },
    editorialDescription: {
      ar: 'يستمد عطر ظِل اسمه من برودة الفيء وسط هجير الصحراء. تلتقي فيه راتنجات الإليمي والمرّ العربي مع أوراق التبغ الجافة وخشب الغاياك المدخن ونجيل الهند في توليفة عميقة آسرة.',
      en: 'ZILL draws inspiration from cool architectural shade amidst the desert expanse — uniting Arabian myrrh and desert elemi resin with cured tobacco leaf, smoked guaiac wood, and Java vetiver.',
    },
    inspiration: {
      ar: 'ظلال الأعمدة الحجرية الطويلة ورائحة الراتنجات العربية النادرة.',
      en: 'Long architectural colonnade shadows and rare Arabian desert resins.',
    },
    applicationRitual: {
      ar: 'يوضع على المعصمين والوشاح أو العباءة ليترك أثراً راتنجياً دافئاً.',
      en: 'Mist onto pulse points and outer garments for a deep, resinous trail.',
    },
    whenToWear: {
      ar: 'الأمسيات الباردة والمجالس المسائية.',
      en: 'Autumn and winter evenings and contemplative nocturnal gatherings.',
    },
    collectionId: 'col-sahra',
    collectionSlug: 'sahra',
    collectionName: {
      ar: 'صَحراء',
      en: 'SAHRA',
    },
    olfactoryFamilyKey: 'incense-resinous',
    concentration: {
      ar: 'إكسترايت دي بارفان (30%)',
      en: 'Extrait de Parfum (30%)',
    },
    price: createMoney(790),
    originalPrice: createMoney(860),
    image: {
      url: '/images/rwaq/products/rwaq_prod_sahra_myrrh_1790767009599.jpg',
      alt: {
        ar: 'زجاجة عطر ظل من رِواق مع راتنج المر العربي والأخشاب المدخنة',
        en: 'ZILL Extrait de Parfum flacon by RWAQ with golden Arabian myrrh resin and charred woods',
      },
      aspectRatio: '3:4',
    },
    gallery: [
      {
        url: '/images/rwaq/products/rwaq_prod_sahra_myrrh_1790767009599.jpg',
        alt: {
          ar: 'زجاجة عطر ظل من رِواق مع راتنج المر العربي',
          en: 'ZILL Extrait de Parfum flacon by RWAQ with Arabian myrrh resin',
        },
        aspectRatio: '3:4',
      },
    ],
    notes: {
      top: [
        { ar: 'إليمي صحراوي', en: 'Desert Elemi Resin' },
        { ar: 'فلفل وردي', en: 'Pink Peppercorn' },
      ],
      heart: [
        { ar: 'مرّ عربي', en: 'Arabian Myrrh' },
        { ar: 'أوراق التبغ الجافة', en: 'Cured Tobacco Leaf' },
      ],
      base: [
        { ar: 'خشب الغاياك المدخن', en: 'Smoked Guaiac Wood' },
        { ar: 'نجيل الهند', en: 'Java Vetiver' },
        { ar: 'عود كمبودي', en: 'Cambodian Oud' },
      ],
      olfactoryFamily: {
        ar: 'راتنجي خشبي مدخّن',
        en: 'Resinous Smoked Woods',
      },
    },
    accords: [
      {
        key: 'myrrh-resin',
        label: { ar: 'مرّ وراتنجات', en: 'Myrrh & Resins' },
        intensity: 92,
      },
      {
        key: 'smoked-woods',
        label: { ar: 'أخشاب مدخّنة', en: 'Smoked Woods' },
        intensity: 89,
      },
      {
        key: 'tobacco-vetiver',
        label: { ar: 'تبغ ونجيل الهند', en: 'Tobacco & Vetiver' },
        intensity: 80,
      },
    ],
    ingredientHighlights: [
      {
        name: { ar: 'المرّ العربي', en: 'Arabian Myrrh' },
        origin: { ar: 'راتنج الصحراء الذهبي', en: 'Golden desert resin tears' },
        description: {
          ar: 'يمنح القلب طابعاً بلسمياً دافئاً وعمقاً تاريخياً.',
          en: 'Brings warm balsamic richness and meditative depth to the heart.',
        },
      },
    ],
    variants: [
      {
        id: 'var-zill-100',
        sku: 'RWQ-SHR-002-100',
        sizeMl: 100,
        concentration: {
          ar: 'إكسترايت دي بارفان (30%)',
          en: 'Extrait de Parfum (30%)',
        },
        price: createMoney(790),
        originalPrice: createMoney(860),
        inStock: true,
        stockQuantity: 19,
      },
      {
        id: 'var-zill-50',
        sku: 'RWQ-SHR-002-50',
        sizeMl: 50,
        concentration: {
          ar: 'إكسترايت دي بارفان (30%)',
          en: 'Extrait de Parfum (30%)',
        },
        price: createMoney(540),
        inStock: true,
        stockQuantity: 25,
      },
    ],
    genderPositioning: 'masculine-leaning',
    season: 'autumn-winter',
    occasion: 'evening',
    longevity: 'eternal',
    projection: 'commanding',
    inStock: true,
    isNew: true,
    isBestSeller: false,
    isFeatured: false,
    createdAt: '2026-04-05T10:00:00.000Z',
    updatedAt: '2026-09-01T10:00:00.000Z',
  },
  {
    id: 'prod-jamr',
    slug: 'jamr-embers',
    sku: 'RWQ-SHR-003',
    name: {
      ar: 'جَمر',
      en: 'JAMR',
    },
    subtitle: {
      ar: 'بارفان أبسولو · جمر الغضا والعود الكمبودي',
      en: 'Parfum Absolu · Desert Ghadha Embers & Cambodian Oud',
    },
    shortDescription: {
      ar: 'حرارةٌ فاخرة تجمع وهج جمر الغضا ودخان البخور مع العود الكمبودي المعتّق والعنبر الأسود.',
      en: 'Glowing desert embers and aromatic smoke fused with aged Cambodian agarwood and black amber.',
    },
    editorialDescription: {
      ar: 'يستلهم عطر جَمر دفء السمر الشتوي في قلب الصحراء؛ حين تتوهج أخشاب الغضا وتتعانق مع رقائق العود الكمبودي الكثيف والقريضة العنبرية والفانيليا المحمّصة.',
      en: 'JAMR captures winter nights around desert Ghadha embers, where rich Cambodian agarwood melts into labdanum resin, clove bud, and dark roasted vanilla.',
    },
    inspiration: {
      ar: 'ليالي الشتاء في صحراء النفود وجمار الغضا المتقدة.',
      en: 'Winter nights across the Nafud desert and glowing Ghadha wood embers.',
    },
    applicationRitual: {
      ar: 'توضع رشّة واحدة على المعصم أو طرف البشت لثباتٍ يمتد لأيام.',
      en: 'A single spray on wrists or outer cloak provides an enveloping, days-long trail.',
    },
    whenToWear: {
      ar: 'ليالي الشتاء الباردة، المجالس، والمناسبات الاحتفالية.',
      en: 'Deep winter nights, outdoor majlis gatherings, and ceremonial wear.',
    },
    collectionId: 'col-sahra',
    collectionSlug: 'sahra',
    collectionName: {
      ar: 'صَحراء',
      en: 'SAHRA',
    },
    olfactoryFamilyKey: 'smoky-oud',
    concentration: {
      ar: 'بارفان أبسولو (35%)',
      en: 'Parfum Absolu (35%)',
    },
    price: createMoney(940),
    image: {
      url: '/images/rwaq/products/rwaq-prod-sahra-leather-embers.jpg',
      alt: {
        ar: 'زجاجة عطر جمر من رِواق مع الجمار المتوهجة ورقائق العود والجلد',
        en: 'JAMR Parfum Absolu flacon by RWAQ with glowing embers, agarwood, and saddle leather',
      },
      aspectRatio: '3:4',
    },
    gallery: [
      {
        url: '/images/rwaq/products/rwaq-prod-sahra-leather-embers.jpg',
        alt: {
          ar: 'زجاجة عطر جمر من رِواق',
          en: 'JAMR Parfum Absolu flacon by RWAQ',
        },
        aspectRatio: '3:4',
      },
    ],
    notes: {
      top: [
        { ar: 'كبش قرنفل محمّص', en: 'Toasted Clove Bud' },
        { ar: 'قشور برتقال مدخنة', en: 'Smoked Bitter Orange Peel' },
      ],
      heart: [
        { ar: 'دخان خشب الغضا', en: 'Ghadha Wood Embers Accord' },
        { ar: 'قريضة عنبرية', en: 'Dark Labdanum' },
      ],
      base: [
        { ar: 'عود كمبودي معتّق', en: 'Aged Cambodian Oud' },
        { ar: 'عنبر أسود', en: 'Black Amber Resin' },
        { ar: 'بلسم بيرو', en: 'Peru Balsam' },
      ],
      olfactoryFamily: {
        ar: 'عود دخاني عنبري كثيف',
        en: 'Ember Smoke & Aged Oud',
      },
    },
    accords: [
      {
        key: 'ember-smoke',
        label: { ar: 'دخان الجمر', en: 'Ember Smoke' },
        intensity: 96,
      },
      {
        key: 'cambodian-oud',
        label: { ar: 'عود كمبودي', en: 'Cambodian Oud' },
        intensity: 93,
      },
      {
        key: 'black-amber',
        label: { ar: 'عنبر أسود', en: 'Black Amber' },
        intensity: 88,
      },
    ],
    ingredientHighlights: [
      {
        name: { ar: 'العود الكمبودي المعتّق', en: 'Aged Cambodian Oud' },
        origin: { ar: 'تقطير تقليدي بطيء', en: 'Slow artisanal distillation' },
        description: {
          ar: 'ثراء خشبي راتنجي عميق يمنح العطر هيبته الاستثنائية.',
          en: 'Deep resinous woodiness lending extraordinary presence and warmth.',
        },
      },
    ],
    variants: [
      {
        id: 'var-jamr-100',
        sku: 'RWQ-SHR-003-100',
        sizeMl: 100,
        concentration: {
          ar: 'بارفان أبسولو (35%)',
          en: 'Parfum Absolu (35%)',
        },
        price: createMoney(940),
        inStock: true,
        stockQuantity: 12,
      },
      {
        id: 'var-jamr-75',
        sku: 'RWQ-SHR-003-75',
        sizeMl: 75,
        concentration: {
          ar: 'بارفان أبسولو (35%)',
          en: 'Parfum Absolu (35%)',
        },
        price: createMoney(760),
        inStock: true,
        stockQuantity: 17,
      },
    ],
    genderPositioning: 'unisex',
    season: 'autumn-winter',
    occasion: 'majlis',
    longevity: 'eternal',
    projection: 'commanding',
    inStock: true,
    isNew: false,
    isBestSeller: true,
    isFeatured: false,
    createdAt: '2026-03-22T10:00:00.000Z',
    updatedAt: '2026-09-01T10:00:00.000Z',
  },
  {
    id: 'prod-washm',
    slug: 'washm-leather',
    sku: 'RWQ-SHR-004',
    name: {
      ar: 'وَشم',
      en: 'WASHM',
    },
    subtitle: {
      ar: 'خلاصة عطرية · الجلد المدبوغ وجذور السوسن البري',
      en: 'Extrait de Parfum · Saddle Leather & Wild Orris Root',
    },
    shortDescription: {
      ar: 'نقشٌ عطري ثابت على الذاكرة؛ يجمع فخامة السروج الجلدية المصقولة مع السوسن البري وحبوب الهيل.',
      en: 'An indelible olfactory mark pairing burnished saddle leather with wild desert orris and cardamom.',
    },
    editorialDescription: {
      ar: 'يجسّد عطر وَشم العلاقة العريقة بين الفارس والصحراء؛ حيث يلتقي الجلد المدبوغ بالتوابل الجافة وجذور السوسن وخشب الأرز في تركيبة متزنة تجمع القوة بالأناقة.',
      en: 'WASHM honors the equestrian heritage of the Arabian desert — marrying supple saddle leather with crushed cardamom, dry orris root, and smoky vetiver.',
    },
    inspiration: {
      ar: 'حِرفة صناعة السروج الجلدية العربية الأصيلة.',
      en: 'Artisanal Arabian saddlery and desert horsemanship.',
    },
    applicationRitual: {
      ar: 'يوضع على المعصمين والرقبة ليمنح طابعاً جلدياً أنيقاً يتطور عبر الساعات.',
      en: 'Apply to wrists and neck for a refined leathery signature that softens into warm iris.',
    },
    whenToWear: {
      ar: 'مناسب لجميع الفصول، خصوصاً الأمسيات واللقاءات الرسمية.',
      en: 'Suited for year-round evening wear and formal occasions.',
    },
    collectionId: 'col-sahra',
    collectionSlug: 'sahra',
    collectionName: {
      ar: 'صَحراء',
      en: 'SAHRA',
    },
    olfactoryFamilyKey: 'leather-iris',
    concentration: {
      ar: 'إكسترايت دي بارفان (28%)',
      en: 'Extrait de Parfum (28%)',
    },
    price: createMoney(750),
    image: {
      url: '/images/rwaq/products/rwaq-prod-sahra-leather-embers.jpg',
      alt: {
        ar: 'زجاجة عطر وشم من رِواق مع الجلد المصقول',
        en: 'WASHM Extrait de Parfum flacon by RWAQ with burnished saddle leather',
      },
      aspectRatio: '3:4',
    },
    gallery: [
      {
        url: '/images/rwaq/products/rwaq-prod-sahra-leather-embers.jpg',
        alt: {
          ar: 'زجاجة عطر وشم من رِواق',
          en: 'WASHM Extrait de Parfum flacon by RWAQ',
        },
        aspectRatio: '3:4',
      },
    ],
    notes: {
      top: [
        { ar: 'هيل بري', en: 'Wild Cardamom' },
        { ar: 'زعتر صحراوي', en: 'Desert Thyme' },
      ],
      heart: [
        { ar: 'جلد السروج المصقول', en: 'Burnished Saddle Leather' },
        { ar: 'جذور السوسن', en: 'Orris Root' },
      ],
      base: [
        { ar: 'خشب البتولا', en: 'Birchwood' },
        { ar: 'عنبر جاف', en: 'Dry Amber' },
        { ar: 'مسك جلدي', en: 'Suede Musk' },
      ],
      olfactoryFamily: {
        ar: 'جلدي سوسني دافئ',
        en: 'Saddle Leather & Orris',
      },
    },
    accords: [
      {
        key: 'saddle-leather',
        label: { ar: 'جلد مدبوغ', en: 'Saddle Leather' },
        intensity: 91,
      },
      {
        key: 'orris-root',
        label: { ar: 'جذور السوسن', en: 'Orris Root' },
        intensity: 84,
      },
      {
        key: 'aromatic-herbs',
        label: { ar: 'أعشاب صحراوية', en: 'Desert Herbs' },
        intensity: 74,
      },
    ],
    ingredientHighlights: [
      {
        name: { ar: 'جلد السروج المصقول', en: 'Burnished Leather Accord' },
        origin: { ar: 'تركيبة جلدية نباتية مدخنة', en: 'Botanical birch-cured leather accord' },
        description: {
          ar: 'يمنح حضوراً واثقاً وملمساً غنياً.',
          en: 'Delivers structured poise and tactile warmth.',
        },
      },
    ],
    variants: [
      {
        id: 'var-washm-100',
        sku: 'RWQ-SHR-004-100',
        sizeMl: 100,
        concentration: {
          ar: 'إكسترايت دي بارفان (28%)',
          en: 'Extrait de Parfum (28%)',
        },
        price: createMoney(750),
        inStock: true,
        stockQuantity: 22,
      },
      {
        id: 'var-washm-50',
        sku: 'RWQ-SHR-004-50',
        sizeMl: 50,
        concentration: {
          ar: 'إكسترايت دي بارفان (28%)',
          en: 'Extrait de Parfum (28%)',
        },
        price: createMoney(520),
        inStock: true,
        stockQuantity: 29,
      },
    ],
    genderPositioning: 'masculine-leaning',
    season: 'all-season',
    occasion: 'signature',
    longevity: 'long-lasting',
    projection: 'moderate',
    inStock: true,
    isNew: false,
    isBestSeller: false,
    isFeatured: false,
    createdAt: '2026-04-18T10:00:00.000Z',
    updatedAt: '2026-09-01T10:00:00.000Z',
  },
  {
    id: 'prod-sarab',
    slug: 'sarab-resins',
    sku: 'RWQ-SHR-005',
    name: {
      ar: 'سَراب',
      en: 'SARAB',
    },
    subtitle: {
      ar: 'عطر مركز · الراتنجات الصحراوية والفلفل الوردي',
      en: 'Eau de Parfum Intense · Golden Desert Resins & Pink Pepper',
    },
    shortDescription: {
      ar: 'تموّجٌ ضوئي بين الفلفل الوردي والمندرين الجاف مع قلب من اللبان الحوجري والعنبر المعدني.',
      en: 'Shimmering pink peppercorn and dry mandarin over translucent Hojari frankincense and mineral amber.',
    },
    editorialDescription: {
      ar: 'يحاكي عطر سَراب ارتجاف الضوء فوق الرمال البعيدة؛ تركيبة هوائية مشرقة تبدأ بالتوابل الوردية والحمضيات الجافة ثم تذوب في سحابة من اللبان والعنبر المعدني.',
      en: 'SARAB mirrors the shimmer of light above distant dunes — an airy, radiant composition of pink pepper, dry mandarin, Hojari frankincense, and mineral ambroxan.',
    },
    inspiration: {
      ar: 'انعكاس ضوء الظهيرة على أفق الصحراء المفتوح.',
      en: 'Shimmering horizon light across open desert plains.',
    },
    applicationRitual: {
      ar: 'يرشّ بسخاء ليمنح هالة هوائية مشرقة وفوحاناً متجدداً.',
      en: 'Mist generously for an airy, luminous sillage that catches the breeze.',
    },
    whenToWear: {
      ar: 'مثالي للربيع والصيف والأيام المشمسة.',
      en: 'Tailored for spring, summer, and warm sunlit days.',
    },
    collectionId: 'col-sahra',
    collectionSlug: 'sahra',
    collectionName: {
      ar: 'صَحراء',
      en: 'SAHRA',
    },
    olfactoryFamilyKey: 'incense-resinous',
    concentration: {
      ar: 'أو دي بارفان إنتنس (25%)',
      en: 'Eau de Parfum Intense (25%)',
    },
    price: createMoney(610),
    image: {
      url: '/images/rwaq/collection_sahra_oud_1790732070469.jpg',
      alt: {
        ar: 'زجاجة عطر سراب من رِواق — مجموعة صحراء',
        en: 'SARAB Eau de Parfum Intense by RWAQ — Sahra Collection',
      },
      aspectRatio: '4:3',
    },
    gallery: [
      {
        url: '/images/rwaq/collection_sahra_oud_1790732070469.jpg',
        alt: {
          ar: 'زجاجة عطر سراب من رِواق',
          en: 'SARAB Eau de Parfum Intense by RWAQ',
        },
        aspectRatio: '4:3',
      },
    ],
    notes: {
      top: [
        { ar: 'فلفل وردي', en: 'Pink Peppercorn' },
        { ar: 'مندرين جاف', en: 'Dry Mandarin Peel' },
      ],
      heart: [
        { ar: 'لبان حوجري أخضر', en: 'Green Hojari Frankincense' },
        { ar: 'راتنج المصطكى', en: 'Mastic Resin' },
      ],
      base: [
        { ar: 'عنبر معدني', en: 'Mineral Ambroxan' },
        { ar: 'خشب الأرز الأبيض', en: 'White Cedarwood' },
      ],
      olfactoryFamily: {
        ar: 'راتنجي معدني مشرق',
        en: 'Luminous Mineral Incense',
      },
    },
    accords: [
      {
        key: 'mineral-amber',
        label: { ar: 'عنبر معدني', en: 'Mineral Amber' },
        intensity: 89,
      },
      {
        key: 'green-frankincense',
        label: { ar: 'لبان أخضر', en: 'Green Frankincense' },
        intensity: 86,
      },
      {
        key: 'pink-pepper',
        label: { ar: 'فلفل وردي', en: 'Pink Pepper' },
        intensity: 79,
      },
    ],
    ingredientHighlights: [
      {
        name: { ar: 'اللبان الحوجري الأخضر', en: 'Green Hojari Frankincense' },
        origin: { ar: 'قطرات اللبان النقية ذات النغمة الليمونية', en: 'Citrus-faceted royal tears' },
        description: {
          ar: 'يمنح البخور خفةً وإشراقاً يناسب الأجواء الدافئة.',
          en: 'Brings a crisp, uplifting luminosity to traditional desert incense.',
        },
      },
    ],
    variants: [
      {
        id: 'var-sarab-75',
        sku: 'RWQ-SHR-005-75',
        sizeMl: 75,
        concentration: {
          ar: 'أو دي بارفان إنتنس (25%)',
          en: 'Eau de Parfum Intense (25%)',
        },
        price: createMoney(610),
        inStock: true,
        stockQuantity: 31,
      },
      {
        id: 'var-sarab-50',
        sku: 'RWQ-SHR-005-50',
        sizeMl: 50,
        concentration: {
          ar: 'أو دي بارفان إنتنس (25%)',
          en: 'Eau de Parfum Intense (25%)',
        },
        price: createMoney(450),
        inStock: true,
        stockQuantity: 38,
      },
    ],
    genderPositioning: 'unisex',
    season: 'spring-summer',
    occasion: 'signature',
    longevity: 'long-lasting',
    projection: 'moderate',
    inStock: true,
    isNew: true,
    isBestSeller: false,
    isFeatured: false,
    createdAt: '2026-06-25T10:00:00.000Z',
    updatedAt: '2026-09-01T10:00:00.000Z',
  },
  {
    id: 'prod-raml',
    slug: 'raml-amber',
    sku: 'RWQ-SHR-006',
    name: {
      ar: 'رَمل',
      en: 'RAML',
    },
    subtitle: {
      ar: 'خلاصة عطرية · الكثبان الدافئة والباتشولي الداكن',
      en: 'Extrait de Parfum · Sun-baked Amber & Dark Patchouli',
    },
    shortDescription: {
      ar: 'تموّجات دافئة من العنبر الذهبي وأوراق الباتشولي المعتّقة مع لمسة من القرفة وحبوب الكاكاو الجافة.',
      en: 'Ripples of golden amber and aged patchouli leaf dusted with dry cocoa and warm cinnamon.',
    },
    editorialDescription: {
      ar: 'يستحضر عطر رَمل ملمس الكثبان الذهبية عند الأصيل؛ توليفة غنية ودافئة ترتكز على الباتشولي المعتّق والعنبر الراتنجي وخشب الصندل.',
      en: 'RAML translates the tactile curves of golden dunes into scent — layering aged dark patchouli, golden labdanum amber, dry cocoa shell, and sandalwood.',
    },
    inspiration: {
      ar: 'خطوط الكثبان الرملية المتموجة في الربع الخالي.',
      en: 'Sculpted wind-swept dunes of the Rub’ al Khali.',
    },
    applicationRitual: {
      ar: 'يوضع على نقاط النبض ليمنح دفئاً عنبرياً يزداد جمالاً مع مرور الوقت.',
      en: 'Apply to pulse points for a rich, grounding amber trail.',
    },
    whenToWear: {
      ar: 'مثالي لأوقات المساء وفصلي الخريف والشتاء.',
      en: 'Ideal for evening wear and cooler autumn-winter temperatures.',
    },
    collectionId: 'col-sahra',
    collectionSlug: 'sahra',
    collectionName: {
      ar: 'صَحراء',
      en: 'SAHRA',
    },
    olfactoryFamilyKey: 'woody-amber',
    concentration: {
      ar: 'إكسترايت دي بارفان (30%)',
      en: 'Extrait de Parfum (30%)',
    },
    price: createMoney(770),
    image: {
      url: '/images/rwaq/products/rwaq_prod_sahra_myrrh_1790767009599.jpg',
      alt: {
        ar: 'زجاجة عطر رمل من رِواق مع العنبر والرمال الذهبية',
        en: 'RAML Extrait de Parfum flacon by RWAQ with golden amber and desert sand',
      },
      aspectRatio: '3:4',
    },
    gallery: [
      {
        url: '/images/rwaq/products/rwaq_prod_sahra_myrrh_1790767009599.jpg',
        alt: {
          ar: 'زجاجة عطر رمل من رِواق',
          en: 'RAML Extrait de Parfum flacon by RWAQ',
        },
        aspectRatio: '3:4',
      },
    ],
    notes: {
      top: [
        { ar: 'قرفة دافئة', en: 'Warm Cinnamon' },
        { ar: 'برغموت', en: 'Bergamot' },
      ],
      heart: [
        { ar: 'باتشولي معتّق', en: 'Aged Dark Patchouli' },
        { ar: 'قشور الكاكاو الجافة', en: 'Dry Roasted Cocoa Shell' },
      ],
      base: [
        { ar: 'عنبر ذهبي', en: 'Golden Labdanum Amber' },
        { ar: 'خشب الصندل', en: 'Sandalwood' },
        { ar: 'فانيليا جافة', en: 'Dry Vanilla Bean' },
      ],
      olfactoryFamily: {
        ar: 'عنبري باتشولي دافئ',
        en: 'Warm Patchouli & Golden Amber',
      },
    },
    accords: [
      {
        key: 'golden-amber',
        label: { ar: 'عنبر ذهبي', en: 'Golden Amber' },
        intensity: 93,
      },
      {
        key: 'patchouli',
        label: { ar: 'باتشولي معتّق', en: 'Aged Patchouli' },
        intensity: 88,
      },
      {
        key: 'warm-cocoa',
        label: { ar: 'كاكاو وتوابل', en: 'Dry Cocoa & Spice' },
        intensity: 77,
      },
    ],
    ingredientHighlights: [
      {
        name: { ar: 'قلب الباتشولي المعتّق', en: 'Heart of Aged Patchouli' },
        origin: { ar: 'تقطير منقّى للأوراق الجافة', en: 'Fractionated leaf distillation' },
        description: {
          ar: 'يمنح عمقاً مخملياً دافئاً يذكّر برائحة الأرض الدافئة.',
          en: 'Provides a smooth, velvety earthiness free of camphoraceous sharpness.',
        },
      },
    ],
    variants: [
      {
        id: 'var-raml-100',
        sku: 'RWQ-SHR-006-100',
        sizeMl: 100,
        concentration: {
          ar: 'إكسترايت دي بارفان (30%)',
          en: 'Extrait de Parfum (30%)',
        },
        price: createMoney(770),
        inStock: true,
        stockQuantity: 21,
      },
      {
        id: 'var-raml-75',
        sku: 'RWQ-SHR-006-75',
        sizeMl: 75,
        concentration: {
          ar: 'إكسترايت دي بارفان (30%)',
          en: 'Extrait de Parfum (30%)',
        },
        price: createMoney(630),
        inStock: true,
        stockQuantity: 26,
      },
    ],
    genderPositioning: 'unisex',
    season: 'autumn-winter',
    occasion: 'evening',
    longevity: 'long-lasting',
    projection: 'moderate',
    inStock: true,
    isNew: false,
    isBestSeller: false,
    isFeatured: false,
    createdAt: '2026-05-02T10:00:00.000Z',
    updatedAt: '2026-09-01T10:00:00.000Z',
  },

  // ==========================================================================
  // COLLECTION III: لَيل | LAYL (6 Products)
  // ==========================================================================
  {
    id: 'prod-wajd',
    slug: 'wajd-nocturne',
    sku: 'RWQ-LYL-001',
    name: {
      ar: 'وَجد',
      en: 'WAJD',
    },
    subtitle: {
      ar: 'عطر مركز · الورد الطائفي والتين الداكن',
      en: 'Eau de Parfum Intense · Taif Rose & Dark Fig',
    },
    shortDescription: {
      ar: 'تناغم شاعري بين قطرات الورد الطائفي في قطفته الأولى ورحيق التين الأسود على وسادة من المسك المخملي.',
      en: 'Poetic tension between first-harvest Taif rose absolute and dark fig nectar resting on velvet skin musk.',
    },
    editorialDescription: {
      ar: 'يحتفي عطر وَجد بالساعات الليلية الهادئة؛ حيث يتلاقى الورد الطائفي الندي مع التين الأسود والشاي المدخن في توليفة شاعرية تستقر على قاعدة مخملية من المسك الأبيض وخشب الكشمير.',
      en: 'WAJD celebrates the quiet nocturnal hours, weaving dewy first-harvest Taif rose with dark black fig and smoked tea over a velvet bed of white musk and cashmere wood.',
    },
    inspiration: {
      ar: 'بساتين الورد في مرتفعات الطائف تحت نسيم الليل البارد.',
      en: 'Mountain rose terraces of Taif under cool starlit skies.',
    },
    applicationRitual: {
      ar: 'يوضع على العنق والمعصمين ليمنح هالة عطرية مخملية تتكشف تدريجياً.',
      en: 'Apply to neck and wrists for a magnetic, velvet aura that unfolds across the night.',
    },
    whenToWear: {
      ar: 'الأمسيات الخاصة واللقاءات الراقية.',
      en: 'Intimate evenings, gallery openings, and nocturnal gatherings.',
    },
    collectionId: 'col-layl',
    collectionSlug: 'layl',
    collectionName: {
      ar: 'لَيل',
      en: 'LAYL',
    },
    olfactoryFamilyKey: 'floral-musk',
    concentration: {
      ar: 'أو دي بارفان إنتنس (25%)',
      en: 'Eau de Parfum Intense (25%)',
    },
    price: createMoney(740),
    image: {
      url: '/images/rwaq/products/rwaq_prod_layl_rose_1790767019885.jpg',
      alt: {
        ar: 'زجاجة عطر وجد من رِواق مع بتلات الورد الطائفي الداكنة والتين الأسود على حجر البازلت',
        en: 'WAJD Eau de Parfum Intense flacon by RWAQ with dark Taif rose petals and black fig on honed basalt',
      },
      aspectRatio: '3:4',
    },
    gallery: [
      {
        url: '/images/rwaq/products/rwaq_prod_layl_rose_1790767019885.jpg',
        alt: {
          ar: 'زجاجة عطر وجد من رِواق مع بتلات الورد الطائفي الداكنة',
          en: 'WAJD Eau de Parfum Intense flacon by RWAQ with dark Taif rose petals',
        },
        aspectRatio: '3:4',
      },
      {
        url: '/images/rwaq/collection_layl_musk_1790732079960.jpg',
        alt: {
          ar: 'عالم مجموعة ليل العطري من رِواق',
          en: 'RWAQ Layl Collection olfactory world',
        },
        aspectRatio: '3:4',
      },
    ],
    notes: {
      top: [
        { ar: 'تين داكن', en: 'Dark Black Fig' },
        { ar: 'توت العليق البري', en: 'Crushed Blackberry' },
      ],
      heart: [
        { ar: 'خلاصة الورد الطائفي', en: 'Taif Rose Absolute' },
        { ar: 'شاي أسود مدخن', en: 'Smoked Black Tea' },
      ],
      base: [
        { ar: 'مسك مخملي', en: 'Velvet White Musk' },
        { ar: 'باتشولي ناعم', en: 'Heart of Patchouli' },
        { ar: 'خشب الكشمير', en: 'Cashmere Wood' },
      ],
      olfactoryFamily: {
        ar: 'زهري مسكي داكن',
        en: 'Nocturnal Floral & Dark Fruit Musk',
      },
    },
    accords: [
      {
        key: 'taif-rose',
        label: { ar: 'ورد طائفي', en: 'Taif Rose' },
        intensity: 90,
      },
      {
        key: 'velvet-musk',
        label: { ar: 'مسك مخملي', en: 'Velvet Musk' },
        intensity: 86,
      },
      {
        key: 'dark-fig',
        label: { ar: 'تين داكن', en: 'Dark Fig' },
        intensity: 78,
      },
    ],
    ingredientHighlights: [
      {
        name: { ar: 'خلاصة الورد الطائفي', en: 'Taif Rose Absolute' },
        origin: { ar: 'قطفة الصباح الأولى', en: 'Dawn-harvested highland petals' },
        description: {
          ar: 'قلب زهري غني يجمع بين النضارة والعمق العسلي.',
          en: 'A luminous floral heart with subtle honeyed and spiced facets.',
        },
      },
    ],
    variants: [
      {
        id: 'var-wajd-100',
        sku: 'RWQ-LYL-001-100',
        sizeMl: 100,
        concentration: {
          ar: 'أو دي بارفان إنتنس (25%)',
          en: 'Eau de Parfum Intense (25%)',
        },
        price: createMoney(740),
        inStock: true,
        stockQuantity: 35,
      },
      {
        id: 'var-wajd-50',
        sku: 'RWQ-LYL-001-50',
        sizeMl: 50,
        concentration: {
          ar: 'أو دي بارفان إنتنس (25%)',
          en: 'Eau de Parfum Intense (25%)',
        },
        price: createMoney(510),
        inStock: true,
        stockQuantity: 28,
      },
    ],
    genderPositioning: 'feminine-leaning',
    season: 'evening',
    occasion: 'evening',
    longevity: 'long-lasting',
    projection: 'moderate',
    inStock: true,
    isNew: true,
    isBestSeller: false,
    isFeatured: true,
    createdAt: '2026-03-10T10:00:00.000Z',
    updatedAt: '2026-09-01T10:00:00.000Z',
  },
  {
    id: 'prod-sukoon',
    slug: 'sukoon-musk',
    sku: 'RWQ-LYL-002',
    name: {
      ar: 'سُكون',
      en: 'SUKOON',
    },
    subtitle: {
      ar: 'خلاصة عطرية · المسك الأبيض وزهر السوسن',
      en: 'Extrait de Parfum · Pure Musk & Pallida Iris',
    },
    shortDescription: {
      ar: 'صفاءٌ مطلق يحاكي ملمس الحرير البارد؛ مسك أبيض نقي يلتقي بزبدة السوسن وحبوب الأمبريت في هدوءٍ آسر.',
      en: 'Pure olfactory stillness combining clean white musk, aged iris butter, and warm ambrette seed.',
    },
    editorialDescription: {
      ar: 'صُمم عطر سُكون كهمسةٍ راقية قريبة من البشرة. يجمع بين نقاء المسك الأبيض المعتّق والنعومة المخملية لزبدة السوسن وبذور الأمبريت وخشب الصندل الأبيض.',
      en: 'SUKOON is an intimate skin study — pairing clean aged white musk with the powdery elegance of Iris Pallida butter, ambrette seed, and creamy white sandalwood.',
    },
    inspiration: {
      ar: 'ضوء الفجر الأول على الحجر الجيري الأبيض وسكينة الأروقة الداخلية.',
      en: 'First light across white limestone courtyards and quiet interior colonnades.',
    },
    applicationRitual: {
      ar: 'يوضع مباشرة على البشرة بعد الاستحمام ليمنح حضوراً نظيفاً وهادئاً يدوم طوال اليوم.',
      en: 'Apply directly to clean skin for a poised, second-skin radiance that lasts from morning to night.',
    },
    whenToWear: {
      ar: 'مثالي لجميع الفصول، ولحظات الصفاء واللقاءات القريبة.',
      en: 'Ideal for all seasons, daytime refinement, and intimate settings.',
    },
    collectionId: 'col-layl',
    collectionSlug: 'layl',
    collectionName: {
      ar: 'لَيل',
      en: 'LAYL',
    },
    olfactoryFamilyKey: 'leather-iris',
    concentration: {
      ar: 'إكسترايت دي بارفان (28%)',
      en: 'Extrait de Parfum (28%)',
    },
    price: createMoney(590),
    image: {
      url: '/images/rwaq/products/rwaq_prod_layl_iris_1790767031847.jpg',
      alt: {
        ar: 'زجاجة عطر سكون من رِواق مع المسك الأبيض وزهر السوسن على حجر جيري ناعم',
        en: 'SUKOON Extrait de Parfum flacon by RWAQ with pure white musk and Pallida iris on smooth limestone',
      },
      aspectRatio: '3:4',
    },
    gallery: [
      {
        url: '/images/rwaq/products/rwaq_prod_layl_iris_1790767031847.jpg',
        alt: {
          ar: 'زجاجة عطر سكون من رِواق مع المسك الأبيض وزهر السوسن',
          en: 'SUKOON Extrait de Parfum flacon by RWAQ with pure white musk and iris',
        },
        aspectRatio: '3:4',
      },
    ],
    notes: {
      top: [
        { ar: 'بذور الأمبريت', en: 'Ambrette Seed' },
        { ar: 'كمثرى بيضاء', en: 'White Pear Accord' },
      ],
      heart: [
        { ar: 'زبدة السوسن', en: 'Iris Pallida Butter' },
        { ar: 'بخور أبيض ناعم', en: 'Soft White Incense' },
      ],
      base: [
        { ar: 'مسك نقي معتّق', en: 'Aged Pure Skin Musk' },
        { ar: 'خشب الصندل الأبيض', en: 'White Sandalwood' },
      ],
      olfactoryFamily: {
        ar: 'مسك نقي وبودرة السوسن',
        en: 'Pure Skin Musk & Iris',
      },
    },
    accords: [
      {
        key: 'skin-musk',
        label: { ar: 'مسك أبيض نقي', en: 'Pure Skin Musk' },
        intensity: 94,
      },
      {
        key: 'iris',
        label: { ar: 'زبدة السوسن', en: 'Iris Butter' },
        intensity: 86,
      },
      {
        key: 'sandalwood',
        label: { ar: 'صندل أبيض', en: 'White Sandalwood' },
        intensity: 76,
      },
    ],
    ingredientHighlights: [
      {
        name: { ar: 'زبدة السوسن (Iris Pallida)', en: 'Iris Pallida Butter' },
        origin: { ar: 'جذور السوسن المعتّقة', en: 'Aged rhizome extraction' },
        description: {
          ar: 'تمنح العطر ملمساً حريرياً ناعماً وأناقة هادئة.',
          en: 'Lends a cool, silken texture and architectural poise.',
        },
      },
    ],
    variants: [
      {
        id: 'var-sukoon-75',
        sku: 'RWQ-LYL-002-75',
        sizeMl: 75,
        concentration: {
          ar: 'إكسترايت دي بارفان (28%)',
          en: 'Extrait de Parfum (28%)',
        },
        price: createMoney(590),
        inStock: true,
        stockQuantity: 50,
      },
      {
        id: 'var-sukoon-100',
        sku: 'RWQ-LYL-002-100',
        sizeMl: 100,
        concentration: {
          ar: 'إكسترايت دي بارفان (28%)',
          en: 'Extrait de Parfum (28%)',
        },
        price: createMoney(720),
        inStock: true,
        stockQuantity: 28,
      },
      {
        id: 'var-sukoon-50',
        sku: 'RWQ-LYL-002-50',
        sizeMl: 50,
        concentration: {
          ar: 'إكسترايت دي بارفان (28%)',
          en: 'Extrait de Parfum (28%)',
        },
        price: createMoney(440),
        inStock: true,
        stockQuantity: 35,
      },
    ],
    genderPositioning: 'unisex',
    season: 'all-season',
    occasion: 'intimate',
    longevity: 'long-lasting',
    projection: 'intimate',
    inStock: true,
    isNew: false,
    isBestSeller: true,
    isFeatured: false,
    createdAt: '2026-02-01T10:00:00.000Z',
    updatedAt: '2026-09-01T10:00:00.000Z',
  },
  {
    id: 'prod-nafas',
    slug: 'nafas-jasmine',
    sku: 'RWQ-LYL-003',
    name: {
      ar: 'نَفَس',
      en: 'NAFAS',
    },
    subtitle: {
      ar: 'خلاصة عطرية · ياسمين الليل والشاي الأبيض المدخن',
      en: 'Extrait de Parfum · Night-Blooming Jasmine & Smoked White Tea',
    },
    shortDescription: {
      ar: 'نسمةٌ ليلية عذبة تجمع زهر الياسمين المتفتح ليلاً مع أوراق الشاي الأبيض والمسك الشفاف.',
      en: 'A nocturnal breeze of night-blooming jasmine Sambac, smoked white tea leaves, and sheer skin musk.',
    },
    editorialDescription: {
      ar: 'يلتقط عطر نَفَس اللحظة التي ينكسر فيها حرّ النهار وتبدأ نسمات الليل بحمل عبير الياسمين المتفتح في الحدائق الحجرية، ممزوجاً بالشاي الأبيض وخشب الصندل الناعم.',
      en: 'NAFAS captures the first cool breath of evening air carrying night-blooming jasmine across stone-walled gardens, balanced by delicate white tea and sheer musk.',
    },
    inspiration: {
      ar: 'حدائق الياسمين الليلية والشرفات المفتوحة تحت القمر.',
      en: 'Moonlit jasmine courtyards and breezy night terraces.',
    },
    applicationRitual: {
      ar: 'يرشّ على الشعر والملابس ونقاط النبض لفوحان زهري نقي وغير مثقل.',
      en: 'Mist lightly over pulse points and scarves for a weightless, luminous floral trail.',
    },
    whenToWear: {
      ar: 'أمسيات الربيع والصيف واللقاءات الراقية.',
      en: 'Spring and summer evenings, intimate dinners, and refined social occasions.',
    },
    collectionId: 'col-layl',
    collectionSlug: 'layl',
    collectionName: {
      ar: 'لَيل',
      en: 'LAYL',
    },
    olfactoryFamilyKey: 'floral-musk',
    concentration: {
      ar: 'إكسترايت دي بارفان (28%)',
      en: 'Extrait de Parfum (28%)',
    },
    price: createMoney(710),
    image: {
      url: '/images/rwaq/products/rwaq-prod-layl-jasmine-ambergris.jpg',
      alt: {
        ar: 'زجاجة عطر نفس من رِواق مع أزهار الياسمين الليلي على حجر البازلت',
        en: 'NAFAS Extrait de Parfum flacon by RWAQ with night-blooming jasmine on honed basalt',
      },
      aspectRatio: '3:4',
    },
    gallery: [
      {
        url: '/images/rwaq/products/rwaq-prod-layl-jasmine-ambergris.jpg',
        alt: {
          ar: 'زجاجة عطر نفس من رِواق',
          en: 'NAFAS Extrait de Parfum flacon by RWAQ',
        },
        aspectRatio: '3:4',
      },
    ],
    notes: {
      top: [
        { ar: 'برغموت أبيض', en: 'White Bergamot' },
        { ar: 'أوراق الشاي الأبيض', en: 'Silver Needle White Tea' },
      ],
      heart: [
        { ar: 'ياسمين السامباك الليلي', en: 'Night-Blooming Jasmine Sambac' },
        { ar: 'زهر البرتقال', en: 'Orange Blossom Absolute' },
      ],
      base: [
        { ar: 'مسك حريري', en: 'Silken White Musk' },
        { ar: 'خشب الصندل', en: 'Creamy Sandalwood' },
      ],
      olfactoryFamily: {
        ar: 'زهري أبيض مسكي',
        en: 'Luminous White Floral & Tea Musk',
      },
    },
    accords: [
      {
        key: 'night-jasmine',
        label: { ar: 'ياسمين ليلي', en: 'Night Jasmine' },
        intensity: 92,
      },
      {
        key: 'white-tea',
        label: { ar: 'شاي أبيض', en: 'White Tea' },
        intensity: 85,
      },
      {
        key: 'silk-musk',
        label: { ar: 'مسك حريري', en: 'Silken Musk' },
        intensity: 82,
      },
    ],
    ingredientHighlights: [
      {
        name: { ar: 'ياسمين السامباك الليلي', en: 'Night-Blooming Jasmine' },
        origin: { ar: 'أزهار تُقطف عند المساء', en: 'Dusk-harvested blossoms' },
        description: {
          ar: 'يمنح إشراقة زهرية آسرة تتناغم مع نقاء الشاي الأبيض.',
          en: 'Radiates an intoxicating yet airy floral glow.',
        },
      },
    ],
    variants: [
      {
        id: 'var-nafas-100',
        sku: 'RWQ-LYL-003-100',
        sizeMl: 100,
        concentration: {
          ar: 'إكسترايت دي بارفان (28%)',
          en: 'Extrait de Parfum (28%)',
        },
        price: createMoney(710),
        inStock: true,
        stockQuantity: 27,
      },
      {
        id: 'var-nafas-50',
        sku: 'RWQ-LYL-003-50',
        sizeMl: 50,
        concentration: {
          ar: 'إكسترايت دي بارفان (28%)',
          en: 'Extrait de Parfum (28%)',
        },
        price: createMoney(490),
        inStock: true,
        stockQuantity: 33,
      },
    ],
    genderPositioning: 'feminine-leaning',
    season: 'spring-summer',
    occasion: 'evening',
    longevity: 'long-lasting',
    projection: 'moderate',
    inStock: true,
    isNew: true,
    isBestSeller: false,
    isFeatured: false,
    createdAt: '2026-06-01T10:00:00.000Z',
    updatedAt: '2026-09-01T10:00:00.000Z',
  },
  {
    id: 'prod-hala',
    slug: 'hala-ambergris',
    sku: 'RWQ-LYL-004',
    name: {
      ar: 'هالة',
      en: 'HALA',
    },
    subtitle: {
      ar: 'خلاصة عطرية · العنبر الرمادي والمسك المخملي',
      en: 'Extrait de Parfum · Silver Ambergris & Velvet Musk',
    },
    shortDescription: {
      ar: 'إشراقةٌ هادئة تحيط بحضورك؛ يمتزج فيها العنبر الرمادي المالح مع المسك المخملي وخشب الكشمير.',
      en: 'A magnetic nocturnal halo of mineral silver ambergris, velvet musk, and warm cashmere wood.',
    },
    editorialDescription: {
      ar: 'صُمم عطر هالة ليحاكي ضوء القمر الفضي المنعكس على الصخور البازلتية؛ تركيبة غامضة وجذابة توازن بين النغمة المعدنية للعنبر الرمادي والدفء الحميمي للمسك وخشب الأرز.',
      en: 'HALA surrounds the wearer in a silver-lit aura — balancing mineral ambergris and pink pepper with warm cashmere wood and skin-hugging velvet musk.',
    },
    inspiration: {
      ar: 'هالة القمر فوق التكوينات الصخرية في سماء العُلا.',
      en: 'Lunar halos above the monolithic rock formations of AlUla.',
    },
    applicationRitual: {
      ar: 'يتفاعل بجمال فريد مع كيمياء البشرة الطبيعية عند وضعه على نقاط النبض.',
      en: 'Adapts intimately to individual skin chemistry when applied to pulse points.',
    },
    whenToWear: {
      ar: 'توقيع شخصي لجميع الفصول والأمسيات الحميمية.',
      en: 'An all-season personal signature and magnetic evening scent.',
    },
    collectionId: 'col-layl',
    collectionSlug: 'layl',
    collectionName: {
      ar: 'لَيل',
      en: 'LAYL',
    },
    olfactoryFamilyKey: 'woody-amber',
    concentration: {
      ar: 'إكسترايت دي بارفان (30%)',
      en: 'Extrait de Parfum (30%)',
    },
    price: createMoney(810),
    image: {
      url: '/images/rwaq/products/rwaq-prod-layl-jasmine-ambergris.jpg',
      alt: {
        ar: 'زجاجة عطر هالة من رِواق مع العنبر الرمادي على حجر البازلت',
        en: 'HALA Extrait de Parfum flacon by RWAQ with silver ambergris on honed basalt',
      },
      aspectRatio: '3:4',
    },
    gallery: [
      {
        url: '/images/rwaq/products/rwaq-prod-layl-jasmine-ambergris.jpg',
        alt: {
          ar: 'زجاجة عطر هالة من رِواق',
          en: 'HALA Extrait de Parfum flacon by RWAQ',
        },
        aspectRatio: '3:4',
      },
    ],
    notes: {
      top: [
        { ar: 'فلفل وردي ناعم', en: 'Soft Pink Pepper' },
        { ar: 'الدهيدات معدنية شفافة', en: 'Sheer Mineral Accord' },
      ],
      heart: [
        { ar: 'خشب الكشمير', en: 'Cashmere Wood' },
        { ar: 'سوسن أبيض', en: 'White Iris' },
      ],
      base: [
        { ar: 'عنبر رمادي (أمبرغريس)', en: 'Silver Ambergris Accord' },
        { ar: 'مسك مخملي', en: 'Velvet Musk' },
        { ar: 'خشب الأرز الأطلسي', en: 'Atlas Cedar' },
      ],
      olfactoryFamily: {
        ar: 'عنبري مسكي معدني',
        en: 'Mineral Ambergris & Velvet Musk',
      },
    },
    accords: [
      {
        key: 'ambergris',
        label: { ar: 'عنبر رمادي', en: 'Silver Ambergris' },
        intensity: 94,
      },
      {
        key: 'cashmere-musk',
        label: { ar: 'مسك الكشمير', en: 'Cashmere Musk' },
        intensity: 89,
      },
      {
        key: 'white-iris',
        label: { ar: 'سوسن أبيض', en: 'White Iris' },
        intensity: 78,
      },
    ],
    ingredientHighlights: [
      {
        name: { ar: 'العنبر الرمادي', en: 'Silver Ambergris Accord' },
        origin: { ar: 'مركب عنبري معدني نقي', en: 'Botanical & mineral ambergris infusion' },
        description: {
          ar: 'يمنح فوحاناً مغناطيسياً هادئاً وثباتاً استثنائياً.',
          en: 'Creates an enveloping, radiant halo that lingers effortlessly.',
        },
      },
    ],
    variants: [
      {
        id: 'var-hala-100',
        sku: 'RWQ-LYL-004-100',
        sizeMl: 100,
        concentration: {
          ar: 'إكسترايت دي بارفان (30%)',
          en: 'Extrait de Parfum (30%)',
        },
        price: createMoney(810),
        inStock: true,
        stockQuantity: 23,
      },
      {
        id: 'var-hala-75',
        sku: 'RWQ-LYL-004-75',
        sizeMl: 75,
        concentration: {
          ar: 'إكسترايت دي بارفان (30%)',
          en: 'Extrait de Parfum (30%)',
        },
        price: createMoney(660),
        inStock: true,
        stockQuantity: 19,
      },
    ],
    genderPositioning: 'unisex',
    season: 'all-season',
    occasion: 'intimate',
    longevity: 'eternal',
    projection: 'moderate',
    inStock: true,
    isNew: false,
    isBestSeller: true,
    isFeatured: false,
    createdAt: '2026-04-29T10:00:00.000Z',
    updatedAt: '2026-09-01T10:00:00.000Z',
  },
  {
    id: 'prod-sahar',
    slug: 'sahar-rose-oud',
    sku: 'RWQ-LYL-005',
    name: {
      ar: 'سَحر',
      en: 'SAHAR',
    },
    subtitle: {
      ar: 'بارفان أبسولو · الورد الطائفي المعتّق والعود الأسود',
      en: 'Parfum Absolu · Nocturnal Taif Rose & Black Agarwood',
    },
    shortDescription: {
      ar: 'لقاءٌ مهيب في آخر الليل بين خلاصة الورد الطائفي الكثيفة والعود الأسود المعتّق والزعفران.',
      en: 'A late-night encounter between rich Taif rose absolute, black agarwood, and crimson saffron.',
    },
    editorialDescription: {
      ar: 'يمثل عطر سَحر التفسير الأكثر فخامة وعمقاً للقاء الورد الطائفي بالعود؛ حيث تُصقل بتلات الورد بلمسة من الزعفران واللبان قبل أن تستقر على قاعدة غنية من العود الأسود والعنبر.',
      en: 'SAHAR is RWAQ’s grand nocturnal rose-oud statement — wrapping damask and Taif rose absolute in saffron, frankincense, and dark aged agarwood.',
    },
    inspiration: {
      ar: 'الساعات المتأخرة قبل الفجر حين يبلغ عبير الورد والعود ذروته.',
      en: 'The pre-dawn hours of sahar when rose and oud reach their deepest resonance.',
    },
    applicationRitual: {
      ar: 'تكفي رشّة واحدة على نقاط النبض لحضورٍ آسر يملأ المكان.',
      en: 'One mist on pulse points releases a rich, commanding tapestry of rose and oud.',
    },
    whenToWear: {
      ar: 'المناسبات الاحتفالية المسائية والليالي الباردة.',
      en: 'Formal evening galas, celebrations, and winter nights.',
    },
    collectionId: 'col-layl',
    collectionSlug: 'layl',
    collectionName: {
      ar: 'لَيل',
      en: 'LAYL',
    },
    olfactoryFamilyKey: 'smoky-oud',
    concentration: {
      ar: 'بارفان أبسولو (34%)',
      en: 'Parfum Absolu (34%)',
    },
    price: createMoney(910),
    originalPrice: createMoney(980),
    image: {
      url: '/images/rwaq/products/rwaq_prod_layl_rose_1790767019885.jpg',
      alt: {
        ar: 'زجاجة عطر سحر من رِواق مع الورد الطائفي الداكن والعود الأسود',
        en: 'SAHAR Parfum Absolu flacon by RWAQ with nocturnal Taif rose and black oud',
      },
      aspectRatio: '3:4',
    },
    gallery: [
      {
        url: '/images/rwaq/products/rwaq_prod_layl_rose_1790767019885.jpg',
        alt: {
          ar: 'زجاجة عطر سحر من رِواق',
          en: 'SAHAR Parfum Absolu flacon by RWAQ',
        },
        aspectRatio: '3:4',
      },
    ],
    notes: {
      top: [
        { ar: 'زعفران أحمر', en: 'Red Saffron' },
        { ar: 'برغموت داكن', en: 'Dark Bergamot' },
      ],
      heart: [
        { ar: 'ورد طائفي مركز', en: 'Concentrated Taif Rose Absolute' },
        { ar: 'بخور اللبان', en: 'Olibanum Incense' },
      ],
      base: [
        { ar: 'عود أسود معتّق', en: 'Aged Black Agarwood' },
        { ar: 'عنبر وعسل داكن', en: 'Dark Amber & Honeyed Labdanum' },
        { ar: 'مسك أسود', en: 'Dark Musk' },
      ],
      olfactoryFamily: {
        ar: 'عود وردي ملكي',
        en: 'Opulent Rose & Black Oud',
      },
    },
    accords: [
      {
        key: 'rose-oud',
        label: { ar: 'ورد طائفي وعود', en: 'Taif Rose & Oud' },
        intensity: 96,
      },
      {
        key: 'saffron-amber',
        label: { ar: 'زعفران وعنبر', en: 'Saffron Amber' },
        intensity: 89,
      },
      {
        key: 'incense',
        label: { ar: 'بخور اللبان', en: 'Olibanum Smoke' },
        intensity: 82,
      },
    ],
    ingredientHighlights: [
      {
        name: { ar: 'ثنائية الورد الطائفي والعود الأسود', en: 'Taif Rose & Black Agarwood Duo' },
        origin: { ar: 'مزج تقليدي بروح حديثة', en: 'Contemporary maceration' },
        description: {
          ar: 'تعتيق مشترك يمنح تناغماً سلساً بين الورد والعود.',
          en: 'Co-macerated for weeks so the rose and agarwood fuse into a single velvet accord.',
        },
      },
    ],
    variants: [
      {
        id: 'var-sahar-100',
        sku: 'RWQ-LYL-005-100',
        sizeMl: 100,
        concentration: {
          ar: 'بارفان أبسولو (34%)',
          en: 'Parfum Absolu (34%)',
        },
        price: createMoney(910),
        originalPrice: createMoney(980),
        inStock: true,
        stockQuantity: 16,
      },
      {
        id: 'var-sahar-50',
        sku: 'RWQ-LYL-005-50',
        sizeMl: 50,
        concentration: {
          ar: 'بارفان أبسولو (34%)',
          en: 'Parfum Absolu (34%)',
        },
        price: createMoney(640),
        inStock: true,
        stockQuantity: 21,
      },
    ],
    genderPositioning: 'unisex',
    season: 'evening',
    occasion: 'ceremonial',
    longevity: 'eternal',
    projection: 'commanding',
    inStock: true,
    isNew: false,
    isBestSeller: true,
    isFeatured: false,
    createdAt: '2026-02-12T10:00:00.000Z',
    updatedAt: '2026-09-01T10:00:00.000Z',
  },
  {
    id: 'prod-ghasaq',
    slug: 'ghasaq-incense',
    sku: 'RWQ-LYL-006',
    name: {
      ar: 'غَسق',
      en: 'GHASAQ',
    },
    subtitle: {
      ar: 'عطر مركز · التين البري وبخور العُلا الليلي',
      en: 'Eau de Parfum Intense · Wild Black Fig & AlUla Night Incense',
    },
    shortDescription: {
      ar: 'أول ساعات الليل حين يمتزج رحيق التين البري والبرقوق الداكن مع دخان البخور الناعم وخشب الأرز.',
      en: 'Early twilight captured in wild black fig, dark plum, soft temple incense, and cedarwood.',
    },
    editorialDescription: {
      ar: 'يرسم عطر غَسق لحظة تحوّل السماء من الأزرق الداكن إلى سواد الليل؛ توليفة فاكهية-بخورية حديثة تجمع التين البري باللبان والمسك الأسود.',
      en: 'GHASAQ paints the transition of dusk into night — pairing ripe black fig and plum skin with cool olibanum smoke, cedarwood, and velvet musk.',
    },
    inspiration: {
      ar: 'غسق المساء في واحة العُلا بين النخيل والجبال الصخرية.',
      en: 'Twilight descending over the oasis palms and sandstone canyons of AlUla.',
    },
    applicationRitual: {
      ar: 'يرشّ عند الغروب ليرافقك بجاذبية هادئة طوال المساء.',
      en: 'Mist at sundown for a modern, intriguing trail of dark fruit and cool incense.',
    },
    whenToWear: {
      ar: 'الأمسيات العصرية واللقاءات الاجتماعية.',
      en: 'Modern evening social occasions across all seasons.',
    },
    collectionId: 'col-layl',
    collectionSlug: 'layl',
    collectionName: {
      ar: 'لَيل',
      en: 'LAYL',
    },
    olfactoryFamilyKey: 'floral-musk',
    concentration: {
      ar: 'أو دي بارفان إنتنس (25%)',
      en: 'Eau de Parfum Intense (25%)',
    },
    price: createMoney(620),
    image: {
      url: '/images/rwaq/collection_layl_musk_1790732079960.jpg',
      alt: {
        ar: 'زجاجة عطر غسق من رِواق — مجموعة ليل',
        en: 'GHASAQ Eau de Parfum Intense by RWAQ — Layl Collection',
      },
      aspectRatio: '3:4',
    },
    gallery: [
      {
        url: '/images/rwaq/collection_layl_musk_1790732079960.jpg',
        alt: {
          ar: 'زجاجة عطر غسق من رِواق',
          en: 'GHASAQ Eau de Parfum Intense by RWAQ',
        },
        aspectRatio: '3:4',
      },
    ],
    notes: {
      top: [
        { ar: 'تين بري أسود', en: 'Wild Black Fig' },
        { ar: 'برقوق داكن', en: 'Dark Plum Skin' },
      ],
      heart: [
        { ar: 'بخور بارد', en: 'Cool Olibanum Smoke' },
        { ar: 'بتلات البنفسج الليلي', en: 'Night Violet' },
      ],
      base: [
        { ar: 'خشب الأرز الداكن', en: 'Dark Cedarwood' },
        { ar: 'مسك مخملي', en: 'Velvet Musk' },
      ],
      olfactoryFamily: {
        ar: 'فاكهي داكن وبخور مسكي',
        en: 'Dark Fig & Nocturnal Incense Musk',
      },
    },
    accords: [
      {
        key: 'dark-fig-plum',
        label: { ar: 'تين وبرقوق داكن', en: 'Dark Fig & Plum' },
        intensity: 90,
      },
      {
        key: 'cool-incense',
        label: { ar: 'بخور بارد', en: 'Cool Incense' },
        intensity: 85,
      },
      {
        key: 'velvet-musk',
        label: { ar: 'مسك مخملي', en: 'Velvet Musk' },
        intensity: 80,
      },
    ],
    ingredientHighlights: [
      {
        name: { ar: 'التين البري وبخور العُلا', en: 'Wild Fig & Cool Incense' },
        origin: { ar: 'تناغم الواحة والجبل', en: 'Oasis fruit & canyon resin accord' },
        description: {
          ar: 'يجمع بين غنى الفاكهة الداكنة وشفافية الدخان العطري.',
          en: 'Contrasts lush dark fruit with mineral, airy incense.',
        },
      },
    ],
    variants: [
      {
        id: 'var-ghasaq-75',
        sku: 'RWQ-LYL-006-75',
        sizeMl: 75,
        concentration: {
          ar: 'أو دي بارفان إنتنس (25%)',
          en: 'Eau de Parfum Intense (25%)',
        },
        price: createMoney(620),
        inStock: true,
        stockQuantity: 29,
      },
      {
        id: 'var-ghasaq-50',
        sku: 'RWQ-LYL-006-50',
        sizeMl: 50,
        concentration: {
          ar: 'أو دي بارفان إنتنس (25%)',
          en: 'Eau de Parfum Intense (25%)',
        },
        price: createMoney(470),
        inStock: true,
        stockQuantity: 34,
      },
    ],
    genderPositioning: 'unisex',
    season: 'evening',
    occasion: 'evening',
    longevity: 'long-lasting',
    projection: 'moderate',
    inStock: true,
    isNew: false,
    isBestSeller: false,
    isFeatured: false,
    createdAt: '2026-05-20T10:00:00.000Z',
    updatedAt: '2026-09-01T10:00:00.000Z',
  },
];
