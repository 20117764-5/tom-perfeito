// src/components/AudioVisualizer.tsx
"use client";

import { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  stream: MediaStream;
}

export function AudioVisualizer({ stream }: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !stream) return;

    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);

    source.connect(analyser);

    analyser.fftSize = 2048;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');
    let animationId: number;

    const draw = () => {
      if (!canvasCtx) return;

      animationId = requestAnimationFrame(draw);

      analyser.getByteTimeDomainData(dataArray);

      canvasCtx.fillStyle = '#18181b'; 
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = '#34d399'; 
      canvasCtx.beginPath();

      const sliceWidth = (canvas.width * 1.0) / bufferLength;
      let x = 0;

      // AQUI ESTAVA O ERRO! Agora está corrigido para < bufferLength
      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasCtx.lineTo(canvas.width, canvas.height / 2);
      canvasCtx.stroke();
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      audioContext.close();
    };
  }, [stream]);

  return (
    <div className="w-full max-w-2xl bg-zinc-800 rounded-xl p-4 shadow-lg border border-zinc-700 mt-8">
      <canvas
        ref={canvasRef}
        width={800}
        height={200}
        className="w-full h-32 rounded-lg"
      />
    </div>
  );
}