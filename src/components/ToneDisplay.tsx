// src/components/ToneDisplay.tsx
interface ToneDisplayProps {
  detectedKey: string | null;
  currentChord: string | null;
  currentNote: string | null;
}

export function ToneDisplay({ detectedKey, currentChord, currentNote }: ToneDisplayProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-zinc-800 rounded-2xl border border-zinc-700 mt-8 w-full max-w-sm shadow-xl transition-all">
      
      {/* 1. O TOM DA MÚSICA (Maior e no topo) */}
      <span className="text-emerald-500/80 text-xs font-bold tracking-widest uppercase mb-1">
        Tom da Música
      </span>
      <div className="text-4xl font-black text-emerald-400 min-h-[60px] flex items-center justify-center text-center">
        {detectedKey ? detectedKey : "Analisando..."}
      </div>

      <div className="w-full h-px bg-zinc-700 my-4"></div>

      {/* Grid para dividir Acorde e Nota Lado a Lado */}
      <div className="flex w-full justify-between px-4">
        
        {/* 2. O ACORDE ATUAL */}
        <div className="flex flex-col items-center">
          <span className="text-zinc-500 text-[10px] tracking-widest uppercase mb-1">
            Acorde (Cifra)
          </span>
          <div className="text-3xl font-bold text-zinc-100 min-h-[40px] flex items-center justify-center">
            {currentChord ? currentChord : "-"}
          </div>
        </div>

        <div className="w-px h-auto bg-zinc-700 mx-4"></div>

        {/* 3. A NOTA ISOLADA (Solfejo) */}
        <div className="flex flex-col items-center">
          <span className="text-zinc-500 text-[10px] tracking-widest uppercase mb-1">
            Nota (Solfejo)
          </span>
          <div className="text-3xl font-bold text-zinc-400 min-h-[40px] flex items-center justify-center">
            {currentNote ? currentNote : "-"}
          </div>
        </div>

      </div>
    </div>
  );
}