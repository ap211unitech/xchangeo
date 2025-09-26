"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Log error for debugging
    if (error) {
      console.error("Global error:", error);
    }
  }, [error]);

  const handleReset = () => {
    // Add slight delay for better UX
    setTimeout(() => reset(), 150);
  };

  return (
    <html className="dark h-full">
      <head>
        <title>Something went wrong</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className="m-0 h-full p-0 font-sans antialiased"
        style={{
          background: `linear-gradient(135deg, 
            oklch(0.141 0.005 285.823) 0%, 
            oklch(0.18 0.008 285.823) 100%)`,
          color: "oklch(0.985 0 0)",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div
          className={`flex min-h-screen items-center justify-center p-8 transition-all duration-700 ease-out ${mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"} `}
        >
          <div
            className="border-opacity-20 relative w-full max-w-md transform rounded-2xl border p-8 shadow-2xl backdrop-blur-sm transition-all duration-500 hover:scale-105"
            style={{
              background: `linear-gradient(135deg, 
                oklch(0.21 0.006 285.885) 0%, 
                oklch(0.24 0.008 285.885) 100%)`,
              borderColor: "oklch(1 0 0 / 10%)",
              boxShadow: `
                0 20px 25px -5px rgba(0, 0, 0, 0.3),
                0 10px 10px -5px rgba(0, 0, 0, 0.2),
                inset 0 1px 0 rgba(255, 255, 255, 0.05)
              `,
            }}
          >
            {/* Decorative glow effect */}
            <div
              className="absolute -inset-1 rounded-2xl opacity-30 blur-xl"
              style={{
                background: `linear-gradient(135deg, 
                  oklch(0.645 0.246 5.439), 
                  oklch(0.704 0.191 22.216))`,
              }}
            />

            <div className="relative z-10">
              {/* Error Icon */}
              <div className="mb-6 flex justify-center">
                <div
                  className="flex h-20 w-20 transform items-center justify-center rounded-full transition-all duration-300 hover:rotate-12"
                  style={{
                    background: `linear-gradient(135deg, 
                      oklch(0.704 0.191 22.216), 
                      oklch(0.644 0.171 22.216))`,
                    boxShadow: "0 8px 32px rgba(255, 87, 87, 0.3)",
                  }}
                >
                  <svg className="h-10 w-10" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
              </div>

              {/* Title */}
              <h1
                className="mb-4 bg-gradient-to-r bg-clip-text text-center text-3xl font-bold text-transparent"
                style={{
                  backgroundImage: `linear-gradient(135deg, 
                    oklch(0.985 0 0), 
                    oklch(0.905 0.015 286.067))`,
                }}
              >
                Oops! Something went wrong
              </h1>

              {/* Error message */}
              <div className="mb-8">
                <div
                  className="rounded-lg p-4 text-sm leading-relaxed"
                  style={{
                    background: "oklch(0.274 0.006 286.033)",
                    color: "oklch(0.905 0.015 286.067)",
                    border: "1px solid oklch(1 0 0 / 5%)",
                  }}
                >
                  <div className="mb-2 font-medium text-white">Error Details:</div>
                  <div className="font-mono text-xs break-words">{error?.message || "An unexpected error occurred"}</div>
                  {error?.digest && <div className="mt-2 text-xs opacity-70">Error ID: {error.digest}</div>}
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-3">
                <Button
                  size="lg"
                  onClick={handleReset}
                  className="w-full transform rounded-xl px-6 py-3 font-semibold text-white transition-all duration-200 hover:scale-105 hover:shadow-lg focus:ring-2 focus:ring-offset-2 focus:outline-none active:scale-95"
                  style={{
                    background: `linear-gradient(135deg, 
                    oklch(0.645 0.246 5.439), 
                    oklch(0.595 0.226 5.439))`,
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    focusRingColor: "oklch(0.645 0.246 5.439)",
                    focusRingOffsetColor: "oklch(0.21 0.006 285.885)",
                  }}
                >
                  ✨ Try Again
                </Button>

                <Button
                  size="lg"
                  onClick={() => (window.location.href = "/")}
                  className="border-opacity-30 w-full transform rounded-xl border px-6 py-3 font-medium transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-offset-2 focus:outline-none"
                  style={{
                    background: "transparent",
                    color: "oklch(0.905 0.015 286.067)",
                    borderColor: "oklch(1 0 0 / 20%)",
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    focusRingColor: "oklch(0.645 0.246 5.439)",
                    focusRingOffsetColor: "oklch(0.21 0.006 285.885)",
                  }}
                >
                  🏠 Go Home
                </Button>
              </div>

              {/* Footer */}
              <div className="mt-6 text-center text-xs opacity-60">If this problem persists, please contact support</div>
            </div>
          </div>
        </div>

        {/* Floating particles effect */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute h-2 w-2 animate-pulse rounded-full opacity-20"
              style={{
                background: "oklch(0.645 0.246 5.439)",
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </body>
    </html>
  );
}
