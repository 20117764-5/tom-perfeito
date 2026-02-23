// src/lib/audioAnalyzer.ts
// Trocamos o AMDF pelo YIN (melhor para instrumentos e notas de celular)
import { YIN } from 'pitchfinder';

const NOTES = ["Dó", "Dó#", "Ré", "Ré#", "Mi", "Fá", "Fá#", "Sol", "Sol#", "Lá", "Lá#", "Si"];

export function getNoteFromFrequency(frequency: number): string {
  const noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
  const midiNote = Math.round(noteNum) + 69;
  return NOTES[midiNote % 12];
}

function getVolume(audioData: Float32Array): number {
  let sum = 0;
  for (let i = 0; i < audioData.length; i++) {
    sum += audioData[i] * audioData[i];
  }
  return Math.sqrt(sum / audioData.length);
}

let detectPitch: ((float32Array: Float32Array) => number | null) | null = null;
let currentSampleRate = 0;

export function analyzePitch(audioData: Float32Array, sampleRate: number): string | null {
  if (!detectPitch || currentSampleRate !== sampleRate) {
    // Agora usamos o YIN, que é impecável para sons de alto-falantes e instrumentos
    detectPitch = YIN({ sampleRate: sampleRate });
    currentSampleRate = sampleRate;
  }

  const volume = getVolume(audioData);
  
  // Limite bem baixo para captar o alto-falante do celular de boas
  if (volume < 0.002) { 
    return null; 
  }

  const pitchInHz = detectPitch(audioData);

  // O YIN já é bem preciso, então se ele retornar algo, nós confiamos
  if (pitchInHz && pitchInHz > 50 && pitchInHz < 3000) {
    return getNoteFromFrequency(pitchInHz);
  }

  return null;
}