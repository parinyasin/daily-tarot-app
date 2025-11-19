import React, { useState } from 'react';
import { BRAND_ICON_URL } from '../constants';

interface Props {
  className?: string;
}

export const BrandIcon: React.FC<Props> = ({ className }) => {
  const [imgError, setImgError] = useState(false);

  // Check if URL is provided and not errored
  if (BRAND_ICON_URL && !imgError) {
    return (
      <img 
        src={BRAND_ICON_URL} 
        alt="Brand Logo" 
        className={`${className} object-cover drop-shadow-lg rounded-full`} 
        onError={() => setImgError(true)}
      />
    );
  }

  // Fallback Default Icon (Mystical Eye) if no URL or image fails to load
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="2" className="opacity-50" />
      <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="1" className="opacity-30" />
      <path 
        d="M10 50 C10 50 30 20 50 20 C70 20 90 50 90 50 C90 50 70 80 50 80 C30 80 10 50 10 50 Z" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <circle cx="50" cy="50" r="12" fill="currentColor" className="opacity-80" />
      <path d="M50 20 L50 10 M50 90 L50 80 M20 50 L10 50 M90 50 L80 50" stroke="currentColor" strokeWidth="2" />
      <path d="M28 28 L22 22 M78 28 L72 22 M28 72 L22 78 M78 72 L72 78" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
};