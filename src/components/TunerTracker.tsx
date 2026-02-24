// src/components/TunerTracker.tsx
"use client";

import { useEffect, useState } from 'react';
import { YIN } from 'pitchfinder';
import { TunerDisplay } from './TunerDisplay';

const CHORD_ROOTS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export function TunerTracker({ stream }: { stream: MediaStream }) {
  const [currentNote, setCurrentNote] = useState<string | null>(null);
  const [cents, setCents] = useState<number>(0);

  useEffect(() => {
    if (!stream) return;

    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);

    source.connect(analyser);
    // Janela grande para ouvir os graves com precisão
    analyser.fftSize = 4096;

    const detectPitch = YIN({ sampleRate: audioContext.sampleRate });
    const dataArray = new Float32Array(analyser.fftSize);
    let animationId: number;

    const detect = () => {
      animationId = requestAnimationFrame(detect);
      analyser.getFloatTimeDomainData(dataArray);

      // Portão de Volume (RMS)
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) sum += dataArray[i] * dataArray[i];
      const rms = Math.sqrt(sum / dataArray.length);

      // Se tiver silêncio, apaga o visor
      if (rms < 0.01) {
        setCurrentNote(null);
        setCents(0);
        return; 
      }

      const pitchInHz = detectPitch(dataArray);

      if (pitchInHz && pitchInHz > 50 && pitchInHz < 3000) {
        // Encontra o número da nota MIDI mais próxima
        const noteNum = 12 * (Math.log2(pitchInHz / 440)) + 69;
        const midiNote = Math.round(noteNum);
        
        // Calcula a Frequência Alvo perfeita dessa nota (onde seria a bolinha verde)
        const targetFreq = 440 * Math.pow(2, (midiNote - 69) / 12);
        
        // Descobre a diferença exata em 'Cents' entre o som cantado e a frequência perfeita
        const centsDiff = 1200 * Math.log2(pitchInHz / targetFreq);

        setCurrentNote(CHORD_ROOTS[midiNote % 12]);
        setCents(centsDiff);
      }
    };

    detect();

    return () => {
      cancelAnimationFrame(animationId);
      audioContext.close();
    };
  }, [stream]);

  return <TunerDisplay note={currentNote} cents={cents} />;
}