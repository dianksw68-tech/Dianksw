"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { useAppStore } from "@/lib/store"
import {
  ArrowLeft,
  Download,
  Share2,
  Copy,
  Check,
  RefreshCw,
  Play,
  Pause,
  Info,
  FileText,
  Code,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

export function ResultPage() {
  const { currentResult, setCurrentPage, setCharacterImage, setPrompt, setLipSyncSettings } = useAppStore()
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  if (!currentResult) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="p-6 glass-card border-0 text-center">
          <p className="text-muted-foreground mb-4">No result found</p>
          <Button onClick={() => setCurrentPage("dashboard")}>
            Go to Dashboard
          </Button>
        </Card>
      </div>
    )
  }

  const copyProjectId = () => {
    navigator.clipboard.writeText(currentResult.id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast({
      title: "Copied",
      description: "Project ID copied to clipboard",
    })
  }

  const handleDownload = async () => {
    if (!currentResult.videoUrl) {
      toast({
        title: "No Video",
        description: "Video URL is not available.",
        variant: "destructive",
      })
      return
    }
    
    try {
      toast({
        title: "Download Started",
        description: "Your video will download shortly.",
      })
      
      const response = await fetch(currentResult.videoUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `lipsync-${currentResult.id}.mp4`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch {
      // Fallback: open in new tab
      window.open(currentResult.videoUrl, '_blank')
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "LipSync Studio Video",
        text: "Check out this AI-generated lip sync video!",
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link Copied",
        description: "Share link copied to clipboard",
      })
    }
  }

  const handleGenerateAgain = () => {
    if (currentResult.thumbnail) {
      setCharacterImage(currentResult.thumbnail)
    }
    setPrompt(currentResult.prompt)
    setLipSyncSettings(currentResult.settings)
    setCurrentPage("create")
  }

  const mockJsonResponse = {
    id: currentResult.id,
    status: currentResult.status,
    created_at: currentResult.date,
    duration: currentResult.duration,
    settings: currentResult.settings,
    output: {
      video_url: currentResult.videoUrl,
      thumbnail_url: currentResult.thumbnail,
      format: "mp4",
      resolution: "1080p",
      fps: 30,
    },
    meta: {
      processing_time: "2m 34s",
      model_version: "v2.1",
      gpu_type: "A100",
    },
  }

  return (
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
            <h1 className="text-2xl font-bold">Video Result</h1>
            <p className="text-sm text-muted-foreground">
              Your lip sync video is ready
            </p>
          </div>
        </div>
      </motion.header>

      {/* Video Preview */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <Card className="glass-card border-0 overflow-hidden">
          <div className="relative aspect-video bg-secondary">
            {currentResult.videoUrl ? (
              <>
                <video
                  ref={videoRef}
                  src={currentResult.videoUrl}
                  poster={currentResult.thumbnail}
                  className="w-full h-full object-cover"
                  controls={isPlaying}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                />
                {!isPlaying && (
                  <button
                    onClick={() => {
                      videoRef.current?.play()
                      setIsPlaying(true)
                    }}
                    className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
                  >
                    <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center neon-glow">
                      <Play className="w-8 h-8 text-primary-foreground ml-1" />
                    </div>
                  </button>
                )}
              </>
            ) : currentResult.thumbnail ? (
              <img
                src={currentResult.thumbnail}
                alt="Video thumbnail"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Play className="w-16 h-16 text-muted-foreground/30" />
              </div>
            )}

            {/* Duration badge */}
            <div className="absolute bottom-3 right-3 px-2 py-1 rounded-lg bg-black/60 text-xs">
              {currentResult.duration}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        className="grid grid-cols-2 gap-3 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <Button
          onClick={handleDownload}
          className="h-12 gradient-primary hover:opacity-90 rounded-xl"
        >
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
        <Button
          onClick={handleShare}
          variant="secondary"
          className="h-12 rounded-xl"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </motion.div>

      {/* Project ID */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <Card className="p-4 glass-card border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Project ID</p>
              <p className="font-mono text-sm">{currentResult.id}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyProjectId}
              className="rounded-xl"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Tabs: Details, Prompt, JSON */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        <Tabs defaultValue="details">
          <TabsList className="w-full glass-card border-0 mb-4">
            <TabsTrigger value="details" className="flex-1">
              <Info className="w-4 h-4 mr-2" />
              Details
            </TabsTrigger>
            <TabsTrigger value="prompt" className="flex-1">
              <FileText className="w-4 h-4 mr-2" />
              Prompt
            </TabsTrigger>
            <TabsTrigger value="json" className="flex-1">
              <Code className="w-4 h-4 mr-2" />
              JSON
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <Card className="p-4 glass-card border-0 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Date</p>
                  <p className="font-medium">{currentResult.date}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Duration</p>
                  <p className="font-medium">{currentResult.duration}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  <p className="font-medium capitalize text-green-400">
                    {currentResult.status}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Quality</p>
                  <p className="font-medium capitalize">
                    {currentResult.settings.quality}
                  </p>
                </div>
              </div>
              <div className="border-t border-border pt-4">
                <p className="text-xs text-muted-foreground mb-2">Settings</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p>
                    Expression:{" "}
                    <span className="text-primary">
                      {currentResult.settings.expressionIntensity}%
                    </span>
                  </p>
                  <p>
                    Accuracy:{" "}
                    <span className="text-primary">
                      {currentResult.settings.mouthAccuracy}%
                    </span>
                  </p>
                  <p>
                    Emotion:{" "}
                    <span className="text-primary capitalize">
                      {currentResult.settings.emotion}
                    </span>
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="prompt">
            <Card className="p-4 glass-card border-0">
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {currentResult.prompt || "No prompt was used for this generation."}
              </p>
            </Card>
          </TabsContent>

          <TabsContent value="json">
            <Card className="p-4 glass-card border-0">
              <pre className="text-xs text-muted-foreground overflow-x-auto">
                {JSON.stringify(mockJsonResponse, null, 2)}
              </pre>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Generate Again Button */}
      <motion.div
        className="mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        <Button
          onClick={handleGenerateAgain}
          variant="secondary"
          className="w-full h-12 rounded-xl"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Generate Again
        </Button>
      </motion.div>
    </div>
  )
}
