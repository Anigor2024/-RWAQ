import type { HomepageContent } from '@/types';

export const SEED_HOMEPAGE_CONTENT: HomepageContent = {
  id: 'homepage-v2',
  hero: {
    eyebrow: {
      ar: 'دار عطور سعودية معاصرة',
      en: 'A Contemporary Saudi Fragrance House',
    },
    headline: {
      ar: 'حضورٌ لا يُنسى، يبدأ بالعطر',
      en: 'An unforgettable presence begins with scent.',
    },
    supportingCopy: {
      ar: 'رِواق يعيد صياغة العطر السعودي بروح معاصرة؛ العود والورد الطائفي والزعفران في تراكيب صُممت لصناعة حضور مميّز.',
      en: 'RWAQ reimagines Saudi perfumery through a contemporary lens — oud, Taif rose and saffron composed for a distinctive presence.',
    },
    primaryCta: {
      type: 'route',
      label: {
        ar: 'اكتشف عطور رِواق',
        en: 'Discover RWAQ',
      },
      href: '/shop',
    },
    secondaryCta: {
      type: 'section',
      label: {
        ar: 'استكشف المجموعات',
        en: 'Explore Collections',
      },
      targetSectionId: 'collections',
    },
    media: {
      type: 'image',
      imageUrl: '/images/rwaq/hero/rwaq-hero-luminous-campaign.jpg',
      posterUrl: '/images/rwaq/hero/rwaq-hero-luminous-campaign.jpg',
      alt: {
        ar: 'زجاجة عطر رِواق المنحوتة من الزجاج المدخن والبرونز المصقول تحت إضاءة ذهبية دافئة على حجر الترافرتين النجدي ورمال الصحراء',
        en: 'RWAQ sculptural smoked-glass and brushed bronze perfume flacon illuminated by warm golden-hour light on Najdi travertine stone and desert sand',
      },
    },
  },
  manifesto: {
    eyebrow: {
      ar: 'البيان العطري · فلسفة الدار',
      en: 'The House Manifesto · Olfactory Philosophy',
    },
    statement: {
      ar: 'نؤمن أن العطر ليس ما ترتديه فقط، بل بصمةٌ تسبق حضورك وتُعرّف بك.',
      en: 'Fragrance is more than something you wear — it is a signature that arrives before you and becomes part of how you are remembered.',
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
  updatedAt: '2026-09-30T12:55:00.000Z',
};
