import { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { ConnectionState, Message, AppMode } from '../types';
import { createBlob, decode, decodeAudioData, downsampleTo16000 } from '../utils/audioUtils';

// System instruction to enforce bilingual behavior for Conversation
const CONVERSATION_INSTRUCTION = `
You are a helpful, friendly, and intelligent AI assistant. 
You are fluent in both Khmer and English. 
Your goal is to have a natural voice conversation with the user.
If the user speaks to you in Khmer, respond in Khmer.
If the user speaks in English, respond in English.
Keep your responses concise and conversational, suitable for a voice interface.
`;

// System instruction for Smart Dictation
const DICTATION_INSTRUCTION = `
You are a professional, intelligent speech-to-text dictation system.
Your task is to transcribe the user's speech accurately into text.
You support both Khmer and English.
KEY BEHAVIORS:
1. "Smart Formatting": Use context to determine formatting. Use bullet points for lists, indentation for structure, and new lines for pauses or topic changes.
2. "Indent Inline Context Awareness": If the user dictates structured content (like a plan, code, or hierarchy), use indentation to represent this visually.
3. Do NOT converse. Do NOT answer questions. Do NOT say "Here is the transcription".
4. Output ONLY the transcribed text.
5. If the user corrects themselves, transcribe the correction, not the mistake if obvious.
6. Handle mixed Khmer and English speech seamlessly.
`;

const MODEL_NAME = 'gemini-2.5-flash-native-audio-preview-09-2025';

export const useGeminiLive = () => {
  const [connectionState, setConnectionState] = useState<ConnectionState>(ConnectionState.DISCONNECTED);
  const [messages, setMessages] = useState<Message[]>([]);
  const [volume, setVolume] = useState<number>(0);
  
  // Audio Contexts and Nodes
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const inputNodeRef = useRef<GainNode | null>(null);
  const outputNodeRef = useRef<GainNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  
  // Playback queue management
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  
  // Session management
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  
  // Transcription state
  const currentInputTranscriptionRef = useRef<string>('');
  const currentOutputTranscriptionRef = useRef<string>('');

  const connect = useCallback(async (mode: AppMode) => {
    if (!process.env.API_KEY) {
      console.error("API Key is missing");
      setConnectionState(ConnectionState.ERROR);
      return;
    }

    try {
      setConnectionState(ConnectionState.CONNECTING);
      
      // Initialize Audio Contexts without fixed sample rate to avoid NotSupportedError
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      inputAudioContextRef.current = new AudioContextClass();
      outputAudioContextRef.current = new AudioContextClass();
      
      // CRITICAL: Resume contexts immediately as they might start in 'suspended' state
      await inputAudioContextRef.current.resume();
      await outputAudioContextRef.current.resume();
      
      inputNodeRef.current = inputAudioContextRef.current.createGain();
      outputNodeRef.current = outputAudioContextRef.current.createGain();
      
      // Connect output node to destination (speakers)
      outputNodeRef.current.connect(outputAudioContextRef.current.destination);

      // Get Microphone Stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      // Determine System Instruction based on Mode
      const systemInstruction = mode === 'dictation' ? DICTATION_INSTRUCTION : CONVERSATION_INSTRUCTION;

      // Start the session
      sessionPromiseRef.current = ai.live.connect({
        model: MODEL_NAME,
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: systemInstruction,
          inputAudioTranscription: {}, 
          outputAudioTranscription: {}, 
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
        },
        callbacks: {
          onopen: () => {
            console.log('Gemini Live Session Opened');
            setConnectionState(ConnectionState.CONNECTED);
            
            // Setup Audio Input Processing
            if (!inputAudioContextRef.current || !mediaStreamRef.current) return;
            
            const source = inputAudioContextRef.current.createMediaStreamSource(mediaStreamRef.current);
            // Using ScriptProcessor for raw PCM access (bufferSize: 4096, in: 1, out: 1)
            const processor = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);
            scriptProcessorRef.current = processor;
            
            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              
              // Simple volume calculation for visualizer
              let sum = 0;
              for(let i=0; i<inputData.length; i++) sum += inputData[i] * inputData[i];
              const rms = Math.sqrt(sum / inputData.length);
              setVolume(Math.min(rms * 5, 1)); // Amplify for visualizer
              
              // Downsample to 16000Hz before sending to Gemini
              const downsampledData = downsampleTo16000(inputData, inputAudioContextRef.current!.sampleRate);
              const pcmBlob = createBlob(downsampledData);
              
              sessionPromiseRef.current?.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            
            source.connect(processor);
            processor.connect(inputAudioContextRef.current.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            // Handle Transcription (User Input)
            if (message.serverContent?.inputTranscription) {
               const text = message.serverContent.inputTranscription.text;
               currentInputTranscriptionRef.current += text;
               
               // Update UI with partial user message
               setMessages(prev => {
                  const others = prev.filter(m => m.id !== 'current-user');
                  return [...others, {
                    id: 'current-user',
                    role: 'user',
                    text: currentInputTranscriptionRef.current,
                    timestamp: new Date(),
                    isPartial: true
                  }];
               });
            }
            
            // Handle Transcription (Model Output)
            if (message.serverContent?.outputTranscription) {
              const text = message.serverContent.outputTranscription.text;
              currentOutputTranscriptionRef.current += text;
              
              // Update UI with partial model message
              setMessages(prev => {
                  const others = prev.filter(m => m.id !== 'current-model');
                  return [...others, {
                    id: 'current-model',
                    role: 'model',
                    text: currentOutputTranscriptionRef.current,
                    timestamp: new Date(),
                    isPartial: true
                  }];
               });
            }

            // Handle Turn Completion (Finalize messages)
            if (message.serverContent?.turnComplete) {
               if (currentInputTranscriptionRef.current) {
                 const finalText = currentInputTranscriptionRef.current;
                 setMessages(prev => [
                   ...prev.filter(m => m.id !== 'current-user'),
                   { id: Date.now().toString() + '-user', role: 'user', text: finalText, timestamp: new Date(), isPartial: false }
                 ]);
                 currentInputTranscriptionRef.current = '';
               }
               
               if (currentOutputTranscriptionRef.current) {
                 const finalText = currentOutputTranscriptionRef.current;
                 setMessages(prev => [
                   ...prev.filter(m => m.id !== 'current-model'),
                   { id: Date.now().toString() + '-model', role: 'model', text: finalText, timestamp: new Date(), isPartial: false }
                 ]);
                 currentOutputTranscriptionRef.current = '';
               }
            }
            
            // Handle Audio Output
            // Only play audio in 'conversation' mode
            if (mode === 'conversation') {
              const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
              if (base64Audio && outputAudioContextRef.current && outputNodeRef.current) {
                 const ctx = outputAudioContextRef.current;
                 nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
                 
                 try {
                   const audioBuffer = await decodeAudioData(
                     decode(base64Audio),
                     ctx,
                     24000,
                     1
                   );
                   
                   const source = ctx.createBufferSource();
                   source.buffer = audioBuffer;
                   source.connect(outputNodeRef.current);
                   
                   source.addEventListener('ended', () => {
                     sourcesRef.current.delete(source);
                   });
                   
                   source.start(nextStartTimeRef.current);
                   nextStartTimeRef.current += audioBuffer.duration;
                   sourcesRef.current.add(source);
                   
                 } catch (e) {
                   console.error("Error decoding audio", e);
                 }
              }
            }
            
            // Handle Interruption
            if (message.serverContent?.interrupted) {
              console.log("Interrupted!");
              // Stop audio
              sourcesRef.current.forEach(source => source.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
              
              // Force finalize the current model message so it doesn't blink forever
               if (currentOutputTranscriptionRef.current) {
                 const finalText = currentOutputTranscriptionRef.current;
                 setMessages(prev => [
                   ...prev.filter(m => m.id !== 'current-model'),
                   { 
                     id: Date.now().toString() + '-model', 
                     role: 'model', 
                     text: finalText, 
                     timestamp: new Date(), 
                     isPartial: false // Mark as complete
                   }
                 ]);
                 currentOutputTranscriptionRef.current = '';
               }
            }
          },
          onclose: () => {
            console.log("Session Closed");
            setConnectionState(ConnectionState.DISCONNECTED);
          },
          onerror: (err) => {
            console.error("Session Error", err);
            setConnectionState(ConnectionState.ERROR);
          }
        }
      });

    } catch (error) {
      console.error("Connection failed", error);
      setConnectionState(ConnectionState.ERROR);
    }
  }, []);

  const disconnect = useCallback(() => {
    // Stop Microphone
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    
    // Disconnect Processor
    if (scriptProcessorRef.current) {
      scriptProcessorRef.current.disconnect();
      scriptProcessorRef.current = null;
    }
    
    // Stop Audio Output
    if (outputAudioContextRef.current) {
      outputAudioContextRef.current.close();
      outputAudioContextRef.current = null;
    }
    
    if (inputAudioContextRef.current) {
      inputAudioContextRef.current.close();
      inputAudioContextRef.current = null;
    }
    
    // Reset buffers
    currentInputTranscriptionRef.current = '';
    currentOutputTranscriptionRef.current = '';
    
    // Close Session (Conceptual - session logic is handled by cutting streams)
    sessionPromiseRef.current = null;
    
    setConnectionState(ConnectionState.DISCONNECTED);
    setVolume(0);
  }, []);

  return {
    connect,
    disconnect,
    connectionState,
    messages,
    volume
  };
};