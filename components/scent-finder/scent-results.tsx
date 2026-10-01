'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';
import { AlternateScentMatch } from '@/components/scent-finder/alternate-scent-match';
import { PrimaryScentMatch } from '@/components/scent-finder/primary-scent-match';
import { Typography } from '@/components/ui/typography';
import { formatPreferenceProfileSummary } from '@/features/scent-finder/explanations';
import type { ScentRecommendationSuite } from '@/features/scent-finder/types';
import { localize } from '@/lib/i18n/config';
import { useLocale } from '@/providers/locale-provider';
import type { Product } from '@/types';

interface ScentResultsProps {
  suite: ScentRecommendationSuite;
  onInspectDossier: (product: Product) => void;
  onAdjustPreferences: () => void;
  onStartOver: () => void;
}

export function ScentResults({
  suite,
  onInspectDossier,
  onAdjustPreferences,
  onStartOver,
}: ScentResultsProps) {
  const { dir, locale, t } = useLocale();
  const DirectionalArrow = dir === 'rtl' ? ArrowLeft : ArrowRight;

  const summary = formatPreferenceProfileSummary(suite.profile);

  return (
    <div className="mx-auto max-w-[1360px] px-4 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
      <div className="flex flex-col justify-between gap-6 border-b border-[#DED5C6] pb-8 lg:flex-row lg:items-end">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-3">
            <span aria-hidden="true" className="h-px w-8 bg-[#8C6239]" />
            <Typography variant="eyebrow" className="text-[#8C6239]">
              {t.scentFinder.resultsEyebrow}
            </Typography>
          </div>

          <Typography
            variant="display-l"
            as="h1"
            serifInEnglish
            className="mt-3 text-[#0B0B0A]"
          >
            {t.scentFinder.resultsHeadline}
          </Typography>

          <Typography variant="body" className="mt-3 text-[#5C534B]">
            {t.scentFinder.resultsSubheadline}
          </Typography>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onAdjustPreferences}
            className="inline-flex h-11 items-center gap-2 border border-[#CFC4B4] bg-[#FFFDF9] px-4 text-xs font-medium text-[#0B0B0A] transition-colors hover:border-[#0B0B0A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 stroke-[1.6]" />
            <span>{t.scentFinder.refineAnswersAction}</span>
          </button>

          <button
            type="button"
            onClick={onStartOver}
            className="inline-flex h-11 items-center gap-2 border border-[#CFC4B4] bg-transparent px-4 text-xs font-medium text-[#5C534B] transition-colors hover:border-[#0B0B0A] hover:text-[#0B0B0A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
          >
            <RotateCcw className="h-3.5 w-3.5 stroke-[1.6]" />
            <span>{t.scentFinder.startOverCta}</span>
          </button>
        </div>
      </div>

      <section aria-label={t.scentFinder.resultsHeadline} className="mt-10">
        <PrimaryScentMatch
          match={suite.primaryMatch}
          onInspectDossier={onInspectDossier}
        />
      </section>

      {suite.alternateMatches.length > 0 && (
        <section
          aria-labelledby="scent-finder-alternates-heading"
          className="mt-16 sm:mt-20"
        >
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-7 bg-[#8C6239]" />
              <Typography variant="eyebrow" className="text-[#8C6239]">
                {t.scentFinder.alternatesEyebrow}
              </Typography>
            </div>

            <Typography
              id="scent-finder-alternates-heading"
              variant="h1"
              as="h2"
              serifInEnglish
              className="mt-3 text-[#0B0B0A]"
            >
              {t.scentFinder.alternatesHeading}
            </Typography>

            <Typography variant="body" className="mt-2 text-[#5C534B]">
              {t.scentFinder.alternatesSubtitle}
            </Typography>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
            {suite.alternateMatches.map((altMatch, idx) => (
              <AlternateScentMatch
                key={altMatch.product.id}
                match={altMatch}
                index={idx}
                onInspectDossier={onInspectDossier}
              />
            ))}
          </div>
        </section>
      )}

      <section
        aria-labelledby="scent-finder-ledger-heading"
        className="mt-16 border border-[#DED5C6] bg-[#FFFDF9] p-6 sm:mt-20 sm:p-10"
      >
        <div className="flex flex-col justify-between gap-6 border-b border-[#EBE3D5] pb-6 lg:flex-row lg:items-end">
          <div>
            <Typography variant="eyebrow" className="text-[#8C6239]">
              {t.scentFinder.profileSummaryEyebrow}
            </Typography>
            <Typography
              id="scent-finder-ledger-heading"
              variant="h2"
              as="h2"
              serifInEnglish
              className="mt-2 text-[#0B0B0A]"
            >
              {t.scentFinder.profileSummaryHeading}
            </Typography>
          </div>

          <Link
            href={suite.shopBridgeHref}
            className="inline-flex h-12 items-center justify-center gap-2.5 bg-[#0B0B0A] px-7 text-xs sm:text-sm font-medium text-[#F5F0E8] transition-colors hover:bg-[#241E1B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
          >
            <span>{t.scentFinder.exploreSimilarInShopAction}</span>
            <DirectionalArrow className="h-4 w-4 stroke-[1.6]" />
          </Link>
        </div>

        <dl className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="border-s border-[#DED5C6] ps-4">
            <dt className="text-xs text-[#7A7067]">
              {t.scentFinder.profilePresenceLabel}
            </dt>
            <dd className="mt-1 text-sm font-medium text-[#0B0B0A]">
              {localize(summary.presence, locale)}
            </dd>
          </div>

          <div className="border-s border-[#DED5C6] ps-4">
            <dt className="text-xs text-[#7A7067]">
              {t.scentFinder.profileMaterialsLabel}
            </dt>
            <dd className="mt-1 text-sm font-medium text-[#0B0B0A]">
              {summary.materials.map((m) => localize(m, locale)).join(' · ')}
            </dd>
          </div>

          <div className="border-s border-[#DED5C6] ps-4">
            <dt className="text-xs text-[#7A7067]">
              {t.scentFinder.profileWorldLabel}
            </dt>
            <dd className="mt-1 text-sm font-medium text-[#0B0B0A]">
              {localize(summary.family, locale)}
            </dd>
          </div>

          <div className="border-s border-[#DED5C6] ps-4">
            <dt className="text-xs text-[#7A7067]">
              {t.scentFinder.profileOccasionLabel}
            </dt>
            <dd className="mt-1 text-sm font-medium text-[#0B0B0A]">
              {localize(summary.occasion, locale)} ·{' '}
              {localize(summary.season, locale)}
            </dd>
          </div>

          <div className="border-s border-[#DED5C6] ps-4">
            <dt className="text-xs text-[#7A7067]">
              {t.scentFinder.profileProjectionLabel}
            </dt>
            <dd className="mt-1 text-sm font-medium text-[#0B0B0A]">
              {localize(summary.projection, locale)}
            </dd>
          </div>

          <div className="border-s border-[#DED5C6] ps-4">
            <dt className="text-xs text-[#7A7067]">
              {t.scentFinder.profileLongevityLabel}
            </dt>
            <dd className="mt-1 text-sm font-medium text-[#0B0B0A]">
              {localize(summary.longevity, locale)} ·{' '}
              {t.shop.genders[suite.profile.character]}
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
