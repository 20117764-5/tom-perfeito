// src/lib/keyEstimator.ts

const NOTES = ["Dó", "Dó#", "Ré", "Ré#", "Mi", "Fá", "Fá#", "Sol", "Sol#", "Lá", "Lá#", "Si"];

// Fórmula de distâncias (em semitons) para montar as escalas
const MAJOR_INTERVALS = [0, 2, 4, 5, 7, 9, 11]; // Tom, Tom, Semitom, Tom, Tom, Tom, Semitom
const MINOR_INTERVALS = [0, 2, 3, 5, 7, 8, 10]; // Tom, Semitom, Tom, Tom, Semitom, Tom, Tom

// Função que monta qualquer escala a partir de uma nota raiz
function getScaleNotes(rootIndex: number, intervals: number[]) {
  return intervals.map(interval => NOTES[(rootIndex + interval) % 12]);
}

/**
 * Pega o histórico longo de notas ouvidas e descobre o Tom Principal
 */
export function estimateKey(longTermHistory: string[]): string {
  // Se ainda não ouviu música suficiente, pede calma
  if (longTermHistory.length < 10) return "Analisando..."; 

  // Conta quantas vezes cada nota apareceu na música
  const noteCounts = longTermHistory.reduce((acc, note) => {
    acc[note] = (acc[note] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  let bestKey = "";
  let maxScore = -Infinity; // Começa bem baixo

  // Testa todas as 12 notas como possíveis tons principais
  for (let i = 0; i < 12; i++) {
    const rootNote = NOTES[i];

    // --- TESTA A ESCALA MAIOR ---
    const majorNotes = getScaleNotes(i, MAJOR_INTERVALS);
    let majorScore = 0;
    
    Object.keys(noteCounts).forEach(note => {
      if (majorNotes.includes(note)) {
        majorScore += noteCounts[note]; // Ganha pontos se a nota pertencer ao Campo Harmônico
      } else {
        majorScore -= noteCounts[note] * 1.5; // PUNIÇÃO SEVERA: A nota está fora do tom!
      }
    });

    if (majorScore > maxScore) {
      maxScore = majorScore;
      bestKey = `${rootNote} Maior`;
    }

    // --- TESTA A ESCALA MENOR ---
    const minorNotes = getScaleNotes(i, MINOR_INTERVALS);
    let minorScore = 0;

    Object.keys(noteCounts).forEach(note => {
      if (minorNotes.includes(note)) {
        minorScore += noteCounts[note];
      } else {
        minorScore -= noteCounts[note] * 1.5;
      }
    });

    if (minorScore > maxScore) {
      maxScore = minorScore;
      bestKey = `${rootNote} Menor`;
    }
  }

  return bestKey;
}