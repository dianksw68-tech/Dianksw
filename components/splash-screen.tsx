"use client"

import { motion } from "framer-motion"
import { useAppStore } from "@/lib/store"
import { Sparkles, Wand2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SplashScreen() {
  const { setCurrentPage, setHasSeenSplash } = useAppStore()

  const handleEnter = () => {
    setHasSeenSplash(true)
    setCurrentPage("dashboard")
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-6">
      {/* Animated background gradients */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-1/2 -left-1/2 w-full h-full rounded-full opacity-30"
          style={{
            background: "radial-gradient(circle, var(--neon-cyan) 0%, transparent 70%)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-1/2 -right-1/2 w-full h-full rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, var(--neon-purple) 0%, transparent 70%)",
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Logo and branding */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Animated logo icon */}
        <motion.div
          className="relative mb-8"
          animate={{
            rotateY: [0, 360],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <div className="w-24 h-24 rounded-3xl gradient-primary flex items-center justify-center pulse-glow">
            <Wand2 className="w-12 h-12 text-primary-foreground" />
          </div>
        </motion.div>

        {/* App name */}
        <motion.h1
          className="text-4xl md:text-5xl font-bold mb-3 neon-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          LipSync Studio
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-muted-foreground text-lg mb-2 flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <Sparkles className="w-5 h-5 text-primary" />
          AI Video Lip Sync Generator
          <Sparkles className="w-5 h-5 text-primary" />
        </motion.p>

        <motion.p
          className="text-muted-foreground/70 text-sm max-w-xs mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          Transform your characters into talking videos with cutting-edge AI technology
        </motion.p>

        {/* Enter button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9, duration: 0.4 }}
        >
          <Button
            onClick={handleEnter}
            size="lg"
            className="px-10 py-6 text-lg font-semibold gradient-primary hover:opacity-90 transition-all neon-glow rounded-2xl"
          >
            Enter App
          </Button>
        </motion.div>

        {/* Version badge */}
        <motion.div
          className="mt-8 px-4 py-2 rounded-full glass-card text-xs text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.4 }}
        >
          Version 1.0.0 Beta
        </motion.div>
      </motion.div>

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-primary/40"
          style={{
            left: `${20 + i * 12}%`,
            top: `${30 + (i % 3) * 20}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}
