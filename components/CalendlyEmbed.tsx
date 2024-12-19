'use client';

import { InlineWidget } from "react-calendly";

export function CalendlyEmbed() {
  return (
    <div className="h-[600px] w-full">
      <InlineWidget
        url="https://calendly.com/shhadyse/30min"
        styles={{
          height: '100%',
          width: '100%',
        }}
      />
    </div>
  );
} 