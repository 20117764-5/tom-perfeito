// src/components/TunerDisplay.tsx

interface TunerDisplayProps {
    note: string | null;
    cents: number; // Vai de -50 (muito baixo) a +50 (muito alto)
  }
  
  export function TunerDisplay({ note, cents }: TunerDisplayProps) {
    // Define qual das 9 bolinhas deve acender (índices de 0 a 8)
    let activeIndex = -1; // -1 significa tudo apagado (sem som)
  
    if (note) {
      if (cents <= -35) activeIndex = 0;
      else if (cents <= -25) activeIndex = 1;
      else if (cents <= -15) activeIndex = 2;
      else if (cents <= -5) activeIndex = 3;
      else if (cents < 5) activeIndex = 4; // Verde! (Margem de erro minúscula)
      else if (cents < 15) activeIndex = 5;
      else if (cents < 25) activeIndex = 6;
      else if (cents < 35) activeIndex = 7;
      else activeIndex = 8;
    }
  
    // A paleta de cores exata que você pediu
    const colors = [
      'bg-red-500', 'bg-red-500', 'bg-orange-500', 'bg-yellow-400',
      'bg-emerald-500', // Centro (Afinado)
      'bg-yellow-400', 'bg-orange-500', 'bg-red-500', 'bg-red-500'
    ];
  
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-zinc-800 rounded-2xl border border-zinc-700 mt-8 w-full max-w-sm shadow-xl transition-all">
        <span className="text-zinc-400 text-sm tracking-widest uppercase mb-4">
          Afinador Preciso
        </span>
        
        <div className="text-7xl font-black text-white min-h-[100px] flex items-center justify-center">
          {note ? note : "..."}
        </div>
        
        {/* O Visor de Bolinhas */}
        <div className="flex gap-3 mt-6 items-center h-8">
          {colors.map((color, index) => {
            const isActive = index === activeIndex;
            const isCenter = index === 4;
            
            return (
              <div 
                key={index}
                className={`rounded-full transition-all duration-75 ${color} ${
                  // A bolinha verde do meio é um pouco maior
                  isCenter ? 'w-5 h-5' : 'w-4 h-4'
                } ${
                  isActive 
                    ? 'opacity-100 scale-150 shadow-[0_0_15px_rgba(255,255,255,0.4)]' 
                    : 'opacity-20 scale-100'
                }`}
              />
            )
          })}
        </div>
  
        <div className="flex w-full justify-between px-2 mt-6 text-[10px] text-zinc-500 uppercase font-bold tracking-widest">
          <span>Baixo (b)</span>
          <span className={activeIndex === 4 ? "text-emerald-400" : ""}>Afinado</span>
          <span>Alto (#)</span>
        </div>
      </div>
    );
  }