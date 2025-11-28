/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useCallback } from "react";

interface ImageLightboxProps {
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onChangeIndex: (index: number) => void;
}

export default function ImageLightbox({
  images,
  currentIndex,
  isOpen,
  onClose,
  onChangeIndex,
}: ImageLightboxProps) {
  const hasImages = images && images.length > 0;

  const goNext = useCallback(() => {
    if (!hasImages) return;
    onChangeIndex((currentIndex + 1) % images.length);
  }, [currentIndex, images.length, hasImages, onChangeIndex]);

  const goPrev = useCallback(() => {
    if (!hasImages) return;
    onChangeIndex((currentIndex - 1 + images.length) % images.length);
  }, [currentIndex, images.length, hasImages, onChangeIndex]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, goNext, goPrev]);

  if (!isOpen || !hasImages) return null;

  const activeImage = images[currentIndex] || images[0];

  const handleBackdropClick = () => {
    onClose();
  };

  const stopPropagation: React.MouseEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      role="dialog"
      aria-modal="true"
      aria-label="Image preview"
      onClick={handleBackdropClick}
    >
      <div
        className="relative max-w-5xl w-full px-4 sm:px-6 lg:px-8"
        onClick={stopPropagation}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-10 right-4 text-white hover:text-gray-200 focus:outline-none"
          aria-label="Close image preview"
        >
          <span className="text-3xl">&times;</span>
        </button>

        {/* Image and navigation */}
        <div className="relative flex items-center justify-center">
          {images.length > 1 && (
            <button
              type="button"
              onClick={goPrev}
              className="hidden sm:flex items-center justify-center absolute left-0 top-1/2 -translate-y-1/2 text-white bg-black/40 hover:bg-black/60 rounded-full w-10 h-10 focus:outline-none"
              aria-label="Previous image"
            >
              &#8592;
            </button>
          )}

          <div className="relative w-full max-h-[80vh] flex items-center justify-center">
            {activeImage ? (
              <img
                src={activeImage}
                alt={`Image ${currentIndex + 1}`}
                className="max-h-[80vh] w-auto max-w-full object-contain rounded-lg shadow-lg"
              />
            ) : (
              <div className="flex items-center justify-center h-64 w-full text-gray-200">
                No image available
              </div>
            )}
          </div>

          {images.length > 1 && (
            <button
              type="button"
              onClick={goNext}
              className="hidden sm:flex items-center justify-center absolute right-0 top-1/2 -translate-y-1/2 text-white bg-black/40 hover:bg-black/60 rounded-full w-10 h-10 focus:outline-none"
              aria-label="Next image"
            >
              &#8594;
            </button>
          )}
        </div>

        {/* Mobile next/prev buttons below image */}
        {images.length > 1 && (
          <div className="mt-4 flex items-center justify-center gap-4 sm:hidden">
            <button
              type="button"
              onClick={goPrev}
              className="px-4 py-2 rounded-md bg-white/10 text-white border border-white/30 hover:bg-white/20 text-sm"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={goNext}
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 text-sm"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


