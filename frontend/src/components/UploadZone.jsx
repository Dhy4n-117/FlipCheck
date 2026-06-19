import { useRef, useState, useCallback } from "react";

export default function UploadZone({ onFileSelect, preview, disabled, askingPrice, onAskingPriceChange }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    (file) => {
      if (file && onFileSelect) onFileSelect(file);
    },
    [onFileSelect]
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer?.files?.[0];
      handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      handleFile(file);
    },
    [handleFile]
  );

  if (preview) {
    return (
      <div className="relative w-full max-w-md mx-auto animate-fade-in">
        <div className="glass-card-elevated overflow-hidden rounded-2xl">
          <img
            src={preview}
            alt="Selected item"
            className="w-full h-72 sm:h-80 object-cover"
          />
          {!disabled && (
            <button
              onClick={() => inputRef.current?.click()}
              className="absolute bottom-4 right-4 px-4 py-2 bg-surface/80 backdrop-blur-sm
                         border border-border-light rounded-lg text-sm text-white/80
                         hover:text-white hover:border-accent/50 transition-all duration-200
                         font-body"
            >
              Change photo
            </button>
          )}
        </div>

        {/* Asking price input */}
        {!disabled && (
          <div className="mt-4 animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono text-white/40 uppercase tracking-wider">
                Seller's asking price
              </label>
              <span className="text-[10px] font-mono text-white/20 border border-white/10 rounded-full px-2 py-0.5 uppercase tracking-wider">
                optional
              </span>
            </div>
            <div className="flex items-center bg-surface border border-white/10 rounded-full
                            px-4 py-2.5 gap-2
                            focus-within:border-accent/50 focus-within:shadow-[0_0_20px_rgba(239,159,39,0.1)]
                            transition-all duration-300">
              <span className="text-white/30 font-mono text-sm select-none">$</span>
              <input
                type="number"
                inputMode="decimal"
                min="0"
                step="any"
                placeholder="e.g. 8"
                value={askingPrice}
                onChange={(e) => onAskingPriceChange?.(e.target.value)}
                className="flex-1 bg-transparent text-white font-mono text-sm
                           placeholder:text-white/15 outline-none
                           [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          capture="environment"
          onChange={handleInputChange}
          className="hidden"
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        className={`
          relative cursor-pointer rounded-2xl border-2 border-dashed p-8 sm:p-12
          transition-all duration-300 ease-out group
          ${
            isDragging
              ? "drag-active border-accent bg-accent/5"
              : "border-white/10 hover:border-accent/40 hover:bg-white/[0.02]"
          }
        `}
      >
        {/* Animated corner accents */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-accent/40 rounded-tl-lg" />
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-accent/40 rounded-tr-lg" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-accent/40 rounded-bl-lg" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-accent/40 rounded-br-lg" />

        <div className="flex flex-col items-center gap-4 text-center">
          {/* Upload icon */}
          <div
            className={`
              w-16 h-16 rounded-2xl flex items-center justify-center
              transition-all duration-300
              ${isDragging ? "bg-accent/20 scale-110" : "bg-white/5 group-hover:bg-accent/10"}
            `}
          >
            <svg
              className={`w-8 h-8 transition-colors duration-300 ${
                isDragging ? "text-accent" : "text-white/40 group-hover:text-accent/70"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"
              />
            </svg>
          </div>

          <div>
            <p className="text-white/70 font-body text-base mb-1">
              <span className="text-accent font-semibold">Upload</span> or{" "}
              <span className="text-accent font-semibold">drag & drop</span>
            </p>
            <p className="text-white/30 text-sm font-body">
              JPEG, PNG, or WEBP · Max 10MB
            </p>
          </div>

          {/* Mobile camera hint */}
          <div className="sm:hidden flex items-center gap-2 text-white/30 text-xs mt-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
            </svg>
            Tap to use camera
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          capture="environment"
          onChange={handleInputChange}
          className="hidden"
        />
      </div>
    </div>
  );
}
