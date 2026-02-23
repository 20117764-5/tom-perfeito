// src/components/PitchTracker.tsx
"use client";

import { useEffect, useState, useRef } from 'react';
import Meyda from 'meyda'; 
import { ToneDisplay } from './ToneDisplay';
import { detectChord } from '../lib/chordEstimator';
import { estimateKey } from '../lib/keyEstimator'; // Assumindo que você criou este no passo anterior

const NOTES = ["Dó", "Dó#", "Ré", "Ré#", "Mi", "Fá", "Fá#", "Sol", "Sol#", "Lá", "Lá#", "Si"];

interface MeydaFeatures {
  chroma?: number[];
  rms?: number; 
}

export function PitchTracker({ stream }: { stream: MediaStream }) {
  const [currentNote, setCurrentNote] = useState<string | null>(null);
  const [currentChord, setCurrentChord] = useState<string | null>(null);
  const [detectedKey, setDetectedKey] = useState<string | null>(null);
  
  // Memórias separadas para não misturar acorde com nota
  const shortTermNoteHistory = useRef<string[]>([]);
  const shortTermChordHistory = useRef<string[]>([]);
  const longTermNoteHistory = useRef<string[]>([]);

  useEffect(() => {
    if (!stream) return;

    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);

    const analyzer = Meyda.createMeydaAnalyzer({
      audioContext: audioContext,
      source: source,
      bufferSize: 4096, 
      featureExtractors: ['chroma', 'rms'], 
      callback: (features: MeydaFeatures) => {
        
        if (features.rms && features.rms < 0.02) return; 

        if (features && features.chroma) {
          const chromaArray = features.chroma;
          
          // ==========================================
          // 1. EXTRAI A NOTA ISOLADA E O TOM DA MÚSICA
          // ==========================================
          let maxEnergy = 0;
          let maxIndex = -1;

          for (let i = 0; i < chromaArray.length; i++) {
            if (chromaArray[i] > maxEnergy) {
              maxEnergy = chromaArray[i];
              maxIndex = i;
            }
          }

          if (maxEnergy > 0.85 && maxIndex !== -1) {
            const note = NOTES[maxIndex];
            
            // Estabiliza a nota (Curto prazo)
            shortTermNoteHistory.current.push(note);
            if (shortTermNoteHistory.current.length > 15) shortTermNoteHistory.current.shift();

            const noteCounts = shortTermNoteHistory.current.reduce((acc, n) => {
              acc[n] = (acc[n] || 0) + 1; return acc;
            }, {} as Record<string, number>);

            const stabilizedNote = Object.keys(noteCounts).reduce((a, b) => 
              noteCounts[a] > noteCounts[b] ? a : b
            );
            
            setCurrentNote(stabilizedNote);

            // Alimenta o cálculo do Tom da Música (Longo prazo)
            longTermNoteHistory.current.push(stabilizedNote);
            if (longTermNoteHistory.current.length > 200) longTermNoteHistory.current.shift();

            const calculatedKey = estimateKey(longTermNoteHistory.current);
            setDetectedKey(calculatedKey);
          }

          // ==========================================
          // 2. EXTRAI O ACORDE
          // ==========================================
          const chord = detectChord(chromaArray);
          
          if (chord) {
            // Estabiliza o acorde
            shortTermChordHistory.current.push(chord);
            if (shortTermChordHistory.current.length > 15) shortTermChordHistory.current.shift();

            const chordCounts = shortTermChordHistory.current.reduce((acc, c) => {
              acc[c] = (acc[c] || 0) + 1; return acc;
            }, {} as Record<string, number>);

            const stabilizedChord = Object.keys(chordCounts).reduce((a, b) => 
              chordCounts[a] > chordCounts[b] ? a : b
            );
            
            setCurrentChord(stabilizedChord);
          }
        }
      }
    });

    analyzer.start();

    return () => {
      analyzer.stop();
      audioContext.close();
    };
  }, [stream]);

  return (
    <ToneDisplay 
      detectedKey={detectedKey} 
      currentChord={currentChord} 
      currentNote={currentNote} 
    />
  );
}