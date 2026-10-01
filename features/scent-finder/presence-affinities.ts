import type {
  OccasionSuitability,
  OlfactoryFamilyKey,
  ProjectionLevel,
} from '@/types';
import type { ScentPresenceArchetype } from './types';

export const RELATED_FAMILIES_MAP: Record<
  OlfactoryFamilyKey,
  readonly OlfactoryFamilyKey[]
> = {
  'woody-amber': ['spiced-oriental', 'incense-resinous'],
  'smoky-oud': ['incense-resinous', 'leather-iris'],
  'floral-musk': ['leather-iris', 'woody-amber'],
  'spiced-oriental': ['woody-amber', 'smoky-oud'],
  'incense-resinous': ['smoky-oud', 'woody-amber'],
  'leather-iris': ['smoky-oud', 'floral-musk'],
};

export const PRESENCE_AFFINITY_MAP: Record<
  ScentPresenceArchetype,
  {
    families: readonly OlfactoryFamilyKey[];
    collections: readonly string[];
    projections: readonly ProjectionLevel[];
    occasions: readonly OccasionSuitability[];
  }
> = {
  'quiet-intimate': {
    families: ['floral-musk', 'leather-iris'],
    collections: ['layl'],
    projections: ['intimate', 'moderate'],
    occasions: ['intimate', 'signature'],
  },
  'warm-magnetic': {
    families: ['woody-amber', 'spiced-oriental'],
    collections: ['najd'],
    projections: ['moderate', 'commanding'],
    occasions: ['majlis', 'evening', 'signature'],
  },
  'deep-mysterious': {
    families: ['smoky-oud', 'incense-resinous'],
    collections: ['sahra'],
    projections: ['commanding', 'moderate'],
    occasions: ['evening', 'ceremonial'],
  },
  'refined-ceremonial': {
    families: ['smoky-oud', 'woody-amber', 'spiced-oriental'],
    collections: ['najd', 'sahra'],
    projections: ['commanding', 'moderate'],
    occasions: ['ceremonial', 'majlis'],
  },
  'radiant-expressive': {
    families: ['floral-musk', 'leather-iris', 'woody-amber'],
    collections: ['layl', 'najd'],
    projections: ['moderate'],
    occasions: ['signature', 'evening'],
  },
};

export const COMPATIBLE_OCCASIONS_MAP: Record<
  OccasionSuitability,
  readonly OccasionSuitability[]
> = {
  signature: ['intimate', 'majlis'],
  majlis: ['ceremonial', 'evening', 'signature'],
  evening: ['ceremonial', 'majlis', 'intimate'],
  ceremonial: ['majlis', 'evening'],
  intimate: ['signature', 'evening'],
};
