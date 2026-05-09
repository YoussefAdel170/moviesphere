import { useEffect, useRef, useState } from "react";

export function useVoiceSearch(
  language: string,
  onResult: (text: string) => void,
) {
  const [listening, setListening] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceError("Voice search not supported");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language === "ar" ? "ar-EG" : "en-US";
    recognition.onresult = (e: any) =>
      onResult(e.results[0][0].transcript ?? "");
    recognition.onerror = (e: any) => {
      setVoiceError(`Error: ${e.error}`);
      setListening(false);
      setTimeout(() => setVoiceError(null), 3000);
    };
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    return () => recognitionRef.current?.abort?.();
  }, [language]);

  const handleVoice = async () => {
    if (!recognitionRef.current) return;
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setListening(true);
      recognitionRef.current.start();
    } catch {
      setVoiceError("Microphone permission denied");
      setTimeout(() => setVoiceError(null), 3000);
    }
  };

  return { listening, voiceError, handleVoice };
}
