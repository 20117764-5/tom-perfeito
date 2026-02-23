// src/lib/chordEstimator.ts

const CHORD_ROOTS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export function detectChord(chromaArray: number[]): string | null {
  let bestChord = "";
  let maxScore = -Infinity;

  for (let i = 0; i < 12; i++) {
    const root = CHORD_ROOTS[i];
    
    const thirdMaj = (i + 4) % 12; 
    const thirdMin = (i + 3) % 12; 
    const fifth = (i + 7) % 12;    

    // Acorde Maior
    const scoreMaj = chromaArray[i] + chromaArray[thirdMaj] + chromaArray[fifth];
    if (scoreMaj > maxScore) {
      maxScore = scoreMaj;
      bestChord = root;
    }

    // Acorde Menor
    const scoreMin = chromaArray[i] + chromaArray[thirdMin] + chromaArray[fifth];
    if (scoreMin > maxScore) {
      maxScore = scoreMin;
      bestChord = root + "m";
    }
  }

  // Se o som estiver muito embaralhado e não formar um acorde claro, descarta
  if (maxScore < 1.5) return null;

  return bestChord;
}