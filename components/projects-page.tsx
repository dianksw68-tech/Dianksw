"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAppStore, demoProjects, type Project } from "@/lib/store"
import {
  ArrowLeft,
  Search,
  Filter,
  Play,
  Trash2,
  RefreshCw,
  Clock,
  CheckCircle,
  Loader2,
  XCircle,
  FolderOpen,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

const filterOptions = ["all", "completed", "processing", "failed"] as const

export function ProjectsPage() {
  const {
    projects,
    removeProject,
    setCurrentPage,
    setCurrentResult,
    setCharacterImage,
    setPrompt,
    setLipSyncSettings,
  } = useAppStore()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<(typeof filterOptions)[number]>("all")
  const [showFilters, setShowFilters] = useState(false)

  // Combine user projects with demo projects for display
  const allProjects = useMemo(() => {
    return [...projects, ...demoProjects]
  }, [projects])

  const filteredProjects = useMemo(() => {
    return allProjects.filter((project) => {
      const matchesSearch =
        project.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.id.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesFilter =
        activeFilter === "all" || project.status === activeFilter
      return matchesSearch && matchesFilter
    })
  }, [allProjects, searchQuery, activeFilter])

  const handleViewProject = (project: Project) => {
    setCurrentResult(project)
    setCurrentPage("result")
  }

  const handleReuseProject = (project: Project) => {
    if (project.thumbnail) {
      setCharacterImage(project.thumbnail)
    }
    setPrompt(project.prompt)
    setLipSyncSettings(project.settings)
    setCurrentPage("create")
    toast({
      title: "Settings Loaded",
      description: "Project settings have been loaded. Ready to generate!",
    })
  }

  const handleDeleteProject = (projectId: string) => {
    removeProject(projectId)
    toast({
      title: "Project Deleted",
      description: "The project has been removed from your history.",
    })
  }

  const getStatusIcon = (status: Project["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case "processing":
        return <Loader2 className="w-4 h-4 text-yellow-400 animate-spin" />
      case "failed":
        return <XCircle className="w-4 h-4 text-red-400" />
    }
  }

  const getStatusColor = (status: Project["status"]) => {
    switch (status) {
      case "completed":
        return "text-green-400"
      case "processing":
        return "text-yellow-400"
      case "failed":
        return "text-red-400"
    }
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
            <h1 className="text-2xl font-bold">My Projects</h1>
            <p className="text-sm text-muted-foreground">
              {allProjects.length} total projects
            </p>
          </div>
        </div>
      </motion.header>

      {/* Search and Filter */}
      <motion.div
        className="mb-6 space-y-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-input border-0 h-11 rounded-xl"
            />
          </div>
          <Button
            variant="secondary"
            onClick={() => setShowFilters(!showFilters)}
            className={`rounded-xl ${showFilters ? "bg-primary/20" : ""}`}
          >
            <Filter className="w-4 h-4" />
          </Button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex gap-2 overflow-x-auto pb-2"
            >
              {filterOptions.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm capitalize transition-all ${
                    activeFilter === filter
                      ? "gradient-primary text-primary-foreground"
                      : "bg-secondary hover:bg-secondary/80"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 + 0.2, duration: 0.4 }}
            >
              <Card className="glass-card border-0 overflow-hidden">
                <div className="flex">
                  {/* Thumbnail */}
                  <div
                    className="relative w-28 h-28 flex-shrink-0 bg-secondary cursor-pointer"
                    onClick={() => handleViewProject(project)}
                  >
                    {project.thumbnail ? (
                      <img
                        src={project.thumbnail}
                        alt="Project thumbnail"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Play className="w-8 h-8 text-muted-foreground/30" />
                      </div>
                    )}
                    {project.status === "completed" && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                        <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                          <Play className="w-5 h-5 text-primary-foreground ml-0.5" />
                        </div>
                      </div>
                    )}
                    <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/60 text-[10px]">
                      {project.duration}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {getStatusIcon(project.status)}
                        <span
                          className={`text-xs capitalize ${getStatusColor(
                            project.status
                          )}`}
                        >
                          {project.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {project.prompt || "No prompt"}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {project.date}
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleReuseProject(project)}
                          className="p-2 rounded-lg hover:bg-secondary transition-colors"
                          title="Reuse settings"
                        >
                          <RefreshCw className="w-4 h-4 text-primary" />
                        </button>
                        {!project.id.startsWith("demo-") && (
                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            className="p-2 rounded-lg hover:bg-destructive/20 transition-colors"
                            title="Delete project"
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          className="flex flex-col items-center justify-center py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-4">
            <FolderOpen className="w-10 h-10 text-muted-foreground/50" />
          </div>
          <h3 className="font-semibold mb-2">No Projects Found</h3>
          <p className="text-sm text-muted-foreground text-center mb-6">
            {searchQuery || activeFilter !== "all"
              ? "Try adjusting your search or filters"
              : "Create your first lip sync video to get started"}
          </p>
          <Button
            onClick={() => setCurrentPage("create")}
            className="gradient-primary hover:opacity-90 rounded-xl"
          >
            Create New Project
          </Button>
        </motion.div>
      )}
    </div>
  )
}
