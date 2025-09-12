"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Shield, Lock, Menu, Plus, Trash2, X } from "lucide-react"

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
  if (!inputValue.trim()) return;

  const newMessage: Message = {
    id: Date.now().toString(),
    text: inputValue,
    sender: "user",
    timestamp: new Date(),
  };

  setMessages((prev) => [...prev, newMessage]);
  const userText = inputValue;
  setInputValue("");
  setIsTyping(true);

  try {
    // Call your API route
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: "demo-user", message: userText }),
    });

    const data = await res.json();

    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      text: data.reply || "Sorry, I couldn’t generate a response.",
      sender: "ai",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, aiResponse]);
  } catch (err) {
    console.error(err);
    const errorMessage: Message = {
      id: (Date.now() + 2).toString(),
      text: "⚠️ Something went wrong. Please try again.",
      sender: "ai",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, errorMessage]);
  } finally {
    setIsTyping(false);
  }
};


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

  if (showOpeningAnimation) {
    return (
      <div className="flex items-center justify-center h-screen max-w-md mx-auto bg-background">
        <div className="text-center">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-foreground animate-powerful-entrance">Veyra AI</h1>
            <p className="text-lg text-muted-foreground animate-powerful-entrance-delay">
              Your confidential health companion
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-background border-x border-border relative">
      <div className="flex items-center justify-between p-4 bg-card border-b border-border shadow-sm">
        <Button variant="ghost" size="sm" onClick={() => setIsDrawerOpen(true)} className="p-2">
          <Menu className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Shield className="w-3 h-3" />
          <span>Confidential & Secure</span>
        </div>
        <Lock className="w-5 h-5 text-muted-foreground" />
      </div>

      {isDrawerOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsDrawerOpen(false)} />
          <div className="fixed left-0 top-0 h-full w-80 bg-card border-r border-border z-50 transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="text-xl font-bold text-card-foreground">Veyra AI</h2>
                <Button variant="ghost" size="sm" onClick={() => setIsDrawerOpen(false)} className="p-2">
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="p-4 border-b border-border">
                <Button
                  onClick={handleNewChat}
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  New Chat
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Previous Chats</h3>
                <div className="space-y-2">
                  {chatHistory.map((chat) => (
                    <div
                      key={chat.id}
                      className={`group p-3 rounded-lg bg-background hover:bg-muted cursor-pointer border border-border relative`}
                    >
                      <h4 className="font-medium text-sm text-card-foreground truncate pr-6">{chat.title}</h4>
                      <p className="text-xs text-muted-foreground truncate mt-1">{chat.lastMessage}</p>
                      <p className="text-xs text-muted-foreground mt-1">{chat.timestamp.toLocaleDateString()}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteHistory(chat.id)
                        }}
                        className="absolute top-2 right-2 p-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl shadow-sm ${
                message.sender === "user"
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-secondary text-secondary-foreground rounded-bl-md"
              } ${message.id.includes("welcome") && showWelcomeMessage ? "animate-message-pop" : ""}`}
            >
              <p className="text-sm leading-relaxed text-pretty">{message.text}</p>
              <p
                className={`text-xs mt-1 opacity-70 ${
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
            <div className="bg-secondary text-secondary-foreground px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
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

      <div className="p-4 bg-card border-t border-border">
        <div className="relative">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about sexual health..."
            className="resize-none bg-input border-border focus:ring-ring rounded-2xl px-4 py-3 pr-12 text-sm"
            disabled={isTyping}
          />
          {inputValue.trim() && (
            <Button
              onClick={handleSendMessage}
              disabled={isTyping}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl p-2 h-8 w-8 flex-shrink-0 animate-send-button-appear shadow-lg"
            >
              <Send className="w-4 h-4" />
            </Button>
          )}
        </div>

        <div className="mt-3 text-xs text-muted-foreground text-center text-pretty">
          <p className="flex items-center justify-center gap-1">
            <Shield className="w-3 h-3" />
            This is for informational purposes only. Always consult healthcare professionals for medical advice.
          </p>
        </div>
      </div>
    </div>
  )
}
