import { useState, useCallback } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const STATES = {
  IDLE: "idle",
  UPLOADING: "uploading",
  ANALYZING: "analyzing",
  RESULT: "result",
  ERROR: "error",
};

export function useAnalyze() {
  const [state, setState] = useState(STATES.IDLE);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [askingPrice, setAskingPrice] = useState("");

  const selectFile = useCallback((selectedFile) => {
    if (!selectedFile) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(selectedFile.type)) {
      setError("Please upload a JPEG, PNG, or WEBP image.");
      setState(STATES.ERROR);
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      setError(
        `Image is too large (${(selectedFile.size / (1024 * 1024)).toFixed(1)}MB). Maximum is 10MB.`
      );
      setState(STATES.ERROR);
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setError(null);
    setResult(null);
    setState(STATES.UPLOADING);
  }, []);

  const analyze = useCallback(async () => {
    if (!file) return;

    setState(STATES.ANALYZING);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", file);

      if (askingPrice.trim() !== "") {
        const parsed = parseFloat(askingPrice);
        if (!isNaN(parsed) && parsed > 0) {
          formData.append("asking_price", parsed);
        }
      }

      const res = await fetch(`${API_URL}/api/analyze`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || data.error || "Analysis failed. Please try again.");
        setState(STATES.ERROR);
        return;
      }

      if (data.error && !data.item) {
        setError(data.message || data.error);
        setState(STATES.ERROR);
        return;
      }

      setResult(data);
      setState(STATES.RESULT);
    } catch (err) {
      setError(
        "Unable to connect to the analysis server. Make sure the backend is running."
      );
      setState(STATES.ERROR);
    }
  }, [file, askingPrice]);

  const reset = useCallback(() => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    setAskingPrice("");
    setState(STATES.IDLE);
  }, [preview]);

  return {
    state,
    file,
    preview,
    result,
    error,
    askingPrice,
    setAskingPrice,
    selectFile,
    analyze,
    reset,
    STATES,
  };
}
