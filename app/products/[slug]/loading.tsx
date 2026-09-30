import React from 'react';

export default function ProductDetailLoading() {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="min-h-screen bg-[#F5F0E8] text-[#0B0B0A]"
    >
      {/* Header Spacer */}
      <div className="h-20 lg:h-[5.25rem] bg-[#0B0B0A]" />

      {/* Breadcrumbs Skeleton */}
      <div className="border-b border-[#DFD3C3]/80 bg-[#F5F0E8] py-3.5">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
          <div className="h-4 w-56 animate-pulse bg-[#DFD3C3]" />
        </div>
      </div>

      {/* Main 2-Column Gallery + Purchase Panel Skeleton */}
      <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-8 sm:py-12 lg:px-12 lg:py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start lg:gap-14">
          {/* Gallery Column */}
          <div className="lg:col-span-7 space-y-5">
            <div className="aspect-[3/4] w-full animate-pulse border border-[#DFD3C3] bg-[#EBE3D5]" />
            <div className="hidden lg:grid lg:grid-cols-3 lg:gap-4">
              <div className="aspect-[3/4] w-full animate-pulse bg-[#EBE3D5]" />
              <div className="aspect-[3/4] w-full animate-pulse bg-[#EBE3D5]" />
              <div className="aspect-[3/4] w-full animate-pulse bg-[#EBE3D5]" />
            </div>
          </div>

          {/* Purchase Panel Column */}
          <div className="lg:col-span-5">
            <div className="border border-[#DFD3C3] bg-[#FFFDF9] p-6 sm:p-8 lg:p-10 space-y-6">
              <div className="flex justify-between">
                <div className="h-3.5 w-36 animate-pulse bg-[#EBE3D5]" />
                <div className="h-3.5 w-24 animate-pulse bg-[#EBE3D5]" />
              </div>

              <div className="space-y-3">
                <div className="h-10 w-48 animate-pulse bg-[#DFD3C3]" />
                <div className="h-4 w-64 animate-pulse bg-[#EBE3D5]" />
              </div>

              <div className="border-y border-[#DFD3C3] py-4 flex justify-between">
                <div className="h-8 w-28 animate-pulse bg-[#DFD3C3]" />
                <div className="h-4 w-32 animate-pulse bg-[#EBE3D5]" />
              </div>

              <div className="space-y-2">
                <div className="h-4 w-full animate-pulse bg-[#EBE3D5]" />
                <div className="h-4 w-5/6 animate-pulse bg-[#EBE3D5]" />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="h-20 w-full animate-pulse border border-[#DFD3C3] bg-[#F5F0E8]" />
                <div className="h-20 w-full animate-pulse border border-[#DFD3C3] bg-[#F5F0E8]" />
              </div>

              <div className="h-12 w-full animate-pulse bg-[#DFD3C3]" />

              <div className="space-y-3 border-t border-[#DFD3C3] pt-6">
                <div className="h-10 w-full animate-pulse bg-[#EBE3D5]" />
                <div className="h-10 w-full animate-pulse bg-[#EBE3D5]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Editorial Story Skeleton */}
      <div className="border-t border-[#DFD3C3] bg-[#FFFDF9] py-20">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7 space-y-4">
              <div className="h-3.5 w-40 animate-pulse bg-[#EBE3D5]" />
              <div className="h-9 w-80 animate-pulse bg-[#DFD3C3]" />
              <div className="h-24 w-full animate-pulse bg-[#EBE3D5]" />
            </div>
            <div className="lg:col-span-5">
              <div className="aspect-[4/5] w-full animate-pulse bg-[#EBE3D5]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
