"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Shield, Menu, Plus, Trash2, X, Sun, Moon } from "lucide-react"

interface Message {
  id: string
  text: string
  sender: "user" | "ai"
  timestamp: Date
}

interface ChatHistory {
  id: string
  title: string
  lastMessage: string
  timestamp: Date
}

export default function VeyraChat() {
  const [showOpeningAnimation, setShowOpeningAnimation] = useState(true)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)

  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([
    {
      id: "1",
      title: "Birth Control Options",
      lastMessage: "What are the different types of birth control?",
      timestamp: new Date(Date.now() - 86400000), // 1 day ago
    },
    {
      id: "2",
      title: "STI Prevention",
      lastMessage: "How can I protect myself from STIs?",
      timestamp: new Date(Date.now() - 172800000), // 2 days ago
    },
    {
      id: "3",
      title: "Reproductive Health",
      lastMessage: "Questions about menstrual cycle",
      timestamp: new Date(Date.now() - 259200000), // 3 days ago
    },
  ])

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowOpeningAnimation(false)
      setTimeout(() => {
        setShowWelcomeMessage(true)
        const welcomeMessage: Message = {
          id: "welcome",
          text: "Hey there! 👋 I'm Veyra – your friendly AI confidant. Here, you can ask me anything about sex, intimacy, or relationships – no judgments, no awkwardness. Just real answers, tips, and guidance whenever you need. So… what's on your mind today?",
          sender: "ai",
          timestamp: new Date(),
        }
        setMessages([welcomeMessage])
      }, 100)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, newMessage])
    const userText = inputValue
    setInputValue("")
    setIsTyping(true)

    try {
      // Call your API route
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "demo-user", message: userText }),
      })

      const data = await res.json()

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: data.reply || "Sorry, I couldn't generate a response.",
        sender: "ai",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiResponse])
    } catch (err) {
      console.error(err)
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        text: "⚠️ Something went wrong. Please try again.",
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleNewChat = () => {
    const welcomeMessage: Message = {
      id: "welcome-new",
      text: "Hey there! 👋 I'm Veyra – your friendly AI confidant. Here, you can ask me anything about sex, intimacy, or relationships – no judgments, no awkwardness. Just real answers, tips, and guidance whenever you need. So… what's on your mind today?",
      sender: "ai",
      timestamp: new Date(),
    }
    setMessages([welcomeMessage])
    setIsDrawerOpen(false)
  }

  const handleDeleteHistory = (chatId: string) => {
    setChatHistory((prev) => prev.filter((chat) => chat.id !== chatId))
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    // Apply theme to document
    if (!isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [])

  if (showOpeningAnimation) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-background px-4">
        <div className="text-center max-w-md mx-auto">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground animate-powerful-entrance">
              Veyra AI
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-muted-foreground animate-powerful-entrance-delay">
              Your confidential health companion
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen w-full max-w-md lg:max-w-4xl xl:max-w-6xl mx-auto bg-background lg:border-x border-border relative">
      <div className="flex items-center justify-between p-3 md:p-4 lg:p-6 bg-card border-b border-border shadow-sm">
        <Button variant="ghost" size="sm" onClick={() => setIsDrawerOpen(true)} className="p-2 hover:bg-muted">
          <Menu className="w-5 h-5 md:w-6 md:h-6" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="relative flex items-center bg-muted rounded-full p-1 w-16 h-8">
            <div
              className={`absolute w-6 h-6 bg-background rounded-full shadow-md transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                isDarkMode ? "translate-x-8" : "translate-x-0"
              }`}
            />
            <button onClick={toggleTheme} className="relative z-10 flex items-center justify-between w-full px-1">
              <Sun
                className={`w-4 h-4 text-yellow-500 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                  isDarkMode ? "scale-75 rotate-180 opacity-50" : "scale-100 rotate-0 opacity-100"
                }`}
              />
              <Moon
                className={`w-4 h-4 text-blue-400 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                  isDarkMode ? "scale-100 rotate-0 opacity-100" : "scale-75 rotate-180 opacity-50"
                }`}
              />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs md:text-sm text-muted-foreground">
          <Shield className="w-3 h-3 md:w-4 md:h-4" />
          <span className="hidden sm:inline">Confidential & Secure</span>
          <span className="sm:hidden">Secure</span>
        </div>
      </div>

      {isDrawerOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsDrawerOpen(false)} />
          <div className="fixed left-0 top-0 h-full w-80 md:w-96 lg:w-[420px] bg-card border-r border-border z-50 transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 md:p-6 border-b border-border">
                <h2 className="text-xl md:text-2xl font-bold text-card-foreground">Veyra AI</h2>
                <div className="flex items-center gap-3">
                  <div className="relative flex items-center bg-muted rounded-full p-1 w-16 h-8">
                    <div
                      className={`absolute w-6 h-6 bg-background rounded-full shadow-md transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                        isDarkMode ? "translate-x-8" : "translate-x-0"
                      }`}
                    />
                    <button
                      onClick={toggleTheme}
                      className="relative z-10 flex items-center justify-between w-full px-1"
                    >
                      <Sun
                        className={`w-4 h-4 text-yellow-500 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                          isDarkMode ? "scale-75 rotate-180 opacity-50" : "scale-100 rotate-0 opacity-100"
                        }`}
                      />
                      <Moon
                        className={`w-4 h-4 text-blue-400 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                          isDarkMode ? "scale-100 rotate-0 opacity-100" : "scale-75 rotate-180 opacity-50"
                        }`}
                      />
                    </button>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsDrawerOpen(false)}
                    className="p-2 hover:bg-muted"
                  >
                    <X className="w-4 h-4 md:w-5 md:h-5" />
                  </Button>
                </div>
              </div>

              <div className="p-4 md:p-6 border-b border-border">
                <Button
                  onClick={handleNewChat}
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground flex items-center gap-2 py-3 md:py-4 text-sm md:text-base"
                >
                  <Plus className="w-4 h-4 md:w-5 md:h-5" />
                  New Chat
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 md:p-6">
                <h3 className="text-sm md:text-base font-medium text-muted-foreground mb-3 md:mb-4">Previous Chats</h3>
                <div className="space-y-2 md:space-y-3">
                  {chatHistory.map((chat) => (
                    <div
                      key={chat.id}
                      className="group p-3 md:p-4 rounded-lg bg-background hover:bg-muted cursor-pointer border border-border relative transition-colors duration-200"
                    >
                      <h4 className="font-medium text-sm md:text-base text-card-foreground truncate pr-6">
                        {chat.title}
                      </h4>
                      <p className="text-xs md:text-sm text-muted-foreground truncate mt-1">{chat.lastMessage}</p>
                      <p className="text-xs text-muted-foreground mt-1">{chat.timestamp.toLocaleDateString()}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteHistory(chat.id)
                        }}
                        className="absolute top-2 right-2 p-1 h-6 w-6 md:h-7 md:w-7 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="flex-1 overflow-y-auto p-3 md:p-4 lg:p-6 space-y-3 md:space-y-4">
        {messages.map((message, index) => (
          <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] md:max-w-[75%] lg:max-w-[65%] px-3 md:px-4 py-2 md:py-3 rounded-2xl shadow-sm ${
                message.sender === "user"
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-secondary text-secondary-foreground rounded-bl-md"
              } ${message.id.includes("welcome") && showWelcomeMessage ? "animate-message-pop" : ""}`}
            >
              <p className="text-sm md:text-base leading-relaxed text-pretty">{message.text}</p>
              <p
                className={`text-xs md:text-sm mt-1 opacity-70 ${
                  message.sender === "user" ? "text-primary-foreground" : "text-secondary-foreground"
                }`}
              >
                {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-secondary text-secondary-foreground px-3 md:px-4 py-2 md:py-3 rounded-2xl rounded-bl-md shadow-sm">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-secondary-foreground/60 rounded-full typing-dot"></div>
                <div className="w-2 h-2 bg-secondary-foreground/60 rounded-full typing-dot"></div>
                <div className="w-2 h-2 bg-secondary-foreground/60 rounded-full typing-dot"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 md:p-4 lg:p-6 bg-card border-t border-border">
        <div className="relative">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about sexual health..."
            className="resize-none bg-input border-border focus:ring-ring rounded-2xl px-4 md:px-5 py-3 md:py-4 pr-12 md:pr-14 text-sm md:text-base transition-all duration-200"
            disabled={isTyping}
          />
          {inputValue.trim() && (
            <Button
              onClick={handleSendMessage}
              disabled={isTyping}
              className="absolute right-2 md:right-3 top-1/2 transform -translate-y-1/2 bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl p-2 h-8 w-8 md:h-9 md:w-9 flex-shrink-0 animate-send-button-appear shadow-lg transition-all duration-200"
            >
              <Send className="w-4 h-4" />
            </Button>
          )}
        </div>

        <div className="mt-3 md:mt-4 text-xs md:text-sm text-muted-foreground text-center text-pretty">
          <p className="flex items-center justify-center gap-1 md:gap-2">
            <Shield className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
            <span className="leading-relaxed">
              This is for informational purposes only. Always consult healthcare professionals for medical advice.
            </span>
          </p>
        </div>
      </div>

      <div className="fixed bottom-8 right-8 z-30">
        <div className="relative w-20 h-20 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full animate-fluid-droplets">
            {/* Multiple animated droplet layers */}
            <div
              className="absolute inset-0 rounded-full animate-droplet-1"
              style={{
                background: `radial-gradient(circle at 30% 40%, #BEECFF 0%, transparent 50%),
                           radial-gradient(circle at 70% 60%, #E77EDC 0%, transparent 50%),
                           radial-gradient(circle at 50% 20%, #FF4C3E 0%, transparent 50%)`,
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                transform: "scale(0.65)",
                filter: "blur(0.5px)",
                opacity: 0.8,
              }}
            />
            <div
              className="absolute inset-0 rounded-full animate-droplet-2"
              style={{
                background: `radial-gradient(circle at 80% 30%, #00FF88 0%, transparent 50%),
                           radial-gradient(circle at 20% 70%, #FFD700 0%, transparent 50%),
                           radial-gradient(circle at 60% 80%, #FF6B35 0%, transparent 50%)`,
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                transform: "scale(0.65)",
                filter: "blur(0.3px)",
                opacity: 0.7,
              }}
            />
            <div
              className="absolute inset-0 rounded-full animate-droplet-3"
              style={{
                background: `radial-gradient(circle at 40% 80%, #8A2BE2 0%, transparent 50%),
                           radial-gradient(circle at 90% 50%, #BEECFF 0%, transparent 50%)`,
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                transform: "scale(0.65)",
                filter: "blur(0.4px)",
                opacity: 0.6,
              }}
            />
          </div>

          {/* Rotating text around the circle */}
          <div className="absolute inset-0 animate-spin-text" style={{ transform: "scale(1.6)" }}>
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <defs>
                <path id="text-circle" d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
              </defs>
              <text className="text-sm fill-white/80 font-serif">
                <textPath href="#text-circle" startOffset="0%">
                  v0 is amazing • v0 is amazing • v0 is amazing • v0 is amazing •
                </textPath>
              </text>
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
