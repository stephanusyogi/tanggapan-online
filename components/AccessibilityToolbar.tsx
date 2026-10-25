"use client";

import { useEffect } from "react";
import Script from "next/script";

export default function AccessibilityToolbar() {
  const initToolbar = () => {
    if (typeof window !== "undefined" && (window as any).MicAccessTool) {
      if (!(window as any)._micAccessToolInitialized) {
        try {
          (window as any).micAccessTool = new (window as any).MicAccessTool({
            link: "#",
            contact: "mailto:datinkpungawi@gmail.com",
            buttonPosition: "left",
            forceLang: "id-ID",
          });
          (window as any)._micAccessToolInitialized = true;
        } catch (e) {
          console.error("[AccessibilityToolbar] Failed to initialize:", e);
        }
      }
    }
  };

  useEffect(() => {
    initToolbar();
  }, []);

  return (
    <Script
      src="/template/js/acctoolbar/acctoolbar.min.js"
      strategy="afterInteractive"
      onLoad={initToolbar}
    />
  );
}
