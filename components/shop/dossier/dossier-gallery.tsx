'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { localize } from '@/lib/i18n/config';
import { cn } from '@/lib/utils';
import { useLocale } from '@/providers/locale-provider';
import type { MediaAsset, Product } from '@/types';

interface DossierGalleryProps {
  product: Product;
  gallery: MediaAsset[];
  selectedImageIndex: number;
  onSelectImage: (index: number) => void;
  onClose: () => void;
}

export function DossierGallery({
  product,
  gallery,
  selectedImageIndex,
  onSelectImage,
  onClose,
}: DossierGalleryProps) {
  const { locale, t } = useLocale();
  const activeMedia = gallery[selectedImageIndex] ?? product.image;

  return (
    <div>
      <Link
        href={`/products/${product.slug}`}
        onClick={onClose}
        className="group relative block aspect-[4/5] w-full overflow-hidden bg-[#181512] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
      >
        <Image
          key={activeMedia.url}
          src={activeMedia.url}
          alt={localize(activeMedia.alt, locale)}
          fill
          sizes="(max-width: 640px) 92vw, 440px"
          className="object-cover brightness-[1.05] contrast-[1.03] transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          referrerPolicy="no-referrer"
        />
        {(product.isNew || product.isBestSeller) && (
          <span className="pointer-events-none absolute top-4 start-4 border border-[#F5F0E8]/20 bg-[#0B0B0A]/80 px-3 py-1 text-xs text-[#FFFDF9] backdrop-blur-xs">
            {product.isNew
              ? t.creations.newCreation
              : t.creations.houseSignature}
          </span>
        )}
      </Link>

      {gallery.length > 1 && (
        <div className="mt-3 flex items-center gap-2.5">
          {gallery.map((media, idx) => (
            <button
              key={`${media.url}-${idx}`}
              type="button"
              onClick={() => onSelectImage(idx)}
              aria-label={`${t.pdp.selectImage} ${idx + 1}`}
              aria-current={selectedImageIndex === idx ? 'true' : undefined}
              className={cn(
                'relative h-16 w-14 overflow-hidden border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]',
                selectedImageIndex === idx
                  ? 'border-[#A77A50]'
                  : 'border-[#F5F0E8]/15 opacity-65 hover:opacity-100'
              )}
            >
              <Image
                src={media.url}
                alt={localize(media.alt, locale)}
                fill
                sizes="56px"
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
