"use client";

import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
  useCallback,
} from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement | string,
        options: {
          sitekey: string;
          action?: string;
          cData?: string;
          callback?: (token: string) => void;
          "error-callback"?: (errorCode?: string) => void;
          "expired-callback"?: () => void;
          "timeout-callback"?: () => void;
          theme?: "auto" | "light" | "dark";
          size?: "normal" | "compact" | "flexible";
          "refresh-expired"?: "auto" | "manual" | "never";
          retry?: "auto" | "never";
          "retry-interval"?: number;
          [key: string]: any;
        }
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
      getResponse: (widgetId?: string) => string | undefined;
      ready: (callback: () => void) => void;
    };
    __turnstileScriptLoaded?: boolean;
    __turnstileLoadingPromise?: Promise<void>;
  }
}

export interface TurnstileHandle {
  reset: () => void;
  remove: () => void;
  getResponse: () => string | undefined;
}

export interface TurnstileProps {
  siteKey?: string;
  action?: string;
  cData?: string;
  theme?: "auto" | "light" | "dark";
  size?: "normal" | "compact" | "flexible";
  onVerify?: (token: string) => void;
  onExpire?: () => void;
  onError?: (errorCode?: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

const TURNSTILE_SCRIPT_URL =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

function loadTurnstileScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }

  if (window.turnstile) {
    return Promise.resolve();
  }

  if (window.__turnstileLoadingPromise) {
    return window.__turnstileLoadingPromise;
  }

  window.__turnstileLoadingPromise = new Promise<void>((resolve, reject) => {
    // Check if script tag already exists
    const existing = document.querySelector(
      `script[src^="https://challenges.cloudflare.com/turnstile/v0/api.js"]`
    ) as HTMLScriptElement | null;

    if (existing) {
      if (window.turnstile) {
        resolve();
      } else {
        existing.addEventListener("load", () => resolve());
        existing.addEventListener("error", (e) => reject(e));
      }
      return;
    }

    const script = document.createElement("script");
    script.src = TURNSTILE_SCRIPT_URL;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      window.__turnstileScriptLoaded = true;
      resolve();
    };
    script.onerror = (err) => {
      console.error("[Turnstile] Gagal memuat script Cloudflare Turnstile:", err);
      reject(err);
    };
    document.head.appendChild(script);
  });

  return window.__turnstileLoadingPromise;
}

const Turnstile = forwardRef<TurnstileHandle, TurnstileProps>(
  (
    {
      siteKey,
      action,
      cData,
      theme = "light",
      size = "normal",
      onVerify,
      onExpire,
      onError,
      className,
      style,
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    const effectiveSiteKey =
      siteKey ||
      process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY ||
      "";

    // Stable callback refs to avoid re-rendering widgets when handlers change
    const onVerifyRef = useRef(onVerify);
    const onExpireRef = useRef(onExpire);
    const onErrorRef = useRef(onError);

    useEffect(() => {
      onVerifyRef.current = onVerify;
      onExpireRef.current = onExpire;
      onErrorRef.current = onError;
    });

    const reset = useCallback(() => {
      if (typeof window !== "undefined" && window.turnstile && widgetIdRef.current) {
        try {
          window.turnstile.reset(widgetIdRef.current);
        } catch (err) {
          console.warn("[Turnstile] Error resetting widget:", err);
        }
      }
    }, []);

    const remove = useCallback(() => {
      if (typeof window !== "undefined" && window.turnstile && widgetIdRef.current) {
        try {
          window.turnstile.remove(widgetIdRef.current);
          widgetIdRef.current = null;
        } catch (err) {
          console.warn("[Turnstile] Error removing widget:", err);
        }
      }
    }, []);

    const getResponse = useCallback(() => {
      if (typeof window !== "undefined" && window.turnstile && widgetIdRef.current) {
        return window.turnstile.getResponse(widgetIdRef.current);
      }
      return undefined;
    }, []);

    useImperativeHandle(ref, () => ({
      reset,
      remove,
      getResponse,
    }));

    useEffect(() => {
      let isMounted = true;

      if (!effectiveSiteKey) {
        return;
      }

      loadTurnstileScript()
        .then(() => {
          if (!isMounted || !containerRef.current) return;
          setIsLoaded(true);

          // Clean up old widget if any
          if (widgetIdRef.current && window.turnstile) {
            try {
              window.turnstile.remove(widgetIdRef.current);
            } catch {
              // ignore
            }
            widgetIdRef.current = null;
          }

          if (containerRef.current) {
            containerRef.current.innerHTML = "";
          }

          if (window.turnstile) {
            try {
              const widgetId = window.turnstile.render(containerRef.current, {
                sitekey: effectiveSiteKey,
                action,
                cData,
                theme,
                size,
                callback: (token: string) => {
                  if (onVerifyRef.current) {
                    onVerifyRef.current(token);
                  }
                },
                "expired-callback": () => {
                  if (onExpireRef.current) {
                    onExpireRef.current();
                  }
                },
                "error-callback": (code?: string) => {
                  console.warn("[Turnstile] Error callback triggered, code:", code);
                  if (onErrorRef.current) {
                    onErrorRef.current(code);
                  }
                },
              });
              widgetIdRef.current = widgetId;
            } catch (err) {
              console.error("[Turnstile] Failed to render widget:", err);
            }
          }
        })
        .catch((err) => {
          console.error("[Turnstile] Error initializing turnstile:", err);
          if (onErrorRef.current) {
            onErrorRef.current(String(err));
          }
        });

      return () => {
        isMounted = false;
        if (widgetIdRef.current && window.turnstile) {
          try {
            window.turnstile.remove(widgetIdRef.current);
            widgetIdRef.current = null;
          } catch {
            // ignore
          }
        }
      };
    }, [effectiveSiteKey, action, cData, theme, size]);

    if (!effectiveSiteKey) {
      return (
        <div
          style={{
            padding: "8px 12px",
            fontSize: "12px",
            color: "#856404",
            backgroundColor: "#fff3cd",
            border: "1px solid #ffeeba",
            borderRadius: "4px",
            textAlign: "center",
            margin: "8px 0",
            ...style,
          }}
          className={className}
        >
          <strong>Cloudflare Turnstile:</strong> NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY belum disetel.
        </div>
      );
    }

    return (
      <div
        className={className}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "65px",
          width: "100%",
          ...style,
        }}
      >
        <div ref={containerRef} />
        {!isLoaded && (
          <div
            style={{
              fontSize: "12px",
              color: "#6c757d",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <i className="fas fa-spinner fa-spin" /> Memuat verifikasi keamanan...
          </div>
        )}
      </div>
    );
  }
);

Turnstile.displayName = "Turnstile";

export default Turnstile;

