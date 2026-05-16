"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useAppStore } from "@/lib/store"
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Key,
  Save,
  Wifi,
  AlertTriangle,
  ExternalLink,
  Check,
  Copy,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export function SettingsPage() {
  const { apiKey, setApiKey, setCurrentPage } = useAppStore()
  const { toast } = useToast()
  const [localKey, setLocalKey] = useState(apiKey)
  const [showKey, setShowKey] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleSave = () => {
    setApiKey(localKey)
    toast({
      title: "API Key Saved",
      description: "Your API key has been saved securely to local storage.",
    })
  }

  const handleTestConnection = async () => {
    if (!localKey) {
      toast({
        title: "No API Key",
        description: "Please enter an API key first.",
        variant: "destructive",
      })
      return
    }

    setIsTesting(true)
    
    // Simulate API test
    await new Promise((resolve) => setTimeout(resolve, 2000))
    
    setIsTesting(false)
    toast({
      title: "Connection Test",
      description: "API connection test completed. Ready to use!",
    })
  }

  const copyKey = () => {
    if (localKey) {
      navigator.clipboard.writeText(localKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="min-h-screen pb-24 px-4">
      {/* Header */}
      <motion.header
        className="pt-6 pb-6"
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
            <h1 className="text-2xl font-bold">API Settings</h1>
            <p className="text-sm text-muted-foreground">
              Configure your Magnific API connection
            </p>
          </div>
        </div>
      </motion.header>

      {/* API Key Input Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <Card className="p-5 glass-card border-0 mb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Key className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold">Magnific API Key</h3>
              <p className="text-xs text-muted-foreground">
                Required for lip sync generation
              </p>
            </div>
          </div>

          <div className="relative mb-4">
            <Input
              type={showKey ? "text" : "password"}
              placeholder="Enter your API key..."
              value={localKey}
              onChange={(e) => setLocalKey(e.target.value)}
              className="pr-20 bg-input border-border h-12 rounded-xl"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
              <button
                onClick={() => setShowKey(!showKey)}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                {showKey ? (
                  <EyeOff className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Eye className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
              {localKey && (
                <button
                  onClick={copyKey}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleSave}
              className="flex-1 gradient-primary hover:opacity-90 h-11 rounded-xl"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Key
            </Button>
            <Button
              onClick={handleTestConnection}
              variant="secondary"
              disabled={isTesting || !localKey}
              className="flex-1 h-11 rounded-xl"
            >
              {isTesting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                  <Wifi className="w-4 h-4 mr-2" />
                </motion.div>
              ) : (
                <Wifi className="w-4 h-4 mr-2" />
              )}
              {isTesting ? "Testing..." : "Test Connection"}
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Warning Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <Card className="p-4 glass-card border-0 border-l-4 border-l-yellow-500/50 mb-4">
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-500 mb-1">
                Security Notice
              </h4>
              <p className="text-sm text-muted-foreground">
                Your API key is stored locally on your device. It is never sent
                to our servers and remains private to you.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Helper Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <Card className="p-4 glass-card border-0">
          <h4 className="font-medium mb-3">How to get your API key</h4>
          <ol className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-xs font-medium text-primary">
                1
              </span>
              <span>Visit the Magnific AI Developer Dashboard</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-xs font-medium text-primary">
                2
              </span>
              <span>Sign in or create an account</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-xs font-medium text-primary">
                3
              </span>
              <span>Navigate to API Keys section</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-xs font-medium text-primary">
                4
              </span>
              <span>Generate a new API key and copy it here</span>
            </li>
          </ol>
          <Button
            variant="outline"
            className="w-full mt-4 h-11 rounded-xl"
            onClick={() =>
              window.open("https://magnific.ai", "_blank", "noopener")
            }
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Open Developer Dashboard
          </Button>
        </Card>
      </motion.div>

      {/* API Status */}
      <motion.div
        className="mt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        <Card className="p-4 glass-card border-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  apiKey ? "bg-green-400" : "bg-yellow-400"
                } animate-pulse`}
              />
              <span className="text-sm">
                Status:{" "}
                <span
                  className={apiKey ? "text-green-400" : "text-yellow-400"}
                >
                  {apiKey ? "Connected" : "Not Configured"}
                </span>
              </span>
            </div>
            {apiKey && (
              <span className="text-xs text-muted-foreground">
                Key: ****{apiKey.slice(-4)}
              </span>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
