"use client"

import { motion } from "framer-motion"
import { useAppStore } from "@/lib/store"
import { Home, PlusCircle, FolderOpen, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { id: "dashboard" as const, icon: Home, label: "Home" },
  { id: "create" as const, icon: PlusCircle, label: "Create" },
  { id: "projects" as const, icon: FolderOpen, label: "Projects" },
  { id: "settings" as const, icon: Settings, label: "Settings" },
]

export function BottomNavigation() {
  const { currentPage, setCurrentPage } = useAppStore()

  return (
    <motion.nav
      className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-2"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
    >
      <div className="glass-card rounded-2xl p-2 max-w-md mx-auto">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const isActive = currentPage === item.id
            const Icon = item.icon

            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={cn(
                  "relative flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary/10 rounded-xl"
                    transition={{ type: "spring", damping: 20, stiffness: 300 }}
                  />
                )}
                <Icon
                  className={cn(
                    "w-5 h-5 relative z-10 transition-transform",
                    isActive && "scale-110"
                  )}
                />
                <span className="text-xs font-medium relative z-10">
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </motion.nav>
  )
}
