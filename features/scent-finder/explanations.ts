import { DICTIONARIES } from '@/lib/i18n/dictionaries';
import type { LocalizedString, Product } from '@/types';
import {
  FAMILY_CHOICES,
  LONGEVITY_CHOICES,
  MATERIAL_CHOICES,
  OCCASION_CHOICES,
  PRESENCE_CHOICES,
  PROJECTION_CHOICES,
  SEASON_CHOICES,
} from './questions';
import type {
  ScentMatchFactor,
  ScentMaterialKey,
  ScentPreferenceProfile,
} from './types';

function findChoiceLabel<T extends string>(
  choices: ReadonlyArray<{ value: T; label: LocalizedString }>,
  value: T
): LocalizedString {
  return (
    choices.find((c) => c.value === value)?.label ?? {
      ar: value,
      en: value,
    }
  );
}

function formatArabicList(items: string[]): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} و${items[1]}`;
  return `${items.slice(0, -1).join('، ')} و${items[items.length - 1]}`;
}

function formatEnglishList(items: string[]): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}

export function getMaterialChoiceLabel(
  key: ScentMaterialKey
): LocalizedString {
  return findChoiceLabel(MATERIAL_CHOICES, key);
}

/**
 * Generates deterministic, product-grounded bilingual explanations for a ScentMatchResult.
 * Every reason added is directly backed by an evaluated factor and real product data.
 */
export function buildMatchExplanations(
  product: Product,
  profile: ScentPreferenceProfile,
  factors: readonly ScentMatchFactor[]
): {
  narrativeExplanation: LocalizedString;
  topReasons: LocalizedString[];
} {
  const topReasons: LocalizedString[] = [];

  const materialsFactor = factors.find((f) => f.dimension === 'materials');
  const familyFactor = factors.find((f) => f.dimension === 'family');
  const occasionFactor = factors.find((f) => f.dimension === 'occasion');
  const seasonFactor = factors.find((f) => f.dimension === 'season');
  const projectionFactor = factors.find((f) => f.dimension === 'projection');
  const longevityFactor = factors.find((f) => f.dimension === 'longevity');

  const presenceLabel = findChoiceLabel(PRESENCE_CHOICES, profile.presence);
  const productProjectionAr =
    DICTIONARIES.ar.creations.projectionValues[product.projection];
  const productProjectionEn =
    DICTIONARIES.en.creations.projectionValues[product.projection];
  const productLongevityAr =
    DICTIONARIES.ar.creations.longevityValues[product.longevity];
  const productLongevityEn =
    DICTIONARIES.en.creations.longevityValues[product.longevity];
  const productOccasionAr = DICTIONARIES.ar.shop.occasions[product.occasion];
  const productOccasionEn = DICTIONARIES.en.shop.occasions[product.occasion];

  // 1. Materials & Notes Reason (if matched)
  const matchedNotes = materialsFactor?.matchedNoteLabels ?? [];
  const fallbackPyramidNotes = [
    product.notes.top[0],
    product.notes.heart[0],
    product.notes.base[0],
  ].filter((n): n is LocalizedString => Boolean(n));

  const notesToCite =
    matchedNotes.length > 0 ? matchedNotes.slice(0, 3) : fallbackPyramidNotes;
  const notesArText = formatArabicList(notesToCite.map((n) => n.ar));
  const notesEnText = formatEnglishList(notesToCite.map((n) => n.en));

  if (
    materialsFactor &&
    (materialsFactor.strength === 'exact' ||
      materialsFactor.strength === 'strong')
  ) {
    topReasons.push({
      ar: `يحتضن في هرمه العطري نوتات ${notesArText} التي تتقاطع مباشرةً مع الخامات النبيلة التي اخترتها.`,
      en: `Directly features ${notesEnText} within its composition, aligning with your chosen raw materials.`,
    });
  } else {
    topReasons.push({
      ar: `تتألف بنيته العطرية من ${notesArText} في تناغمٍ يدعم ذائقتك العطرية.`,
      en: `Built around ${notesEnText}, offering a refined interpretation of your material preferences.`,
    });
  }

  // 2. Olfactory Family & World Reason
  if (familyFactor && familyFactor.strength === 'exact') {
    topReasons.push({
      ar: `ينتمي إلى عائلة «${product.notes.olfactoryFamily.ar}» ضمن مجموعة ${product.collectionName.ar}، وهو العالم العطري الأقرب لاختيارك.`,
      en: `Belongs to the ${product.notes.olfactoryFamily.en} family in the ${product.collectionName.en} collection — your exact chosen territory.`,
    });
  } else if (familyFactor && familyFactor.strength !== 'none') {
    topReasons.push({
      ar: `يقدّم قراءةً متناغمة لعالم «${product.notes.olfactoryFamily.ar}» من خلال مجموعة ${product.collectionName.ar}.`,
      en: `Offers a resonant ${product.notes.olfactoryFamily.en} signature from the ${product.collectionName.en} collection.`,
    });
  }

  // 3. Occasion & Season Reason
  if (occasionFactor && occasionFactor.strength === 'exact') {
    topReasons.push({
      ar: `صُمّم إيقاعه خصيصاً ليلائم «${productOccasionAr}» بانسجامٍ تام مع الأوقات التي تفضّلها.`,
      en: `Specifically composed for ${productOccasionEn.toLowerCase()}, matching your preferred wearing ritual.`,
    });
  } else if (seasonFactor && seasonFactor.strength !== 'none') {
    const seasonAr = DICTIONARIES.ar.shop.seasons[product.season];
    const seasonEn = DICTIONARIES.en.shop.seasons[product.season];
    topReasons.push({
      ar: `يتفاعل بتركيزه العالي (${product.concentration.ar}) بتناغمٍ مثالي مع أجواء «${seasonAr}».`,
      en: `Its ${product.concentration.en} concentration unfolds with poise across ${seasonEn.toLowerCase()}.`,
    });
  }

  // 4. Projection & Longevity Reason
  if (
    (projectionFactor && projectionFactor.strength === 'exact') ||
    (longevityFactor && longevityFactor.strength === 'exact')
  ) {
    topReasons.push({
      ar: `يمنحك فوحاناً «${productProjectionAr}» مع درجة ثبات «${productLongevityAr}» كما تفضّل تماماً.`,
      en: `Delivers a ${productProjectionEn.toLowerCase()} sillage paired with ${productLongevityEn.toLowerCase()} endurance on skin.`,
    });
  } else {
    topReasons.push({
      ar: `يمتاز بفوحان «${productProjectionAr}» وثبات «${productLongevityAr}» بتركيز ${product.concentration.ar}.`,
      en: `Balanced with ${productProjectionEn.toLowerCase()} projection and ${productLongevityEn.toLowerCase()} longevity.`,
    });
  }

  // Narrative consultation paragraph
  const narrativeExplanation: LocalizedString = {
    ar: `اخترنا لك عطر «${product.name.ar}» لأنك تميل إلى حضورٍ ${presenceLabel.ar}، وتشكّل نوتات ${notesArText} جوهر بنائه العطري ضمن عالم ${product.collectionName.ar}؛ كما أن فوحانه (${productProjectionAr}) وثباته (${productLongevityAr}) ينسجمان مع رغبتك في عطرٍ يلائم ${productOccasionAr}.`,
    en: `We selected ${product.name.en} for you because you gravitate toward a ${presenceLabel.en.toLowerCase()} presence. Anchored by ${notesEnText} within the ${product.collectionName.en} collection, its ${productProjectionEn.toLowerCase()} projection and ${productLongevityEn.toLowerCase()} endurance align naturally with ${productOccasionEn.toLowerCase()}.`,
  };

  return {
    narrativeExplanation,
    topReasons: topReasons.slice(0, 4),
  };
}

/**
 * Generates a truthful, product-data-backed contrast label explaining how an
 * Alternate Match differs from the Primary Match.
 */
export function buildAlternateContrastReason(
  alternate: Product,
  primary: Product
): LocalizedString {
  if (alternate.projection !== primary.projection) {
    if (alternate.projection === 'intimate') {
      return {
        ar: 'أكثر هدوءاً وحميمية على البشرة',
        en: 'More intimate and skin-close in sillage',
      };
    }
    if (alternate.projection === 'commanding') {
      return {
        ar: 'أكثر فوحاناً وحضوراً في المكان',
        en: 'More commanding spatial projection',
      };
    }
    return {
      ar: 'فوحان أكثر توازناً واعتدالاً',
      en: 'A more balanced, measured sillage trail',
    };
  }

  if (alternate.olfactoryFamilyKey !== primary.olfactoryFamilyKey) {
    switch (alternate.olfactoryFamilyKey) {
      case 'smoky-oud':
        return {
          ar: 'أكثر دخانية وعمقاً من العود والجلد',
          en: 'A smokier, darker oud and leather direction',
        };
      case 'floral-musk':
        return {
          ar: 'أكثر إشراقاً ونعومة من الورد والمسك',
          en: 'A more luminous Taif rose and velvet musk expression',
        };
      case 'incense-resinous':
        return {
          ar: 'طابع أكثر روحانية من اللبان والراتنجات',
          en: 'A more meditative frankincense and resin character',
        };
      case 'spiced-oriental':
        return {
          ar: 'أكثر دفئاً وتوهجاً بالتوابل والقهوة الشقراء',
          en: 'Warmer spice and golden coffee resonance',
        };
      case 'leather-iris':
        return {
          ar: 'تباين أنعم من الجلد المصقول والسوسن',
          en: 'A sleeker suede leather and powdery iris contrast',
        };
      case 'woody-amber':
        return {
          ar: 'بناء أكثر رسوخاً من الأخشاب والعنبر الصخري',
          en: 'A drier architectural wood and rock amber structure',
        };
    }
  }

  if (alternate.occasion !== primary.occasion) {
    const occAr = DICTIONARIES.ar.shop.occasions[alternate.occasion];
    const occEn = DICTIONARIES.en.shop.occasions[alternate.occasion];
    return {
      ar: `موجّه بصورة أخص نحو ${occAr}`,
      en: `Tailored more specifically toward ${occEn.toLowerCase()}`,
    };
  }

  if (alternate.season !== primary.season) {
    const seasonAr = DICTIONARIES.ar.shop.seasons[alternate.season];
    const seasonEn = DICTIONARIES.en.shop.seasons[alternate.season];
    return {
      ar: `توليفة تتألق أكثر في ${seasonAr}`,
      en: `Calibrated especially for ${seasonEn.toLowerCase()}`,
    };
  }

  return {
    ar: `قراءة عطرية مغايرة من مجموعة ${alternate.collectionName.ar}`,
    en: `A distinct tonal interpretation from ${alternate.collectionName.en}`,
  };
}

/**
 * Formats a human-readable summary of the user's ScentPreferenceProfile for the results ledger.
 */
export function formatPreferenceProfileSummary(
  profile: ScentPreferenceProfile
) {
  return {
    presence: findChoiceLabel(PRESENCE_CHOICES, profile.presence),
    materials: profile.materials.map((m) => getMaterialChoiceLabel(m)),
    family: findChoiceLabel(FAMILY_CHOICES, profile.family),
    occasion: findChoiceLabel(OCCASION_CHOICES, profile.occasion),
    season: findChoiceLabel(SEASON_CHOICES, profile.season),
    projection: findChoiceLabel(PROJECTION_CHOICES, profile.projection),
    longevity: findChoiceLabel(LONGEVITY_CHOICES, profile.longevity),
  };
}
