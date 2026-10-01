'use client';

import React from 'react';
import { Check, FileText } from 'lucide-react';
import { RwaqWordmark } from '@/components/brand/rwaq-wordmark';
import { Typography } from '@/components/ui/typography';
import {
  GIFT_BUILDER_STEPS,
  getGiftOccasionDescriptor,
} from '@/features/gift-builder/occasions';
import type {
  GiftMessageDraft,
  GiftOccasion,
} from '@/features/gift-builder/types';
import {
  MAX_GIFT_MESSAGE_LENGTH,
  MAX_RECIPIENT_NAME_LENGTH,
  MAX_SENDER_NAME_LENGTH,
} from '@/features/gift-builder/validation';
import { localize } from '@/lib/i18n/config';
import { cn } from '@/lib/utils';
import { useLocale } from '@/providers/locale-provider';

interface GiftMessageStepProps {
  occasion: GiftOccasion | null;
  message: GiftMessageDraft;
  onUpdateMessage: (next: GiftMessageDraft) => void;
}

export function GiftMessageStep({
  occasion,
  message,
  onUpdateMessage,
}: GiftMessageStepProps) {
  const { locale, t } = useLocale();
  const stepMeta = GIFT_BUILDER_STEPS[3];
  const occasionDescriptor = getGiftOccasionDescriptor(occasion);

  const charCountLabel = t.giftBuilder.characterLimitNote
    .replace('{count}', String(message.messageBody.length))
    .replace('{max}', String(MAX_GIFT_MESSAGE_LENGTH));

  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center gap-3">
          <span aria-hidden="true" className="h-px w-8 bg-[#8C6239]" />
          <Typography variant="eyebrow" className="text-[#8C6239]">
            {localize(stepMeta.eyebrow, locale)}
          </Typography>
        </div>

        <Typography
          variant="display-l"
          as="h1"
          serifInEnglish
          className="mt-3 text-[#0B0B0A]"
        >
          {localize(stepMeta.title, locale)}
        </Typography>

        <Typography
          variant="body"
          className="mt-3 max-w-2xl text-[#5C534B]"
        >
          {localize(stepMeta.subtitle, locale)}
        </Typography>
      </div>

      {/* Mode Toggle: Inscribed Card vs Blank Card */}
      <div
        role="radiogroup"
        aria-label={t.giftBuilder.messageStepHint}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
      >
        <button
          type="button"
          role="radio"
          aria-checked={message.includeCard}
          onClick={() =>
            onUpdateMessage({
              ...message,
              includeCard: true,
            })
          }
          className={cn(
            'flex items-start justify-between gap-4 border p-5 text-start transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]',
            message.includeCard
              ? 'border-[#0B0B0A] bg-[#0B0B0A] text-[#F5F0E8]'
              : 'border-[#DED5C6] bg-[#FFFDF9] text-[#0B0B0A] hover:border-[#8C6239]'
          )}
        >
          <div>
            <span className="block text-sm font-medium">
              {t.giftBuilder.includeCardToggleLabel}
            </span>
            <span
              className={cn(
                'mt-1 block text-xs leading-relaxed',
                message.includeCard ? 'text-[#D8C8B2]' : 'text-[#5C534B]'
              )}
            >
              {t.giftBuilder.includeCardDescription}
            </span>
          </div>
          <span
            className={cn(
              'mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center border',
              message.includeCard
                ? 'border-[#A77A50] bg-[#A77A50] text-[#0B0B0A]'
                : 'border-[#CFC4B4] text-transparent'
            )}
          >
            <Check className="h-3 w-3 stroke-[2.2]" />
          </span>
        </button>

        <button
          type="button"
          role="radio"
          aria-checked={!message.includeCard}
          onClick={() =>
            onUpdateMessage({
              ...message,
              includeCard: false,
            })
          }
          className={cn(
            'flex items-start justify-between gap-4 border p-5 text-start transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]',
            !message.includeCard
              ? 'border-[#0B0B0A] bg-[#0B0B0A] text-[#F5F0E8]'
              : 'border-[#DED5C6] bg-[#FFFDF9] text-[#0B0B0A] hover:border-[#8C6239]'
          )}
        >
          <div>
            <span className="block text-sm font-medium">
              {t.giftBuilder.blankCardToggleLabel}
            </span>
            <span
              className={cn(
                'mt-1 block text-xs leading-relaxed',
                !message.includeCard ? 'text-[#D8C8B2]' : 'text-[#5C534B]'
              )}
            >
              {t.giftBuilder.blankCardDescription}
            </span>
          </div>
          <span
            className={cn(
              'mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center border',
              !message.includeCard
                ? 'border-[#A77A50] bg-[#A77A50] text-[#0B0B0A]'
                : 'border-[#CFC4B4] text-transparent'
            )}
          >
            <Check className="h-3 w-3 stroke-[2.2]" />
          </span>
        </button>
      </div>

      {/* Editor & Live Cream-Linen Card Preview */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {message.includeCard && (
          <div className="space-y-5 lg:col-span-7">
            <div>
              <label
                htmlFor="gift-recipient-name"
                className="block text-xs font-medium text-[#2C2623]"
              >
                {t.giftBuilder.recipientLabel}
              </label>
              <input
                id="gift-recipient-name"
                type="text"
                maxLength={MAX_RECIPIENT_NAME_LENGTH}
                value={message.recipientName}
                onChange={(e) =>
                  onUpdateMessage({
                    ...message,
                    recipientName: e.target.value.slice(
                      0,
                      MAX_RECIPIENT_NAME_LENGTH
                    ),
                  })
                }
                placeholder={t.giftBuilder.recipientPlaceholder}
                className="mt-2 h-12 w-full border border-[#CFC4B4] bg-[#FFFDF9] px-4 text-sm text-[#0B0B0A] placeholder:text-[#918A80] focus:border-[#0B0B0A] focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="gift-message-body"
                  className="block text-xs font-medium text-[#2C2623]"
                >
                  {t.giftBuilder.messageBodyLabel}
                </label>
                <span className="text-[11px] tabular-nums text-[#7A7067]">
                  {charCountLabel}
                </span>
              </div>
              <textarea
                id="gift-message-body"
                rows={4}
                maxLength={MAX_GIFT_MESSAGE_LENGTH}
                value={message.messageBody}
                onChange={(e) =>
                  onUpdateMessage({
                    ...message,
                    messageBody: e.target.value.slice(
                      0,
                      MAX_GIFT_MESSAGE_LENGTH
                    ),
                  })
                }
                placeholder={t.giftBuilder.messageBodyPlaceholder}
                className="mt-2 w-full border border-[#CFC4B4] bg-[#FFFDF9] p-4 text-sm leading-relaxed text-[#0B0B0A] placeholder:text-[#918A80] focus:border-[#0B0B0A] focus:outline-none"
              />
            </div>

            {/* Occasion-Curated House Dedication Phrases */}
            {occasionDescriptor &&
              occasionDescriptor.suggestedCardMessages.length > 0 && (
                <div className="border border-[#EBE3D5] bg-[#FFFDF9] p-4">
                  <div className="flex items-center gap-2 text-xs font-medium text-[#8C6239]">
                    <FileText className="h-3.5 w-3.5 stroke-[1.6]" />
                    <span>{t.giftBuilder.suggestedMessagesTitle}</span>
                  </div>
                  <div className="mt-3 space-y-2.5">
                    {occasionDescriptor.suggestedCardMessages.map(
                      (phrase, idx) => {
                        const localizedPhrase = localize(phrase, locale);
                        return (
                          <div
                            key={idx}
                            className="flex flex-col justify-between gap-2 border-t border-[#EBE3D5] pt-2.5 first:border-t-0 first:pt-0 sm:flex-row sm:items-center"
                          >
                            <p className="text-xs italic leading-relaxed text-[#4A3027]">
                              &ldquo;{localizedPhrase}&rdquo;
                            </p>
                            <button
                              type="button"
                              onClick={() =>
                                onUpdateMessage({
                                  ...message,
                                  messageBody: localizedPhrase,
                                })
                              }
                              className="shrink-0 text-xs font-medium text-[#8C6239] underline underline-offset-4 transition-colors hover:text-[#0B0B0A]"
                            >
                              {t.giftBuilder.useSuggestedMessageAction}
                            </button>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              )}

            <div>
              <label
                htmlFor="gift-sender-name"
                className="block text-xs font-medium text-[#2C2623]"
              >
                {t.giftBuilder.senderLabel}
              </label>
              <input
                id="gift-sender-name"
                type="text"
                maxLength={MAX_SENDER_NAME_LENGTH}
                value={message.senderName}
                onChange={(e) =>
                  onUpdateMessage({
                    ...message,
                    senderName: e.target.value.slice(0, MAX_SENDER_NAME_LENGTH),
                  })
                }
                placeholder={t.giftBuilder.senderPlaceholder}
                className="mt-2 h-12 w-full border border-[#CFC4B4] bg-[#FFFDF9] px-4 text-sm text-[#0B0B0A] placeholder:text-[#918A80] focus:border-[#0B0B0A] focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Live Architectural Linen Card Preview */}
        <div
          className={cn(
            message.includeCard ? 'lg:col-span-5' : 'lg:col-span-12'
          )}
        >
          <div className="border border-[#CFC4B4] bg-[#FFFDF9] p-6 sm:p-8 shadow-[0_18px_40px_rgba(11,11,10,0.06)]">
            <div className="border border-[#A77A50]/45 p-6 sm:p-8">
              <div className="flex items-center justify-between border-b border-[#EBE3D5] pb-4">
                <div className="text-[#0B0B0A]">
                  <RwaqWordmark size="sm" />
                </div>
                <span className="font-[family-name:var(--font-display-en)] text-[10px] tracking-[0.22em] text-[#8C6239]">
                  {t.giftBuilder.cardPreviewTitle}
                </span>
              </div>

              {message.includeCard ? (
                <div className="my-8 min-h-[140px] flex flex-col justify-between space-y-5">
                  {message.recipientName.trim() ? (
                    <p className="text-xs font-medium text-[#4A3027]">
                      {t.drawers.bag.giftCardToPrefix}{' '}
                      <span className="text-[#0B0B0A]">
                        {message.recipientName}
                      </span>
                    </p>
                  ) : (
                    <span aria-hidden="true" />
                  )}

                  <p
                    className={cn(
                      'text-base leading-relaxed',
                      message.messageBody.trim()
                        ? 'italic text-[#0B0B0A]'
                        : 'text-sm text-[#918A80]'
                    )}
                  >
                    {message.messageBody.trim()
                      ? `“${message.messageBody}”`
                      : t.giftBuilder.cardPreviewEmptyBody}
                  </p>

                  {message.senderName.trim() ? (
                    <p className="text-end text-xs font-medium text-[#4A3027]">
                      {t.drawers.bag.giftCardFromPrefix}{' '}
                      <span className="text-[#0B0B0A]">
                        {message.senderName}
                      </span>
                    </p>
                  ) : (
                    <span aria-hidden="true" />
                  )}
                </div>
              ) : (
                <div className="my-10 text-center">
                  <p className="text-sm leading-relaxed text-[#5C534B]">
                    {t.giftBuilder.cardPreviewBlankNotice}
                  </p>
                </div>
              )}

              <div className="border-t border-[#EBE3D5] pt-3 text-center">
                <span className="font-[family-name:var(--font-display-en)] text-[10px] tracking-[0.25em] text-[#918A80]">
                  RIYADH · HOUSE OF RWAQ
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
