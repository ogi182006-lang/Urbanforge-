// ============================================================
// UrbanForge — useSpeechSearch Hook (Web Speech API)
// ============================================================
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { VoiceSearchState } from "@/types";

// TypeScript declarations for browser Speech API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

export function useSpeechSearch(
  onResult?: (transcript: string) => void
): VoiceSearchState & { isSupported: boolean } {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const isSupported =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  useEffect(() => {
    if (!isSupported) return;

    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = "en-IN"; // Delhi accent 🙏
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      const current = finalTranscript || interimTranscript;
      setTranscript(current);

      if (finalTranscript && onResult) {
        onResult(finalTranscript.trim());
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setIsListening(false);
      switch (event.error) {
        case "not-allowed":
          setError("Microphone access denied. Please allow mic permissions.");
          break;
        case "no-speech":
          setError("No speech detected. Try again.");
          break;
        case "network":
          setError("Network error. Check your connection.");
          break;
        default:
          setError(`Voice search error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
    };
  }, [isSupported, onResult]);

  const startListening = useCallback(() => {
    if (!isSupported || !recognitionRef.current) {
      setError("Voice search not supported in this browser.");
      return;
    }
    setTranscript("");
    setError(null);
    try {
      recognitionRef.current.start();
    } catch {
      // Recognition already started
    }
  }, [isSupported]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  const resetTranscript = useCallback(() => {
    setTranscript("");
    setError(null);
  }, []);

  return {
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    resetTranscript,
    isSupported,
  };
}
