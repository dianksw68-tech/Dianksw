"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useAppStore } from "@/lib/store"
import { Cpu, Upload, AudioLines, Wand2, Film } from "lucide-react"

const processingSteps = [
  { icon: Upload, label: "Uploading assets", description: "Preparing your files..." },
  { icon: AudioLines, label: "Processing audio", description: "Analyzing speech patterns..." },
  { icon: Wand2, label: "Generating lip sync", description: "AI magic in progress..." },
  { icon: Film, label: "Rendering video", description: "Creating final output..." },
]

export function ProcessingOverlay() {
  const { isProcessing, processingStep, processingProgress } = useAppStore()

  return (
    <AnimatePresence>
      {isProcessing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center px-6"
        >
          {/* GPU Animation */}
          <motion.div
            className="relative mb-8"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="w-24 h-24 rounded-3xl gradient-primary flex items-center justify-center neon-glow">
              <Cpu className="w-12 h-12 text-primary-foreground" />
            </div>
            
            {/* Orbiting particles */}
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-full bg-primary"
                style={{
                  top: "50%",
                  left: "50%",
                }}
                animate={{
                  x: [
                    Math.cos((i * Math.PI) / 2) * 50,
                    Math.cos((i * Math.PI) / 2 + Math.PI) * 50,
                    Math.cos((i * Math.PI) / 2) * 50,
                  ],
                  y: [
                    Math.sin((i * Math.PI) / 2) * 50,
                    Math.sin((i * Math.PI) / 2 + Math.PI) * 50,
                    Math.sin((i * Math.PI) / 2) * 50,
                  ],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "linear",
                }}
              />
            ))}
          </motion.div>

          {/* Progress percentage */}
          <motion.div
            className="text-5xl font-bold mb-4 neon-text"
            key={processingProgress}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {processingProgress}%
          </motion.div>

          {/* Progress bar */}
          <div className="w-full max-w-xs h-2 bg-secondary rounded-full overflow-hidden mb-8">
            <motion.div
              className="h-full gradient-primary"
              initial={{ width: 0 }}
              animate={{ width: `${processingProgress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>

          {/* Processing steps */}
          <div className="w-full max-w-sm space-y-3">
            {processingSteps.map((step, index) => {
              const Icon = step.icon
              const isActive = index === processingStep
              const isCompleted = index < processingStep

              return (
                <motion.div
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                    isActive
                      ? "glass-card bg-primary/10"
                      : isCompleted
                      ? "opacity-50"
                      : "opacity-30"
                  }`}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: isActive ? 1 : isCompleted ? 0.5 : 0.3 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isActive
                        ? "gradient-primary"
                        : isCompleted
                        ? "bg-green-500/20"
                        : "bg-secondary"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        isActive
                          ? "text-primary-foreground"
                          : isCompleted
                          ? "text-green-400"
                          : "text-muted-foreground"
                      }`}
                    />
                  </div>
                  <div>
                    <p
                      className={`font-medium text-sm ${
                        isActive ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {step.label}
                    </p>
                    {isActive && (
                      <motion.p
                        className="text-xs text-muted-foreground"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        {step.description}
                      </motion.p>
                    )}
                  </div>
                  {isCompleted && (
                    <motion.div
                      className="ml-auto"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-green-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )
            })}
          </div>

          {/* GPU Processing text */}
          <motion.p
            className="mt-8 text-sm text-muted-foreground flex items-center gap-2"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            GPU Processing Active
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
