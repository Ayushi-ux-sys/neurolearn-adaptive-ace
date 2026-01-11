import React, { useState, useRef, useEffect } from 'react';
import { BackButton } from '@/components/layout/BackButton';
import { Header } from '@/components/layout/Header';
import { useLearningMode } from '@/contexts/LearningModeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Play, Pause, Trash2, Clock, Save } from 'lucide-react';

interface Recording {
  id: string;
  name: string;
  blob: Blob;
  url: string;
  duration: number;
  date: Date;
}

export function AudioPage() {
  const { playbackSpeed, setPlaybackSpeed } = useLearningMode();
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const newRecording: Recording = {
          id: Date.now().toString(),
          name: `Recording ${recordings.length + 1}`,
          blob: audioBlob,
          url: audioUrl,
          duration: recordingTime,
          date: new Date(),
        };
        setRecordings([newRecording, ...recordings]);
        setRecordingTime(0);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const playRecording = (recording: Recording) => {
    if (currentlyPlaying === recording.id) {
      audioRef.current?.pause();
      setCurrentlyPlaying(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(recording.url);
    audio.playbackRate = playbackSpeed;
    audio.onended = () => setCurrentlyPlaying(null);
    audio.play();
    audioRef.current = audio;
    setCurrentlyPlaying(recording.id);
  };

  const deleteRecording = (id: string) => {
    setRecordings(recordings.filter(r => r.id !== id));
    if (currentlyPlaying === id) {
      audioRef.current?.pause();
      setCurrentlyPlaying(null);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <BackButton />
        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-400 to-rose-600 flex items-center justify-center shadow-lg">
              <Mic className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Audio Notes</h1>
              <p className="text-muted-foreground">Record and listen to your voice notes</p>
            </div>
          </div>
        </motion.div>

        {/* Recording Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-neuro p-8 mb-6 text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={isRecording ? stopRecording : startRecording}
            className={`
              w-24 h-24 rounded-full flex items-center justify-center shadow-xl mx-auto mb-4
              ${isRecording 
                ? 'bg-red-500 animate-pulse' 
                : 'bg-gradient-to-br from-red-400 to-rose-600'
              }
            `}
          >
            {isRecording ? (
              <Square className="w-10 h-10 text-white" />
            ) : (
              <Mic className="w-10 h-10 text-white" />
            )}
          </motion.button>

          <p className="text-2xl font-bold text-foreground mb-1">
            {formatTime(recordingTime)}
          </p>
          <p className="text-muted-foreground">
            {isRecording ? 'Recording... Tap to stop' : 'Tap to start recording'}
          </p>
        </motion.div>

        {/* Playback Speed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-neuro p-6 mb-6"
        >
          <h2 className="font-bold text-foreground mb-4">Playback Speed</h2>
          <div className="flex flex-wrap gap-2">
            {speedOptions.map((speed) => (
              <motion.button
                key={speed}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setPlaybackSpeed(speed);
                  if (audioRef.current) {
                    audioRef.current.playbackRate = speed;
                  }
                }}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  playbackSpeed === speed
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {speed}x
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Recordings List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="font-bold text-foreground mb-4">Your Recordings</h2>

          {recordings.length === 0 ? (
            <div className="card-neuro p-8 text-center">
              <Mic className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No recordings yet</p>
              <p className="text-sm text-muted-foreground/70">Start recording to see them here</p>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {recordings.map((recording, index) => (
                  <motion.div
                    key={recording.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="card-neuro p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => playRecording(recording)}
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            currentlyPlaying === recording.id
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-foreground'
                          }`}
                        >
                          {currentlyPlaying === recording.id ? (
                            <Pause className="w-5 h-5" />
                          ) : (
                            <Play className="w-5 h-5 ml-0.5" />
                          )}
                        </motion.button>
                        <div>
                          <p className="font-medium text-foreground">{recording.name}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>{formatTime(recording.duration)}</span>
                          </div>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => deleteRecording(recording.id)}
                        className="p-2 text-destructive hover:bg-destructive/10 rounded-full"
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
