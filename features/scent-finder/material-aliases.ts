import { normalizeSearchText } from '@/features/catalog/catalog-query';
import type { LocalizedString, OlfactoryFamilyKey } from '@/types';
import type { ScentMaterialKey } from './types';

export interface MaterialAliasDefinition {
  key: ScentMaterialKey;
  label: LocalizedString;
  noteTokens: readonly string[];
  accordKeys: readonly string[];
  supportingFamilies: readonly OlfactoryFamilyKey[];
}

/**
 * Centralized bilingual alias registry mapping each ScentMaterialKey to
 * normalized Arabic and English note/ingredient tokens and accord keys.
 */
export const MATERIAL_ALIAS_REGISTRY: Record<
  ScentMaterialKey,
  MaterialAliasDefinition
> = {
  oud: {
    key: 'oud',
    label: { ar: 'العود المعتّق', en: 'Aged Agarwood (Oud)' },
    noteTokens: [
      'عود',
      'العود',
      'كمبودي',
      'ملكي',
      'agarwood',
      'oud',
      'cambodian oud',
      'royal oud',
      'smoked oud',
    ].map(normalizeSearchText),
    accordKeys: ['oud', 'smoky-oud', 'smoky', 'woody'],
    supportingFamilies: ['smoky-oud', 'incense-resinous'],
  },
  'taif-rose': {
    key: 'taif-rose',
    label: { ar: 'الورد الطائفي', en: 'Taif Rose' },
    noteTokens: [
      'ورد',
      'الورد',
      'طائفي',
      'الطائفي',
      'جوري',
      'rose',
      'taif rose',
      'damask rose',
      'rose absolute',
    ].map(normalizeSearchText),
    accordKeys: ['rose', 'floral', 'taif-rose'],
    supportingFamilies: ['floral-musk'],
  },
  saffron: {
    key: 'saffron',
    label: { ar: 'الزعفران الأحمر', en: 'Red Saffron' },
    noteTokens: [
      'زعفران',
      'الزعفران',
      'saffron',
      'red saffron',
      'crimson saffron',
    ].map(normalizeSearchText),
    accordKeys: ['saffron', 'warm-spicy', 'spicy', 'spiced'],
    supportingFamilies: ['spiced-oriental', 'woody-amber'],
  },
  frankincense: {
    key: 'frankincense',
    label: { ar: 'اللبان الحوجري والمرّ', en: 'Frankincense & Myrrh' },
    noteTokens: [
      'لبان',
      'اللبان',
      'حوجري',
      'مر',
      'المر',
      'بخور',
      'الدخان',
      'frankincense',
      'hojari',
      'myrrh',
      'incense',
      'olibanum',
    ].map(normalizeSearchText),
    accordKeys: ['incense', 'resinous', 'balsamic', 'smoky', 'frankincense'],
    supportingFamilies: ['incense-resinous', 'smoky-oud'],
  },
  musk: {
    key: 'musk',
    label: { ar: 'المسك المخملي', en: 'Velvet Musk' },
    noteTokens: [
      'مسك',
      'المسك',
      'musk',
      'white musk',
      'skin musk',
      'velvet musk',
      'cashmere musk',
    ].map(normalizeSearchText),
    accordKeys: ['musk', 'musky', 'powdery'],
    supportingFamilies: ['floral-musk', 'leather-iris'],
  },
  amber: {
    key: 'amber',
    label: { ar: 'العنبر الصخري', en: 'Rock Amber' },
    noteTokens: [
      'عنبر',
      'العنبر',
      'لابدانوم',
      'جاوي',
      'amber',
      'ambergris',
      'rock amber',
      'labdanum',
      'benzoin',
    ].map(normalizeSearchText),
    accordKeys: ['amber', 'resinous', 'balsamic'],
    supportingFamilies: ['woody-amber', 'incense-resinous', 'spiced-oriental'],
  },
  leather: {
    key: 'leather',
    label: { ar: 'الجلد المصقول', en: 'Burnished Leather' },
    noteTokens: [
      'جلد',
      'الجلد',
      'شامواه',
      'leather',
      'suede',
      'saddle leather',
      'burnished leather',
    ].map(normalizeSearchText),
    accordKeys: ['leather', 'suede', 'smoky'],
    supportingFamilies: ['leather-iris', 'smoky-oud'],
  },
  iris: {
    key: 'iris',
    label: { ar: 'السوسن الجاف', en: 'Florentine Iris' },
    noteTokens: [
      'سوسن',
      'السوسن',
      'ايرس',
      'أيرس',
      'جذور السوسن',
      'iris',
      'orris',
      'florentine iris',
      'violet',
    ].map(normalizeSearchText),
    accordKeys: ['iris', 'powdery', 'floral'],
    supportingFamilies: ['leather-iris', 'floral-musk'],
  },
  sandalwood: {
    key: 'sandalwood',
    label: { ar: 'خشب الصندل والأرز', en: 'Sandalwood & Cedar' },
    noteTokens: [
      'صندل',
      'الصندل',
      'ارز',
      'الأرز',
      'أخشاب',
      'اخشاب',
      'فيتيفير',
      'نجيل الهند',
      'باتشولي',
      'sandalwood',
      'cedar',
      'cedarwood',
      'atlas cedar',
      'guaiac',
      'vetiver',
      'patchouli',
    ].map(normalizeSearchText),
    accordKeys: ['woody', 'sandalwood', 'cedar', 'earthy'],
    supportingFamilies: ['woody-amber', 'leather-iris'],
  },
  'coffee-spice': {
    key: 'coffee-spice',
    label: { ar: 'القهوة الشقراء والهيل', en: 'Arabian Coffee & Cardamom' },
    noteTokens: [
      'قهوة',
      'القهوة',
      'هيل',
      'الهيل',
      'قرفة',
      'فلفل',
      'قرنفل',
      'جوزة الطيب',
      'coffee',
      'cardamom',
      'cinnamon',
      'pepper',
      'pink pepper',
      'black pepper',
      'clove',
      'nutmeg',
      'spice',
    ].map(normalizeSearchText),
    accordKeys: ['warm-spicy', 'spicy', 'coffee', 'cardamom', 'aromatic'],
    supportingFamilies: ['spiced-oriental', 'woody-amber'],
  },
};

export function matchesAnyToken(
  localized: LocalizedString,
  normalizedTokens: readonly string[]
): boolean {
  const normAr = normalizeSearchText(localized.ar);
  const normEn = normalizeSearchText(localized.en);

  return normalizedTokens.some(
    (token) =>
      token.length > 0 && (normAr.includes(token) || normEn.includes(token))
  );
}
