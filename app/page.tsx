"use client"

import { useEffect } from "react"
import { useAppStore } from "@/lib/store"
import { SplashScreen } from "@/components/splash-screen"
import { Dashboard } from "@/components/dashboard"
import { SettingsPage } from "@/components/settings-page"
import { CreateLipSyncPage } from "@/components/create-lipsync-page"
import { ResultPage } from "@/components/result-page"
import { ProjectsPage } from "@/components/projects-page"
import { BottomNavigation } from "@/components/bottom-navigation"
import { Toaster } from "@/components/ui/toaster"
import { AnimatePresence, motion } from "framer-motion"

export default function LipSyncStudioApp() {
  const { currentPage, hasSeenSplash, setCurrentPage } = useAppStore()

  // If user has already seen splash, go to dashboard
  useEffect(() => {
    if (hasSeenSplash && currentPage === "splash") {
      setCurrentPage("dashboard")
    }
  }, [hasSeenSplash, currentPage, setCurrentPage])

  const renderPage = () => {
    switch (currentPage) {
      case "splash":
        return <SplashScreen key="splash" />
      case "dashboard":
        return <Dashboard key="dashboard" />
      case "settings":
        return <SettingsPage key="settings" />
      case "create":
        return <CreateLipSyncPage key="create" />
      case "result":
        return <ResultPage key="result" />
      case "projects":
        return <ProjectsPage key="projects" />
      default:
        return <Dashboard key="dashboard" />
    }
  }

  const showNavigation = currentPage !== "splash" && currentPage !== "result"

  return (
    <main className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {renderPage()}
        </motion.div>
      </AnimatePresence>
      
      {showNavigation && <BottomNavigation />}
      <Toaster />
    </main>
  )
}
