'use client';

import { InlineWidget } from "react-calendly";

export function CalendlyEmbed() {
  return (
    <div className="lg:h-[700px] h-[840px] w-full">
      <InlineWidget
        url="https://calendly.com/shhadyse/30min"
        styles={{
          height: '100%',
          width: '100%',
          overflow: 'hidden'
        }}
      />
    </div>
  );
} 