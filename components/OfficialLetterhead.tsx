'use client';

import React from 'react';
import EditableText from './EditableText';
import { toSafeAssetUrl } from '@/utils/officialAssets';

export interface LetterheadProps {
  image: string;
  outwardNumber?: string;
  date?: string;
  showEditableFields?: boolean;
  isDirectEditEnabled?: boolean;
  onUpdateOutwardNumber?: (val: string) => void;
  onUpdateDate?: (val: string) => void;
}

/**
 * OfficialLetterhead renders the authentic official letterhead image at the top of the A4 page.
 * - Strictly NO border, NO card frame, NO rounded border, NO box-shadow around the letterhead.
 * - Background is transparent and wrapper padding is zero.
 * - Outward number (जावक क्र.) and Date (दिनांक) are rendered in normal document typography (11pt-12pt),
 *   not oversized, visually matching the rest of the official document.
 */
export default function OfficialLetterhead({
  image,
  outwardNumber,
  date,
  showEditableFields = true,
  isDirectEditEnabled = false,
  onUpdateOutwardNumber,
  onUpdateDate,
}: LetterheadProps) {
  // Ensure the image URL handles spaces cleanly for both web rendering and canvas/PDF export
  const encodedImage = toSafeAssetUrl(image);

  return (
    <header className="w-full mb-3 bg-transparent border-none p-0 m-0 shadow-none">
      {/* Official Fixed A4 Header Image - strictly preserve aspect ratio with no frame, shadow or border */}
      <div className="w-full bg-transparent p-0 m-0 border-none shadow-none flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={encodedImage}
          alt="अधिकृत लेटरहेड"
          className="w-full h-auto object-contain block select-none border-none shadow-none rounded-none bg-transparent"
          crossOrigin="anonymous"
          loading="eager"
        />
      </div>

      {/* Official Letterhead Divider Line: thin 1px black divider directly below the letterhead image */}
      <div
        id="letterhead-divider"
        className="w-full letterhead-divider border-t border-black m-0 p-0"
        style={{
          width: '100%',
          borderTop: '1px solid #000000',
          margin: 0,
          padding: 0,
          boxSizing: 'border-box',
        }}
      />

      {/* Outward Number & Date Fields below letterhead - Normal document typography (11pt-12pt / 14px-15px, weight 500) */}
      {showEditableFields && (
        <div className="w-full flex justify-between items-baseline mt-2 pt-0.5 pb-1 text-[14px] sm:text-[15px] font-normal leading-normal font-devanagari-sans text-slate-800">
          <div className="flex items-baseline gap-1">
            <span className="font-semibold text-slate-900">जावक क्र. :</span>
            {onUpdateOutwardNumber ? (
              <EditableText
                value={outwardNumber || ''}
                onChange={onUpdateOutwardNumber}
                isDirectEditEnabled={isDirectEditEnabled}
                placeholder="जा.क्र./२०२५-२६/"
                className="text-slate-800 font-medium"
              />
            ) : (
              <span>{outwardNumber || 'जा.क्र./२०२५/'}</span>
            )}
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-semibold text-slate-900">दिनांक :</span>
            {onUpdateDate ? (
              <EditableText
                value={date || ''}
                onChange={onUpdateDate}
                isDirectEditEnabled={isDirectEditEnabled}
                placeholder="१८.०९.२०२६"
                className="text-slate-800 font-medium"
              />
            ) : (
              <span>{date || '___/___/२०२६'}</span>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
