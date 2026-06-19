export default function ItemCard({ item, askingPrice }) {
  if (!item) return null;

  const confidencePercent = Math.round((item.confidence || 0) * 100);

  const conditionColors = {
    new: "text-accent-green",
    excellent: "text-accent-green",
    good: "text-accent",
    fair: "text-yellow-400",
    poor: "text-accent-red",
  };

  const conditionColor = conditionColors[item.condition?.toLowerCase()] || "text-white/50";

  return (
    <div className="w-full max-w-md mx-auto animate-slide-up" style={{ animationDelay: "0.3s" }}>
      <div className="glass-card-elevated p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-1">
              Identified Item
            </p>
            <h3 className="font-heading text-xl sm:text-2xl text-white font-bold leading-tight">
              {item.brand && (
                <span className="neon-text">{item.brand} </span>
              )}
              {item.model || item.type}
            </h3>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {askingPrice != null && (
              <span className="px-2.5 py-1 rounded-md bg-accent/10 border border-accent/25 text-xs font-mono text-accent">
                Asked: ${Number(askingPrice).toFixed(0)}
              </span>
            )}
            <span className="px-2.5 py-1 rounded-md bg-white/5 border border-border text-xs font-mono text-white/50 capitalize">
              {item.type}
            </span>
          </div>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {item.colorway && (
            <div className="space-y-1">
              <p className="text-[11px] font-mono text-white/30 uppercase tracking-wider">Colorway</p>
              <p className="text-sm font-body text-white/80">{item.colorway}</p>
            </div>
          )}
          {item.estimated_year_range && (
            <div className="space-y-1">
              <p className="text-[11px] font-mono text-white/30 uppercase tracking-wider">Era</p>
              <p className="text-sm font-mono text-white/80">{item.estimated_year_range}</p>
            </div>
          )}
          {item.condition && (
            <div className="space-y-1">
              <p className="text-[11px] font-mono text-white/30 uppercase tracking-wider">Condition</p>
              <p className={`text-sm font-body font-semibold capitalize ${conditionColor}`}>
                {item.condition}
              </p>
            </div>
          )}
          {item.condition_notes && (
            <div className="space-y-1 col-span-2">
              <p className="text-[11px] font-mono text-white/30 uppercase tracking-wider">Notes</p>
              <p className="text-sm font-body text-white/60 italic">{item.condition_notes}</p>
            </div>
          )}
        </div>

        {/* Confidence bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-mono text-white/30 uppercase tracking-wider">
              AI Confidence
            </p>
            <p className="text-sm font-mono text-accent font-medium">
              {confidencePercent}%
            </p>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${confidencePercent}%`,
                background:
                  confidencePercent >= 80
                    ? "linear-gradient(90deg, #1D9E75, #2BC48A)"
                    : confidencePercent >= 50
                    ? "linear-gradient(90deg, #EF9F27, #F0B95B)"
                    : "linear-gradient(90deg, #E5484D, #F07070)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
