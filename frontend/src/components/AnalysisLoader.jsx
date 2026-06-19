import { useState, useEffect } from "react";

const STEPS = [
  { label: "Identifying item with AI vision", icon: "🔍" },
  { label: "Searching eBay sold listings", icon: "🏷️" },
  { label: "Checking resale platforms", icon: "📊" },
  { label: "Computing price range", icon: "💰" },
  { label: "Building your flip report", icon: "📋" },
];

const STEP_DELAY = 400;

export default function AnalysisLoader() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev < STEPS.length - 1) return prev + 1;
        return prev;
      });
    }, STEP_DELAY);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in">
      <div className="glass-card p-6 sm:p-8">
        {/* Scanning animation header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative w-5 h-5">
            <div className="absolute inset-0 rounded-full bg-accent/30 animate-ping" />
            <div className="absolute inset-0.5 rounded-full bg-accent animate-glow-pulse" />
          </div>
          <h3 className="font-heading text-lg text-white font-bold tracking-tight">
            Analyzing your item
          </h3>
        </div>

        {/* Steps */}
        <div className="space-y-3">
          {STEPS.map((step, idx) => {
            const isActive = idx === activeStep;
            const isComplete = idx < activeStep;
            const isPending = idx > activeStep;

            return (
              <div
                key={idx}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300
                  ${isActive ? "bg-accent/10 border border-accent/20" : ""}
                  ${isComplete ? "opacity-60" : ""}
                  ${isPending ? "opacity-25" : ""}
                `}
                style={{
                  animationDelay: `${idx * STEP_DELAY}ms`,
                }}
              >
                {/* Status indicator */}
                <div className="flex-shrink-0 w-6 text-center">
                  {isComplete && (
                    <svg className="w-5 h-5 text-accent-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  )}
                  {isActive && (
                    <div className="w-4 h-4 mx-auto border-2 border-accent border-t-transparent rounded-full animate-spin" />
                  )}
                  {isPending && (
                    <div className="w-3 h-3 mx-auto rounded-full bg-white/10" />
                  )}
                </div>

                {/* Step label */}
                <span
                  className={`
                    font-mono text-sm transition-colors duration-300
                    ${isActive ? "text-accent" : ""}
                    ${isComplete ? "text-white/50" : ""}
                    ${isPending ? "text-white/20" : ""}
                  `}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="mt-6 h-1 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-accent to-accent-green rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((activeStep + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
