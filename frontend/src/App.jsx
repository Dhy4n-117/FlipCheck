import { useAnalyze } from "./hooks/useAnalyze";
import UploadZone from "./components/UploadZone";
import AnalysisLoader from "./components/AnalysisLoader";
import ItemCard from "./components/ItemCard";
import PriceReport from "./components/PriceReport";
import FlipInsight from "./components/FlipInsight";

function App() {
  const {
    state,
    preview,
    result,
    error,
    askingPrice,
    setAskingPrice,
    selectFile,
    analyze,
    reset,
    STATES,
  } = useAnalyze();

  const isAnalyzing = state === STATES.ANALYZING;
  const hasResult = state === STATES.RESULT && result;
  const hasError = state === STATES.ERROR;
  const canAnalyze = state === STATES.UPLOADING;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4 sm:py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent/15 flex items-center justify-center">
              <span className="text-base">⚡</span>
            </div>
            <div>
              <h1 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-white">
                Flip<span className="neon-text">Check</span>
              </h1>
            </div>
          </div>
          {(hasResult || hasError) && (
            <button
              onClick={reset}
              className="text-sm font-mono text-white/40 hover:text-accent transition-colors duration-200
                         border border-white/10 hover:border-accent/30 rounded-lg px-3 py-1.5"
            >
              New scan
            </button>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-6 sm:py-10">
        <div className="space-y-6">
          {/* Tagline — only in idle state */}
          {state === STATES.IDLE && (
            <div className="text-center mb-4 animate-fade-in">
              <p className="text-sm font-mono text-white/30 tracking-wide">
                Snap it. Scan it. Flip it.
              </p>
              <p className="text-xs font-body text-white/15 mt-1">
                Upload a photo of any thrift find to get instant resale pricing
              </p>
            </div>
          )}

          {/* Upload zone */}
          <UploadZone
            onFileSelect={selectFile}
            preview={preview}
            disabled={isAnalyzing}
            askingPrice={askingPrice}
            onAskingPriceChange={setAskingPrice}
          />

          {/* Analyze button */}
          {canAnalyze && (
            <div className="flex justify-center animate-fade-in">
              <button
                onClick={analyze}
                className="group relative px-8 py-3.5 rounded-xl font-heading font-bold text-base
                           bg-accent text-black hover:bg-accent/90
                           transition-all duration-300 hover:shadow-[0_0_30px_rgba(239,159,39,0.25)]
                           active:scale-[0.98]"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                  Analyze Item
                </span>
              </button>
            </div>
          )}

          {/* Loading */}
          {isAnalyzing && <AnalysisLoader />}

          {/* Error */}
          {hasError && error && (
            <div className="w-full max-w-md mx-auto animate-fade-in">
              <div className="glass-card border-accent-red/30 p-5 sm:p-6">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-accent-red/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-accent-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-heading text-sm font-bold text-accent-red mb-1">
                      Analysis Failed
                    </p>
                    <p className="text-sm font-body text-white/50 leading-relaxed">
                      {error}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 mt-4 pt-3 border-t border-white/5">
                  <button
                    onClick={analyze}
                    className="text-sm font-mono text-accent hover:text-accent/80 transition-colors"
                  >
                    Retry
                  </button>
                  <button
                    onClick={reset}
                    className="text-sm font-mono text-white/30 hover:text-white/50 transition-colors"
                  >
                    Start over
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Results — Verdict FIRST (hero), then Price, then Item */}
          {hasResult && (
            <div className="space-y-4">
              {result.flip_insight && (
                <FlipInsight
                  insight={result.flip_insight}
                  pricing={result.pricing}
                />
              )}

              {result.pricing && (
                <PriceReport pricing={result.pricing} />
              )}

              <ItemCard
                item={result.item}
                askingPrice={result.asking_price}
              />

              {!result.pricing && !result.flip_insight && (
                <div className="w-full max-w-md mx-auto animate-fade-in">
                  <div className="glass-card border-accent/20 p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                        <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-body text-white/60">
                          Item identified, but pricing data is temporarily unavailable.
                        </p>
                        {result.message && (
                          <p className="text-xs font-mono text-white/30 mt-1">
                            {result.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-border">
        <div className="max-w-2xl mx-auto px-4 py-4 text-center">
          <p className="text-xs font-mono text-white/15">
            FlipCheck · AI-powered thrift pricing · Not financial advice
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
