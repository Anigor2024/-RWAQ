import type {
  CatalogSort,
  DemoPersona,
  GenderPositioning,
  Locale,
  OccasionSuitability,
  OlfactoryFamilyKey,
  SeasonSuitability,
} from '@/types';

export interface CraftMaterialEntry {
  id: string;
  numeral: string;
  name: string;
  subtitle: string;
  description: string;
  olfactoryRole: string;
  sensoryProfile: string;
  featuredCreations: string;
  searchQuery: string;
  imageUrl: string;
  imageAlt: string;
}

export interface Dictionary {
  brand: {
    name: string;
    nameSecondary: string;
    tagline: string;
    origin: string;
  };
  units: {
    ml: string;
  };
  a11y: {
    skipToContent: string;
    primaryNavigation: string;
    openMenu: string;
    closeMenu: string;
    openSearch: string;
    openWishlist: string;
    openAccount: string;
    openBag: string;
    switchLanguage: string;
    closeDrawer: string;
    closeNotification: string;
    scrollToManifesto: string;
  };
  nav: {
    shop: string;
    scentFinder: string;
    giftAtelier: string;
    collections: string;
    creations: string;
    craft: string;
    manifesto: string;
    house: string;
    languageToggleLabel: string;
    languageToggleFull: string;
  };
  hero: {
    scrollPrompt: string;
    concentrationBadge: string;
    trilogyLabel: string;
  };
  signatureStrip: {
    ariaLabel: string;
    items: Array<{
      code: string;
      title: string;
      detail: string;
    }>;
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
    worldsInteractiveHint: string;
    featuredInCollectionLabel: string;
    materialCharacterLabel: string;
    worldsMeta: Record<
      'najd' | 'sahra' | 'layl',
      {
        material: string;
        atmosphere: string;
      }
    >;
  };
  creations: {
    sectionEyebrow: string;
    sectionTitle: string;
    sectionSubtitle: string;
    filterAll: string;
    flagshipBadge: string;
    supportingHeading: string;
    swipeHint: string;
    concentrationLabel: string;
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
    exploreFullCatalog: string;
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
  shop: {
    eyebrow: string;
    title: string;
    subtitle: string;
    allWorldsTab: string;
    creationsCountUnit: string;
    searchPlaceholder: string;
    clearSearch: string;
    showingResults: string;
    filtersToggle: string;
    hideFilters: string;
    showFilters: string;
    activeFiltersLabel: string;
    resetAllFilters: string;
    applyFilters: string;
    sortLabel: string;
    sortOptions: Record<CatalogSort, string>;
    filterGroups: {
      collection: string;
      family: string;
      projection: string;
      longevity: string;
      occasion: string;
      season: string;
      gender: string;
      price: string;
      curation: string;
    };
    allOption: string;
    families: Record<OlfactoryFamilyKey, string>;
    genders: Record<GenderPositioning, string>;
    seasons: Record<SeasonSuitability, string>;
    occasions: Record<OccasionSuitability, string>;
    pricePresets: {
      all: string;
      under700: string;
      from700To850: string;
      above850: string;
    };
    curationFlags: {
      bestsellersOnly: string;
      newReleasesOnly: string;
      inStockOnly: string;
    };
    card: {
      selectSizeLabel: string;
      inspectDossier: string;
      viewCreation: string;
      inStockLabel: string;
      limitedStockLabel: string;
      outOfStockLabel: string;
      skuLabel: string;
    };
    dossier: {
      drawerTitle: string;
      editorialHeading: string;
      inspirationHeading: string;
      ritualHeading: string;
      whenToWearHeading: string;
      accordsHeading: string;
      ingredientsHeading: string;
      variantsHeading: string;
      characterLabel: string;
      seasonLabel: string;
      occasionLabel: string;
      filterByCollectionAction: string;
      filterByFamilyAction: string;
      viewFullCreationPage: string;
    };
    emptyState: {
      eyebrow: string;
      title: string;
      description: string;
      resetButton: string;
      suggestedNotesTitle: string;
    };
  };
  pdp: {
    breadcrumbAriaLabel: string;
    homeLabel: string;
    shopLabel: string;
    galleryAriaLabel: string;
    previousImage: string;
    nextImage: string;
    selectImage: string;
    selectSizeLabel: string;
    quantityLabel: string;
    decreaseQuantity: string;
    increaseQuantity: string;
    maxQuantityNote: string;
    inStockStatus: string;
    limitedStockStatus: string;
    outOfStockStatus: string;
    viewBagAction: string;
    mobileStickyBarAria: string;
    reassurance: Array<{
      code: string;
      title: string;
      detail: string;
    }>;
    storyEyebrow: string;
    storyHeading: string;
    inspirationHeading: string;
    architecturalContextLabel: string;
    pyramidEyebrow: string;
    pyramidHeading: string;
    pyramidSubtitle: string;
    topTierDescription: string;
    heartTierDescription: string;
    baseTierDescription: string;
    accordsEyebrow: string;
    accordsHeading: string;
    accordsSubtitle: string;
    performanceEyebrow: string;
    performanceHeading: string;
    performanceSubtitle: string;
    longevityTitle: string;
    projectionTitle: string;
    seasonTitle: string;
    occasionTitle: string;
    characterTitle: string;
    ingredientsEyebrow: string;
    ingredientsHeading: string;
    ingredientsSubtitle: string;
    originLabel: string;
    ritualEyebrow: string;
    ritualHeading: string;
    applicationHeading: string;
    whenToWearHeading: string;
    relatedEyebrow: string;
    relatedHeading: string;
    relatedSubtitle: string;
    returnToCatalog: string;
    giftCreationAction: string;
  };
  craft: {
    sectionEyebrow: string;
    sectionTitle: string;
    sectionSubtitle: string;
    olfactoryRoleLabel: string;
    sensoryProfileLabel: string;
    featuredInLabel: string;
    exploreNoteInSearch: string;
    materials: CraftMaterialEntry[];
  };
  concierge: {
    sectionEyebrow: string;
    sectionTitle: string;
    sectionSubtitle: string;
    primaryAction: string;
    secondaryAction: string;
    giftAtelierAction: string;
    pillars: Array<{
      code: string;
      title: string;
      description: string;
      detail: string;
    }>;
  };
  drawers: {
    mobileMenu: {
      title: string;
    };
    search: {
      title: string;
      placeholder: string;
      noResults: string;
      suggestedNotesLabel: string;
      clearFilter: string;
      viewAllInShop: string;
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
      proceedToCheckout: string;
      continueBrowsing: string;
      giftBundlesSectionTitle: string;
      standaloneSectionTitle: string;
      giftAtelierBadge: string;
      giftOccasionPrefix: string;
      giftPresentationLine: string;
      giftCardToPrefix: string;
      giftCardFromPrefix: string;
      giftBundleTotalLabel: string;
      removeGiftBundle: string;
      composeGiftAction: string;
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
      verifiedRoleLabel: string;
      verifiedRoleNone: string;
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
  homeScentFinder: {
    eyebrow: string;
    title: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
    durationNote: string;
    pillars: Array<{
      code: string;
      label: string;
    }>;
  };
  scentFinder: {
    eyebrow: string;
    title: string;
    subtitle: string;
    leadQuote: string;
    description: string;
    beginCta: string;
    resumeCta: string;
    exploreShopCta: string;
    startOverCta: string;
    durationMeta: string;
    methodologyMeta: string;
    progressAriaLabel: string;
    stepLabel: string;
    ofLabel: string;
    singleSelectHint: string;
    multiSelectHint: string;
    multiSelectCount: string;
    backAction: string;
    continueAction: string;
    revealMatchAction: string;
    characterSubQuestionLabel: string;
    characterSubQuestionHint: string;
    resultsEyebrow: string;
    resultsHeadline: string;
    resultsSubheadline: string;
    affinityScoreLabel: string;
    affinityMethodologyNote: string;
    whyMatchedHeading: string;
    keyNotesLabel: string;
    viewCreationAction: string;
    inspectQuickDossierAction: string;
    alternatesEyebrow: string;
    alternatesHeading: string;
    alternatesSubtitle: string;
    contrastBadgePrefix: string;
    profileSummaryEyebrow: string;
    profileSummaryHeading: string;
    profilePresenceLabel: string;
    profileMaterialsLabel: string;
    profileWorldLabel: string;
    profileOccasionLabel: string;
    profileProjectionLabel: string;
    profileLongevityLabel: string;
    exploreSimilarInShopAction: string;
    refineAnswersAction: string;
    emptyCatalogTitle: string;
    emptyCatalogSubtitle: string;
    emptyCatalogReturnToShop: string;
    emptyCatalogStartAgain: string;
  };
  giftBuilder: {
    eyebrow: string;
    title: string;
    subtitle: string;
    leadQuote: string;
    description: string;
    beginCta: string;
    resumeCta: string;
    startOverCta: string;
    exploreShopCta: string;
    scentFinderCta: string;
    complimentaryPresentationMeta: string;
    transparentPricingMeta: string;
    pillars: Array<{
      code: string;
      title: string;
      detail: string;
    }>;
    progressAriaLabel: string;
    stepLabel: string;
    ofLabel: string;
    backAction: string;
    continueAction: string;
    proceedToReviewAction: string;
    occasionStepHint: string;
    occasionGuidanceLabel: string;
    sizeStepHint: string;
    presentationIncludedBadge: string;
    presentationNoFeeNote: string;
    fragranceStepHint: string;
    slotLabel: string;
    slotEmptyState: string;
    slotSelectedState: string;
    slotActiveEditing: string;
    selectSlotToCurate: string;
    filterAllCreations: string;
    filterRecommendedForOccasion: string;
    recommendedForOccasionTag: string;
    inAnotherSlotTag: string;
    selectForSlotAction: string;
    selectedInActiveSlotAction: string;
    changeVariantLabel: string;
    removeSlotSelectionAction: string;
    inspectDossierAction: string;
    stockExhaustedNote: string;
    messageStepHint: string;
    includeCardToggleLabel: string;
    includeCardDescription: string;
    blankCardToggleLabel: string;
    blankCardDescription: string;
    recipientLabel: string;
    recipientPlaceholder: string;
    senderLabel: string;
    senderPlaceholder: string;
    messageBodyLabel: string;
    messageBodyPlaceholder: string;
    characterLimitNote: string;
    suggestedMessagesTitle: string;
    useSuggestedMessageAction: string;
    cardPreviewTitle: string;
    cardPreviewEmptyBody: string;
    cardPreviewBlankNotice: string;
    reviewEyebrow: string;
    reviewHeading: string;
    reviewSubtitle: string;
    changeStepAction: string;
    summarySidebarTitle: string;
    summaryOccasionLabel: string;
    summarySetSizeLabel: string;
    summaryPresentationLabel: string;
    summaryComplimentaryValue: string;
    summarySlotsProgressLabel: string;
    summaryDedicationLabel: string;
    summaryDedicationIncluded: string;
    summaryDedicationBlank: string;
    summaryFragrancesSubtotal: string;
    summaryShippingLabel: string;
    summaryVatIncludedLabel: string;
    summaryTotalLabel: string;
    summaryCommercialPolicyNote: string;
    addGiftToBagCta: string;
    addedGiftToBagToast: string;
    composeAnotherGiftAction: string;
    validationIncompleteSlots: string;
    validationStockExceeded: string;
    validationDuplicateVariant: string;
    sizeReductionWarningTitle: string;
    sizeReductionWarningBody: string;
    confirmSizeReductionAction: string;
    manageSlotsBeforeReductionAction: string;
    cancelSizeReductionAction: string;
    emptyCatalogTitle: string;
    emptyCatalogSubtitle: string;
  };
  checkout: {
    title: string;
    reassuranceNote: string;
    returnToBagAction: string;
    returnToShopAction: string;
    progressAriaLabel: string;
    stepLabel: string;
    stages: {
      contact: {
        code: string;
        label: string;
      };
      delivery: {
        code: string;
        label: string;
      };
      review: {
        code: string;
        label: string;
      };
    };
    emptyEyebrow: string;
    emptyTitle: string;
    emptyDescription: string;
    exploreFragrancesCta: string;
    giftAtelierCta: string;
    blockedEyebrow: string;
    blockedTitle: string;
    blockedDescription: string;
    blockedIssueUnavailable: string;
    blockedIssueStock: string;
    blockedIssueGiftBundle: string;
    reviewBagCta: string;
    continueShoppingCta: string;
    priceChangedNotice: string;
    contact: {
      eyebrow: string;
      heading: string;
      subtitle: string;
      fullNameLabel: string;
      fullNamePlaceholder: string;
      emailLabel: string;
      emailPlaceholder: string;
      phoneLabel: string;
      phonePlaceholder: string;
      phoneHint: string;
      continueToDeliveryCta: string;
      errors: {
        invalid_full_name: string;
        invalid_email: string;
        invalid_phone: string;
      };
    };
    delivery: {
      eyebrow: string;
      heading: string;
      subtitle: string;
      useContactDetailsAction: string;
      recipientNameLabel: string;
      recipientNamePlaceholder: string;
      recipientPhoneLabel: string;
      recipientPhonePlaceholder: string;
      countryLabel: string;
      countryValue: string;
      cityLabel: string;
      cityPlaceholder: string;
      districtLabel: string;
      districtPlaceholder: string;
      streetLabel: string;
      streetPlaceholder: string;
      additionalDetailsToggle: string;
      additionalDetailsOptionalTag: string;
      buildingNumberLabel: string;
      buildingNumberPlaceholder: string;
      postalCodeLabel: string;
      postalCodePlaceholder: string;
      nationalShortCodeLabel: string;
      nationalShortCodePlaceholder: string;
      deliveryNotesLabel: string;
      deliveryNotesPlaceholder: string;
      deliveryNotesCounter: string;
      deliveryMethodSectionTitle: string;
      standardDeliveryTitle: string;
      standardDeliveryDescription: string;
      complimentaryStandardDelivery: string;
      backToContactAction: string;
      continueToReviewCta: string;
      errors: {
        invalid_recipient_name: string;
        invalid_phone: string;
        invalid_city: string;
        invalid_district: string;
        invalid_street: string;
        invalid_building_number: string;
        invalid_postal_code: string;
        invalid_national_short_code: string;
        invalid_delivery_notes: string;
      };
    };
    review: {
      eyebrow: string;
      heading: string;
      subtitle: string;
      contactSummaryTitle: string;
      editContactAction: string;
      deliverySummaryTitle: string;
      editDeliveryAction: string;
      deliveryMethodSummaryTitle: string;
      itemsSectionTitle: string;
      standaloneItemsHeading: string;
      giftBundlesHeading: string;
      quantityLabel: string;
      unitPriceLabel: string;
      lineTotalLabel: string;
      giftAtelierBadge: string;
      giftPresentationValue: string;
      giftSlotPrefix: string;
      giftDedicationHeading: string;
      giftDedicationTo: string;
      giftDedicationFrom: string;
      giftDedicationBlank: string;
      paymentSectionEyebrow: string;
      paymentSectionTitle: string;
      paymentSectionSubtitle: string;
      paymentDemoBadge: string;
      paymentDemoNotice: string;
      confirmDemoOrderCta: string;
      confirmingDemoOrderCta: string;
      completionErrors: {
        invalid_payment_method: string;
        invalid_checkout_draft: string;
        checkout_not_ready: string;
        receipt_persistence_failed: string;
      };
      reviewFooterNotice: string;
      backToDeliveryAction: string;
    };
    confirmation: {
      eyebrow: string;
      heading: string;
      subtitle: string;
      demoBannerTitle: string;
      demoBannerBody: string;
      orderNumberLabel: string;
      createdAtLabel: string;
      orderStatusLabel: string;
      orderStatusValue: string;
      paymentMethodLabel: string;
      paymentStatusLabel: string;
      paymentStatusValue: string;
      contactSectionTitle: string;
      deliverySectionTitle: string;
      deliveryMethodLabel: string;
      itemsSectionTitle: string;
      financialSummaryTitle: string;
      continueShoppingCta: string;
      giftAtelierCta: string;
      returnHomeCta: string;
      clearReceiptAction: string;
      loadingReceiptLabel: string;
      emptyEyebrow: string;
      emptyTitle: string;
      emptyDescription: string;
      emptyCheckoutCta: string;
    };
    summary: {
      title: string;
      mobileShowSummary: string;
      mobileHideSummary: string;
      subtotalLabel: string;
      deliveryLabel: string;
      vatIncludedBreakdownLabel: string;
      totalLabel: string;
      vatRetailCopy: string;
      unitCountLabel: string;
      singleUnitLabel: string;
    };
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
    units: {
      ml: 'مل',
    },
    a11y: {
      skipToContent: 'انتقل إلى المحتوى الرئيسي',
      primaryNavigation: 'التنقل الرئيسي',
      openMenu: 'فتح قائمة التنقل',
      closeMenu: 'إغلاق القائمة',
      openSearch: 'البحث في العطور والمجموعات',
      openWishlist: 'عرض قائمة الأمنيات',
      openAccount: 'الحساب ووضع العرض التوضيحي',
      openBag: 'عرض حقيبة التسوق',
      switchLanguage: 'التبديل إلى اللغة الإنجليزية (English)',
      closeDrawer: 'إغلاق النافذة الجانبية',
      closeNotification: 'إغلاق الإشعار',
      scrollToManifesto: 'التمرير إلى البيان العطري',
    },
    nav: {
      shop: 'العطور',
      scentFinder: 'اكتشف عطرك',
      giftAtelier: 'مشغل الهدايا',
      collections: 'المجموعات',
      creations: 'الابتكارات العطرية',
      craft: 'الخامات والحِرفة',
      manifesto: 'فلسفة الدار',
      house: 'الدار',
      languageToggleLabel: 'EN',
      languageToggleFull: 'English',
    },
    hero: {
      scrollPrompt: 'استكشف عالم رِواق',
      concentrationBadge: 'إكسترايت دي بارفان · تركيز ٢٥٪ – ٣٥٪',
      trilogyLabel: 'الثلاثية التوقيعية: نَجد · صَحراء · لَيل',
    },
    signatureStrip: {
      ariaLabel: 'سمات دار رِواق',
      items: [
        {
          code: 'I',
          title: 'تركيزات عطرية عالية',
          detail: 'تركيبات إكسترايت وأبسولو بتركيز ٢٥٪ إلى ٣٥٪ لثباتٍ عميق وفوحان متزن.',
        },
        {
          code: 'II',
          title: 'خامات مختارة',
          detail: 'العود المعتّق، الورد الطائفي في قطفته الأولى، الزعفران، واللبان الحوجري.',
        },
        {
          code: 'III',
          title: 'هوية سعودية معاصرة',
          detail: 'تراكيب تستلهم سكينة المعمار النجدي وتحولات الضوء في الجزيرة العربية.',
        },
        {
          code: 'IV',
          title: 'إهداء فاخر',
          detail: 'زجاجات منحوتة من الزجاج المدخّن ومقصورات تحاكي ملمس الحجر الجيري والبرونز.',
        },
      ],
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
      sectionEyebrow: 'العوالم العطرية · الثلاثية التوقيعية',
      sectionTitle: 'عوالم رِواق العطرية',
      sectionSubtitle:
        'ثلاثة عوالم حسية تستمد ملامحها من جغرافيا الجزيرة العربية وتباين الحجر والرمال وسكينة الليل.',
      accordLabel: 'السمة العطرية',
      originLabel: 'الإلهام المكاني',
      exploreCollectionCreations: 'استعرض عطور المجموعة',
      chapterPrefix: 'الفصل',
      worldsInteractiveHint: 'انتقل بين الفصول الثلاثة أو استكشف كل عالم بالتفصيل',
      featuredInCollectionLabel: 'عطور هذا العالم',
      materialCharacterLabel: 'الطابع المادي والضوئي',
      worldsMeta: {
        najd: {
          material: 'حجر الترافرتين النجدي · الزعفران الأحمر · خشب الأرز',
          atmosphere: 'ضوء الأصيل الدافئ على الشرفات الحجرية في الدرعية',
        },
        sahra: {
          material: 'العود المعتّق · اللبان الحوجري · الجلد المصقول',
          atmosphere: 'وهج الجمار الهادئ وامتداد الكثبان الرملية عند الغروب',
        },
        layl: {
          material: 'حجر البازلت المصقول · الورد الطائفي · المسك الأبيض',
          atmosphere: 'سكينة السمر الليلي تحت سماء الطائف والعُلا الصافية',
        },
      },
    },
    creations: {
      sectionEyebrow: 'مختارات الدار · عطور موقّعة',
      sectionTitle: 'ابتكارات رِواق',
      sectionSubtitle:
        'ستة عطور مصاغة بتأنٍّ في تركيزات عالية؛ استكشف الإصدار التوقيعي المختار أو تصفح التشكيلة الكاملة.',
      filterAll: 'جميع المجموعات',
      flagshipBadge: 'الإصدار التوقيعي المختار',
      supportingHeading: 'بقية ابتكارات التشكيلة',
      swipeHint: 'اسحب أفقياً لاستعراض العطور',
      concentrationLabel: 'التركيز',
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
      exploreFullCatalog: 'استكشف الكتالوج الكامل (18 ابتكاراً عطرياً)',
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
    shop: {
      eyebrow: 'دار رِواق · المجموعة العطرية الكاملة',
      title: 'عطور رِواق',
      subtitle:
        'مجموعة من التركيبات السعودية المعاصرة، من العود والزعفران إلى الورد الطائفي والمسك.',
      allWorldsTab: 'جميع المجموعات',
      creationsCountUnit: 'عطراً',
      searchPlaceholder:
        'ابحث باسم العطر، النوتة (عود، زعفران، ورد طائفي، صندل، مسك)، أو الرمز...',
      clearSearch: 'مسح البحث',
      showingResults: 'عرض {shown} من أصل {total} ابتكاراً عطرياً',
      filtersToggle: 'تصفية العطور',
      hideFilters: 'إخفاء الفلاتر',
      showFilters: 'إظهار الفلاتر',
      activeFiltersLabel: 'الفلاتر النشطة',
      resetAllFilters: 'إعادة تعيين الكل',
      applyFilters: 'عرض الابتكارات المطابقة',
      sortLabel: 'الترتيب حسب',
      sortOptions: {
        featured: 'مختارات الدار',
        bestsellers: 'الأكثر طلباً',
        newest: 'الأحدث إصداراً',
        'price-asc': 'السعر: من الأقل إلى الأعلى',
        'price-desc': 'السعر: من الأعلى إلى الأقل',
        name: 'الترتيب الأبجدي',
      },
      filterGroups: {
        collection: 'العالم العطري (المجموعة)',
        family: 'العائلة العطرية',
        projection: 'الفوحان والحضور',
        longevity: 'درجة الثبات',
        occasion: 'المناسبة الملائمة',
        season: 'الموسم الموصى به',
        gender: 'الطابع العطري',
        price: 'نطاق السعر (ر.س)',
        curation: 'الإصدارات والتوفر',
      },
      allOption: 'الكل',
      families: {
        'woody-amber': 'أخشاب وعنبر صخري',
        'smoky-oud': 'عود مدخّن وجلد',
        'floral-musk': 'ورد طائفي ومسك',
        'spiced-oriental': 'توابل وقهوة شقراء',
        'incense-resinous': 'لبان حوجري وراتنجات',
        'leather-iris': 'جلد مصقول وسوسن',
      },
      genders: {
        unisex: 'للجنسين (توقيع متوازن)',
        'masculine-leaning': 'طابع مهيب وجاف',
        'feminine-leaning': 'طابع زهري مخملي',
      },
      seasons: {
        'all-season': 'جميع الفصول',
        'autumn-winter': 'الخريف والشتاء',
        'spring-summer': 'الربيع والصيف',
        evening: 'الأمسيات والليل',
      },
      occasions: {
        signature: 'توقيع يومي راقٍ',
        majlis: 'المجالس والضيافة',
        evening: 'أمسيات خاصة',
        ceremonial: 'مراسم ومناسبات رسمية',
        intimate: 'لقاءات حميمية هادئة',
      },
      pricePresets: {
        all: 'جميع الأسعار',
        under700: 'أقل من 700 ر.س',
        from700To850: '700 – 850 ر.س',
        above850: 'أكثر من 850 ر.س',
      },
      curationFlags: {
        bestsellersOnly: 'الأكثر طلباً في الدار',
        newReleasesOnly: 'الإصدارات الجديدة فقط',
        inStockOnly: 'المتوفر للشحن الفوري',
      },
      card: {
        selectSizeLabel: 'الحجم',
        inspectDossier: 'معاينة سريعة',
        viewCreation: 'صفحة العطر',
        inStockLabel: 'متوفر',
        limitedStockLabel: 'تخصيص محدود',
        outOfStockLabel: 'غير متوفر حالياً',
        skuLabel: 'الرمز',
      },
      dossier: {
        drawerTitle: 'معاينة سريعة · الملف العطري',
        editorialHeading: 'القصة والبناء العطري',
        inspirationHeading: 'الإلهام المكاني',
        ritualHeading: 'طقس الاستخدام',
        whenToWearHeading: 'أوقات الارتداء الموصى بها',
        accordsHeading: 'كثافة السمات العطرية',
        ingredientsHeading: 'أبرز الخامات النبيلة',
        variantsHeading: 'الأحجام والتراكيز المتوفرة',
        characterLabel: 'الطابع',
        seasonLabel: 'الموسم',
        occasionLabel: 'المناسبة',
        filterByCollectionAction: 'تصفح كامل مجموعة',
        filterByFamilyAction: 'استكشف عائلة',
        viewFullCreationPage: 'استعراض صفحة العطر الكاملة',
      },
      emptyState: {
        eyebrow: 'لا توجد نتائج مطابقة',
        title: 'لم نجد عطراً يطابق هذه الاختيارات.',
        description:
          'جرّب إزالة بعض الفلاتر النشطة، أو البحث بنوتة عطرية مختلفة، أو مسح عوامل التصفية لاستعراض جميع ابتكارات رِواق الثمانية عشر.',
        resetButton: 'مسح عوامل التصفية',
        suggestedNotesTitle: 'أو ابدأ الاستكشاف عبر النوتة العطرية:',
      },
    },
    pdp: {
      breadcrumbAriaLabel: 'مسار التنقل التفصيلي',
      homeLabel: 'الرئيسية',
      shopLabel: 'المتجر العطري',
      galleryAriaLabel: 'معرض صور العطر',
      previousImage: 'الصورة السابقة',
      nextImage: 'الصورة التالية',
      selectImage: 'عرض الصورة رقم',
      selectSizeLabel: 'اختر حجم الزجاجة',
      quantityLabel: 'الكمية',
      decreaseQuantity: 'إنقاص الكمية',
      increaseQuantity: 'زيادة الكمية',
      maxQuantityNote: 'الحد الأقصى المتاح للطلب الفوري',
      inStockStatus: 'متوفر للشحن الفوري داخل المملكة',
      limitedStockStatus: 'إصدار بكمية محدودة متبقية',
      outOfStockStatus: 'نفدت الكمية المخصصة حالياً',
      viewBagAction: 'معاينة الحقيبة',
      mobileStickyBarAria: 'شريط الاقتناء السريع',
      reassurance: [
        {
          code: 'I',
          title: 'تجرِبة العينات المرفقة',
          detail: 'يرفق مع كل زجاجة عينتان استكشافيتان (2 مل) لتجربة العطر على البشرة قبل فضّ الختم.',
        },
        {
          code: 'II',
          title: 'مقصورة الإهداء النجدية',
          detail: 'تُقدّم الزجاجة داخل علبة معمارية مكسوة بنسيج الحجر الجيري وتفاصيل البرونز المصقول.',
        },
        {
          code: 'III',
          title: 'توصيل خاص داخل المملكة',
          detail: 'شحن مبرد ومؤمّن لجميع مدن المملكة العربية السعودية (مجاني للطلبات فوق 500 ر.س).',
        },
      ],
      storyEyebrow: 'الفصل الأول · القصة والإلهام',
      storyHeading: 'البناء العطري والذاكرة المكانية',
      inspirationHeading: 'الإلهام المعماري والجغرافي',
      architecturalContextLabel: 'توقيع دار رِواق · الرياض',
      pyramidEyebrow: 'الفصل الثاني · الهندسة العطرية',
      pyramidHeading: 'هرم النوتات العطرية',
      pyramidSubtitle:
        'يتكشف العطر على البشرة عبر ثلاث طبقات متتابعة؛ من إشراقة الافتتاحية وحتى استقرار القاعدة العميقة.',
      topTierDescription: 'الانطباع الأول والمقدمة المشرقة فور ملامسة العطر للهواء',
      heartTierDescription: 'المحور العطري النابض الذي يتبلور بعد دقائق على البشرة',
      baseTierDescription: 'الأثر العميق والراتنجات النبيلة التي تدوم لساعات طويلة',
      accordsEyebrow: 'البصمة الحسية · توازن التركيبة',
      accordsHeading: 'معمارية السمات العطرية',
      accordsSubtitle:
        'توزيع الكثافة النسبية للسمات العطرية الرئيسية التي تشكل شخصية هذا الابتكار.',
      performanceEyebrow: 'الفصل الثالث · الأداء والطابع',
      performanceHeading: 'ملف الثبات والفوحان والملاءمة',
      performanceSubtitle:
        'قراءة معمارية لدرجة الثبات وانتشار الأثر العطري والأوقات الموصى بها لارتدائه.',
      longevityTitle: 'درجة الثبات',
      projectionTitle: 'الفوحان والحضور',
      seasonTitle: 'الموسم الموصى به',
      occasionTitle: 'المناسبة الملائمة',
      characterTitle: 'الطابع العطري',
      ingredientsEyebrow: 'الفصل الرابع · الخامات النبيلة',
      ingredientsHeading: 'أبرز المكونات ومصادر الإلهام',
      ingredientsSubtitle:
        'خامات عطرية مختارة بعناية تشكّل العمود الفقري لهذا التركيب وتمنحه عمقه المميز.',
      originLabel: 'المنشأ والسمة',
      ritualEyebrow: 'الفصل الخامس · مراسم الارتداء',
      ritualHeading: 'طقس الاستخدام وأوقات الارتداء',
      applicationHeading: 'طقس التطبيق الموصى به',
      whenToWearHeading: 'الأوقات والمجالس الملائمة',
      relatedEyebrow: 'استكشاف متصل · من أروقة الدار',
      relatedHeading: 'ابتكارات عطرية ذات صلة',
      relatedSubtitle:
        'تراكيب مختارة تشترك في العالم العطري أو تتناغم مع العائلة العطرية لهذا الإصدار.',
      returnToCatalog: 'العودة إلى المتجر الكامل',
      giftCreationAction: 'تقديم هذا الابتكار كهدية في مشغل رِواق',
    },
    craft: {
      sectionEyebrow: 'الحِرفة والخامات · لغة التصميم العطري',
      sectionTitle: 'خاماتٌ نبيلة صِيغت بروح معاصرة',
      sectionSubtitle:
        'تتشكل لغة رِواق من حوارٍ مدروس بين أربع خامات عطرية أصيلة ومفردات المعمار السعودي؛ حيث تتحول المادة الخام إلى حضورٍ ملموس.',
      olfactoryRoleLabel: 'الدور في البناء العطري',
      sensoryProfileLabel: 'البصمة الحسية',
      featuredInLabel: 'يبرز في عطور',
      exploreNoteInSearch: 'استكشف العطور بهذه السمة',
      materials: [
        {
          id: 'oud',
          numeral: '01',
          name: 'العود المعتّق',
          subtitle: 'عمق الخشب الراتنجي والوقار الهادئ',
          description:
            'تُصاغ نوتات العود في رِواق بعيداً عن الحدة التقليدية؛ حيث يُصقل العود الكمبودي والملكي بطبقات من الأخشاب الجافة والعنبر ليمنح العطر قاعدة دافئة ومهيبة.',
          olfactoryRole: 'قاعدة ارتكازية تمنح الثبات الفائق والعمق الخشبي الدافئ',
          sensoryProfile: 'راتنجي · خشبي داكن · دافئ ومصقول',
          featuredCreations: 'أثَر (ATHAR) · مَقام (MAQAM) · ظِل (ZILL)',
          searchQuery: 'عود',
          imageUrl: '/images/rwaq/products/rwaq_prod_sahra_incense_1790766997373.jpg',
          imageAlt: 'رقائق العود المعتق واللبان الحوجري بجانب زجاجة عطر رِواق',
        },
        {
          id: 'taif-rose',
          numeral: '02',
          name: 'الورد الطائفي',
          subtitle: 'إشراقة القطفة الأولى في أعالي الجبال',
          description:
            'نستحضر الورد الطائفي في توازنٍ معاصر يجمع بين النضارة الزهرية والعمق المخملي، ممزوجاً بالتين الداكن والشاي المدخن والمسك النقي.',
          olfactoryRole: 'قلب عطري نابض يمنح التوهج والنعومة المخملية',
          sensoryProfile: 'زهري ندي · فاكهي داكن · مخملي',
          featuredCreations: 'وَجد (WAJD)',
          searchQuery: 'ورد طائفي',
          imageUrl: '/images/rwaq/products/rwaq_prod_layl_rose_1790767019885.jpg',
          imageAlt: 'بتلات الورد الطائفي والتين الداكن على حجر البازلت',
        },
        {
          id: 'saffron',
          numeral: '03',
          name: 'الزعفران والهيل',
          subtitle: 'ذهب الصحراء الأحمر وحفاوة المجالس',
          description:
            'خيوط الزعفران الأحمر وحبوب الهيل الأخضر تمنح افتتاحيات رِواق توقيعاً مشرقاً يستحضر دفء الضيافة السعودية وهيبة القصور النجدية.',
          olfactoryRole: 'افتتاحية مشرقة تربط التوابل الدافئة بالعنبر الصخري',
          sensoryProfile: 'تابلي مشرق · جلدي ناعم · دافئ',
          featuredCreations: 'سَرى (SARA) · مَقام (MAQAM)',
          searchQuery: 'زعفران',
          imageUrl: '/images/rwaq/products/rwaq_prod_najd_saffron_1790766970563.jpg',
          imageAlt: 'خيوط الزعفران الأحمر وحبوب الهيل على حجر الترافرتين',
        },
        {
          id: 'frankincense',
          numeral: '04',
          name: 'اللبان والمرّ العربي',
          subtitle: 'أثر الدخان النقي والراتنجات الصحراوية',
          description:
            'يمثل اللبان الحوجري والمرّ العربي الذاكرة الهوائية للعطر؛ طبقة شفافة من الدخان العطري النقي الذي يملأ المكان بهدوءٍ مهيب.',
          olfactoryRole: 'جسر عطري يمنح الفوحان الهوائي والعمق البلسمي',
          sensoryProfile: 'بلسمي · دخاني شفاف · معدني دافئ',
          featuredCreations: 'أثَر (ATHAR) · ظِل (ZILL)',
          searchQuery: 'لبان',
          imageUrl: '/images/rwaq/products/rwaq_prod_sahra_myrrh_1790767009599.jpg',
          imageAlt: 'راتنج المر العربي واللبان مع زجاجة عطر رِواق',
        },
        {
          id: 'architecture',
          numeral: '05',
          name: 'المعمار والحجر النجدي',
          subtitle: 'من هندسة الأروقة إلى نحت الزجاجة',
          description:
            'استُلهم تصميم زجاجة رِواق من الكتل المعمارية النجدية وتدرجات الحجر الجيري والبازلت؛ زجاج مدخّن ثقيل يعلوه غطاء برونزي مصقول يحفظ الخلاصة العطرية.',
          olfactoryRole: 'وعاء معماري يحمي الخلاصة العطرية من الضوء والحرارة',
          sensoryProfile: 'حجر جيري دافئ · زجاج مدخّن · برونز مصقول',
          featuredCreations: 'جميع إصدارات نَجد وصَحراء ولَيل',
          searchQuery: 'مسك',
          imageUrl: '/images/rwaq/product_flacon_studio_1790732089787.jpg',
          imageAlt: 'زجاجة رِواق المنحوتة من الزجاج المدخن والبرونز على قاعدة من الحجر الجيري',
        },
      ],
    },
    concierge: {
      sectionEyebrow: 'مراسم الدار · تجربة رِواق',
      sectionTitle: 'تجربةٌ صُممت لتليق بحضورك',
      sectionSubtitle:
        'في رِواق، يمتد الاعتناء بالعطر إلى الطريقة التي يُقدّم ويُختبر بها؛ من اختيار النوتة الملائمة وحتى مراسم الإهداء.',
      primaryAction: 'ابدأ الاستكشاف بالبحث العطري',
      secondaryAction: 'معاينة حقيبة الاقتناء',
      giftAtelierAction: 'ادخل مشغل هدايا رِواق',
      pillars: [
        {
          code: '01',
          title: 'تجرِبة العينات المرفقة',
          description:
            'فلسفة الاقتناء الواثق؛ صُممت تجربة رِواق لتتيح لك اختبار العطر على البشرة عبر عينات استكشافية قبل فضّ ختم الزجاجة الرئيسية.',
          detail: 'عينتان استكشافيتان (2 مل) ضمن مفهوم تقديم الطلبات',
        },
        {
          code: '02',
          title: 'مقصورة الإهداء المعمارية',
          description:
            'تُقدّم كل زجاجة داخل علبة صلبة مكسوة بنسيج يحاكي الحجر الجيري النجدي، ومزودة بتفاصيل برونزية تجعلها جاهزة للإهداء الرفيع.',
          detail: 'تصميم يجمع المتانة المعمارية والبساطة الفاخرة',
        },
        {
          code: '03',
          title: 'الاستكشاف عبر النوتات والعوالم',
          description:
            'سواء كنت تبحث عن دفء الزعفران النجدي، أو عمق العود والجلد، أو سكينة المسك والورد الطائفي، يمكنك تصفية الابتكارات حسب النوتة أو المجموعة.',
          detail: 'تصنيف عطري واضح للثبات والفوحان وهرم النوتات',
        },
      ],
    },
    drawers: {
      mobileMenu: {
        title: 'قائمة التنقل الرئيسية — رِواق',
      },
      search: {
        title: 'البحث والاستكشاف العطري',
        placeholder: 'ابحث باسم العطر، النوتة (عود، زعفران، ورد طائفي، مسك)...',
        noResults: 'لم يتم العثور على عطور مطابقة لبحثك.',
        suggestedNotesLabel: 'استكشف حسب النوتة العطرية',
        clearFilter: 'مسح',
        viewAllInShop: 'عرض جميع النتائج في المتجر',
      },
      bag: {
        title: 'حقيبة رِواق',
        emptyTitle: 'حقيبتك فارغة حالياً',
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
        proceedToCheckout: 'إتمام الطلب',
        continueBrowsing: 'متابعة التصفح',
        giftBundlesSectionTitle: 'صناديق مشغل هدايا رِواق',
        standaloneSectionTitle: 'الابتكارات المنفردة',
        giftAtelierBadge: 'مشغل هدايا رِواق',
        giftOccasionPrefix: 'المناسبة:',
        giftPresentationLine: 'صندوق رِواق الحجري والبرونزي — مشمول مجاناً',
        giftCardToPrefix: 'إلى:',
        giftCardFromPrefix: 'من:',
        giftBundleTotalLabel: 'إجمالي صندوق الهدية',
        removeGiftBundle: 'إزالة صندوق الهدية',
        composeGiftAction: 'تنسيق هدية جديدة في مشغل رِواق',
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
        activePersonaLabel: 'منظور المعاينة النشط (Demo Persona)',
        verifiedRoleLabel: 'الدور الموثق من الخادم',
        verifiedRoleNone: 'غير مصادق (لا توجد صلاحيات خلفية)',
        firebaseStatusLabel: 'حالة البنية السحابية (Firebase)',
        firebaseConnected: 'متصل بمشروع Firebase (الوضع الحي)',
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
        'دار عطور سعودية معاصرة تعيد صياغة العطر بروح حديثة؛ تتقاطع فيها أصالة العود والورد الطائفي والزعفران مع السكينة المعمارية لصناعة حضورٍ مميّز.',
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
    homeScentFinder: {
      eyebrow: 'بوصلة رِواق · استشارة عطرية خاصة',
      title: 'لست متأكداً من أين تبدأ؟',
      subtitle:
        'دع بوصلة رِواق تقودك إلى العطر الأقرب لحضورك عبر سبع خطوات هادئة تقرأ ذائقتك في الخامات النبيلة والأجواء والفوحان.',
      primaryCta: 'اكتشف عطرك',
      secondaryCta: 'تصفح المتجر الكامل',
      durationNote: '٧ أسئلة مدروسة · توصية فورية مفسّرة من كتالوج الدار',
      pillars: [
        { code: 'I', label: 'قراءة الحضور والمناسبة' },
        { code: 'II', label: 'توافق النوتات والخامات النبيلة' },
        { code: 'III', label: 'ترشيح مفسّر لعطرك الأقرب' },
      ],
    },
    scentFinder: {
      eyebrow: 'استشارة الدار الخاصة · الذكاء العطري الحتمي',
      title: 'بوصلة رِواق',
      subtitle: 'رحلة قصيرة لاكتشاف العطر الأقرب إلى حضورك.',
      leadQuote: 'العطر الأقرب إليك يبدأ بسؤال.',
      description:
        'صُمّمت بوصلة رِواق لتكون جلستك العطرية الخاصة؛ عبر سبع محطات متأنية، نحلّل تفضيلاتك في الخامات النبيلة والعوالم العطرية ودرجة الفوحان لنرشّح لك التركيبة الأكثر انسجاماً مع شخصيتك.',
      beginCta: 'ابدأ الرحلة',
      resumeCta: 'متابعة الاستشارة المحفوظة',
      exploreShopCta: 'استكشف العطور مباشرة',
      startOverCta: 'ابدأ من جديد',
      durationMeta: '٧ خطوات هادئة · أقل من دقيقتين',
      methodologyMeta: 'مبنية على هرم النوتات الفعلي لـ ١٨ ابتكاراً من رِواق',
      progressAriaLabel: 'تقدّم خطوات بوصلة رِواق',
      stepLabel: 'المحطة',
      ofLabel: 'من',
      singleSelectHint: 'اختر إجابة واحدة تعبّر عن تفضيلك الأقرب',
      multiSelectHint: 'اختر من خامة واحدة إلى ٣ خامات بحدٍ أقصى',
      multiSelectCount: 'تم اختيار {count} من ٣',
      backAction: 'السابق',
      continueAction: 'متابعة',
      revealMatchAction: 'اكشف عن عطرك الأقرب',
      characterSubQuestionLabel: 'تفضيل الطابع العطري (اختياري)',
      characterSubQuestionHint:
        'جميع عطور رِواق مصاغة لتناسب الجنسين، ويمكنك توجيه البوصلة نحو الميل الأقرب لذائقتك:',
      resultsEyebrow: 'خلاصة الاستشارة العطرية · بوصلة رِواق',
      resultsHeadline: 'عطرك الأقرب',
      resultsSubheadline:
        'بناءً على قراءتنا لتفضيلاتك في الحضور والخامات والأجواء، إليك التركيبة الأكثر توافقاً مع بصمتك الخاصة.',
      affinityScoreLabel: 'درجة التوافق العطري',
      affinityMethodologyNote:
        'تقييم توافقي مبني على تطابق الخامات والعائلة العطرية والأداء',
      whyMatchedHeading: 'لماذا اخترنا لك هذا العطر؟',
      keyNotesLabel: 'أبرز النوتات المتناغمة',
      viewCreationAction: 'اكتشف العطر',
      inspectQuickDossierAction: 'معاينة الملف العطري',
      alternatesEyebrow: 'ترشيحات مكملة · زوايا عطرية أخرى',
      alternatesHeading: 'ابتكاران بديلان من أروقة الدار',
      alternatesSubtitle:
        'تركيبتان تشتركان في جوهر ذائقتك مع تباينٍ مدروس في الفوحان أو الإيقاع العطري.',
      contrastBadgePrefix: 'زاوية التمايز:',
      profileSummaryEyebrow: 'قراءة البصمة العطرية',
      profileSummaryHeading: 'ملامح تفضيلاتك في هذه الجلسة',
      profilePresenceLabel: 'الحضور المنشود',
      profileMaterialsLabel: 'الخامات المختارة',
      profileWorldLabel: 'العالم العطري',
      profileOccasionLabel: 'المناسبة والأوقات',
      profileProjectionLabel: 'مدى الفوحان',
      profileLongevityLabel: 'درجة الثبات والطابع',
      exploreSimilarInShopAction: 'عرض العطور بهذه التفضيلات',
      refineAnswersAction: 'تعديل الإجابات',
      emptyCatalogTitle: 'تعذّر إكمال المطابقة العطرية حالياً.',
      emptyCatalogSubtitle:
        'لا تتوفر حالياً ابتكارات عطرية متاحة للمطابقة في الكتالوج. يمكنك العودة إلى المتجر أو البدء من جديد.',
      emptyCatalogReturnToShop: 'العودة إلى المتجر',
      emptyCatalogStartAgain: 'البدء من جديد',
    },
    giftBuilder: {
      eyebrow: 'صالون الإهداء الخاص · مراسم دار رِواق',
      title: 'مشغل هدايا رِواق',
      subtitle:
        'صمّم هدية عطرية شخصية تجمع بين عطر واحد أو عطرين أو ثلاثة عطور ضمن صندوق الحجر الجيري والبرونز.',
      leadQuote: 'الهدية الأصيلة أثرٌ يُختار بعناية ويُقدّم بوقار.',
      description:
        'في مشغل هدايا رِواق، تتحول الهدية العطرية إلى طقسٍ معماري متكامل؛ اختر المناسبة، وحدّد حجم الصندوق، وانتقِ العطور وأحجام زجاجاتها مع بطاقة إهداء من الكتّان المختوم بالبرونز — دون أي رسوم إضافية على التغليف الفاخر.',
      beginCta: 'ابدأ تنسيق الهدية',
      resumeCta: 'متابعة الهدية المحفوظة',
      startOverCta: 'تنسيق هدية جديدة',
      exploreShopCta: 'تصفح المتجر مباشرة',
      scentFinderCta: 'جرب بوصلة العطور أولاً',
      complimentaryPresentationMeta: 'صندوق رِواق الحجري وبطاقة الإهداء مشمولان مجاناً',
      transparentPricingMeta: 'قيمة الهدية = مجموع أسعار العطور المختارة فقط (شاملاً ضريبة ١٥٪)',
      pillars: [
        {
          code: 'I',
          title: 'تأليف شخصي مرن (١ أو ٢ أو ٣ عطور)',
          detail: 'انتقِ العطور وأحجام الزجاجات المتوفرة لكل موضع في الصندوق.',
        },
        {
          code: 'II',
          title: 'صندوق الحجر الجيري والبرونز مجاناً',
          detail: 'تقديم معماري فاخر مشمول ضمن مراسم الإهداء دون أي كلفة إضافية.',
        },
        {
          code: 'III',
          title: 'بطاقة إهداء من الكتّان الفاخر',
          detail: 'أضف إهداءك الشخصي أو اطلب البطاقة فارغة لكتابتها يدوياً.',
        },
      ],
      progressAriaLabel: 'مراحل تنسيق الهدية في مشغل رِواق',
      stepLabel: 'الخطوة',
      ofLabel: 'من',
      backAction: 'السابق',
      continueAction: 'متابعة',
      proceedToReviewAction: 'مراجعة الهدية',
      occasionStepHint: 'اختر المناسبة لتخصيص مقترحات العطور وعبارات بطاقة الإهداء',
      occasionGuidanceLabel: 'التوجيه العطري للمناسبة',
      sizeStepHint: 'اختر عدد الزجاجات العطرية التي سيحتضنها صندوق رِواق',
      presentationIncludedBadge: 'مشمول مجاناً مع كل هدية',
      presentationNoFeeNote:
        'يُقدّم صندوق رِواق الحجري والبرونزي وبطاقة الكتّان مجاناً؛ تدفع فقط السعر الفعلي للزجاجات المختارة.',
      fragranceStepHint:
        'اختر الموضع أولاً ثم انتقِ العطر وحجم الزجاجة (مل) لكل موضع في الصندوق',
      slotLabel: 'الموضع',
      slotEmptyState: 'بانتظار اختيار العطر',
      slotSelectedState: 'تم الاختيار',
      slotActiveEditing: 'الموضع النشط حالياً',
      selectSlotToCurate: 'انقر لتخصيص هذا الموضع',
      filterAllCreations: 'جميع العطور المتاحة',
      filterRecommendedForOccasion: 'مقترحات المناسبة',
      recommendedForOccasionTag: 'مقترح للمناسبة',
      inAnotherSlotTag: 'مختار في الموضع',
      selectForSlotAction: 'اختيار للموضع',
      selectedInActiveSlotAction: 'مختار في هذا الموضع',
      changeVariantLabel: 'حجم الزجاجة:',
      removeSlotSelectionAction: 'إفراغ الموضع',
      inspectDossierAction: 'معاينة النوتات',
      stockExhaustedNote: 'الكمية المتاحة لهذا الحجم مخصصة بالكامل في الحقيبة أو المواضع الأخرى',
      messageStepHint: 'تُرفق بطاقة الإهداء مجاناً داخل ظرف مختوم بشعار الدار',
      includeCardToggleLabel: 'إرفاق بطاقة إهداء برسالة مخصصة',
      includeCardDescription: 'تُطبع كلماتك بعناية على بطاقة الكتّان الفاخرة وتوضع داخل الصندوق.',
      blankCardToggleLabel: 'إرفاق بطاقة رِواق فارغة (للكتابة اليدوية)',
      blankCardDescription: 'نرفق البطاقة والظرف المختوم دون نص مطبوع لتخطّ إهداءك بيدك.',
      recipientLabel: 'إلى (اسم المُهدى إليه — اختياري)',
      recipientPlaceholder: 'مثال: إلى صاحب السمو / إلى أخي العزيز / إلى سارة',
      senderLabel: 'من (اسم المُهدي — اختياري)',
      senderPlaceholder: 'مثال: مع خالص المحبة، فيصل',
      messageBodyLabel: 'نص الإهداء (اختياري)',
      messageBodyPlaceholder: 'اكتب كلمتك الخاصة أو اختر من عبارات الدار المقترحة أدناه...',
      characterLimitNote: '{count} / {max} حرفاً',
      suggestedMessagesTitle: 'عبارات إهداء مقترحة لهذه المناسبة',
      useSuggestedMessageAction: 'استخدام هذه العبارة',
      cardPreviewTitle: 'معاينة بطاقة الإهداء',
      cardPreviewEmptyBody: 'ستظهر كلماتك المختارة هنا على بطاقة الكتّان...',
      cardPreviewBlankNotice: 'سيتم إرفاق بطاقة رِواق الفاخرة فارغة لتتمكن من كتابتها يدوياً.',
      reviewEyebrow: 'الاعتماد النهائي · مشغل هدايا رِواق',
      reviewHeading: 'مراجعة صندوق الهدية المنسّق',
      reviewSubtitle:
        'تأكّد من جميع تفاصيل هديتك. عند الإضافة إلى الحقيبة، سيُحفظ هذا الصندوق كوحدة إهداء مترابطة.',
      changeStepAction: 'تعديل',
      summarySidebarTitle: 'ملخص صندوق الهدية',
      summaryOccasionLabel: 'المناسبة',
      summarySetSizeLabel: 'تكوين الصندوق',
      summaryPresentationLabel: 'تغليف الدار المعماري',
      summaryComplimentaryValue: 'مشمول مجاناً',
      summarySlotsProgressLabel: 'العطور المختارة',
      summaryDedicationLabel: 'بطاقة الإهداء',
      summaryDedicationIncluded: 'مرفقة برسالة خاصة',
      summaryDedicationBlank: 'مرفقة فارغة للكتابة اليدوية',
      summaryFragrancesSubtotal: 'مجموع العطور المختارة',
      summaryShippingLabel: 'الشحن المبرد داخل المملكة',
      summaryVatIncludedLabel: 'ضريبة القيمة المضافة المتضمنة (١٥٪)',
      summaryTotalLabel: 'إجمالي الهدية (شاملاً الضريبة)',
      summaryCommercialPolicyNote:
        'التسعير الشفاف: إجمالي الهدية يساوي مجموع الأسعار الفعلية للزجاجات المختارة تماماً دون أي رسوم تغليف إضافية.',
      addGiftToBagCta: 'إضافة الهدية إلى الحقيبة',
      addedGiftToBagToast: 'تمت إضافة صندوق الهدية إلى حقيبة رِواق',
      composeAnotherGiftAction: 'تنسيق هدية أخرى',
      validationIncompleteSlots: 'يرجى استكمال اختيار العطر لكل موضع في الصندوق أولاً.',
      validationStockExceeded:
        'أحد الأحجام المختارة تجاوز الحد الأقصى المتاح في المخزون مع محتويات الحقيبة الحالية.',
      validationDuplicateVariant:
        'لا يمكن تكرار نفس العطر وحجم الزجاجة داخل صندوق الهدية الواحد. يرجى اختيار عطر آخر أو حجم مختلف.',
      sizeReductionWarningTitle: 'تأكيد تقليص حجم صندوق الإهداء',
      sizeReductionWarningBody:
        'تقليص حجم الهدية سيؤدي إلى إزالة العطور المختارة في المواضع الإضافية التالية:',
      confirmSizeReductionAction: 'تأكيد التقليص وإزالة المواضع الإضافية',
      manageSlotsBeforeReductionAction: 'تعديل المواضع يدوياً أولاً',
      cancelSizeReductionAction: 'الاحتفاظ بالحجم الحالي',
      emptyCatalogTitle: 'مشغل الهدايا غير متاح مؤقتاً',
      emptyCatalogSubtitle:
        'لا تتوفر حالياً ابتكارات عطرية قابلة للاقتناء في الكتالوج لتنسيق صندوق هدية.',
    },
    checkout: {
      title: 'إتمام الطلب',
      reassuranceNote: 'بياناتك لا تشمل معلومات الدفع في هذه المرحلة.',
      returnToBagAction: 'مراجعة الحقيبة',
      returnToShopAction: 'متابعة التسوق',
      progressAriaLabel: 'مراحل إتمام الطلب',
      stepLabel: 'المرحلة',
      stages: {
        contact: {
          code: '01',
          label: 'التواصل',
        },
        delivery: {
          code: '02',
          label: 'التوصيل',
        },
        review: {
          code: '03',
          label: 'المراجعة',
        },
      },
      emptyEyebrow: 'حقيبة التسوق فارغة',
      emptyTitle: 'لا توجد مقتنيات في حقيبتك لإتمام الطلب',
      emptyDescription:
        'ابدأ باستكشاف ابتكارات دار رِواق العطرية أو نسّق صندوق إهداء خاص في مشغل الهدايا قبل المتابعة إلى إتمام الطلب.',
      exploreFragrancesCta: 'استكشف العطور',
      giftAtelierCta: 'مشغل الهدايا',
      blockedEyebrow: 'مراجعة الحقيبة مطلوبة',
      blockedTitle: 'تحتاج حقيبتك إلى مراجعة قبل إتمام الطلب.',
      blockedDescription:
        'طرأ تحديث على توفر أحد العطور أو الكميات المتاحة في حقيبتك. يرجى مراجعة الحقيبة لتحديث اختياراتك قبل متابعة إتمام الطلب.',
      blockedIssueUnavailable:
        'أحد الابتكارات أو الأحجام المختارة لم يعد متوفراً للاقتناء حالياً.',
      blockedIssueStock:
        'الكمية المطلوبة لأحد الأحجام تتجاوز الحد المتاح حالياً في المخزون.',
      blockedIssueGiftBundle:
        'أحد صناديق الإهداء في الحقيبة يحتاج إلى مراجعة لضمان اكتمال مواضعه.',
      reviewBagCta: 'مراجعة الحقيبة',
      continueShoppingCta: 'متابعة التسوق',
      priceChangedNotice: 'تم تحديث سعر أحد المنتجات ليطابق السعر الحالي.',
      contact: {
        eyebrow: 'المرحلة 01 · بيانات التواصل',
        heading: 'بيانات التواصل',
        subtitle:
          'تُستخدم هذه البيانات لإرسال تأكيد الطلب والتنسيق المباشر عند التوصيل. يمكنك المتابعة كضيف دون الحاجة إلى حساب.',
        fullNameLabel: 'الاسم الكامل',
        fullNamePlaceholder: 'مثال: فيصل العتيبي',
        emailLabel: 'البريد الإلكتروني',
        emailPlaceholder: 'name@example.com',
        phoneLabel: 'رقم الجوال',
        phonePlaceholder: '05XXXXXXXX أو +9665XXXXXXXX',
        phoneHint:
          'يُقبل الرقم السعودي بالصيغة المحلية أو الدولية ويُحفظ تلقائياً بصيغة +9665XXXXXXXX.',
        continueToDeliveryCta: 'المتابعة إلى التوصيل',
        errors: {
          invalid_full_name: 'يرجى إدخال الاسم الكامل (حرفين على الأقل).',
          invalid_email: 'يرجى إدخال بريد إلكتروني صحيح.',
          invalid_phone:
            'يرجى إدخال رقم جوال سعودي صحيح يبدأ بـ 05 أو +9665.',
        },
      },
      delivery: {
        eyebrow: 'المرحلة 02 · التوصيل داخل المملكة',
        heading: 'عنوان التوصيل وطريقة الشحن',
        subtitle:
          'أدخل تفاصيل عنوان التوصيل داخل المملكة العربية السعودية.',
        useContactDetailsAction: 'استخدام الاسم ورقم الجوال من بيانات التواصل',
        recipientNameLabel: 'اسم المستلم',
        recipientNamePlaceholder: 'الاسم الكامل للمستلم',
        recipientPhoneLabel: 'رقم الجوال',
        recipientPhonePlaceholder: '05XXXXXXXX أو +9665XXXXXXXX',
        countryLabel: 'الدولة',
        countryValue: 'السعودية',
        cityLabel: 'المدينة',
        cityPlaceholder: 'مثال: الرياض، جدة، الخبر',
        districtLabel: 'الحي',
        districtPlaceholder: 'مثال: حي السفارات، حي العليا',
        streetLabel: 'الشارع',
        streetPlaceholder: 'اسم الشارع أو الطريق الرئيسي',
        additionalDetailsToggle: 'تفاصيل عنوان إضافية',
        additionalDetailsOptionalTag: 'اختياري',
        buildingNumberLabel: 'رقم المبنى',
        buildingNumberPlaceholder: 'مثال: 4210',
        postalCodeLabel: 'الرمز البريدي',
        postalCodePlaceholder: '5 أرقام (مثال: 12512)',
        nationalShortCodeLabel: 'العنوان الوطني المختصر',
        nationalShortCodePlaceholder: 'مثال: RRRD2929',
        deliveryNotesLabel: 'ملاحظات التوصيل',
        deliveryNotesPlaceholder:
          'أي إرشادات إضافية لتسهيل الوصول إلى الموقع...',
        deliveryNotesCounter: '{count} / {max} حرفاً',
        deliveryMethodSectionTitle: 'طريقة التوصيل',
        standardDeliveryTitle: 'التوصيل الاعتيادي',
        standardDeliveryDescription:
          'توصيل معتمد للعطور وصناديق الإهداء داخل المملكة العربية السعودية.',
        complimentaryStandardDelivery: 'توصيل اعتيادي مجاني',
        backToContactAction: 'العودة إلى التواصل',
        continueToReviewCta: 'المتابعة إلى المراجعة',
        errors: {
          invalid_recipient_name: 'يرجى إدخال اسم المستلم (حرفين على الأقل).',
          invalid_phone:
            'يرجى إدخال رقم جوال سعودي صحيح يبدأ بـ 05 أو +9665.',
          invalid_city: 'يرجى إدخال اسم المدينة.',
          invalid_district: 'يرجى إدخال اسم الحي.',
          invalid_street: 'يرجى إدخال اسم الشارع.',
          invalid_building_number: 'رقم المبنى المدخل غير صالح.',
          invalid_postal_code:
            'يجب أن يتكون الرمز البريدي من 5 أرقام عند إدخاله.',
          invalid_national_short_code:
            'العنوان الوطني المختصر يحتوي على رموز غير مدعومة.',
          invalid_delivery_notes:
            'يرجى ألا تتجاوز ملاحظات التوصيل 240 حرفاً.',
        },
      },
      review: {
        eyebrow: 'المرحلة 03 · المراجعة النهائية',
        heading: 'مراجعة تفاصيل الطلب',
        subtitle:
          'تحقق من بيانات التواصل وعنوان التوصيل ومحتويات الحقيبة المعتمدة وفق الأسعار الحالية.',
        contactSummaryTitle: 'بيانات التواصل',
        editContactAction: 'تعديل التواصل',
        deliverySummaryTitle: 'عنوان التوصيل',
        editDeliveryAction: 'تعديل التوصيل',
        deliveryMethodSummaryTitle: 'طريقة التوصيل',
        itemsSectionTitle: 'مقتنيات الطلب المعتمدة',
        standaloneItemsHeading: 'العطور المفردة',
        giftBundlesHeading: 'صناديق مشغل الهدايا',
        quantityLabel: 'الكمية',
        unitPriceLabel: 'سعر الوحدة',
        lineTotalLabel: 'المجموع',
        giftAtelierBadge: 'مشغل هدايا رِواق',
        giftPresentationValue: 'صندوق رِواق — مشمول مجاناً',
        giftSlotPrefix: 'الموضع',
        giftDedicationHeading: 'بطاقة الإهداء',
        giftDedicationTo: 'إلى:',
        giftDedicationFrom: 'من:',
        giftDedicationBlank: 'بطاقة رِواق فارغة للكتابة اليدوية',
        paymentSectionEyebrow: 'محاكاة الدفع · عرض توضيحي للمحفظة',
        paymentSectionTitle: 'اختر تجربة الدفع التوضيحية',
        paymentSectionSubtitle:
          'اختر وسيلة الدفع المراد محاكاتها لإتمام رحلة الشراء التوضيحية. لا يتم جمع أي بيانات بطاقات أو تنفيذ أي خصم مالي فعلي.',
        paymentDemoBadge: 'محاكاة عرض توضيحي فقط',
        paymentDemoNotice:
          'هذه المرحلة مخصصة لاستعراض اكتمال رحلة الشراء في محفظة الأعمال؛ لن يُطلب منك رقم بطاقة أو رمز تحقق (OTP) ولن يتم سحب أي مبلغ.',
        confirmDemoOrderCta: 'تأكيد الطلب التجريبي',
        confirmingDemoOrderCta: 'جاري إصدار إيصال الطلب التجريبي...',
        completionErrors: {
          invalid_payment_method:
            'يرجى اختيار وسيلة دفع توضيحية صالحة قبل تأكيد الطلب.',
          invalid_checkout_draft:
            'يرجى التحقق من اكتمال بيانات التواصل وعنوان التوصيل قبل تأكيد الطلب.',
          checkout_not_ready:
            'طرأ تغيير على محتويات الحقيبة؛ يرجى مراجعة الحقيبة قبل إتمام الطلب.',
          receipt_persistence_failed:
            'تعذّر حفظ إيصال الطلب التجريبي في جلسة المتصفح الحالية. يرجى المحاولة مرة أخرى.',
        },
        reviewFooterNotice:
          'تمت مطابقة محتويات الحقيبة وبيانات التوصيل بنجاح. اختر تجربة الدفع التوضيحية أعلاه لتأكيد الطلب وإصدار الإيصال.',
        backToDeliveryAction: 'العودة إلى التوصيل',
      },
      confirmation: {
        eyebrow: 'تأكيد الطلب التجريبي · دار رِواق للعطور',
        heading: 'تم اعتماد طلبك التجريبي بنجاح',
        subtitle:
          'شكراً لتجربة رحلة الاقتناء في دار رِواق. تم إصدار إيصال الطلب التوضيحي أدناه استناداً إلى اختياراتك المعتمدة.',
        demoBannerTitle: 'إشعار العرض التوضيحي للمحفظة (Portfolio Demo)',
        demoBannerBody:
          'هذا الإيصال نتاج محاكاة عرض توضيحي فقط؛ لم يتم تحصيل أي مبالغ مالية، ولا يترتب عليه شحن فعلي أو تسجيل طلب حقيقي.',
        orderNumberLabel: 'رقم الطلب التوضيحي',
        createdAtLabel: 'تاريخ الإصدار',
        orderStatusLabel: 'حالة الطلب',
        orderStatusValue: 'مؤكد (محاكاة عرض توضيحي)',
        paymentMethodLabel: 'تجربة الدفع المختارة',
        paymentStatusLabel: 'حالة الدفع',
        paymentStatusValue: 'محاكاة ناجحة — بدون خصم مالي',
        contactSectionTitle: 'بيانات التواصل المسجلة',
        deliverySectionTitle: 'عنوان التوصيل داخل المملكة',
        deliveryMethodLabel: 'طريقة الشحن',
        itemsSectionTitle: 'المقتنيات وصناديق الإهداء المؤكدة',
        financialSummaryTitle: 'الملخص المالي للإيصال',
        continueShoppingCta: 'متابعة تسوق العطور',
        giftAtelierCta: 'تنسيق هدية في مشغل رِواق',
        returnHomeCta: 'العودة إلى الرئيسية',
        clearReceiptAction: 'إنهاء العرض ومسح الإيصال التجريبي',
        loadingReceiptLabel: 'جاري استرجاع إيصال الطلب التجريبي...',
        emptyEyebrow: 'لا يوجد إيصال نشط · دار رِواق',
        emptyTitle: 'لم يتم العثور على إيصال طلب تجريبي في هذه الجلسة',
        emptyDescription:
          'يُحفظ إيصال الطلب التوضيحي مؤقتاً في جلسة المتصفح الحالية فور إتمام الطلب. يمكنك استكشاف العطور أو مراجعة الحقيبة لبدء تجربة شراء جديدة.',
        emptyCheckoutCta: 'الانتقال إلى إتمام الطلب',
      },
      summary: {
        title: 'ملخص الطلب',
        mobileShowSummary: 'عرض ملخص الطلب',
        mobileHideSummary: 'إخفاء ملخص الطلب',
        subtotalLabel: 'المجموع الفرعي',
        deliveryLabel: 'التوصيل',
        vatIncludedBreakdownLabel: 'ضريبة القيمة المضافة المتضمنة (15%)',
        totalLabel: 'الإجمالي',
        vatRetailCopy: 'شامل ضريبة القيمة المضافة 15%',
        unitCountLabel: '{count} قطع',
        singleUnitLabel: 'قطعة واحدة',
      },
    },
  },
  en: {
    brand: {
      name: 'RWAQ',
      nameSecondary: 'رِواق',
      tagline: 'A Saudi House of Scent',
      origin: 'Riyadh · Kingdom of Saudi Arabia',
    },
    units: {
      ml: 'ml',
    },
    a11y: {
      skipToContent: 'Skip to main content',
      primaryNavigation: 'Primary Navigation',
      openMenu: 'Open navigation menu',
      closeMenu: 'Close navigation menu',
      openSearch: 'Search fragrances and collections',
      openWishlist: 'Open saved fragrances wishlist',
      openAccount: 'Account and portfolio mode settings',
      openBag: 'Open shopping bag',
      switchLanguage: 'Switch language to Arabic (العربية)',
      closeDrawer: 'Close drawer panel',
      closeNotification: 'Close notification',
      scrollToManifesto: 'Scroll to brand manifesto',
    },
    nav: {
      shop: 'Shop',
      scentFinder: 'Find Your Scent',
      giftAtelier: 'Gift Atelier',
      collections: 'Collections',
      creations: 'Creations',
      craft: 'Craft & Materials',
      manifesto: 'Manifesto',
      house: 'The House',
      languageToggleLabel: 'عربي',
      languageToggleFull: 'العربية',
    },
    hero: {
      scrollPrompt: 'Enter the House',
      concentrationBadge: 'Extrait de Parfum · 25%–35% Concentration',
      trilogyLabel: 'Signature Trilogy: NAJD · SAHRA · LAYL',
    },
    signatureStrip: {
      ariaLabel: 'RWAQ House Signatures',
      items: [
        {
          code: 'I',
          title: 'High Oil Concentrations',
          detail: 'Extrait and Absolu compositions crafted at 25% to 35% for depth and poise.',
        },
        {
          code: 'II',
          title: 'Selected Noble Materials',
          detail: 'Aged agarwood, first-harvest Taif rose, red saffron, and Hojari frankincense.',
        },
        {
          code: 'III',
          title: 'Contemporary Saudi Identity',
          detail: 'Rooted in Najdi architectural geometry and the shifting light of Arabia.',
        },
        {
          code: 'IV',
          title: 'Luxury Gifting Presentation',
          detail: 'Heavy smoked-glass flacons housed in limestone-textured ceremonial coffrets.',
        },
      ],
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
      sectionEyebrow: 'Olfactory Worlds · The Signature Trilogy',
      sectionTitle: 'The Three Olfactory Worlds',
      sectionSubtitle:
        'Three sensory territories shaped by the geology, desert horizons, and nocturnal stillness of the Arabian Peninsula.',
      accordLabel: 'Primary Accord',
      originLabel: 'Spatial Inspiration',
      exploreCollectionCreations: 'Explore Collection Creations',
      chapterPrefix: 'Chapter',
      worldsInteractiveHint: 'Select an olfactory world or explore each chapter below',
      featuredInCollectionLabel: 'Creations in this World',
      materialCharacterLabel: 'Material & Lighting Character',
      worldsMeta: {
        najd: {
          material: 'Najdi Travertine Stone · Red Saffron · Atlas Cedarwood',
          atmosphere: 'Warm late-afternoon sun casting long shadows across Diriyah colonnades',
        },
        sahra: {
          material: 'Aged Agarwood · Hojari Frankincense · Burnished Leather',
          atmosphere: 'Glowing desert embers and resinous incense smoke at twilight',
        },
        layl: {
          material: 'Honed Basalt · First-Harvest Taif Rose · Velvet Skin Musk',
          atmosphere: 'Cool highland air and starlit stillness across Taif and AlUla',
        },
      },
    },
    creations: {
      sectionEyebrow: 'House Selection · Composed Extraits',
      sectionTitle: 'Featured Creations',
      sectionSubtitle:
        'Six signature compositions crafted in high concentration. Inspect the flagship spotlight or browse the full curation.',
      filterAll: 'All Collections',
      flagshipBadge: 'Featured House Creation',
      supportingHeading: 'The Curated Selection',
      swipeHint: 'Swipe horizontally to explore creations',
      concentrationLabel: 'Concentration',
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
      exploreFullCatalog: 'Explore the Complete 18-Creation Catalog',
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
    shop: {
      eyebrow: 'RWAQ House Boutique · Complete Curation',
      title: 'RWAQ Creations',
      subtitle:
        'A contemporary Saudi fragrance collection shaped by oud, saffron, Taif rose, musk and modern restraint.',
      allWorldsTab: 'All Collections',
      creationsCountUnit: 'Creations',
      searchPlaceholder:
        'Search by creation name, note (oud, saffron, Taif rose, sandalwood, musk), or SKU...',
      clearSearch: 'Clear search',
      showingResults: 'Showing {shown} of {total} creations',
      filtersToggle: 'Filter Creations',
      hideFilters: 'Hide Filters',
      showFilters: 'Show Filters',
      activeFiltersLabel: 'Active Filters',
      resetAllFilters: 'Reset All',
      applyFilters: 'View Matching Creations',
      sortLabel: 'Sort by',
      sortOptions: {
        featured: 'House Featured',
        bestsellers: 'Bestsellers',
        newest: 'Newest Releases',
        'price-asc': 'Price: Low to High',
        'price-desc': 'Price: High to Low',
        name: 'Alphabetical',
      },
      filterGroups: {
        collection: 'Olfactory World',
        family: 'Olfactory Family',
        projection: 'Sillage & Projection',
        longevity: 'Longevity',
        occasion: 'Occasion',
        season: 'Season',
        gender: 'Olfactory Character',
        price: 'Price Range (SAR)',
        curation: 'Curation & Availability',
      },
      allOption: 'All',
      families: {
        'woody-amber': 'Woody Amber',
        'smoky-oud': 'Smoky Oud & Leather',
        'floral-musk': 'Taif Rose & Floral Musk',
        'spiced-oriental': 'Spiced Oriental',
        'incense-resinous': 'Incense & Resins',
        'leather-iris': 'Suede Leather & Iris',
      },
      genders: {
        unisex: 'Unisex Signature',
        'masculine-leaning': 'Masculine-Leaning',
        'feminine-leaning': 'Feminine-Leaning',
      },
      seasons: {
        'all-season': 'All Seasons',
        'autumn-winter': 'Autumn & Winter',
        'spring-summer': 'Spring & Summer',
        evening: 'Nocturnal & Evening',
      },
      occasions: {
        signature: 'Daily Signature',
        majlis: 'Majlis & Hospitality',
        evening: 'Evening Soirées',
        ceremonial: 'Ceremonial & Protocol',
        intimate: 'Intimate & Close',
      },
      pricePresets: {
        all: 'All Prices',
        under700: 'Under 700 SAR',
        from700To850: '700 – 850 SAR',
        above850: 'Above 850 SAR',
      },
      curationFlags: {
        bestsellersOnly: 'House Signatures (Bestsellers)',
        newReleasesOnly: 'New Releases Only',
        inStockOnly: 'In Stock Only',
      },
      card: {
        selectSizeLabel: 'Size',
        inspectDossier: 'Quick Olfactory View',
        viewCreation: 'View Creation',
        inStockLabel: 'In Stock',
        limitedStockLabel: 'Limited Allocation',
        outOfStockLabel: 'Currently Unavailable',
        skuLabel: 'SKU',
      },
      dossier: {
        drawerTitle: 'Quick Olfactory View · Dossier',
        editorialHeading: 'Olfactory Composition',
        inspirationHeading: 'Spatial Inspiration',
        ritualHeading: 'Application Ritual',
        whenToWearHeading: 'When to Wear',
        accordsHeading: 'Accord Architecture',
        ingredientsHeading: 'Noble Ingredient Highlights',
        variantsHeading: 'Available Flacon Sizes',
        characterLabel: 'Character',
        seasonLabel: 'Season',
        occasionLabel: 'Occasion',
        filterByCollectionAction: 'Filter by Collection:',
        filterByFamilyAction: 'Explore Family:',
        viewFullCreationPage: 'Explore Full Creation Page',
      },
      emptyState: {
        eyebrow: 'No Matching Creations',
        title: 'No fragrances matched these selections.',
        description:
          'Try removing one of your active filters, searching for a foundational note, or clearing filters to explore all eighteen RWAQ compositions.',
        resetButton: 'Clear Filters',
        suggestedNotesTitle: 'Or explore by signature olfactory note:',
      },
    },
    pdp: {
      breadcrumbAriaLabel: 'Breadcrumb navigation',
      homeLabel: 'Home',
      shopLabel: 'The Shop',
      galleryAriaLabel: 'Product image gallery',
      previousImage: 'Previous image',
      nextImage: 'Next image',
      selectImage: 'Select image',
      selectSizeLabel: 'Select Flacon Volume',
      quantityLabel: 'Quantity',
      decreaseQuantity: 'Decrease quantity',
      increaseQuantity: 'Increase quantity',
      maxQuantityNote: 'Maximum immediate allocation',
      inStockStatus: 'In Stock · Ready for KSA Dispatch',
      limitedStockStatus: 'Limited Allocation Remaining',
      outOfStockStatus: 'Currently Out of Stock',
      viewBagAction: 'View Bag',
      mobileStickyBarAria: 'Quick purchase bar',
      reassurance: [
        {
          code: 'I',
          title: 'The Discovery Vial Ritual',
          detail: 'Includes two complimentary 2ml discovery vials to experience on skin before unsealing the flacon.',
        },
        {
          code: 'II',
          title: 'Najdi Limestone Coffret',
          detail: 'Housed in an architectural stone-textured presentation box finished with brushed bronze.',
        },
        {
          code: 'III',
          title: 'KSA Concierge Delivery',
          detail: 'Temperature-controlled delivery across Saudi Arabia (complimentary on orders above 500 SAR).',
        },
      ],
      storyEyebrow: 'Chapter I · The Story & Origin',
      storyHeading: 'Olfactory Narrative & Spatial Memory',
      inspirationHeading: 'Architectural & Geographic Inspiration',
      architecturalContextLabel: 'RWAQ House Composition · Riyadh',
      pyramidEyebrow: 'Chapter II · Olfactory Architecture',
      pyramidHeading: 'The Note Pyramid',
      pyramidSubtitle:
        'Unfolding across three distinct movements — from the luminous first impression to the enduring resinous dry-down.',
      topTierDescription: 'The radiant opening movement upon first contact with air',
      heartTierDescription: 'The central thematic core emerging as the composition warms on skin',
      baseTierDescription: 'The structural foundation and noble resins that linger for hours',
      accordsEyebrow: 'Sensory Proportion · Accord Balance',
      accordsHeading: 'Accord Profile',
      accordsSubtitle:
        'Relative intensity across the primary olfactory accords shaping this creation.',
      performanceEyebrow: 'Chapter III · Performance & Character',
      performanceHeading: 'Longevity, Sillage & Wearing Profile',
      performanceSubtitle:
        'An architectural reading of endurance, spatial projection, and recommended wearing context.',
      longevityTitle: 'Longevity',
      projectionTitle: 'Sillage & Projection',
      seasonTitle: 'Recommended Season',
      occasionTitle: 'Occasion',
      characterTitle: 'Olfactory Character',
      ingredientsEyebrow: 'Chapter IV · Noble Materials',
      ingredientsHeading: 'Key Ingredient Highlights',
      ingredientsSubtitle:
        'Foundational raw materials selected to give this composition its structural depth and poise.',
      originLabel: 'Origin & Character',
      ritualEyebrow: 'Chapter V · The Wearing Ritual',
      ritualHeading: 'Application & Wearing Guidance',
      applicationHeading: 'Application Ritual',
      whenToWearHeading: 'When to Wear',
      relatedEyebrow: 'Continued Discovery · From the House',
      relatedHeading: 'Related Creations',
      relatedSubtitle:
        'Compositions sharing this creation’s olfactory world or resonant family character.',
      returnToCatalog: 'Return to Full Catalog',
      giftCreationAction: 'Compose as a Gift in the RWAQ Atelier',
    },
    craft: {
      sectionEyebrow: 'Craft & Materials · Olfactory Design Language',
      sectionTitle: 'Noble Ingredients & Architectural Materiality',
      sectionSubtitle:
        'RWAQ’s design language is built on a dialogue between four foundational raw ingredients and Saudi architectural textures — turning scent into tactile presence.',
      olfactoryRoleLabel: 'Olfactory Role',
      sensoryProfileLabel: 'Sensory Profile',
      featuredInLabel: 'Featured Prominently In',
      exploreNoteInSearch: 'Explore Creations with this Note',
      materials: [
        {
          id: 'oud',
          numeral: '01',
          name: 'Aged Agarwood (Oud)',
          subtitle: 'Resinous depth polished with modern restraint',
          description:
            'Rather than overwhelming the wearer, RWAQ’s oud is sculpted with dry woods, amber, and leather — creating a warm, architectural foundation with commanding poise.',
          olfactoryRole: 'Structural base providing eternal longevity and warm woody resonance',
          sensoryProfile: 'Resinous · Dark Woody · Polished & Warm',
          featuredCreations: 'ATHAR (أثَر) · MAQAM (مَقام) · ZILL (ظِل)',
          searchQuery: 'Oud',
          imageUrl: '/images/rwaq/products/rwaq_prod_sahra_incense_1790766997373.jpg',
          imageAlt: 'Aged agarwood chips and Hojari frankincense beside RWAQ perfume flacon',
        },
        {
          id: 'taif-rose',
          numeral: '02',
          name: 'Taif Rose',
          subtitle: 'First-harvest highland radiance meets nocturnal shadow',
          description:
            'Distilled from mountain roses harvested at dawn, our Taif rose accord is paired with dark fig nectar, smoked black tea, and velvet musk for a magnetic contemporary contrast.',
          olfactoryRole: 'Luminous floral heart lending velvet texture and emotional tension',
          sensoryProfile: 'Dewy Rose · Dark Fruit · Velvet Musk',
          featuredCreations: 'WAJD (وَجد)',
          searchQuery: 'Taif Rose',
          imageUrl: '/images/rwaq/products/rwaq_prod_layl_rose_1790767019885.jpg',
          imageAlt: 'Dark Taif rose petals and black fig resting on honed basalt stone',
        },
        {
          id: 'saffron',
          numeral: '03',
          name: 'Red Saffron & Cardamom',
          subtitle: 'Ceremonial warmth of the Najdi Majlis',
          description:
            'Crimson saffron threads and crushed green cardamom pods ignite our openings with golden warmth, paying tribute to Saudi hospitality and sunlit limestone courtyards.',
          olfactoryRole: 'Radiant spice opening bridging dry woods and rock amber',
          sensoryProfile: 'Warm Spice · Soft Leathery · Luminous',
          featuredCreations: 'SARA (سَرى) · MAQAM (مَقام)',
          searchQuery: 'Saffron',
          imageUrl: '/images/rwaq/products/rwaq_prod_najd_saffron_1790766970563.jpg',
          imageAlt: 'Red saffron threads and green cardamom on raw travertine stone',
        },
        {
          id: 'frankincense',
          numeral: '04',
          name: 'Frankincense & Arabian Myrrh',
          subtitle: 'Atmospheric incense smoke and desert resins',
          description:
            'Hojari frankincense and golden Arabian myrrh bring verticality and air into our compositions — evoking the quiet trail of incense rising through a stone colonnade.',
          olfactoryRole: 'Atmospheric bridge creating airy sillage and balsamic depth',
          sensoryProfile: 'Balsamic · Translucent Smoke · Warm Mineral',
          featuredCreations: 'ATHAR (أثَر) · ZILL (ظِل)',
          searchQuery: 'Frankincense',
          imageUrl: '/images/rwaq/products/rwaq_prod_sahra_myrrh_1790767009599.jpg',
          imageAlt: 'Golden Arabian myrrh resin and frankincense with RWAQ flacon',
        },
        {
          id: 'architecture',
          numeral: '05',
          name: 'Saudi Architectural Materiality',
          subtitle: 'From Najdi colonnades to the monolithic flacon',
          description:
            'Every RWAQ vessel draws from the geometry of traditional arcades (riwaq) and raw desert stone — crafted in heavy smoked glass and crowned with brushed dark bronze.',
          olfactoryRole: 'Protective smoked-glass vessel shielding high-concentration oils from light',
          sensoryProfile: 'Warm Limestone · Smoked Glass · Brushed Bronze',
          featuredCreations: 'All NAJD, SAHRA & LAYL Creations',
          searchQuery: 'Musk',
          imageUrl: '/images/rwaq/product_flacon_studio_1790732089787.jpg',
          imageAlt: 'Monolithic RWAQ smoked-glass flacon with brushed bronze cap on limestone pedestal',
        },
      ],
    },
    concierge: {
      sectionEyebrow: 'The House Experience · RWAQ Rituals',
      sectionTitle: 'An Experience Designed Around Presence',
      sectionSubtitle:
        'At RWAQ, the ritual of acquiring a fragrance is conceived with the same architectural care as the scent itself — from guided olfactory discovery to ceremonial presentation.',
      primaryAction: 'Open Olfactory Discovery',
      secondaryAction: 'Inspect Your Bag',
      giftAtelierAction: 'Enter the RWAQ Gift Atelier',
      pillars: [
        {
          code: '01',
          title: 'The Discovery Vial Ritual',
          description:
            'Our presentation philosophy pairs each full flacon with complimentary 2ml discovery vials, intended to let you live with the composition on skin before unsealing the main vessel.',
          detail: 'Two 2ml discovery vials included in the RWAQ presentation concept',
        },
        {
          code: '02',
          title: 'Architectural Coffret Presentation',
          description:
            'Each flacon rests within a structured limestone-textured coffret accented in brushed bronze — conceived from the outset for personal keepsake and ceremonial gifting.',
          detail: 'Monolithic smoked glass & tactile stone-inspired housing',
        },
        {
          code: '03',
          title: 'Olfactory Guidance by Note & Accord',
          description:
            'Whether drawn to sunlit saffron, resinous oud and leather, or nocturnal Taif rose and skin musk, explore our creations through transparent note pyramids and sillage profiles.',
          detail: 'Structured Top, Heart & Base note pyramids on every creation',
        },
      ],
    },
    drawers: {
      mobileMenu: {
        title: 'RWAQ Primary Navigation Menu',
      },
      search: {
        title: 'Olfactory Discovery & Search',
        placeholder:
          'Search by creation name or note (oud, saffron, Taif rose, musk)...',
        noResults: 'No creations matched your search query.',
        suggestedNotesLabel: 'Explore by Olfactory Note',
        clearFilter: 'Clear',
        viewAllInShop: 'View all results in The Shop',
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
        proceedToCheckout: 'Proceed to Checkout',
        continueBrowsing: 'Continue Browsing',
        giftBundlesSectionTitle: 'RWAQ Gift Atelier Coffrets',
        standaloneSectionTitle: 'Individual Creations',
        giftAtelierBadge: 'RWAQ Gift Atelier',
        giftOccasionPrefix: 'Occasion:',
        giftPresentationLine: 'Signature Limestone & Bronze Coffret — Complimentary',
        giftCardToPrefix: 'To:',
        giftCardFromPrefix: 'From:',
        giftBundleTotalLabel: 'Coffret Total',
        removeGiftBundle: 'Remove gift coffret',
        composeGiftAction: 'Compose Another Gift in the Atelier',
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
        activePersonaLabel: 'Active Preview Persona (Demo Only)',
        verifiedRoleLabel: 'Verified Backend Role',
        verifiedRoleNone: 'Unauthenticated (No backend privileges)',
        firebaseStatusLabel: 'Firebase Cloud Status',
        firebaseConnected: 'Connected to Firebase Project (Live Mode)',
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
        'A contemporary Saudi fragrance house reimagining perfumery through a modern lens — oud, Taif rose, and saffron composed for a distinctive presence.',
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
    homeScentFinder: {
      eyebrow: 'RWAQ Scent Finder · Private Olfactory Consultation',
      title: 'Not sure where to begin?',
      subtitle:
        'Let the RWAQ Scent Finder guide you to the creation most aligned with your presence through seven considered questions across raw materials, atmosphere, and sillage.',
      primaryCta: 'Find Your Scent',
      secondaryCta: 'Browse Full Catalog',
      durationNote: '7 Considered Steps · Immediate Explainable Curation',
      pillars: [
        { code: 'I', label: 'Presence & Occasion Reading' },
        { code: 'II', label: 'Noble Material & Accord Matching' },
        { code: 'III', label: 'Explainable House Recommendation' },
      ],
    },
    scentFinder: {
      eyebrow: 'Private House Consultation · Deterministic Scent Intelligence',
      title: 'RWAQ Scent Finder',
      subtitle:
        'A guided journey to the fragrance that feels most aligned with your presence.',
      leadQuote: 'Your closest scent begins with a single question.',
      description:
        'Conceived as a quiet consultation inside the House of RWAQ, this seven-step journey reads your affinity for noble raw materials, olfactory worlds, and spatial projection to identify the compositions most attuned to your signature.',
      beginCta: 'Begin the Journey',
      resumeCta: 'Resume Saved Consultation',
      exploreShopCta: 'Explore Creations Directly',
      startOverCta: 'Start Again',
      durationMeta: '7 Considered Steps · Under Two Minutes',
      methodologyMeta: 'Grounded in the note architecture of all 18 RWAQ creations',
      progressAriaLabel: 'RWAQ Scent Finder progress',
      stepLabel: 'Step',
      ofLabel: 'of',
      singleSelectHint: 'Select the single option that best reflects your preference',
      multiSelectHint: 'Select between 1 and 3 raw materials maximum',
      multiSelectCount: '{count} of 3 selected',
      backAction: 'Back',
      continueAction: 'Continue',
      revealMatchAction: 'Reveal Your Match',
      characterSubQuestionLabel: 'Olfactory Character Positioning (Optional)',
      characterSubQuestionHint:
        'Every RWAQ extrait is composed to be worn across genders; you may optionally tune the character leaning:',
      resultsEyebrow: 'Olfactory Consultation Dossier · RWAQ Scent Finder',
      resultsHeadline: 'Your Closest Match',
      resultsSubheadline:
        'Based on your affinity for presence, noble materials, and atmospheric sillage, this creation is most aligned with your signature.',
      affinityScoreLabel: 'Scent Affinity',
      affinityMethodologyNote:
        'Deterministic olfactory alignment across materials, family, and performance',
      whyMatchedHeading: 'Why This Creation Aligns With You',
      keyNotesLabel: 'Resonant Notes',
      viewCreationAction: 'View the Creation',
      inspectQuickDossierAction: 'Quick Olfactory View',
      alternatesEyebrow: 'Complementary Recommendations · Alternate Angles',
      alternatesHeading: 'Two Alternate Creations to Consider',
      alternatesSubtitle:
        'Compositions that share the core of your profile while offering a distinct shift in sillage or tonal mood.',
      contrastBadgePrefix: 'Distinction:',
      profileSummaryEyebrow: 'Your Olfactory Profile',
      profileSummaryHeading: 'Consultation Preference Ledger',
      profilePresenceLabel: 'Desired Presence',
      profileMaterialsLabel: 'Selected Materials',
      profileWorldLabel: 'Olfactory World',
      profileOccasionLabel: 'Occasion & Ritual',
      profileProjectionLabel: 'Spatial Projection',
      profileLongevityLabel: 'Longevity & Character',
      exploreSimilarInShopAction: 'Explore Similar Creations',
      refineAnswersAction: 'Adjust Preferences',
      emptyCatalogTitle: 'Scent matching is temporarily unavailable.',
      emptyCatalogSubtitle:
        'No fragrance creations are currently available in the catalog to complete your consultation. You may return to the shop or start again.',
      emptyCatalogReturnToShop: 'Return to Shop',
      emptyCatalogStartAgain: 'Start Again',
    },
    giftBuilder: {
      eyebrow: 'Private Gifting Salon · RWAQ House Rituals',
      title: 'RWAQ Gift Atelier',
      subtitle:
        'Compose a personalized fragrance gift uniting one, two, or three creations inside our architectural limestone and bronze coffret.',
      leadQuote: 'A noble gift is an enduring presence, chosen with intention.',
      description:
        'Step inside the RWAQ Gift Atelier to curate a bespoke olfactory gesture. Select your occasion, choose the scale of your coffret, pair exact flacon formats across Najd, Sahra, and Layl, and inscribe a complimentary linen dedication card.',
      beginCta: 'Begin Gift Curation',
      resumeCta: 'Resume Saved Gift',
      startOverCta: 'Start a New Gift',
      exploreShopCta: 'Browse Creations Directly',
      scentFinderCta: 'Consult the Scent Finder',
      complimentaryPresentationMeta: 'Complimentary Limestone Coffret & Linen Card Included',
      transparentPricingMeta: 'Gift Total = Exact Sum of Selected Flacons (15% Saudi VAT Included)',
      pillars: [
        {
          code: 'I',
          title: 'Bespoke Scale (1, 2, or 3 Creations)',
          detail: 'Select exact fragrance creations and bottle formats for each slot in your coffret.',
        },
        {
          code: 'II',
          title: 'Complimentary Limestone & Bronze Coffret',
          detail: 'Architectural house presentation included with our compliments—zero packaging markups.',
        },
        {
          code: 'III',
          title: 'Bronze-Crested Linen Dedication Card',
          detail: 'Inscribe a personal message or request a blank card for handwritten presentation.',
        },
      ],
      progressAriaLabel: 'RWAQ Gift Atelier progress',
      stepLabel: 'Step',
      ofLabel: 'of',
      backAction: 'Back',
      continueAction: 'Continue',
      proceedToReviewAction: 'Review Your Gift',
      occasionStepHint: 'Select an occasion to tailor our house fragrance recommendations and dedication notes',
      occasionGuidanceLabel: 'Olfactory Guidance',
      sizeStepHint: 'Choose the number of fragrance flacons housed within your coffret',
      presentationIncludedBadge: 'Complimentary House Presentation',
      presentationNoFeeNote:
        'The RWAQ Signature Limestone & Bronze Coffret and linen dedication card are included with our compliments. You pay only the exact price of your selected fragrances.',
      fragranceStepHint:
        'Select a slot above, then choose a creation and bottle format (ml) for each position in your coffret',
      slotLabel: 'Slot',
      slotEmptyState: 'Awaiting Selection',
      slotSelectedState: 'Curated',
      slotActiveEditing: 'Currently Curating',
      selectSlotToCurate: 'Select to curate this slot',
      filterAllCreations: 'All Available Creations',
      filterRecommendedForOccasion: 'Curated for Occasion',
      recommendedForOccasionTag: 'Occasion Match',
      inAnotherSlotTag: 'In Slot',
      selectForSlotAction: 'Assign to Slot',
      selectedInActiveSlotAction: 'Assigned to Active Slot',
      changeVariantLabel: 'Flacon Format:',
      removeSlotSelectionAction: 'Clear Slot',
      inspectDossierAction: 'Quick Olfactory View',
      stockExhaustedNote: 'Remaining stock for this format is already allocated in your bag or other slots',
      messageStepHint: 'Every gift includes a complimentary bronze-sealed linen dedication card',
      includeCardToggleLabel: 'Include Printed Personal Dedication',
      includeCardDescription: 'Your message is inscribed on our heavy cream-linen card and sealed inside the coffret.',
      blankCardToggleLabel: 'Include Blank Card (For Handwritten Note)',
      blankCardDescription: 'We include the crested linen card and envelope blank so you may write your note by hand.',
      recipientLabel: 'To (Recipient Name — Optional)',
      recipientPlaceholder: 'e.g., To Faisal / For Sarah',
      senderLabel: 'From (Sender Name — Optional)',
      senderPlaceholder: 'e.g., With warmth, Noura',
      messageBodyLabel: 'Personal Dedication Message (Optional)',
      messageBodyPlaceholder: 'Write your personal note or select a house dedication phrase below...',
      characterLimitNote: '{count} / {max} characters',
      suggestedMessagesTitle: 'House Dedication Phrases for This Occasion',
      useSuggestedMessageAction: 'Use This Phrase',
      cardPreviewTitle: 'Linen Dedication Card Preview',
      cardPreviewEmptyBody: 'Your personal dedication will appear here on the cream-linen card...',
      cardPreviewBlankNotice: 'A blank RWAQ bronze-crested linen card will be enclosed for your handwritten note.',
      reviewEyebrow: 'Final Atelier Inspection · RWAQ Gift Atelier',
      reviewHeading: 'Review Your Curated Gift Coffret',
      reviewSubtitle:
        'Confirm every detail of your gift. When added to your bag, this coffret is preserved as a unified gift presentation.',
      changeStepAction: 'Edit',
      summarySidebarTitle: 'Gift Coffret Summary',
      summaryOccasionLabel: 'Occasion',
      summarySetSizeLabel: 'Coffret Scale',
      summaryPresentationLabel: 'House Presentation',
      summaryComplimentaryValue: 'Complimentary',
      summarySlotsProgressLabel: 'Selected Creations',
      summaryDedicationLabel: 'Dedication Card',
      summaryDedicationIncluded: 'Inscribed Card Included',
      summaryDedicationBlank: 'Blank Card Included',
      summaryFragrancesSubtotal: 'Selected Fragrances Subtotal',
      summaryShippingLabel: 'KSA Concierge Delivery',
      summaryVatIncludedLabel: 'Included Saudi VAT (15%)',
      summaryTotalLabel: 'Gift Total (VAT Included)',
      summaryCommercialPolicyNote:
        'Transparent House Pricing: Your gift total equals the exact sum of the selected fragrance formats with complimentary presentation.',
      addGiftToBagCta: 'Add Gift to Bag',
      addedGiftToBagToast: 'Gift coffret added to your RWAQ bag',
      composeAnotherGiftAction: 'Compose Another Gift',
      validationIncompleteSlots: 'Please complete your fragrance selection for every slot in the coffret.',
      validationStockExceeded:
        'One of the selected formats exceeds available stock when combined with your current bag.',
      validationDuplicateVariant:
        'The same creation and bottle format cannot be duplicated within one gift coffret. Please select another fragrance or format.',
      sizeReductionWarningTitle: 'Confirm Coffret Scale Reduction',
      sizeReductionWarningBody:
        'Reducing the coffret size will remove the creations currently assigned to the following overflow slots:',
      confirmSizeReductionAction: 'Confirm & Remove Extra Slots',
      manageSlotsBeforeReductionAction: 'Manage Fragrance Slots First',
      cancelSizeReductionAction: 'Keep Current Size',
      emptyCatalogTitle: 'The Gift Atelier is temporarily unavailable',
      emptyCatalogSubtitle:
        'No purchasable fragrance creations are currently available in the catalog to compose a gift.',
    },
    checkout: {
      title: 'Checkout',
      reassuranceNote: 'No payment information is collected at this stage.',
      returnToBagAction: 'Review Bag',
      returnToShopAction: 'Continue Shopping',
      progressAriaLabel: 'Checkout stages',
      stepLabel: 'Stage',
      stages: {
        contact: {
          code: '01',
          label: 'Contact',
        },
        delivery: {
          code: '02',
          label: 'Delivery',
        },
        review: {
          code: '03',
          label: 'Review',
        },
      },
      emptyEyebrow: 'Empty Shopping Bag',
      emptyTitle: 'Your bag is currently empty',
      emptyDescription:
        'Explore RWAQ signature fragrances or compose a bespoke gift coffret in the Gift Atelier before proceeding to checkout.',
      exploreFragrancesCta: 'Explore Fragrances',
      giftAtelierCta: 'Gift Atelier',
      blockedEyebrow: 'Bag Review Required',
      blockedTitle: 'Your bag needs a quick review before checkout.',
      blockedDescription:
        'Availability or stock limits for one or more items in your bag have changed. Please review your bag to adjust your selections before continuing.',
      blockedIssueUnavailable:
        'One of the selected creations or bottle formats is no longer available.',
      blockedIssueStock:
        'The requested quantity for one of your selections exceeds current available stock.',
      blockedIssueGiftBundle:
        'A gift coffret in your bag requires review to ensure all selections are complete.',
      reviewBagCta: 'Review Bag',
      continueShoppingCta: 'Continue Shopping',
      priceChangedNotice:
        'A product price has been updated to its current price.',
      contact: {
        eyebrow: 'Stage 01 · Guest Contact',
        heading: 'Contact Information',
        subtitle:
          'Used strictly for order confirmation and delivery coordination. No account is required to check out.',
        fullNameLabel: 'Full Name',
        fullNamePlaceholder: 'e.g., Faisal Alotaibi',
        emailLabel: 'Email Address',
        emailPlaceholder: 'name@example.com',
        phoneLabel: 'Mobile Number',
        phonePlaceholder: '05XXXXXXXX or +9665XXXXXXXX',
        phoneHint:
          'Accepts local or international Saudi mobile formats (05XXXXXXXX or +9665XXXXXXXX) and normalizes automatically.',
        continueToDeliveryCta: 'Continue to Delivery',
        errors: {
          invalid_full_name:
            'Please enter your full name (at least 2 characters).',
          invalid_email: 'Please enter a valid email address.',
          invalid_phone:
            'Please enter a valid Saudi mobile number starting with 05 or +9665.',
        },
      },
      delivery: {
        eyebrow: 'Stage 02 · Saudi Delivery',
        heading: 'Delivery Address & Shipping',
        subtitle:
          'Provide your delivery address within the Kingdom of Saudi Arabia.',
        useContactDetailsAction: 'Use contact name and mobile number',
        recipientNameLabel: 'Recipient Name',
        recipientNamePlaceholder: 'Recipient full name',
        recipientPhoneLabel: 'Mobile Number',
        recipientPhonePlaceholder: '05XXXXXXXX or +9665XXXXXXXX',
        countryLabel: 'Country',
        countryValue: 'Saudi Arabia',
        cityLabel: 'City',
        cityPlaceholder: 'e.g., Riyadh, Jeddah, Al Khobar',
        districtLabel: 'District',
        districtPlaceholder: 'e.g., Al Olaya, Diplomatic Quarter',
        streetLabel: 'Street',
        streetPlaceholder: 'Street or main road name',
        additionalDetailsToggle: 'Additional address details',
        additionalDetailsOptionalTag: 'Optional',
        buildingNumberLabel: 'Building Number',
        buildingNumberPlaceholder: 'e.g., 4210',
        postalCodeLabel: 'Postal Code',
        postalCodePlaceholder: '5 digits (e.g., 12512)',
        nationalShortCodeLabel: 'National Address Short Code',
        nationalShortCodePlaceholder: 'e.g., RRRD2929',
        deliveryNotesLabel: 'Delivery Notes',
        deliveryNotesPlaceholder:
          'Gate code, landmark, or preferred delivery instructions...',
        deliveryNotesCounter: '{count} / {max} characters',
        deliveryMethodSectionTitle: 'Delivery Method',
        standardDeliveryTitle: 'Standard Delivery',
        standardDeliveryDescription:
          'Careful delivery for RWAQ fragrances and gift coffrets within Saudi Arabia.',
        complimentaryStandardDelivery: 'Complimentary standard delivery',
        backToContactAction: 'Back to Contact',
        continueToReviewCta: 'Continue to Review',
        errors: {
          invalid_recipient_name:
            'Please enter the recipient name (at least 2 characters).',
          invalid_phone:
            'Please enter a valid Saudi mobile number starting with 05 or +9665.',
          invalid_city: 'Please enter the city.',
          invalid_district: 'Please enter the district.',
          invalid_street: 'Please enter the street.',
          invalid_building_number: 'Please enter a valid building number.',
          invalid_postal_code:
            'Postal code must be exactly 5 digits when provided.',
          invalid_national_short_code:
            'National address short code contains unsupported characters.',
          invalid_delivery_notes:
            'Delivery notes must not exceed 240 characters.',
        },
      },
      review: {
        eyebrow: 'Stage 03 · Final Review',
        heading: 'Review Your Order',
        subtitle:
          'Verify your contact details, Saudi delivery address, and reconciled bag contents priced from the current catalog.',
        contactSummaryTitle: 'Contact Details',
        editContactAction: 'Edit Contact',
        deliverySummaryTitle: 'Delivery Address',
        editDeliveryAction: 'Edit Delivery',
        deliveryMethodSummaryTitle: 'Delivery Method',
        itemsSectionTitle: 'Reconciled Order Items',
        standaloneItemsHeading: 'Individual Creations',
        giftBundlesHeading: 'RWAQ Gift Atelier Coffrets',
        quantityLabel: 'Qty',
        unitPriceLabel: 'Unit Price',
        lineTotalLabel: 'Line Total',
        giftAtelierBadge: 'RWAQ Gift Atelier',
        giftPresentationValue: 'Signature Box — Complimentary',
        giftSlotPrefix: 'Slot',
        giftDedicationHeading: 'Dedication Card',
        giftDedicationTo: 'To:',
        giftDedicationFrom: 'From:',
        giftDedicationBlank: 'Blank RWAQ linen card enclosed for handwritten note',
        paymentSectionEyebrow: 'Payment Simulation · Portfolio Demo',
        paymentSectionTitle: 'Select Demo Payment Experience',
        paymentSectionSubtitle:
          'Choose the payment experience to simulate for this portfolio checkout. No card details are collected and no real charge is processed.',
        paymentDemoBadge: 'Portfolio Demo Simulation Only',
        paymentDemoNotice:
          'This step demonstrates the end-to-end purchase flow in Portfolio Demo Mode; no card numbers, CVV, or OTP codes are requested and no payment is charged.',
        confirmDemoOrderCta: 'Confirm Demo Order',
        confirmingDemoOrderCta: 'Issuing Demo Order Receipt...',
        completionErrors: {
          invalid_payment_method:
            'Please select a valid demo payment experience before confirming your order.',
          invalid_checkout_draft:
            'Please verify that your contact and delivery details are complete before confirming.',
          checkout_not_ready:
            'Your bag contents have changed; please review your bag before completing the order.',
          receipt_persistence_failed:
            'Unable to store the demo order receipt in your current browser session. Please try again.',
        },
        reviewFooterNotice:
          'Your contact details, delivery address, and bag items have been verified. Select a demo payment experience above to confirm your order and generate a receipt.',
        backToDeliveryAction: 'Back to Delivery',
      },
      confirmation: {
        eyebrow: 'Demo Order Confirmation · RWAQ House of Scent',
        heading: 'Your Demo Order Is Confirmed',
        subtitle:
          'Thank you for experiencing the RWAQ acquisition journey. Your simulated order receipt has been generated below from your verified selections.',
        demoBannerTitle: 'Portfolio Demonstration Notice',
        demoBannerBody:
          'This receipt was generated in Portfolio Demo Mode; no real payment was processed and no physical shipment has been scheduled.',
        orderNumberLabel: 'Demo Order Reference',
        createdAtLabel: 'Issued On',
        orderStatusLabel: 'Order Status',
        orderStatusValue: 'Confirmed (Demo Simulation)',
        paymentMethodLabel: 'Selected Payment Experience',
        paymentStatusLabel: 'Payment Status',
        paymentStatusValue: 'Simulated Success — No Real Charge',
        contactSectionTitle: 'Recorded Contact Details',
        deliverySectionTitle: 'Saudi Delivery Destination',
        deliveryMethodLabel: 'Delivery Method',
        itemsSectionTitle: 'Confirmed Creations & Gift Coffrets',
        financialSummaryTitle: 'Receipt Financial Summary',
        continueShoppingCta: 'Continue Shopping',
        giftAtelierCta: 'Compose a Gift in the Atelier',
        returnHomeCta: 'Return to Homepage',
        clearReceiptAction: 'Clear Demo Receipt',
        loadingReceiptLabel: 'Loading demo order receipt...',
        emptyEyebrow: 'No Active Receipt · RWAQ',
        emptyTitle: 'No demo order receipt found in this session',
        emptyDescription:
          'Demo order receipts are stored temporarily in your current browser session upon checkout completion. Explore our creations or open your bag to begin a new checkout journey.',
        emptyCheckoutCta: 'Proceed to Checkout',
      },
      summary: {
        title: 'Order Summary',
        mobileShowSummary: 'Show order summary',
        mobileHideSummary: 'Hide order summary',
        subtotalLabel: 'Subtotal',
        deliveryLabel: 'Delivery',
        vatIncludedBreakdownLabel: 'Included VAT (15%)',
        totalLabel: 'Total',
        vatRetailCopy: 'Includes 15% VAT',
        unitCountLabel: '{count} items',
        singleUnitLabel: '1 item',
      },
    },
  },
};
