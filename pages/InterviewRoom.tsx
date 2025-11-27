import  { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { Mic, MicOff, PhoneOff, AlertCircle, MessageSquare, X } from 'lucide-react';
import { useInterview } from '../context/InterviewContext';
import HolographicAvatar from '../components/HolographicAvatar';
import { getSystemInstruction, PCM_SAMPLE_RATE, OUT_SAMPLE_RATE } from '../constants';
import { createPcmBlob, decodeAudioData, base64ToUint8Array } from '../services/audioUtils';

const InterviewRoom: React.FC = () => {
  const navigate = useNavigate();
  const { config, transcript, addTranscriptItem } = useInterview();
  const [isConnected, setIsConnected] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [streamingUserText, setStreamingUserText] = useState("");
  const [isTranscriptVisible, setIsTranscriptVisible] = useState(true);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);
  const currentUserTextRef = useRef<string>("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const connectToGemini = useCallback(async () => {
    if (!process.env.API_KEY) {
      setError("API Key Missing");
      return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: OUT_SAMPLE_RATE });
      inputContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: PCM_SAMPLE_RATE });
      
      const analyser = audioContextRef.current.createAnalyser();
      analyser.fftSize = 512;
      analyserRef.current = analyser;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          systemInstruction: getSystemInstruction(config.domain, config.difficulty, config.resumeText),
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
          inputAudioTranscription: { },
          outputAudioTranscription: { },
        },
        callbacks: {
          onopen: async () => {
            setIsConnected(true);
            try {
              const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
              streamRef.current = stream;
              if (!inputContextRef.current) return;
              const source = inputContextRef.current.createMediaStreamSource(stream);
              const processor = inputContextRef.current.createScriptProcessor(4096, 1, 1);
              processor.onaudioprocess = (e) => {
                if (!isMicOn) return; 
                const inputData = e.inputBuffer.getChannelData(0);
                const pcmBlob = createPcmBlob(inputData);
                sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
              };
              source.connect(processor);
              processor.connect(inputContextRef.current.destination);
            } catch (err) {
              setError("Microphone Access Denied");
            }
          },
          onmessage: async (msg: LiveServerMessage) => {
            const { serverContent } = msg;
            const audioData = serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audioData && audioContextRef.current) {
               setAiSpeaking(true);
               const ctx = audioContextRef.current;
               nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
               const audioBuffer = await decodeAudioData(base64ToUint8Array(audioData), ctx, OUT_SAMPLE_RATE);
               const source = ctx.createBufferSource();
               source.buffer = audioBuffer;
               source.connect(analyserRef.current!);
               analyserRef.current!.connect(ctx.destination);
               source.start(nextStartTimeRef.current);
               nextStartTimeRef.current += audioBuffer.duration;
               sourcesRef.current.add(source);
               source.onended = () => {
                 sourcesRef.current.delete(source);
                 if (sourcesRef.current.size === 0) setAiSpeaking(false);
               };
            }

            const userInput = serverContent?.inputTranscription?.text;
            if (userInput) {
              currentUserTextRef.current += userInput;
              setStreamingUserText(prev => prev + userInput);
            }

            const modelText = serverContent?.modelTurn?.parts?.[0]?.text;
            if (modelText) {
               addTranscriptItem({ role: 'model', text: modelText, timestamp: Date.now() });
               if (currentUserTextRef.current.trim()) {
                 addTranscriptItem({ role: 'user', text: currentUserTextRef.current.trim(), timestamp: Date.now() });
                 currentUserTextRef.current = "";
                 setStreamingUserText("");
               }
            }

            if (serverContent?.turnComplete && currentUserTextRef.current.trim()) {
               addTranscriptItem({ role: 'user', text: currentUserTextRef.current.trim(), timestamp: Date.now() });
               currentUserTextRef.current = "";
               setStreamingUserText("");
            }

            if (serverContent?.interrupted) {
              sourcesRef.current.forEach(source => source.stop());
              sourcesRef.current.clear();
              setAiSpeaking(false);
              nextStartTimeRef.current = 0;
            }
          },
          onclose: () => setIsConnected(false),
          onerror: () => setError("Connection Error")
        }
      });
    } catch (e) {
      setError("System Error");
    }
  }, [config, isMicOn, addTranscriptItem]);

  useEffect(() => {
    connectToGemini();
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
      if (inputContextRef.current) inputContextRef.current.close();
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [transcript, streamingUserText, isTranscriptVisible]);

  const handleEndInterview = () => {
     if (currentUserTextRef.current.trim()) {
        addTranscriptItem({ role: 'user', text: currentUserTextRef.current.trim(), timestamp: Date.now() });
     }
     navigate('/dashboard');
  };

  if (error) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-4 text-txt-main">
        <div className="text-center space-y-4">
          <AlertCircle className="w-10 h-10 mx-auto text-accent" />
          <h2 className="text-xl font-bold">Error</h2>
          <p className="text-txt-sec">{error}</p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 border border-border rounded hover:bg-white/5">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-bg flex flex-col relative overflow-hidden font-sans">
      
      {/* Header */}
      <header className="absolute top-0 left-0 w-full z-10 p-6 flex justify-between items-center pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto bg-black/50 px-3 py-1 rounded-full border border-border">
           <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
           <span className="text-xs font-mono text-txt-sec">{isConnected ? 'ONLINE' : 'OFFLINE'}</span>
        </div>
        <div className="text-right pointer-events-auto">
          <p className="text-sm font-bold text-txt-main">{config.domain}</p>
          <p className="text-xs text-txt-sec">{config.difficulty}</p>
        </div>
      </header>

      {/* Visuals */}
      <main className="flex-1 w-full h-full relative">
         <HolographicAvatar analyser={analyserRef.current || undefined} isSpeaking={aiSpeaking} />
      </main>

      {/* Transcript Overlay */}
      {isTranscriptVisible && (
        <div className="absolute top-20 left-6 w-80 max-h-[50vh] flex flex-col z-20 pointer-events-auto">
          <div className="bg-[#1a1a1a]/90 border border-border rounded-lg p-4 flex flex-col h-full backdrop-blur-sm">
            <div className="flex justify-between items-center mb-3">
               <span className="text-xs font-mono text-accent">TRANSCRIPT</span>
               <button onClick={() => setIsTranscriptVisible(false)}><X className="w-4 h-4 text-txt-sec" /></button>
            </div>
            <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 pr-1 text-sm">
              {transcript.map((item, idx) => (
                <div key={idx} className={`flex flex-col ${item.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <span className="text-[10px] text-accent mb-1">{item.role === 'model' ? 'AI' : 'YOU'}</span>
                  <div className={`px-3 py-2 rounded-lg max-w-[90%] ${
                    item.role === 'user' ? 'bg-border text-txt-main' : 'bg-black/40 text-txt-sec border border-border'
                  }`}>
                    {item.text}
                  </div>
                </div>
              ))}
              {streamingUserText && (
                <div className="flex flex-col items-end opacity-50">
                   <div className="px-3 py-2 rounded-lg bg-border/50 text-txt-main border border-border border-dashed">{streamingUserText}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <footer className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 z-30 pointer-events-auto">
        <button 
          onClick={() => setIsTranscriptVisible(!isTranscriptVisible)}
          className={`p-4 rounded-full border transition-all ${
            isTranscriptVisible ? 'bg-txt-main text-bg border-txt-main' : 'bg-transparent text-txt-sec border-border hover:border-accent'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
        </button>

        <button 
          onClick={() => setIsMicOn(!isMicOn)}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
            isMicOn 
              ? 'bg-txt-main text-bg' 
              : 'bg-[#1a1a1a] text-red-500 border border-red-900'
          }`}
        >
          {isMicOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
        </button>

        <button 
          onClick={handleEndInterview}
          className="p-4 rounded-full bg-[#1a1a1a] border border-border text-txt-sec hover:bg-red-900/20 hover:text-red-400 hover:border-red-900 transition-all"
        >
          <PhoneOff className="w-5 h-5" />
        </button>
      </footer>
    </div>
  );
};

export default InterviewRoom;