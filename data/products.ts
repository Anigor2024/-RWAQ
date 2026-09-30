import { createMoney } from '@/lib/money';
import type { Product } from '@/types';

export const SEED_PRODUCTS: Product[] = [
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
    collectionId: 'col-najd',
    collectionSlug: 'najd',
    collectionName: {
      ar: 'نَجد',
      en: 'NAJD',
    },
    price: createMoney(680),
    image: {
      url: '/images/rwaq/collection_najd_amber_1790732060898.jpg',
      alt: {
        ar: 'عطر سرى من رِواق — مجموعة نجد',
        en: 'SARA Extrait de Parfum by RWAQ — Najd Collection',
      },
      aspectRatio: '3:4',
    },
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
    ],
    genderPositioning: 'unisex',
    season: 'all-season',
    occasion: 'signature',
    longevity: 'eternal',
    projection: 'commanding',
    isNew: false,
    isBestSeller: true,
    createdAt: '2026-01-15T10:00:00.000Z',
    updatedAt: '2026-09-01T10:00:00.000Z',
  },
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
    collectionId: 'col-sahra',
    collectionSlug: 'sahra',
    collectionName: {
      ar: 'صَحراء',
      en: 'SAHRA',
    },
    price: createMoney(820),
    image: {
      url: '/images/rwaq/collection_sahra_oud_1790732070469.jpg',
      alt: {
        ar: 'عطر أثر من رِواق — مجموعة صحراء',
        en: 'ATHAR Extrait de Parfum by RWAQ — Sahra Collection',
      },
      aspectRatio: '3:4',
    },
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
    ],
    genderPositioning: 'unisex',
    season: 'autumn-winter',
    occasion: 'majlis',
    longevity: 'eternal',
    projection: 'commanding',
    isNew: false,
    isBestSeller: true,
    createdAt: '2026-01-20T10:00:00.000Z',
    updatedAt: '2026-09-01T10:00:00.000Z',
  },
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
    collectionId: 'col-layl',
    collectionSlug: 'layl',
    collectionName: {
      ar: 'لَيل',
      en: 'LAYL',
    },
    price: createMoney(740),
    image: {
      url: '/images/rwaq/collection_layl_musk_1790732079960.jpg',
      alt: {
        ar: 'عطر وجد من رِواق — مجموعة ليل',
        en: 'WAJD Eau de Parfum Intense by RWAQ — Layl Collection',
      },
      aspectRatio: '3:4',
    },
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
    ],
    genderPositioning: 'unisex',
    season: 'evening',
    occasion: 'evening',
    longevity: 'long-lasting',
    projection: 'moderate',
    isNew: true,
    isBestSeller: false,
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
    collectionId: 'col-layl',
    collectionSlug: 'layl',
    collectionName: {
      ar: 'لَيل',
      en: 'LAYL',
    },
    price: createMoney(590),
    image: {
      url: '/images/rwaq/product_flacon_studio_1790732089787.jpg',
      alt: {
        ar: 'عطر سكون من رِواق — مجموعة ليل',
        en: 'SUKOON Extrait de Parfum by RWAQ — Layl Collection',
      },
      aspectRatio: '3:4',
    },
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
    ],
    genderPositioning: 'unisex',
    season: 'all-season',
    occasion: 'intimate',
    longevity: 'long-lasting',
    projection: 'intimate',
    isNew: false,
    isBestSeller: true,
    createdAt: '2026-02-01T10:00:00.000Z',
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
    collectionId: 'col-sahra',
    collectionSlug: 'sahra',
    collectionName: {
      ar: 'صَحراء',
      en: 'SAHRA',
    },
    price: createMoney(790),
    originalPrice: createMoney(860),
    image: {
      url: '/images/rwaq/collection_sahra_oud_1790732070469.jpg',
      alt: {
        ar: 'عطر ظل من رِواق — مجموعة صحراء',
        en: 'ZILL Extrait de Parfum by RWAQ — Sahra Collection',
      },
      aspectRatio: '3:4',
    },
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
    ],
    genderPositioning: 'masculine-leaning',
    season: 'autumn-winter',
    occasion: 'evening',
    longevity: 'eternal',
    projection: 'commanding',
    isNew: true,
    isBestSeller: false,
    createdAt: '2026-04-05T10:00:00.000Z',
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
    collectionId: 'col-najd',
    collectionSlug: 'najd',
    collectionName: {
      ar: 'نَجد',
      en: 'NAJD',
    },
    price: createMoney(890),
    image: {
      url: '/images/rwaq/product_flacon_studio_1790732089787.jpg',
      alt: {
        ar: 'عطر مقام من رِواق — مجموعة نجد',
        en: 'MAQAM Parfum Absolu by RWAQ — Najd Collection',
      },
      aspectRatio: '3:4',
    },
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
    ],
    genderPositioning: 'unisex',
    season: 'autumn-winter',
    occasion: 'ceremonial',
    longevity: 'eternal',
    projection: 'commanding',
    isNew: false,
    isBestSeller: true,
    createdAt: '2026-02-18T10:00:00.000Z',
    updatedAt: '2026-09-01T10:00:00.000Z',
  },
];
