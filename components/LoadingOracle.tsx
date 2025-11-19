import React from 'react';
import { BrandIcon } from './BrandIcon';

export const LoadingOracle: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] space-y-8 animate-fade-in">
      <div className="relative">
        <div className="absolute inset-0 bg-amber-500 blur-3xl opacity-20 animate-pulse rounded-full"></div>
        <BrandIcon className="w-24 h-24 text-amber-300 animate-spin-slow" />
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-2xl text-amber-200 serif-font">ดวงดาวกำลังจัดเรียง...</h3>
        <p className="text-slate-400 text-sm">กำลังเชื่อมต่อจิตวิญญาณกับไพ่ของคุณ</p>
      </div>
    </div>
  );
};
