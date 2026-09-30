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
    ],
    genderPositioning: 'unisex',
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
];
