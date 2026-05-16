"use client"

import { useState, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAppStore, promptPresets } from "@/lib/store"
import {
  ArrowLeft,
  Upload,
  Image as ImageIcon,
  X,
  Music,
  Mic,
  Play,
  Pause,
  Sparkles,
  Copy,
  Trash2,
  Wand2,
  Check,
  ChevronDown,
  Zap,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { ProcessingOverlay } from "@/components/processing-overlay"

const emotions = [
  "neutral",
  "happy",
  "sad",
  "angry",
  "surprised",
  "excited",
  "thoughtful",
]
const durations = ["auto", "15s", "30s", "60s", "90s", "120s"]
const qualities = [
  { id: "fast", label: "Fast", desc: "Quick preview" },
  { id: "balanced", label: "Balanced", desc: "Recommended" },
  { id: "high", label: "High Quality", desc: "Best results" },
]
const voices = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"]
const languages = [
  { code: "en-US", label: "English (US)" },
  { code: "en-GB", label: "English (UK)" },
  { code: "es-ES", label: "Spanish" },
  { code: "fr-FR", label: "French" },
  { code: "de-DE", label: "German" },
  { code: "ja-JP", label: "Japanese" },
  { code: "ko-KR", label: "Korean" },
  { code: "zh-CN", label: "Chinese" },
]

export function CreateLipSyncPage() {
  const {
    setCurrentPage,
    characterImage,
    setCharacterImage,
    audioFile,
    audioFileName,
    setAudioFile,
    ttsText,
    setTtsText,
    ttsSettings,
    setTtsSettings,
    lipSyncSettings,
    setLipSyncSettings,
    prompt,
    setPrompt,
    apiKey,
    isProcessing,
    setProcessing,
    addProject,
    setCurrentResult,
  } = useAppStore()

  const { toast } = useToast()
  const [audioTab, setAudioTab] = useState<"upload" | "tts">("upload")
  const [isPlaying, setIsPlaying] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showEmotionSelect, setShowEmotionSelect] = useState(false)
  const [showDurationSelect, setShowDurationSelect] = useState(false)
  const [showVoiceSelect, setShowVoiceSelect] = useState(false)
  const [showLanguageSelect, setShowLanguageSelect] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const audioInputRef = useRef<HTMLInputElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          setCharacterImage(event.target?.result as string)
        }
        reader.readAsDataURL(file)
      }
    },
    [setCharacterImage]
  )

  const handleAudioUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          setAudioFile(event.target?.result as string, file.name)
        }
        reader.readAsDataURL(file)
      }
    },
    [setAudioFile]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent, type: "image" | "audio") => {
      e.preventDefault()
      const file = e.dataTransfer.files[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (event) => {
        if (type === "image") {
          setCharacterImage(event.target?.result as string)
        } else {
          setAudioFile(event.target?.result as string, file.name)
        }
      }
      reader.readAsDataURL(file)
    },
    [setCharacterImage, setAudioFile]
  )

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const copyPrompt = () => {
    navigator.clipboard.writeText(prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const enhancePrompt = () => {
    const enhanced = `${prompt}\n\nEnhanced: Cinematic 4K quality, professional studio lighting, natural micro-expressions, smooth transitions, high-fidelity lip sync accuracy.`
    setPrompt(enhanced)
    toast({
      title: "Prompt Enhanced",
      description: "AI enhancements have been added to your prompt.",
    })
  }

  const handleGenerate = async () => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please configure your Magnific API key in settings.",
        variant: "destructive",
      })
      return
    }

    if (!characterImage) {
      toast({
        title: "Character Required",
        description: "Please upload a character image.",
        variant: "destructive",
      })
      return
    }

    if (!audioFile && !ttsText) {
      toast({
        title: "Audio Required",
        description: "Please upload audio or enter text for speech.",
        variant: "destructive",
      })
      return
    }

    // Start processing
    setProcessing(true, 0, 0)

    // Simulate processing steps
    const steps = [
      { step: 0, duration: 2000, progress: 20 },
      { step: 1, duration: 3000, progress: 45 },
      { step: 2, duration: 4000, progress: 75 },
      { step: 3, duration: 3000, progress: 100 },
    ]

    for (const { step, duration, progress } of steps) {
      setProcessing(true, step, progress)
      await new Promise((resolve) => setTimeout(resolve, duration))
    }

    // Create result
    const newProject = {
      id: `project-${Date.now()}`,
      thumbnail: characterImage,
      date: new Date().toISOString().split("T")[0],
      duration: lipSyncSettings.videoDuration === "auto" ? "0:30" : lipSyncSettings.videoDuration.replace("s", ""),
      status: "completed" as const,
      prompt,
      settings: lipSyncSettings,
      videoUrl: "https://example.com/generated-video.mp4",
    }

    addProject(newProject)
    setCurrentResult(newProject)
    setProcessing(false)
    setCurrentPage("result")
  }

  return (
    <>
      <ProcessingOverlay />
      <div className="min-h-screen pb-24 px-4">
        {/* Header */}
        <motion.header
          className="pt-6 pb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentPage("dashboard")}
              className="w-10 h-10 rounded-full glass-card flex items-center justify-center hover:bg-secondary transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Create Lip Sync</h1>
              <p className="text-sm text-muted-foreground">
                Generate AI-powered lip sync video
              </p>
            </div>
          </div>
        </motion.header>

        {/* Section A: Character Image */}
        <motion.section
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-primary" />
            Character Image
          </h3>
          <Card
            className="p-4 glass-card border-0 border-dashed border-2 border-border/50 cursor-pointer hover:border-primary/50 transition-colors"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, "image")}
            onClick={() => !characterImage && fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            {characterImage ? (
              <div className="relative">
                <img
                  src={characterImage}
                  alt="Character"
                  className="w-full h-48 object-cover rounded-xl"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setCharacterImage(null)
                  }}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-destructive/80 flex items-center justify-center hover:bg-destructive transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <Upload className="w-10 h-10 mb-3 text-primary/50" />
                <p className="font-medium mb-1">Upload Character Image</p>
                <p className="text-xs">Drag & drop or tap to select</p>
              </div>
            )}
          </Card>
        </motion.section>

        {/* Section B: Audio Input */}
        <motion.section
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
            <Music className="w-4 h-4 text-primary" />
            Audio Input
          </h3>
          <Tabs
            value={audioTab}
            onValueChange={(v) => setAudioTab(v as "upload" | "tts")}
          >
            <TabsList className="w-full glass-card border-0 mb-3">
              <TabsTrigger value="upload" className="flex-1">
                <Upload className="w-4 h-4 mr-2" />
                Upload Audio
              </TabsTrigger>
              <TabsTrigger value="tts" className="flex-1">
                <Mic className="w-4 h-4 mr-2" />
                Text to Speech
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload">
              <Card
                className="p-4 glass-card border-0 border-dashed border-2 border-border/50 cursor-pointer hover:border-primary/50 transition-colors"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, "audio")}
                onClick={() => !audioFile && audioInputRef.current?.click()}
              >
                <input
                  ref={audioInputRef}
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  onChange={handleAudioUpload}
                />
                {audioFile ? (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleAudio()
                      }}
                      className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center flex-shrink-0"
                    >
                      {isPlaying ? (
                        <Pause className="w-5 h-5 text-primary-foreground" />
                      ) : (
                        <Play className="w-5 h-5 text-primary-foreground ml-0.5" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{audioFileName}</p>
                      <p className="text-xs text-muted-foreground">
                        Audio file ready
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setAudioFile(null, null)
                        setIsPlaying(false)
                      }}
                      className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-destructive/20 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <audio ref={audioRef} src={audioFile} onEnded={() => setIsPlaying(false)} />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
                    <Music className="w-8 h-8 mb-2 text-primary/50" />
                    <p className="font-medium mb-1">Upload Audio File</p>
                    <p className="text-xs">MP3, WAV supported</p>
                  </div>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="tts">
              <Card className="p-4 glass-card border-0 space-y-4">
                <textarea
                  placeholder="Enter text to convert to speech..."
                  value={ttsText}
                  onChange={(e) => setTtsText(e.target.value)}
                  className="w-full h-24 bg-input rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <div className="grid grid-cols-2 gap-3">
                  {/* Voice Selector */}
                  <div className="relative">
                    <button
                      onClick={() => setShowVoiceSelect(!showVoiceSelect)}
                      className="w-full px-4 py-3 bg-input rounded-xl flex items-center justify-between"
                    >
                      <span className="capitalize">{ttsSettings.voice}</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <AnimatePresence>
                      {showVoiceSelect && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full left-0 right-0 mt-1 bg-popover rounded-xl shadow-lg z-10 overflow-hidden"
                        >
                          {voices.map((voice) => (
                            <button
                              key={voice}
                              onClick={() => {
                                setTtsSettings({ ...ttsSettings, voice })
                                setShowVoiceSelect(false)
                              }}
                              className="w-full px-4 py-2 text-left hover:bg-secondary capitalize"
                            >
                              {voice}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Language Selector */}
                  <div className="relative">
                    <button
                      onClick={() => setShowLanguageSelect(!showLanguageSelect)}
                      className="w-full px-4 py-3 bg-input rounded-xl flex items-center justify-between"
                    >
                      <span className="truncate">
                        {
                          languages.find((l) => l.code === ttsSettings.language)
                            ?.label
                        }
                      </span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <AnimatePresence>
                      {showLanguageSelect && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full left-0 right-0 mt-1 bg-popover rounded-xl shadow-lg z-10 overflow-hidden max-h-48 overflow-y-auto"
                        >
                          {languages.map((lang) => (
                            <button
                              key={lang.code}
                              onClick={() => {
                                setTtsSettings({
                                  ...ttsSettings,
                                  language: lang.code,
                                })
                                setShowLanguageSelect(false)
                              }}
                              className="w-full px-4 py-2 text-left hover:bg-secondary"
                            >
                              {lang.label}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                <Button className="w-full gradient-accent hover:opacity-90 rounded-xl">
                  <Mic className="w-4 h-4 mr-2" />
                  Generate Voice
                </Button>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.section>

        {/* Section C: Lip Sync Settings */}
        <motion.section
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Lip Sync Settings
          </h3>
          <Card className="p-4 glass-card border-0 space-y-5">
            {/* Expression Intensity */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm">Expression Intensity</span>
                <span className="text-sm text-primary">
                  {lipSyncSettings.expressionIntensity}%
                </span>
              </div>
              <Slider
                value={[lipSyncSettings.expressionIntensity]}
                onValueChange={([value]) =>
                  setLipSyncSettings({ expressionIntensity: value })
                }
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            {/* Mouth Accuracy */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm">Mouth Movement Accuracy</span>
                <span className="text-sm text-primary">
                  {lipSyncSettings.mouthAccuracy}%
                </span>
              </div>
              <Slider
                value={[lipSyncSettings.mouthAccuracy]}
                onValueChange={([value]) =>
                  setLipSyncSettings({ mouthAccuracy: value })
                }
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            {/* Emotion Selector */}
            <div className="relative">
              <span className="text-sm block mb-2">Emotion</span>
              <button
                onClick={() => setShowEmotionSelect(!showEmotionSelect)}
                className="w-full px-4 py-3 bg-input rounded-xl flex items-center justify-between"
              >
                <span className="capitalize">{lipSyncSettings.emotion}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <AnimatePresence>
                {showEmotionSelect && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-1 bg-popover rounded-xl shadow-lg z-10 overflow-hidden"
                  >
                    {emotions.map((emotion) => (
                      <button
                        key={emotion}
                        onClick={() => {
                          setLipSyncSettings({ emotion })
                          setShowEmotionSelect(false)
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-secondary capitalize"
                      >
                        {emotion}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Duration Selector */}
            <div className="relative">
              <span className="text-sm block mb-2">Video Duration</span>
              <button
                onClick={() => setShowDurationSelect(!showDurationSelect)}
                className="w-full px-4 py-3 bg-input rounded-xl flex items-center justify-between"
              >
                <span className="capitalize">
                  {lipSyncSettings.videoDuration}
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <AnimatePresence>
                {showDurationSelect && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-1 bg-popover rounded-xl shadow-lg z-10 overflow-hidden"
                  >
                    {durations.map((duration) => (
                      <button
                        key={duration}
                        onClick={() => {
                          setLipSyncSettings({ videoDuration: duration })
                          setShowDurationSelect(false)
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-secondary"
                      >
                        {duration}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Quality Selector */}
            <div>
              <span className="text-sm block mb-2">Quality</span>
              <div className="grid grid-cols-3 gap-2">
                {qualities.map((q) => (
                  <button
                    key={q.id}
                    onClick={() =>
                      setLipSyncSettings({
                        quality: q.id as "fast" | "balanced" | "high",
                      })
                    }
                    className={`p-3 rounded-xl text-center transition-all ${
                      lipSyncSettings.quality === q.id
                        ? "gradient-primary text-primary-foreground"
                        : "bg-input hover:bg-secondary"
                    }`}
                  >
                    <p className="font-medium text-sm">{q.label}</p>
                    <p
                      className={`text-xs ${
                        lipSyncSettings.quality === q.id
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground"
                      }`}
                    >
                      {q.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </motion.section>

        {/* Section D: Prompt Enhancer */}
        <motion.section
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
            <Wand2 className="w-4 h-4 text-primary" />
            Prompt Enhancer
          </h3>
          <Card className="p-4 glass-card border-0 space-y-3">
            <textarea
              placeholder="Describe expression, emotion, camera movement, cinematic style..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-24 bg-input rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
            />

            {/* Preset Buttons */}
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
              {promptPresets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => setPrompt(preset.prompt)}
                  className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-secondary/50 text-xs hover:bg-secondary transition-colors"
                >
                  {preset.name}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <Button
                onClick={enhancePrompt}
                className="flex-1 gradient-accent hover:opacity-90 rounded-xl"
                disabled={!prompt}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                AI Enhance
              </Button>
              <Button
                variant="secondary"
                onClick={() => setPrompt("")}
                className="rounded-xl"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <Button
                variant="secondary"
                onClick={copyPrompt}
                className="rounded-xl"
                disabled={!prompt}
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </Card>
        </motion.section>

        {/* Section E: Generate Button */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <Button
            onClick={handleGenerate}
            disabled={isProcessing}
            className="w-full h-14 text-lg font-semibold gradient-primary hover:opacity-90 rounded-2xl pulse-glow"
          >
            <Zap className="w-5 h-5 mr-2" />
            Generate Lip Sync Video
          </Button>

          {/* Estimated Time */}
          <p className="text-center text-xs text-muted-foreground mt-3">
            Estimated processing time: ~2-3 minutes for{" "}
            {lipSyncSettings.quality} quality
          </p>
        </motion.section>
      </div>
    </>
  )
}
