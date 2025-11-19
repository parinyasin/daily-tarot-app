import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TarotCard as TarotCardType } from '../types';
import { getCardImageUrl, BACK_OF_CARD_IMAGE } from '../constants';
import { Sparkles } from 'lucide-react';

interface Props {
  card: TarotCardType;
  isRevealed: boolean;
  onClick?: () => void;
  disabled?: boolean;
  width?: string;
  height?: string;
}

export const TarotCardDisplay: React.FC<Props> = ({ 
  card, 
  isRevealed, 
  onClick, 
  disabled = false,
  width = "w-48 md:w-64",
  height = "h-80 md:h-96"
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div 
      className={`relative perspective-1000 cursor-pointer ${width} ${height} group`}
      onClick={!disabled ? onClick : undefined}
    >
      <motion.div
        className="w-full h-full relative preserve-3d transition-all duration-700"
        initial={false}
        animate={{ rotateY: isRevealed ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 50, damping: 15 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Card Back */}
        <div className="absolute w-full h-full backface-hidden rounded-xl overflow-hidden shadow-2xl border-2 border-amber-500/30 bg-slate-900">
            <div className="w-full h-full bg-cover bg-center opacity-90 group-hover:opacity-100 transition-opacity" style={{ backgroundImage: `url(${BACK_OF_CARD_IMAGE})` }}>
               <div className="w-full h-full flex items-center justify-center bg-black/40">
                   <div className="w-16 h-16 border-2 border-amber-200/50 rounded-full flex items-center justify-center">
                       <div className="w-2 h-2 bg-amber-200 rounded-full animate-pulse"></div>
                   </div>
               </div>
            </div>
        </div>

        {/* Card Front */}
        <div 
          className="absolute w-full h-full backface-hidden rounded-xl overflow-hidden shadow-2xl border-2 border-amber-400 bg-slate-800"
          style={{ transform: "rotateY(180deg)", backfaceVisibility: 'hidden' }}
        >
          {!imageError ? (
            <img 
              src={getCardImageUrl(card.imageKey, card.id)} 
              alt={card.name} 
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
              crossOrigin="anonymous"
            />
          ) : (
            // Fallback UI when image fails to load
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-slate-800 to-slate-900">
              <div className="w-16 h-16 mb-4 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/30">
                <Sparkles className="text-amber-400 w-8 h-8" />
              </div>
              <h3 className="text-amber-100 font-serif text-xl tracking-wide mb-2">{card.name}</h3>
              <p className="text-amber-500/60 text-xs uppercase tracking-widest">{card.suit}</p>
              <div className="mt-8 w-full h-[1px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent"></div>
            </div>
          )}
          
          {/* Overlay Text (Only show if image loaded correctly to avoid duplicate text) */}
          {!imageError && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 pt-12">
              <p className="text-amber-100 text-center font-serif text-lg tracking-wider border-t border-amber-500/50 pt-2">
                {card.name}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};