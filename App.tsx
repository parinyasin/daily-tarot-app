import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RefreshCcw, ArrowRight, Heart, Feather } from 'lucide-react';
import { FULL_DECK, BACK_OF_CARD_IMAGE } from './constants';
import { TarotCard as TarotCardType, AppState, DailyPrediction } from './types';
import { getDailyReading } from './services/geminiService';
import { BrandIcon } from './components/BrandIcon';
import { TarotCardDisplay } from './components/TarotCard';
import { LoadingOracle } from './components/LoadingOracle';

function App() {
  const [appState, setAppState] = useState<AppState>('INTRO');
  const [deck, setDeck] = useState<TarotCardType[]>([]);
  const [selectedCard, setSelectedCard] = useState<TarotCardType | null>(null);
  const [prediction, setPrediction] = useState<DailyPrediction | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    resetDeck();
  }, []);

  const resetDeck = () => {
    const shuffled = [...FULL_DECK].sort(() => Math.random() - 0.5);
    setDeck(shuffled.slice(0, 4));
  };

  const handleStart = () => {
    setAppState('SHUFFLING');
    setTimeout(() => {
      setAppState('SELECTION');
    }, 2500);
  };

  const handleCardSelect = async (card: TarotCardType) => {
    if (appState !== 'SELECTION') return;
    
    setSelectedCard(card);
    setAppState('REVEAL');
    
    setTimeout(async () => {
      setAppState('READING');
      setIsLoading(true);
      try {
        const result = await getDailyReading(card);
        setPrediction(result);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }, 800);
  };

  const resetApp = () => {
    setAppState('INTRO');
    setSelectedCard(null);
    setPrediction(null);
    setIsLoading(false);
    resetDeck();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-200 overflow-x-hidden relative font-sans selection:bg-rose-500/30 flex flex-col">
      
      {/* Mystical Background - Love Theme Adjustment */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
         <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-rose-900/20 rounded-full blur-[100px] mix-blend-screen animate-pulse-slow"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[120px] mix-blend-screen"></div>
      </div>

      {/* Navigation */}
      <header className="relative z-20 p-6 flex justify-between items-center border-b border-white/5 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center bg-rose-500/10 rounded-full overflow-hidden border border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.2)]">
             <BrandIcon className="w-full h-full" />
          </div>
          <h1 className="text-xl font-bold tracking-[0.2em] text-rose-50 serif-font uppercase drop-shadow-md">Garagay Tarot</h1>
        </div>
        {appState !== 'INTRO' && (
          <button 
            onClick={resetApp}
            className="group flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-rose-500/10 transition-all text-sm text-rose-100/80 hover:text-rose-100 border border-white/5 hover:border-rose-500/30"
          >
            <RefreshCcw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
            <span className="hidden md:inline">เริ่มใหม่</span>
          </button>
        )}
      </header>

      <main className="relative z-10 container mx-auto px-4 py-6 flex-grow flex flex-col items-center justify-center min-h-[600px]">
        
        <AnimatePresence mode="wait">
          
          {/* STATE: INTRO */}
          {appState === 'INTRO' && (
            <motion.div 
              key="intro"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
              className="flex flex-col items-center text-center space-y-12 max-w-2xl w-full"
            >
              {/* Brand Logo Large */}
              <div className="relative group cursor-default">
                 <div className="absolute inset-0 bg-rose-500 blur-[60px] opacity-20 rounded-full group-hover:opacity-30 transition-opacity duration-1000"></div>
                 <div className="relative z-10 transform transition-transform duration-1000 group-hover:scale-105">
                   <div className="w-56 h-56 md:w-72 md:h-72 rounded-full border-4 border-rose-500/10 p-1 bg-black/20 backdrop-blur-sm flex items-center justify-center overflow-hidden shadow-2xl">
                      <BrandIcon className="w-full h-full object-cover" />
                   </div>
                 </div>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-rose-50 to-rose-400 serif-font leading-tight drop-shadow-lg">
                  Pick A Card
                </h2>
                <p className="text-xl text-rose-100/60 font-light tracking-wide">
                  คำทำนายความรักจากไพ่ 78 ใบ
                </p>
              </div>

              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStart}
                className="relative px-12 py-5 bg-gradient-to-r from-rose-700 to-pink-700 rounded-full text-white font-semibold tracking-widest shadow-[0_0_20px_rgba(244,63,94,0.3)] hover:shadow-[0_0_40px_rgba(244,63,94,0.5)] transition-all duration-300 flex items-center gap-3 group overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <span className="relative z-10 text-lg">เปิดไพ่ทำนายรัก</span>
                <ArrowRight className="relative z-10 w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </motion.div>
          )}

          {/* STATE: SHUFFLING */}
          {appState === 'SHUFFLING' && (
            <motion.div
              key="shuffling"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-full w-full"
            >
              <div className="relative w-48 h-72 md:w-56 md:h-80 perspective-1000">
                {[0, 1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute inset-0 rounded-xl bg-slate-800 border border-rose-500/20 shadow-2xl overflow-hidden backface-hidden"
                    initial={{ x: 0, y: 0, rotate: 0, scale: 1 }}
                    animate={{ 
                      x: [0, (i % 2 === 0 ? 1 : -1) * 180, 0], 
                      rotate: [0, (i % 2 === 0 ? 10 : -10), 0],
                      scale: [1, 1.05, 1],
                      zIndex: [i, 10, i]
                    }}
                    transition={{ 
                      duration: 0.8, 
                      repeat: 2,
                      ease: "easeInOut",
                      delay: i * 0.05
                    }}
                  >
                     <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${BACK_OF_CARD_IMAGE})` }}>
                        <div className="w-full h-full bg-black/10"></div>
                     </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-12 space-y-2 text-center">
                <h3 className="text-2xl text-rose-200 serif-font tracking-[0.2em] animate-pulse">SHUFFLING</h3>
                <p className="text-rose-400/60 text-sm">กำลังสื่อสารกับไพ่...</p>
              </div>
            </motion.div>
          )}

          {/* STATE: SELECTION (Enhanced) */}
          {appState === 'SELECTION' && (
            <motion.div
              key="selection"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center w-full flex flex-col items-center relative z-10"
            >
               {/* Decorative Aura Background */}
               <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] bg-gradient-radial from-rose-500/10 via-purple-500/5 to-transparent blur-3xl -z-10 pointer-events-none animate-pulse-slow"></div>

              <motion.div 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="relative z-20 mb-8"
              >
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-200 text-xs font-medium uppercase tracking-widest mb-6">
                    <Sparkles size={12} />
                    <span>สัมผัสพลังงาน</span>
                    <Sparkles size={12} />
                  </div>
                  <h3 className="text-4xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-rose-100 via-white to-rose-100 mb-6 serif-font font-medium drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                    เลือกไพ่ 1 ใบ
                  </h3>
                  <p className="text-rose-200/70 font-light text-lg tracking-wide max-w-lg mx-auto leading-relaxed">
                    หายใจเข้าลึกๆ ตั้งจิตถึงเรื่องราวความรักของคุณ<br/> 
                    แล้วเลือกไพ่ใบที่ <span className="text-rose-400 font-medium">"ดึงดูดใจ"</span> คุณที่สุด
                  </p>
              </motion.div>
              
              <div className="relative h-[380px] md:h-[500px] w-full max-w-5xl flex justify-center items-center perspective-1000 py-10">
                {deck.map((card, index) => {
                  const totalCards = deck.length;
                  const centerIndex = (totalCards - 1) / 2;
                  const distanceFromCenter = index - centerIndex;
                  
                  // Fan calculation
                  const rotate = distanceFromCenter * 5; // Less rotation for cleaner look
                  const xOffset = distanceFromCenter * 160; // Wider spread
                  const yOffset = Math.abs(distanceFromCenter) * 15; 

                  return (
                    <motion.div
                      key={card.id}
                      className="absolute transform-gpu cursor-pointer group"
                      style={{ transformOrigin: "bottom center" }}
                      initial={{ rotate: 0, x: 0, y: 500, opacity: 0, scale: 0.5 }}
                      animate={{ 
                        rotate: rotate, 
                        x: xOffset, 
                        y: yOffset, 
                        opacity: 1, 
                        scale: 1,
                        transition: { 
                            type: "spring", stiffness: 60, damping: 12, delay: index * 0.1 
                        }
                      }}
                      whileHover={{ 
                        y: yOffset - 50, 
                        scale: 1.1, 
                        zIndex: 50,
                        transition: { duration: 0.3 }
                      }}
                    >
                        {/* Magical Glow on Hover */}
                        <div className="absolute -inset-6 bg-rose-500/0 group-hover:bg-rose-500/20 blur-2xl rounded-full transition-colors duration-500 pointer-events-none"></div>
                        
                        {/* Floating Number Label */}
                        <div className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:-translate-y-2">
                            <div className="w-8 h-8 flex items-center justify-center rounded-full border border-rose-200/30 bg-black/50 backdrop-blur-sm text-rose-100 font-serif text-lg shadow-[0_0_10px_rgba(244,63,94,0.5)]">
                                {index + 1}
                            </div>
                        </div>

                        {/* The Card Itself */}
                        <div onClick={() => handleCardSelect(card)} className="relative">
                             <TarotCardDisplay 
                              card={card} 
                              isRevealed={false} 
                              // Disable click handler in TarotCardDisplay to use parent div's handler
                              onClick={() => {}} 
                              width="w-44 md:w-60" // Larger Cards
                              height="h-72 md:h-96"
                            />
                        </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STATE: REVEAL / READING */}
          {(appState === 'REVEAL' || appState === 'READING') && selectedCard && (
             <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start mt-4 px-4">
               
               {/* Left Column: The Card */}
               <motion.div 
                  className="lg:col-span-5 flex flex-col items-center lg:sticky lg:top-28"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
               >
                 <div className="relative group perspective-1000">
                    <div className="absolute inset-0 bg-rose-500/20 blur-[60px] rounded-full animate-pulse-slow"></div>
                    <TarotCardDisplay 
                      card={selectedCard} 
                      isRevealed={true} 
                      disabled={true}
                      width="w-64 md:w-80"
                      height="h-96 md:h-[480px]"
                    />
                 </div>
                 <div className="text-center mt-10 space-y-3">
                    <h2 className="text-3xl md:text-4xl text-rose-100 serif-font font-bold text-center drop-shadow-lg bg-clip-text text-transparent bg-gradient-to-b from-white to-rose-200">
                        {selectedCard.name}
                    </h2>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10">
                      <Sparkles size={14} className="text-rose-400" />
                      <p className="text-rose-200/80 uppercase tracking-widest text-xs font-medium">{selectedCard.suit}</p>
                    </div>
                 </div>
               </motion.div>

               {/* Right Column: The Reading */}
               <div className="lg:col-span-7 min-h-[400px]">
                  {isLoading ? (
                    <LoadingOracle />
                  ) : prediction ? (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="space-y-6"
                    >
                      {/* Prediction Box */}
                      <div className="relative bg-gradient-to-b from-slate-800 to-slate-900 p-[1px] rounded-2xl shadow-2xl overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-r from-rose-600/20 via-pink-500/20 to-rose-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                        <div className="relative bg-[#0f131a] rounded-2xl p-6 md:p-10 border border-white/5">
                            <div className="flex items-center gap-3 mb-8 text-rose-400 border-b border-rose-500/10 pb-4">
                                <div className="p-2 bg-rose-500/10 rounded-lg">
                                   <Heart size={24} fill="currentColor" className="text-rose-500" />
                                </div>
                                <h3 className="text-xl font-bold uppercase tracking-wider serif-font text-rose-100">คำทำนายความรัก</h3>
                            </div>
                            
                            {/* Main Love Prediction */}
                            <p className="text-rose-50 leading-loose text-lg font-light mb-10">
                                {prediction.general}
                            </p>

                            {/* Advice Section embedded */}
                            <div className="bg-gradient-to-r from-rose-900/20 to-transparent rounded-xl p-6 border-l-4 border-rose-500">
                                <div className="flex items-center gap-2 mb-3 text-rose-300">
                                    <Feather size={18} />
                                    <span className="uppercase tracking-widest text-xs font-bold">คำแนะนำจากไพ่</span>
                                </div>
                                <p className="text-rose-100/90 italic text-xl serif-font leading-relaxed">
                                    "{prediction.advice}"
                                </p>
                            </div>
                        </div>
                      </div>

                    </motion.div>
                  ) : null}
               </div>
             </div>
          )}
        
        </AnimatePresence>
      </main>

      <footer className="relative z-10 py-8 text-center border-t border-white/5 mt-auto bg-black/20 backdrop-blur-sm">
        <div className="flex flex-col items-center justify-center gap-3 text-slate-500 text-sm">
            <div className="w-8 h-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                <BrandIcon className="w-full h-full" />
            </div>
            <p>© 2025 Garagayhoro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;