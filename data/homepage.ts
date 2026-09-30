import type { HomepageContent } from '@/types';

export const SEED_HOMEPAGE_CONTENT: HomepageContent = {
  id: 'homepage-v1',
  hero: {
    eyebrow: {
      ar: 'دار عطور سعودية معاصرة',
      en: 'A Contemporary Saudi Fragrance House',
    },
    headline: {
      ar: 'عطرٌ يبقى بعد الرحيل',
      en: 'A scent that lingers beyond the moment.',
    },
    supportingCopy: {
      ar: 'رِواق يصوغ العطر كذاكرة؛ مزيج من الأصالة السعودية والتعبير المعاصر.',
      en: 'RWAQ crafts fragrance as memory — rooted in Saudi character, expressed with modern restraint.',
    },
    primaryCta: {
      label: {
        ar: 'اكتشف المجموعة',
        en: 'Explore the Collection',
      },
      targetSectionId: 'collections',
    },
    secondaryCta: {
      label: {
        ar: 'اكتشف عطرك',
        en: 'Find Your Scent',
      },
      targetSectionId: 'creations',
    },
    media: {
      type: 'image',
      imageUrl: '/images/rwaq/hero_rwaq_campaign_1790732049989.jpg',
      posterUrl: '/images/rwaq/hero_rwaq_campaign_1790732049989.jpg',
      alt: {
        ar: 'زجاجة عطر رِواق المنحوتة من الزجاج المدخن والبرونز على الحجر الجيري النجدي ورمال الصحراء عند الغسق',
        en: 'RWAQ sculptural smoked-glass and bronze perfume flacon on raw Najdi limestone and desert sand at twilight',
      },
    },
  },
  manifesto: {
    eyebrow: {
      ar: 'البيان العطري · فلسفة الدار',
      en: 'The House Manifesto · Olfactory Philosophy',
    },
    statement: {
      ar: 'نؤمن أن العطر ليس ما ترتديه، بل ما يسبق حضورك ويبقى بعدك.',
      en: 'Fragrance is not simply worn. It arrives before you and remains after you.',
    },
    supportingParagraph: {
      ar: 'في رِواق، نستمد إلهامنا من سكينة الأروقة النجدية وامتداد الصحراء وهيبة المجالس السعودية. نختار أنقى خلاصات العود واللبان والورد الطائفي والأخشاب المعتّقة، لنصوغها بتأنٍّ معاصر يبتعد عن الصخب ويحتفي بالعمق والوقار.',
      en: 'At RWAQ, we draw from the quiet architectural geometry of Najdi arcades, the stillness of the desert horizon, and the warmth of Saudi hospitality. Rare agarwood, Hojari frankincense, and first-harvest Taif rose are composed with modern restraint — unhurried, intimate, and enduring.',
    },
    signatureLocation: {
      ar: 'الرياض · المملكة العربية السعودية',
      en: 'Riyadh · Kingdom of Saudi Arabia',
    },
  },
  featuredCollectionSlugs: ['najd', 'sahra', 'layl'],
  featuredProductSlugs: [
    'sara-extrait',
    'athar-oud',
    'wajd-nocturne',
    'sukoon-musk',
    'zill-smoke',
    'maqam-saffron',
  ],
  updatedAt: '2026-09-29T18:00:00.000Z',
};
