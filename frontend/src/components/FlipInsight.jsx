export default function FlipInsight({ insight, pricing }) {
  if (!insight) return null;

  const formatPrice = (val) => {
    if (val == null) return null;
    return `$${Number(val).toFixed(0)}`;
  };

  const verdictConfig = {
    BUY: {
      label: "BUY",
      className: "verdict-buy",
      color: "#1D9E75",
      textClass: "text-accent-green",
      neonClass: "neon-text-green",
      bgClass: "bg-accent-green/10",
      borderClass: "border-accent-green/25",
      dotClass: "bg-accent-green",
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      ),
    },
    OFFER: {
      label: "OFFER",
      className: "verdict-offer",
      color: "#3B82F6",
      textClass: "text-accent-blue",
      neonClass: "neon-text-blue",
      bgClass: "bg-accent-blue/10",
      borderClass: "border-accent-blue/25",
      dotClass: "bg-accent-blue",
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
        </svg>
      ),
    },
    SKIP: {
      label: "SKIP",
      className: "verdict-skip",
      color: "#E5484D",
      textClass: "text-accent-red",
      neonClass: "neon-text-red",
      bgClass: "bg-accent-red/10",
      borderClass: "border-accent-red/25",
      dotClass: "bg-accent-red",
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
    },
  };

  const config = verdictConfig[insight.verdict] || verdictConfig.SKIP;

  const hasProfit = insight.profit_low != null && insight.profit_high != null;
  const hasOffer = insight.suggested_offer_low != null && insight.suggested_offer_high != null;

  // Build metric cards
  const metrics = [];

  // Always show resale estimate
  if (pricing) {
    metrics.push({
      label: "Est. Resale",
      value: `${formatPrice(pricing.resale_low)}–${formatPrice(pricing.resale_high)}`,
      sub: `avg ${formatPrice(pricing.average)}`,
    });
  }

  if (hasProfit) {
    metrics.push({
      label: "Gross Profit",
      value: `${formatPrice(insight.profit_low)}–${formatPrice(insight.profit_high)}`,
      sub: null,
      highlight: true,
    });
  }

  if (hasOffer) {
    metrics.push({
      label: "Suggested Offer",
      value: `${formatPrice(insight.suggested_offer_low)}–${formatPrice(insight.suggested_offer_high)}`,
      sub: null,
    });
  }

  // Always show risk
  if (insight.risk_level) {
    const riskColors = {
      Low: "text-accent-green",
      Medium: "text-accent",
      High: "text-accent-red",
    };
    metrics.push({
      label: "Risk Level",
      value: insight.risk_level,
      sub: insight.risk_reason || null,
      valueClass: riskColors[insight.risk_level] || "text-white/80",
    });
  }

  return (
    <div className="w-full max-w-md mx-auto animate-slide-up">
      <div className={`rounded-2xl p-5 sm:p-6 ${config.className}`}>
        {/* Header: Icon + Title + Verdict Badge */}
        <div className="flex items-start gap-4 mb-6">
          <div
            className={`flex-shrink-0 w-12 h-12 rounded-xl ${config.bgClass} flex items-center justify-center ${config.textClass}`}
          >
            {config.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-mono text-white/35 uppercase tracking-widest mb-1">
              Profit Report
            </p>
            <div className="flex items-center gap-3">
              <span
                className={`font-heading text-3xl sm:text-4xl font-extrabold tracking-tight ${config.neonClass}`}
              >
                {config.label}
              </span>
              {/* Pulsing dot */}
              <span className="relative flex h-3 w-3">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${config.dotClass}`}
                />
                <span
                  className={`relative inline-flex rounded-full h-3 w-3 ${config.dotClass}`}
                />
              </span>
            </div>
          </div>
        </div>

        {/* Metrics grid */}
        <div className={`grid gap-3 mb-5 ${metrics.length <= 2 ? "grid-cols-2" : "grid-cols-2"}`}>
          {metrics.map((m) => (
            <div
              key={m.label}
              className={`rounded-xl p-3.5 border backdrop-blur-sm
                ${m.highlight
                  ? `${config.bgClass} ${config.borderClass}`
                  : "bg-white/[0.03] border-white/[0.06]"
                }`}
            >
              <p className="text-[10px] font-mono text-white/35 uppercase tracking-widest mb-1.5">
                {m.label}
              </p>
              <p
                className={`text-lg sm:text-xl font-mono font-medium tracking-tight ${
                  m.valueClass || (m.highlight ? config.textClass : "text-white/90")
                }`}
              >
                {m.value}
              </p>
              {m.sub && (
                <p className="text-[11px] font-mono text-white/25 mt-1">{m.sub}</p>
              )}
            </div>
          ))}
        </div>

        {/* Reason */}
        {insight.reason && (
          <div className="mb-5 px-1">
            <p className="text-sm font-body text-white/55 leading-relaxed italic">
              "{insight.reason}"
            </p>
          </div>
        )}

        {/* Footer: Best Platform & Max Buy Price */}
        <div className="flex items-center gap-4 pt-4 border-t border-white/[0.06]">
          {insight.best_platform && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-white/25 uppercase tracking-wider">
                Best Platform
              </span>
              <span className={`text-sm font-mono font-medium ${config.textClass}`}>
                {insight.best_platform}
              </span>
            </div>
          )}
          {insight.best_platform && insight.max_buy_price != null && (
            <span className="text-white/10">·</span>
          )}
          {insight.max_buy_price != null && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-white/25 uppercase tracking-wider">
                Max Buy
              </span>
              <span className={`text-sm font-mono font-medium ${config.textClass}`}>
                {formatPrice(insight.max_buy_price)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
