"use client"

import { motion } from "framer-motion"
import { useAppStore } from "@/lib/store"
import {
  Wand2,
  FolderOpen,
  Key,
  Sparkles,
  User,
  Settings,
  Zap,
  TrendingUp,
  Clock,
} from "lucide-react"
import { Card } from "@/components/ui/card"

const menuCards = [
  {
    id: "create",
    title: "Create Lip Sync",
    description: "Generate a new AI lip sync video",
    icon: Wand2,
    gradient: "gradient-primary",
    page: "create" as const,
  },
  {
    id: "projects",
    title: "My Projects",
    description: "View your generated videos",
    icon: FolderOpen,
    gradient: "gradient-accent",
    page: "projects" as const,
  },
  {
    id: "settings",
    title: "API Settings",
    description: "Configure your Magnific API",
    icon: Key,
    gradient: "bg-secondary",
    page: "settings" as const,
  },
  {
    id: "templates",
    title: "Prompt Templates",
    description: "Quick-start with presets",
    icon: Sparkles,
    gradient: "bg-secondary",
    page: "create" as const,
  },
]

const quickStats = [
  { label: "Projects", value: "12", icon: FolderOpen },
  { label: "This Week", value: "5", icon: TrendingUp },
  { label: "Avg Time", value: "2m", icon: Clock },
]

const aiTips = [
  "Use high-resolution character images for better results",
  "Clear audio with minimal background noise works best",
  "Try different emotion settings for varied expressions",
  "Higher quality settings produce smoother lip movements",
]

export function Dashboard() {
  const { setCurrentPage, apiKey, projects } = useAppStore()

  return (
    <div className="min-h-screen pb-24 px-4">
      {/* Header */}
      <motion.header
        className="pt-6 pb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
              <User className="w-6 h-6 text-foreground" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Welcome back</p>
              <h2 className="font-semibold text-lg">Creator</h2>
            </div>
          </div>
          <button
            onClick={() => setCurrentPage("settings")}
            className="w-10 h-10 rounded-full glass-card flex items-center justify-center hover:bg-secondary transition-colors"
          >
            <Settings className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Credit Status */}
        <Card className="mt-4 p-4 glass-card border-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">API Status</p>
                <p className="font-medium">
                  {apiKey ? (
                    <span className="text-green-400">Connected</span>
                  ) : (
                    <span className="text-yellow-400">Not Configured</span>
                  )}
                </p>
              </div>
            </div>
            {!apiKey && (
              <button
                onClick={() => setCurrentPage("settings")}
                className="text-xs text-primary hover:underline"
              >
                Setup Now
              </button>
            )}
          </div>
        </Card>
      </motion.header>

      {/* Quick Stats */}
      <motion.div
        className="grid grid-cols-3 gap-3 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        {quickStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card
              key={stat.label}
              className="p-3 glass-card border-0 text-center"
            >
              <Icon className="w-4 h-4 text-primary mx-auto mb-1" />
              <p className="text-xl font-bold">
                {stat.label === "Projects" ? projects.length : stat.value}
              </p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </Card>
          )
        })}
      </motion.div>

      {/* Main Menu Cards */}
      <motion.div
        className="grid grid-cols-2 gap-4 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        {menuCards.map((card, index) => {
          const Icon = card.icon
          return (
            <motion.button
              key={card.id}
              onClick={() => setCurrentPage(card.page)}
              className="text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index + 0.2, duration: 0.4 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className={`p-4 h-full border-0 transition-all hover:scale-[1.02] ${
                  card.gradient.startsWith("gradient")
                    ? card.gradient
                    : card.gradient + " glass-card"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl mb-3 flex items-center justify-center ${
                    card.gradient.startsWith("gradient")
                      ? "bg-primary-foreground/20"
                      : "bg-primary/20"
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 ${
                      card.gradient.startsWith("gradient")
                        ? "text-primary-foreground"
                        : "text-primary"
                    }`}
                  />
                </div>
                <h3
                  className={`font-semibold mb-1 ${
                    card.gradient.startsWith("gradient")
                      ? "text-primary-foreground"
                      : ""
                  }`}
                >
                  {card.title}
                </h3>
                <p
                  className={`text-xs ${
                    card.gradient.startsWith("gradient")
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  }`}
                >
                  {card.description}
                </p>
              </Card>
            </motion.button>
          )
        })}
      </motion.div>

      {/* AI Tips Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          AI Tips
        </h3>
        <div className="space-y-2">
          {aiTips.slice(0, 2).map((tip, index) => (
            <Card
              key={index}
              className="p-3 glass-card border-0 text-sm text-muted-foreground"
            >
              {tip}
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Trending Templates */}
      <motion.div
        className="mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
      >
        <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          Trending Styles
        </h3>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
          {["Cinematic", "Natural", "News", "Social", "Corporate"].map(
            (style) => (
              <button
                key={style}
                onClick={() => setCurrentPage("create")}
                className="flex-shrink-0 px-4 py-2 rounded-xl glass-card text-sm hover:bg-primary/20 transition-colors"
              >
                {style}
              </button>
            )
          )}
        </div>
      </motion.div>
    </div>
  )
}
