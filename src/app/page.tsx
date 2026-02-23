// src/app/page.tsx
"use client";

import { useMicrophone } from '../hooks/useMicrophone';
import { AudioVisualizer } from '../components/AudioVisualizer';
import { PitchTracker } from '../components/PitchTracker';

export default function Home() {
  const { stream, isRecording, error, startRecording, stopRecording } = useMicrophone();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-4 text-emerald-400">
        Descubra o Tom 🎵
      </h1>
      <p className="text-zinc-400 text-center mb-8 max-w-md">
        Toque ou cante algo, e o app vai descobrir a nota principal.
      </p>

      {error && (
        <div className="mb-4 text-red-400 text-sm bg-red-900/20 p-3 rounded-lg">
          {error}
        </div>
      )}

      <button 
        onClick={isRecording ? stopRecording : startRecording}
        className={`font-bold py-4 px-8 rounded-full transition-all shadow-lg z-10 ${
          isRecording 
            ? 'bg-red-500 hover:bg-red-600 shadow-red-500/50 animate-pulse' 
            : 'bg-emerald-500 hover:bg-emerald-600 text-zinc-950 shadow-emerald-500/50'
        }`}
      >
        {isRecording ? 'Parar de Ouvir' : 'Ouvir Música'}
      </button>

      {/* Exibe o Gráfico e o Letreiro quando estiver escutando */}
      {isRecording && stream && (
        <div className="flex flex-col items-center w-full mt-8">
          <PitchTracker stream={stream} />
          <AudioVisualizer stream={stream} />
        </div>
      )}
    </main>
  );
}