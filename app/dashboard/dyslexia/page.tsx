"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/providers"
import DashboardNav from "@/components/dashboard-nav"
import OCRUploadModal from "@/components/ocr-upload-modal"
import ControlPanel from "@/components/dyslexia/control-panel"
import TextViewer from "@/components/dyslexia/text-viewer"
import { LoaderIcon } from "@/components/dyslexia/icons"
import { DyslexiaSettings, Theme, Font } from "@/types/dyslexia"
import { extractTextFromPdf, generateSpeech, getWordTimings } from "@/lib/gemini-service"
import { decode, decodeAudioData } from "@/utils/audio"

export default function DyslexiaDashboard() {
  const router = useRouter()
  const { user, logout } = useAuth()

  const [settings, setSettings] = useState<DyslexiaSettings>({
    fontSize: 20,
    font: Font.OpenDyslexic,
    theme: Theme.Default,
    lineSpacing: 1.8,
    letterSpacing: 0.1,
    isReadingRuler: true,
  })

  const [extractedText, setExtractedText] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string>("")
  const [showOCRModal, setShowOCRModal] = useState(false)

  // Text-to-speech state
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false)
  const audioContextRef = useRef<AudioContext | null>(null)
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null)
  const [wordTimings, setWordTimings] = useState<{ word: string, startTime: number }[] | null>(null)
  const [currentWordIndex, setCurrentWordIndex] = useState<number | null>(null)
  const playbackStartTimeRef = useRef<number>(0)
  const animationFrameId = useRef<number | null>(null)

  useEffect(() => {
    if (!user || user.disability !== "dyslexia") {
      router.push("/login")
    }
  }, [user, router])

  // Initialize AudioContext on user interaction
  useEffect(() => {
    const initializeAudioContext = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      document.removeEventListener('click', initializeAudioContext);
    };
    document.addEventListener('click', initializeAudioContext);
    return () => {
      document.removeEventListener('click', initializeAudioContext);
      audioContextRef.current?.close();
    };
  }, []);

  if (!user || user.disability !== "dyslexia") {
    return null
  }

  const handleSettingsChange = useCallback(<K extends keyof DyslexiaSettings>(
    setting: K, 
    value: DyslexiaSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [setting]: value }));
  }, []);

  const stopSpeakingAndHighlighting = useCallback(() => {
    if (audioSourceRef.current) {
      audioSourceRef.current.stop();
      audioSourceRef.current = null;
    }
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
    setIsSpeaking(false);
    setCurrentWordIndex(null);
    setWordTimings(null);
  }, []);

  const handleTextToSpeech = useCallback(async () => {
    if (isSpeaking) {
      stopSpeakingAndHighlighting();
      return;
    }

    if (!extractedText || !audioContextRef.current) return;

    setIsLoading(true);
    setError(null);

    try {
      const audioData = await generateSpeech(extractedText);
      const audioBuffer = await decodeAudioData(
        decode(audioData),
        audioContextRef.current,
        24000,
        1
      );
      
      const timings = await getWordTimings(extractedText, audioBuffer.duration);
      if (timings.length > 0) {
        setWordTimings(timings);
      } else {
        console.warn("Could not get word timings. Playing audio without highlighting.");
      }
      
      setIsSpeaking(true);

      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);
      source.onended = stopSpeakingAndHighlighting;
      
      source.start();
      audioSourceRef.current = source;
      
      if (timings.length > 0) {
        playbackStartTimeRef.current = audioContextRef.current.currentTime;
        
        const highlightLoop = () => {
          if (!audioContextRef.current || !audioSourceRef.current || !timings) {
            return;
          }
          const elapsedTimeMs = (audioContextRef.current.currentTime - playbackStartTimeRef.current) * 1000;
          
          let newWordIndex = -1;
          for (let i = 0; i < timings.length; i++) {
            if (elapsedTimeMs >= timings[i].startTime) {
              newWordIndex = i;
            } else {
              break;
            }
          }
          setCurrentWordIndex(newWordIndex);
          animationFrameId.current = requestAnimationFrame(highlightLoop);
        };
        animationFrameId.current = requestAnimationFrame(highlightLoop);
      }
    } catch (err) {
      console.error(err);
      setError('Text-to-speech failed. Please ensure NEXT_PUBLIC_GEMINI_API_KEY is set.');
      stopSpeakingAndHighlighting();
    } finally {
      setIsLoading(false);
    }
  }, [extractedText, isSpeaking, stopSpeakingAndHighlighting]);

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setExtractedText("");
    setFileName(file.name);
    stopSpeakingAndHighlighting();

    try {
      const text = await extractTextFromPdf(file);
      setExtractedText(text);
      setShowOCRModal(false);
    } catch (err) {
      console.error(err);
      setError('Failed to extract text from the PDF. Please ensure NEXT_PUBLIC_GEMINI_API_KEY is set.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewFile = () => {
    setExtractedText("");
    setFileName("");
    setError(null);
    stopSpeakingAndHighlighting();
  };

  const handleExtractText = (text: string) => {
    setExtractedText(text);
    setShowOCRModal(false);
  };

  return (
    <div className="flex flex-col h-screen font-sans bg-background text-foreground">
      <DashboardNav
        title="Dyslexia Dashboard"
        subtitle="Reading-Friendly Interface with OCR"
        user={user}
        onLogout={logout}
        onChangeDashboard={() => router.push("/select-dashboard")}
      />

      {isLoading && (
        <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex flex-col items-center justify-center z-50">
          <LoaderIcon className="w-16 h-16 animate-spin text-white" />
          <p className="text-white text-xl mt-4">Processing your document...</p>
        </div>
      )}

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <ControlPanel
          settings={settings}
          onSettingsChange={handleSettingsChange}
          onTextToSpeech={handleTextToSpeech}
          isSpeaking={isSpeaking}
          onNewFile={handleNewFile}
          hasContent={!!extractedText}
        />

        <main className="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto">
          {extractedText ? (
            <TextViewer
              text={extractedText}
              settings={settings}
              fileName={fileName}
              currentWordIndex={currentWordIndex}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold">Welcome to Dyslexia Dashboard</h2>
                <p className="text-muted-foreground">Upload a PDF or image to get started</p>
                <button
                  onClick={() => setShowOCRModal(true)}
                  className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-semibold transition shadow-lg hover:shadow-xl"
                >
                  📄 Scan Document (OCR)
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 text-center text-red-500 bg-red-100 dark:bg-red-900/20 border border-red-400 rounded p-4">
              <p className="font-bold">An error occurred:</p>
              <p>{error}</p>
            </div>
          )}
        </main>
      </div>

      {/* OCR Modal */}
      <OCRUploadModal 
        isOpen={showOCRModal} 
        onClose={() => setShowOCRModal(false)} 
        onExtractText={handleExtractText}
        onFileUpload={handleFileUpload}
      />
    </div>
  )
}