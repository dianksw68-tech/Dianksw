"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Project {
  id: string
  thumbnail: string
  date: string
  duration: string
  status: "completed" | "processing" | "failed"
  prompt: string
  settings: LipSyncSettings
  videoUrl?: string
  taskId?: string
}

export interface LipSyncSettings {
  expressionIntensity: number
  mouthAccuracy: number
  emotion: string
  videoDuration: string
  quality: "fast" | "balanced" | "high"
}

export interface TTSSettings {
  voice: string
  language: string
}

interface AppState {
  // Navigation
  currentPage: "splash" | "dashboard" | "create" | "settings" | "projects" | "result"
  setCurrentPage: (page: AppState["currentPage"]) => void
  
  // API Settings
  apiKey: string
  setApiKey: (key: string) => void
  
  // Create Page State
  characterImage: string | null
  setCharacterImage: (image: string | null) => void
  
  audioFile: string | null
  audioFileName: string | null
  setAudioFile: (file: string | null, name: string | null) => void
  
  ttsText: string
  setTtsText: (text: string) => void
  
  ttsSettings: TTSSettings
  setTtsSettings: (settings: TTSSettings) => void
  
  lipSyncSettings: LipSyncSettings
  setLipSyncSettings: (settings: Partial<LipSyncSettings>) => void
  
  prompt: string
  setPrompt: (prompt: string) => void
  
  // Processing State
  isProcessing: boolean
  processingStep: number
  processingProgress: number
  setProcessing: (isProcessing: boolean, step?: number, progress?: number) => void
  
  // Projects
  projects: Project[]
  addProject: (project: Project) => void
  removeProject: (id: string) => void
  
  // Current Result
  currentResult: Project | null
  setCurrentResult: (result: Project | null) => void
  
  // Splash seen
  hasSeenSplash: boolean
  setHasSeenSplash: (seen: boolean) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Navigation
      currentPage: "splash",
      setCurrentPage: (page) => set({ currentPage: page }),
      
      // API Settings
      apiKey: "",
      setApiKey: (apiKey) => set({ apiKey }),
      
      // Create Page State
      characterImage: null,
      setCharacterImage: (characterImage) => set({ characterImage }),
      
      audioFile: null,
      audioFileName: null,
      setAudioFile: (audioFile, audioFileName) => set({ audioFile, audioFileName }),
      
      ttsText: "",
      setTtsText: (ttsText) => set({ ttsText }),
      
      ttsSettings: {
        voice: "alloy",
        language: "en-US",
      },
      setTtsSettings: (ttsSettings) => set({ ttsSettings }),
      
      lipSyncSettings: {
        expressionIntensity: 70,
        mouthAccuracy: 80,
        emotion: "neutral",
        videoDuration: "auto",
        quality: "balanced",
      },
      setLipSyncSettings: (settings) =>
        set((state) => ({
          lipSyncSettings: { ...state.lipSyncSettings, ...settings },
        })),
      
      prompt: "",
      setPrompt: (prompt) => set({ prompt }),
      
      // Processing State
      isProcessing: false,
      processingStep: 0,
      processingProgress: 0,
      setProcessing: (isProcessing, step = 0, progress = 0) =>
        set({ isProcessing, processingStep: step, processingProgress: progress }),
      
      // Projects
      projects: [],
      addProject: (project) =>
        set((state) => ({ projects: [project, ...state.projects] })),
      removeProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
        })),
      
      // Current Result
      currentResult: null,
      setCurrentResult: (currentResult) => set({ currentResult }),
      
      // Splash seen
      hasSeenSplash: false,
      setHasSeenSplash: (hasSeenSplash) => set({ hasSeenSplash }),
    }),
    {
      name: "lipsync-studio-storage",
      partialize: (state) => ({
        apiKey: state.apiKey,
        projects: state.projects,
        hasSeenSplash: state.hasSeenSplash,
        lipSyncSettings: state.lipSyncSettings,
        ttsSettings: state.ttsSettings,
      }),
    }
  )
)

// Prompt presets
export const promptPresets = [
  {
    name: "Cinematic Drama",
    prompt: "Cinematic lighting, dramatic expression, slight head movement, professional studio setting, 4K quality",
  },
  {
    name: "Natural Conversation",
    prompt: "Natural facial expressions, subtle movements, warm lighting, casual and relaxed mood",
  },
  {
    name: "News Anchor",
    prompt: "Professional demeanor, minimal movement, clear articulation, broadcast quality, neutral background",
  },
  {
    name: "Social Media",
    prompt: "Energetic expression, dynamic movements, trendy aesthetic, vibrant colors, engaging personality",
  },
  {
    name: "Corporate",
    prompt: "Professional appearance, confident expression, moderate gestures, clean background, business setting",
  },
]

// Demo projects - empty to avoid placeholder errors
export const demoProjects: Project[] = []
