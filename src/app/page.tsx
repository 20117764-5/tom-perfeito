// src/app/page.tsx
"use client";

import { useState } from 'react';
import { useMicrophone } from '../hooks/useMicrophone';
import { AudioVisualizer } from '../components/AudioVisualizer';
import { PitchTracker } from '../components/PitchTracker';
import { TunerTracker } from '../components/TunerTracker'; // Nosso novo cérebro!

export default function Home() {
  const { stream, isRecording, error, startRecording, stopRecording } = useMicrophone();
  
  // Estado que controla qual aba está aberta
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tuner'>('dashboard');

  return (
    <main className="flex min-h-screen flex-col items-center pt-12 pb-6 px-6 bg-zinc-900 text-white">
      
      {/* Botões de Navegação (Abas) */}
      <div className="flex bg-zinc-800 p-1 rounded-full mb-8 shadow-inner border border-zinc-700/50 z-10">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
            activeTab === 'dashboard' 
              ? 'bg-zinc-700 text-emerald-400 shadow-md' 
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Painel Analisador
        </button>
        <button 
          onClick={() => setActiveTab('tuner')}
          className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
            activeTab === 'tuner' 
              ? 'bg-zinc-700 text-emerald-400 shadow-md' 
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Afinador
        </button>
      </div>

      <h1 className="text-4xl font-bold mb-4 text-emerald-400 text-center">
        {activeTab === 'dashboard' ? 'Descubra o Tom 🎵' : 'Afinação Fina 🎸'}
      </h1>
      
      {error && (
        <div className="mb-4 text-red-400 text-sm bg-red-900/20 p-3 rounded-lg">
          {error}
        </div>
      )}

      <button 
        onClick={isRecording ? stopRecording : startRecording}
        className={`mt-4 font-bold py-4 px-8 rounded-full transition-all shadow-lg z-10 ${
          isRecording 
            ? 'bg-red-500 hover:bg-red-600 shadow-red-500/50 animate-pulse' 
            : 'bg-emerald-500 hover:bg-emerald-600 text-zinc-950 shadow-emerald-500/50'
        }`}
      >
        {isRecording ? 'Parar de Ouvir' : 'Ligar Microfone'}
      </button>

      {/* Renderização Condicional: Mostra a aba escolhida */}
      {isRecording && stream && (
        <div className="flex flex-col items-center w-full mt-4 animate-in fade-in zoom-in duration-500">
          
          {activeTab === 'dashboard' ? (
            <PitchTracker stream={stream} />
          ) : (
            <TunerTracker stream={stream} />
          )}

          <AudioVisualizer stream={stream} />
        </div>
      )}
    </main>
  );
}