import type { DemoPersona, Locale } from '@/types';

export interface Dictionary {
  brand: {
    name: string;
    nameSecondary: string;
    tagline: string;
    origin: string;
  };
  a11y: {
    skipToContent: string;
    openMenu: string;
    closeMenu: string;
    openSearch: string;
    openWishlist: string;
    openAccount: string;
    openBag: string;
    switchLanguage: string;
    closeDrawer: string;
    scrollToManifesto: string;
  };
  nav: {
    collections: string;
    creations: string;
    manifesto: string;
    house: string;
    languageToggleLabel: string;
    languageToggleFull: string;
  };
  hero: {
    scrollPrompt: string;
  };
  manifesto: {
    pillarOneTitle: string;
    pillarOneDetail: string;
    pillarTwoTitle: string;
    pillarTwoDetail: string;
    pillarThreeTitle: string;
    pillarThreeDetail: string;
  };
  collections: {
    sectionEyebrow: string;
    sectionTitle: string;
    sectionSubtitle: string;
    accordLabel: string;
    originLabel: string;
    exploreCollectionCreations: string;
    chapterPrefix: string;
  };
  creations: {
    sectionEyebrow: string;
    sectionTitle: string;
    sectionSubtitle: string;
    filterAll: string;
    topNotes: string;
    heartNotes: string;
    baseNotes: string;
    longevityLabel: string;
    projectionLabel: string;
    addToBag: string;
    addedToBag: string;
    saveToWishlist: string;
    removeFromWishlist: string;
    newCreation: string;
    houseSignature: string;
    vatIncludedNote: string;
    inspectNotes: string;
    hideNotes: string;
    longevityValues: {
      moderate: string;
      'long-lasting': string;
      eternal: string;
    };
    projectionValues: {
      intimate: string;
      moderate: string;
      commanding: string;
    };
  };
  drawers: {
    search: {
      title: string;
      placeholder: string;
      noResults: string;
      suggestedNotesLabel: string;
      clearFilter: string;
    };
    bag: {
      title: string;
      emptyTitle: string;
      emptyBody: string;
      exploreButton: string;
      subtotal: string;
      shipping: string;
      shippingComplimentary: string;
      vatIncludedLabel: string;
      total: string;
      complimentarySampleNote: string;
      removeItem: string;
      increaseQty: string;
      decreaseQty: string;
      continueBrowsing: string;
    };
    wishlist: {
      title: string;
      emptyTitle: string;
      emptyBody: string;
      moveToBag: string;
    };
    account: {
      title: string;
      subtitle: string;
      demoModeBadge: string;
      demoModeExplanation: string;
      activePersonaLabel: string;
      firebaseStatusLabel: string;
      firebaseConnected: string;
      firebasePortfolioMode: string;
      personas: Record<
        DemoPersona,
        {
          title: string;
          description: string;
        }
      >;
    };
  };
  footer: {
    statement: string;
    location: string;
    newsletterEyebrow: string;
    newsletterTitle: string;
    newsletterPlaceholder: string;
    newsletterSubmit: string;
    newsletterSuccess: string;
    newsletterError: string;
    languageLabel: string;
    copyright: string;
    privacy: string;
    terms: string;
    vatRegistryNote: string;
  };
}

export const DICTIONARIES: Record<Locale, Dictionary> = {
  ar: {
    brand: {
      name: 'رِواق',
      nameSecondary: 'RWAQ',
      tagline: 'دار عطور سعودية معاصرة',
      origin: 'الرياض · المملكة العربية السعودية',
    },
    a11y: {
      skipToContent: 'انتقل إلى المحتوى الرئيسي',
      openMenu: 'فتح قائمة التنقل',
      closeMenu: 'إغلاق القائمة',
      openSearch: 'البحث في العطور والمجموعات',
      openWishlist: 'عرض قائمة الأمنيات',
      openAccount: 'الحساب ووضع العرض التوضيحي',
      openBag: 'عرض حقيبة التسوق',
      switchLanguage: 'التبديل إلى اللغة الإنجليزية (English)',
      closeDrawer: 'إغلاق النافذة الجانبية',
      scrollToManifesto: 'التمرير إلى البيان العطري',
    },
    nav: {
      collections: 'المجموعات',
      creations: 'الابتكارات العطرية',
      manifesto: 'فلسفة الدار',
      house: 'الدار',
      languageToggleLabel: 'EN',
      languageToggleFull: 'English',
    },
    hero: {
      scrollPrompt: 'اكتشف رواق',
    },
    manifesto: {
      pillarOneTitle: 'أصالة المنشأ',
      pillarOneDetail:
        'خلاصات طبيعية منتقاة من الورد الطائفي واللبان الحوجري وأعواد العود المعتّقة.',
      pillarTwoTitle: 'تركيز إكسترايت',
      pillarTwoDetail:
        'تراكيز عطرية عالية تتراوح بين 25% و35% تمنح ثباتاً هادئاً يدوم طوال اليوم.',
      pillarThreeTitle: 'إهداء يليق بالمقام',
      pillarThreeDetail:
        'تغليف معماري مستوحى من الحجر النجدي والأنسجة الطبيعية بتفاصيل برونزية متقنة.',
    },
    collections: {
      sectionEyebrow: 'الثلاثية العطرية · الإصدار الأول',
      sectionTitle: 'المجموعات التوقيعية',
      sectionSubtitle:
        'ثلاثة عوالم عطرية تستمد ملامحها من جغرافيا الجزيرة العربية وتحولات الضوء والظل.',
      accordLabel: 'السمة العطرية',
      originLabel: 'الإلهام المكاني',
      exploreCollectionCreations: 'استعرض عطور المجموعة',
      chapterPrefix: 'الفصل',
    },
    creations: {
      sectionEyebrow: 'مختارات الدار · عطور موقّعة',
      sectionTitle: 'ابتكارات رِواق',
      sectionSubtitle:
        'ستة عطور مصاغة بتأنٍّ من أنقى الخلاصات العطرية؛ استكشف هرم النوتات لكل عطر أو أضفه إلى حقيبتك.',
      filterAll: 'جميع المجموعات',
      topNotes: 'الافتتاحية',
      heartNotes: 'القلب العطري',
      baseNotes: 'القاعدة',
      longevityLabel: 'الثبات',
      projectionLabel: 'الفوحان',
      addToBag: 'أضف إلى الحقيبة',
      addedToBag: 'تمت الإضافة إلى الحقيبة',
      saveToWishlist: 'حفظ في قائمة الأمنيات',
      removeFromWishlist: 'إزالة من قائمة الأمنيات',
      newCreation: 'إصدار جديد',
      houseSignature: 'الأكثر طلباً',
      vatIncludedNote: 'شامل ضريبة القيمة المضافة 15%',
      inspectNotes: 'تفاصيل النوتات',
      hideNotes: 'إخفاء النوتات',
      longevityValues: {
        moderate: 'معتدل',
        'long-lasting': 'طويل الأمد',
        eternal: 'ثبات فائق',
      },
      projectionValues: {
        intimate: 'حميمي هادئ',
        moderate: 'متوازن',
        commanding: 'حضور لافت',
      },
    },
    drawers: {
      search: {
        title: 'البحث والاستكشاف العطري',
        placeholder: 'ابحث باسم العطر، النوتة (عود، زعفران، ورد طائفي، مسك)...',
        noResults: 'لم يتم العثور على عطور مطابقة لبحثك.',
        suggestedNotesLabel: 'استكشف حسب النوتة العطرية',
        clearFilter: 'مسح',
      },
      bag: {
        title: 'حقيبة رِواق',
        emptyTitle: 'حقيبتكِ فارغة حالياً',
        emptyBody:
          'اختر من مجموعات نجد أو صحراء أو ليل لتجربة ابتكارات رِواق العطرية.',
        exploreButton: 'استكشف الابتكارات العطرية',
        subtotal: 'المجموع الفرعي',
        shipping: 'التوصيل داخل المملكة',
        shippingComplimentary: 'مجاني',
        vatIncludedLabel: 'ضريبة القيمة المضافة المتضمنة (15%)',
        total: 'الإجمالي شاملاً الضريبة',
        complimentarySampleNote:
          'يرفق مع كل طلب عينتان عطريتان (2 مل) لتجربة العطر قبل فتح الزجاجة الرئيسية.',
        removeItem: 'حذف العنصر',
        increaseQty: 'زيادة الكمية',
        decreaseQty: 'إنقاص الكمية',
        continueBrowsing: 'متابعة التصفح',
      },
      wishlist: {
        title: 'قائمة الأمنيات',
        emptyTitle: 'لا توجد عطور محفوظة بعد',
        emptyBody: 'احفظ ابتكاراتك المفضلة للعودة إليها ومقارنة نوتاتها العطرية.',
        moveToBag: 'نقل إلى الحقيبة',
      },
      account: {
        title: 'الحساب وبيئة العرض',
        subtitle:
          'تم إعداد هذا الأساس المعماري لدعم أدوار العملاء والمشتركين وقطاع الأعمال والإدارة.',
        demoModeBadge: 'وضع العرض التوضيحي للمحفظة (Portfolio Demo)',
        demoModeExplanation:
          'يتيح وضع العرض التوضيحي معاينة تجربة المنصة دون منح أي صلاحيات حقيقية على قاعدة البيانات.',
        activePersonaLabel: 'المنظور النشط حالياً',
        firebaseStatusLabel: 'حالة البنية السحابية (Firebase)',
        firebaseConnected: 'متصل بمشروع Firebase',
        firebasePortfolioMode: 'وضع المحفظة المستقل (البيانات المرجعية الموثقة)',
        personas: {
          customer: {
            title: 'عميل التجزئة الفاخرة (Customer)',
            description: 'تصفح المجموعات، استكشاف النوتات، وإدارة حقيبة التسوق.',
          },
          subscriber: {
            title: 'عضو الاشتراك العطري (Subscriber)',
            description: 'إدارة الدوريات العطرية ومزايا الولاء الخاصة.',
          },
          corporate: {
            title: 'عميل قطاع الأعمال والمراسم (Corporate B2B)',
            description: 'طلبات الإهداء المؤسسي وعروض الأسعار المعتمدة.',
          },
          admin: {
            title: 'إدارة الدار والعمليات (House Admin)',
            description: 'مراقبة المخزون، الطلبات، وإعدادات المنصة.',
          },
        },
      },
    },
    footer: {
      statement:
        'دار عطور سعودية معاصرة تصوغ العطر كذاكرة؛ تتقاطع فيها أصالة المواد الخام مع السكينة المعمارية الحديثة.',
      location: 'الرياض · المملكة العربية السعودية',
      newsletterEyebrow: 'رسائل الدار',
      newsletterTitle:
        'اشترك لتصلك دعوات الإصدارات المحدودة والقصص العطرية من رِواق.',
      newsletterPlaceholder: 'البريد الإلكتروني',
      newsletterSubmit: 'اشتراك',
      newsletterSuccess: 'شكرًا لاشتراكك في رسائل دار رِواق.',
      newsletterError: 'يرجى إدخال بريد إلكتروني صحيح.',
      languageLabel: 'اللغة',
      copyright: '© 2026 رِواق (RWAQ). جميع الحقوق محفوظة.',
      privacy: 'سياسة الخصوصية',
      terms: 'الشروط والأحكام',
      vatRegistryNote: 'جميع الأسعار بالريال السعودي وتشمل ضريبة القيمة المضافة 15%.',
    },
  },
  en: {
    brand: {
      name: 'RWAQ',
      nameSecondary: 'رِواق',
      tagline: 'A Saudi House of Scent',
      origin: 'Riyadh · Kingdom of Saudi Arabia',
    },
    a11y: {
      skipToContent: 'Skip to main content',
      openMenu: 'Open navigation menu',
      closeMenu: 'Close navigation menu',
      openSearch: 'Search fragrances and collections',
      openWishlist: 'Open saved fragrances wishlist',
      openAccount: 'Account and portfolio mode settings',
      openBag: 'Open shopping bag',
      switchLanguage: 'Switch language to Arabic (العربية)',
      closeDrawer: 'Close drawer panel',
      scrollToManifesto: 'Scroll to brand manifesto',
    },
    nav: {
      collections: 'Collections',
      creations: 'Creations',
      manifesto: 'Manifesto',
      house: 'The House',
      languageToggleLabel: 'عربي',
      languageToggleFull: 'العربية',
    },
    hero: {
      scrollPrompt: 'Discover RWAQ',
    },
    manifesto: {
      pillarOneTitle: 'Provenance of Raw Materials',
      pillarOneDetail:
        'First-harvest Taif rose absolute, Hojari frankincense, and aged agarwood sourced with uncompromising purity.',
      pillarTwoTitle: 'Extrait Concentration',
      pillarTwoDetail:
        'Composed at 25% to 35% oil concentration for an intimate yet enduring trail that unfolds across hours.',
      pillarThreeTitle: 'Ceremonial Presentation',
      pillarThreeDetail:
        'Architectural vessels and limestone-textured packaging finished with restrained brushed bronze.',
    },
    collections: {
      sectionEyebrow: 'The Olfactory Trilogy · Chapter I',
      sectionTitle: 'Signature Collections',
      sectionSubtitle:
        'Three distinct olfactory territories shaped by the landscapes, light, and nocturnal rituals of the Arabian Peninsula.',
      accordLabel: 'Primary Accord',
      originLabel: 'Spatial Inspiration',
      exploreCollectionCreations: 'Filter creations by collection',
      chapterPrefix: 'Chapter',
    },
    creations: {
      sectionEyebrow: 'House Selection · Composed Extraits',
      sectionTitle: 'Featured Creations',
      sectionSubtitle:
        'Six signature compositions crafted in high concentration. Inspect the olfactory pyramid or add a flacon to your bag.',
      filterAll: 'All Collections',
      topNotes: 'Top Notes',
      heartNotes: 'Heart Notes',
      baseNotes: 'Base Notes',
      longevityLabel: 'Longevity',
      projectionLabel: 'Sillage',
      addToBag: 'Add to Bag',
      addedToBag: 'Added to your bag',
      saveToWishlist: 'Save to wishlist',
      removeFromWishlist: 'Remove from wishlist',
      newCreation: 'New Release',
      houseSignature: 'House Signature',
      vatIncludedNote: 'Includes 15% Saudi VAT',
      inspectNotes: 'Olfactory Notes',
      hideNotes: 'Hide Notes',
      longevityValues: {
        moderate: 'Moderate',
        'long-lasting': 'Long-Lasting',
        eternal: 'Eternal',
      },
      projectionValues: {
        intimate: 'Intimate',
        moderate: 'Balanced',
        commanding: 'Commanding',
      },
    },
    drawers: {
      search: {
        title: 'Olfactory Discovery & Search',
        placeholder:
          'Search by creation name or note (oud, saffron, Taif rose, musk)...',
        noResults: 'No creations matched your search query.',
        suggestedNotesLabel: 'Explore by Olfactory Note',
        clearFilter: 'Clear',
      },
      bag: {
        title: 'Your RWAQ Bag',
        emptyTitle: 'Your bag is currently empty',
        emptyBody:
          'Select a creation from the Najd, Sahra, or Layl collections to begin.',
        exploreButton: 'Explore Creations',
        subtotal: 'Subtotal',
        shipping: 'KSA Concierge Delivery',
        shippingComplimentary: 'Complimentary',
        vatIncludedLabel: 'Included Saudi VAT (15%)',
        total: 'Total (VAT Included)',
        complimentarySampleNote:
          'Every order includes two complimentary 2ml discovery vials so you may experience the fragrance before unsealing your flacon.',
        removeItem: 'Remove item',
        increaseQty: 'Increase quantity',
        decreaseQty: 'Decrease quantity',
        continueBrowsing: 'Continue Browsing',
      },
      wishlist: {
        title: 'Saved Creations',
        emptyTitle: 'No saved creations yet',
        emptyBody:
          'Bookmark your preferred compositions to compare their olfactory pyramids.',
        moveToBag: 'Move to Bag',
      },
      account: {
        title: 'Account & Portfolio Context',
        subtitle:
          'Architectural foundation prepared for Customer, Subscriber, Corporate B2B, and House Admin roles.',
        demoModeBadge: 'Portfolio Demo Mode Active',
        demoModeExplanation:
          'Portfolio Demo Mode allows safe inspection of role states without granting real Firebase privileges or bypassing security boundaries.',
        activePersonaLabel: 'Active Preview Persona',
        firebaseStatusLabel: 'Firebase Cloud Status',
        firebaseConnected: 'Connected to Firebase Project',
        firebasePortfolioMode: 'Standalone Portfolio Mode (Typed Seed Data)',
        personas: {
          customer: {
            title: 'D2C Private Client (Customer)',
            description: 'Explore collections, inspect olfactory notes, and manage shopping bag.',
          },
          subscriber: {
            title: 'Scent Ritual Member (Subscriber)',
            description: 'Recurring fragrance cadence and patron tier privileges.',
          },
          corporate: {
            title: 'Corporate & Protocol Client (B2B)',
            description: 'Executive gifting allocations and VAT-itemized quotations.',
          },
          admin: {
            title: 'House Operations (Admin)',
            description: 'Catalog governance, inventory ledgers, and audit oversight.',
          },
        },
      },
    },
    footer: {
      statement:
        'A contemporary Saudi fragrance house crafting scent as memory — where noble raw materials meet modern architectural restraint.',
      location: 'Riyadh · Kingdom of Saudi Arabia',
      newsletterEyebrow: 'The House Letters',
      newsletterTitle:
        'Receive private invitations to limited distillations and editorial dispatches from RWAQ.',
      newsletterPlaceholder: 'Email address',
      newsletterSubmit: 'Subscribe',
      newsletterSuccess: 'Thank you. You are subscribed to RWAQ House Letters.',
      newsletterError: 'Please enter a valid email address.',
      languageLabel: 'Language',
      copyright: '© 2026 RWAQ (رِواق). All rights reserved.',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      vatRegistryNote: 'All prices are in Saudi Riyals (SAR) and include 15% VAT.',
    },
  },
};
