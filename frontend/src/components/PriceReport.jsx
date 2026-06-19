export default function PriceReport({ pricing }) {
  if (!pricing) return null;

  const formatPrice = (val) => {
    if (val == null) return "—";
    return `$${Number(val).toFixed(0)}`;
  };

  // Calculate average position on the bar (percentage between low and high)
  const range = (pricing.resale_high || 0) - (pricing.resale_low || 0);
  const avgPosition = range > 0
    ? ((pricing.average - pricing.resale_low) / range) * 100
    : 50;

  return (
    <div
      className="w-full max-w-md mx-auto animate-slide-up"
      style={{ animationDelay: "0.15s" }}
    >
      <div className="glass-card p-5 sm:p-6">
        <p className="text-[11px] font-mono text-white/30 uppercase tracking-widest mb-4">
          Resale Range
        </p>

        {/* Bar visualization */}
        <div className="relative mb-4">
          {/* Labels above bar */}
          <div className="flex items-end justify-between mb-2">
            <div>
              <p className="text-[10px] font-mono text-white/25 uppercase">Low</p>
              <p className="text-lg font-mono font-medium text-white/70 tracking-tight">
                {formatPrice(pricing.resale_low)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-mono text-white/25 uppercase">High</p>
              <p className="text-lg font-mono font-medium text-white/70 tracking-tight">
                {formatPrice(pricing.resale_high)}
              </p>
            </div>
          </div>

          {/* Range bar */}
          <div className="relative h-3 bg-white/[0.06] rounded-full overflow-visible">
            {/* Filled portion */}
            <div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                width: "100%",
                background: "linear-gradient(90deg, rgba(239,159,39,0.15) 0%, rgba(239,159,39,0.4) 50%, rgba(29,158,117,0.3) 100%)",
              }}
            />

            {/* Average marker */}
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10"
              style={{ left: `${Math.min(Math.max(avgPosition, 5), 95)}%` }}
            >
              <div className="relative">
                <div className="w-5 h-5 rounded-full bg-accent border-2 border-surface shadow-[0_0_12px_rgba(239,159,39,0.4)]" />
                {/* Label below marker */}
                <div className="absolute top-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-center">
                  <p className="text-[10px] font-mono text-white/30 uppercase">Avg</p>
                  <p className="text-sm font-mono font-medium neon-text">
                    {formatPrice(pricing.average)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Spacer for avg label below bar */}
        <div className="h-10" />

        {/* Data freshness */}
        {(pricing.sample_size || pricing.data_freshness) && (
          <div className="flex items-center justify-center gap-4 pt-3 border-t border-white/[0.06]">
            {pricing.sample_size && (
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-green animate-glow-pulse" />
                <span className="text-xs font-mono text-white/30">
                  {pricing.sample_size} listings sampled
                </span>
              </div>
            )}
            {pricing.sample_size && pricing.data_freshness && (
              <span className="text-white/10">|</span>
            )}
            {pricing.data_freshness && (
              <span className="text-xs font-mono text-white/30">
                {pricing.data_freshness}
              </span>
            )}
          </div>
        )}

        {/* Currency */}
        <div className="flex justify-center mt-2">
          <span className="text-[10px] font-mono text-white/15 uppercase tracking-wider">
            {pricing.currency}
          </span>
        </div>
      </div>
    </div>
  );
}
