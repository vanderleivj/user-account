import React from "react";
import { useBlackFriday } from "../hooks/useBlackFriday";

interface ScreenLayoutProps {
  readonly children: React.ReactNode;
  readonly blackFridayMode?: boolean;
}

export default function ScreenLayout({
  children,
  blackFridayMode = false,
}: ScreenLayoutProps) {
  const { config: blackFridayConfig } = useBlackFriday();

  if (blackFridayMode && blackFridayConfig.enabled) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8"
        style={{
          background: `linear-gradient(to bottom right, ${
            blackFridayConfig.layout_background_start || "#000000"
          }, ${blackFridayConfig.layout_background_mid || "#111827"}, ${
            blackFridayConfig.layout_background_end || "#000000"
          })`,
        }}
      >
        <div
          className="backdrop-blur-sm border-2 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 max-w-lg sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl w-full shadow-2xl"
          style={{
            backgroundColor:
              blackFridayConfig.layout_card_background || "rgba(0, 0, 0, 0.9)",
            borderColor:
              blackFridayConfig.layout_card_border || "rgba(220, 38, 38, 0.5)",
            boxShadow: blackFridayConfig.shadow_color
              ? `0 25px 50px -12px ${blackFridayConfig.shadow_color}`
              : "0 25px 50px -12px rgba(127, 29, 29, 0.5)",
          }}
        >
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen santo-gradient flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="glass-card rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 max-w-lg sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl w-full shadow-2xl">
        {children}
      </div>
    </div>
  );
}
