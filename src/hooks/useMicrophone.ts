// src/hooks/useMicrophone.ts
import { useState, useCallback } from 'react';

export const useMicrophone = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      
      // Pede permissão e captura o áudio bruto do microfone
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false, // Desliga o filtro de eco
          autoGainControl: false,  // Impede que o volume mude sozinho
          noiseSuppression: false, // Desliga o filtro de "barulho de fundo"
        }
      });
      
      setStream(audioStream);
      setIsRecording(true);
    } catch (err) {
      setError('Não foi possível acessar o microfone. Verifique as permissões do navegador.');
      console.error(err);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (stream) {
      // Desliga todas as faixas de áudio abertas
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsRecording(false);
    }
  }, [stream]);

  return { stream, isRecording, error, startRecording, stopRecording };
};