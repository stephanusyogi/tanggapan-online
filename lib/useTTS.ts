"use client";

import { useEffect, useState, useCallback, useRef } from "react";

const DIGIT_TO_WORDS: Record<string, string> = {
  "0": "nol",
  "1": "satu",
  "2": "dua",
  "3": "tiga",
  "4": "empat",
  "5": "lima",
  "6": "enam",
  "7": "tujuh",
  "8": "delapan",
  "9": "sembilan"
};

export function formatNomor(teks: string): string {
  if (!teks) return "";
  const base = teks.replace(/\*/g, "");
  const perDigit = base
    .split("")
    .map((ch) => DIGIT_TO_WORDS[ch] || "")
    .filter(Boolean)
    .join(" ");

  return teks.includes("*") ? `${perDigit} dan seterusnya` : perDigit;
}

export function normalisasiTeks(teks: string): string {
  if (!teks) return "";
  let clean = teks.replace(/\s+/g, " ").trim();
  if (/^[A-Z\s]+$/.test(clean) && clean.length > 3) {
    clean = clean.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
  }
  return clean;
}

export function useTTS() {
  const [ttsEnabled, setTtsEnabled] = useState<boolean>(false);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
  const userInteractedRef = useRef<boolean>(false);

  // Load voices properly
  const loadVoices = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const v = window.speechSynthesis.getVoices();
    if (v.length > 0) {
      voicesRef.current = v;
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const saved = localStorage.getItem("ttsEnabled");
    if (saved === "true") {
      setTtsEnabled(true);
    }

    const handleFirstInteraction = () => {
      userInteractedRef.current = true;
    };
    window.addEventListener("click", handleFirstInteraction, { passive: true });
    window.addEventListener("keydown", handleFirstInteraction, { passive: true });

    loadVoices();
    if ("speechSynthesis" in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
    };
  }, [loadVoices]);

  const speak = useCallback((text: string, cancelPrevious = true) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (!text.trim()) return;

    if (cancelPrevious) {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "id-ID";
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Pick Indonesian voice if available
    const voices = voicesRef.current.length > 0 ? voicesRef.current : window.speechSynthesis.getVoices();
    const idVoice = voices.find(
      (v) =>
        v.lang === "id-ID" ||
        v.lang.startsWith("id") ||
        v.name.toLowerCase().includes("indonesia")
    );
    if (idVoice) {
      utterance.voice = idVoice;
    }

    window.speechSynthesis.speak(utterance);
  }, []);

  const toggleTts = useCallback(() => {
    userInteractedRef.current = true;
    setTtsEnabled((prev) => {
      const next = !prev;
      localStorage.setItem("ttsEnabled", String(next));
      if (next) {
        speak("Panduan suara diaktifkan. Silakan ketik enam belas digit nomor induk kependudukan.");
      } else {
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
          window.speechSynthesis.cancel();
        }
      }
      return next;
    });
  }, [speak]);

  const speakAlert = useCallback((text: string) => {
    const isEnabled = typeof window !== "undefined" && localStorage.getItem("ttsEnabled") === "true";
    if (!isEnabled) return;
    speak(text, true);
  }, [speak]);

  const handleNumericInput = useCallback((
    currentVal: string,
    lastVal: string,
    label: string
  ) => {
    const isEnabled = typeof window !== "undefined" && localStorage.getItem("ttsEnabled") === "true";
    if (!isEnabled) return;

    if (currentVal.length > lastVal.length) {
      const addedChar = currentVal.slice(-1);
      const word = DIGIT_TO_WORDS[addedChar];
      if (word) speak(word);
    } else if (currentVal.length < lastVal.length) {
      if (currentVal.length === 0) {
        speak(`${label} dihapus semua`);
      } else {
        const deletedChar = lastVal.slice(-1);
        const word = DIGIT_TO_WORDS[deletedChar];
        if (word) speak(`${word} dihapus`);
        else speak("Dihapus");
      }
    }
  }, [speak]);

  const bacaNarasiHasil = useCallback((data: {
    maskedNKK: string;
    maskedNIK: string;
    nama: string;
    kelurahan: string;
    kecamatan: string;
    tps: string;
  }) => {
    const isEnabled = typeof window !== "undefined" && localStorage.getItem("ttsEnabled") === "true";
    if (!isEnabled) return;

    const nkkSpelled = formatNomor(data.maskedNKK);
    const nikSpelled = formatNomor(data.maskedNIK);
    const namaNorm = normalisasiTeks(data.nama);
    const kelNorm = normalisasiTeks(data.kelurahan);
    const kecNorm = normalisasiTeks(data.kecamatan);

    const narasi = `
      Data pemilih berhasil ditemukan dalam Daftar Pemilih Tetap Kabupaten Ngawi.
      Berikut hasil pencarian:
      Nomor Kartu Keluarga ${nkkSpelled}.
      Nomor Induk Kependudukan ${nikSpelled}.
      Atas nama ${namaNorm}.
      Berdomisili di Kelurahan ${kelNorm}, Kecamatan ${kecNorm}.
      Terdaftar di Tempat Pemungutan Suara nomor ${data.tps}.
      Jika Anda ingin kembali ke halaman utama, tekan tombol kembali di bagian bawah halaman.
    `;

    setTimeout(() => {
      speak(narasi, true);
    }, 300);
  }, [speak]);

  return {
    ttsEnabled,
    toggleTts,
    speak,
    speakAlert,
    handleNumericInput,
    bacaNarasiHasil
  };
}
