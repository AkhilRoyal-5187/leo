"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AppLayout } from "@/components/app-layout"
import {
  MessageCircle,
  Phone,
  Mail,
  Search,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  ThumbsDown,
  Send,
  Bot,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface FAQ {
  id: number
  category: string
  question: string
  answer: string
  helpful: number
  notHelpful: number
}

interface ChatMessage {
  id: number
  type: "user" | "ai"
  message: string
  timestamp: string
  suggestions?: string[]
}

export default function HelpCenterPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      type: "ai",
      message: "Hello! I'm LEO AI, your educational assistant. How can I help you today?",
      timestamp: new Date().toISOString(),
      suggestions: [
        "Recommend me a course",
        "How to earn more coins?",
        "Study tips for exams",
        "Tell me about scholarships",
      ],
    },
  ])
  const [currentMessage, setCurrentMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  // Support ticket form
  const [ticketForm, setTicketForm] = useState({
    subject: "",
    description: "",
    category: "",
    priority: "Medium",
  })

  useEffect(() => {
    fetchFAQs()
  }, [activeCategory])

  const fetchFAQs = async () => {
    try {
      const response = await fetch(`/api/help?category=${activeCategory}`)
      const result = await response.json()
      if (result.success) {
        setFaqs(result.data.faqs)
        setCategories(result.data.categories)
      }
    } catch (error) {
      console.error("Error fetching FAQs:", error)
    }
  }

  const handleFAQRating = async (faqId: number, helpful: boolean) => {
    try {
      const response = await fetch("/api/help", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "rate_faq",
          faqId,
          helpful,
        }),
      })

      const result = await response.json()
      if (result.success) {
        fetchFAQs() // Refresh FAQs
      }
    } catch (error) {
      console.error("Error rating FAQ:", error)
    }
  }

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return

    const userMessage: ChatMessage = {
      id: chatMessages.length + 1,
      type: "user",
      message: currentMessage,
      timestamp: new Date().toISOString(),
    }

    setChatMessages((prev) => [...prev, userMessage])
    const placeholderId = chatMessages.length + 2
    const aiPlaceholder: ChatMessage = {
      id: placeholderId,
      type: "ai",
      message: "",
      timestamp: new Date().toISOString(),
      suggestions: [],
    }
    setChatMessages((prev) => [...prev, aiPlaceholder])
    setCurrentMessage("")
    setIsTyping(true)

    try {
      const res = await fetch("/api/ai/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.message }),
      })

      if (!res.body) {
        // Fallback (non-stream)
        const text = await res.text()
        setChatMessages((prev) => prev.map((m) => (m.id === placeholderId ? { ...m, message: text } : m)))
      } else {
        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let done = false
        let acc = ""

        while (!done) {
          const { value, done: d } = await reader.read()
          done = d
          if (value) {
            const chunk = decoder.decode(value)
            acc += chunk
            setChatMessages((prev) => prev.map((m) => (m.id === placeholderId ? { ...m, message: acc } : m)))
          }
        }
      }
    } catch (error) {
      console.error("Error streaming AI:", error)
      setChatMessages((prev) =>
        prev.map((m) =>
          m.id === placeholderId
            ? {
                ...m,
                message: "Sorry, I had trouble responding. Please try again.",
              }
            : m,
        ),
      )
    } finally {
      setIsTyping(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setCurrentMessage(suggestion)
    handleSendMessage()
  }

  const handleSubmitTicket = async () => {
    try {
      const response = await fetch("/api/help", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "create_ticket",
          userId: 1,
          ...ticketForm,
        }),
      })

      const result = await response.json()
      if (result.success) {
        alert("Support ticket created successfully!")
        setTicketForm({
          subject: "",
          description: "",
          category: "",
          priority: "Medium",
        })
      }
    } catch (error) {
      console.error("Error creating ticket:", error)
    }
  }

  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <AppLayout>
      <div className="p-4 md:p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Help Center</h1>
          <p className="text-muted-foreground">Get help and support for your LEO journey</p>
        </div>

        <Tabs defaultValue="faq">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="chat">AI Support</TabsTrigger>
            <TabsTrigger value="ticket">Report Issue</TabsTrigger>
            <TabsTrigger value="contact">Contact Us</TabsTrigger>
          </TabsList>

          <TabsContent value="faq" className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search FAQs..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={activeCategory} onValueChange={setActiveCategory}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category.toLowerCase()}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              {filteredFAQs.map((faq) => (
                <Card key={faq.id} className="border-0 shadow-md">
                  <CardContent className="p-0">
                    <button
                      className="w-full p-4 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
                      onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                    >
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-xs">
                          {faq.category}
                        </Badge>
                        <span className="font-medium">{faq.question}</span>
                      </div>
                      {expandedFAQ === faq.id ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </button>

                    {expandedFAQ === faq.id && (
                      <div className="px-4 pb-4 border-t">
                        <p className="text-muted-foreground mt-3 mb-4">{faq.answer}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Was this helpful?</span>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleFAQRating(faq.id, true)}
                              className="flex items-center gap-1"
                            >
                              <ThumbsUp className="h-4 w-4" />
                              <span>{faq.helpful}</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleFAQRating(faq.id, false)}
                              className="flex items-center gap-1"
                            >
                              <ThumbsDown className="h-4 w-4" />
                              <span>{faq.notHelpful}</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="chat" className="space-y-6">
            <Card className="border-0 shadow-md h-[600px] flex flex-col">
              <div className="p-4 border-b bg-gradient-to-r from-violet-50 to-blue-50 dark:from-violet-900/20 dark:to-blue-900/20">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 flex items-center justify-center">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium">LEO AI Assistant</h3>
                    <p className="text-sm text-muted-foreground">Always here to help</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.type === "user" ? "bg-gradient-to-r from-violet-600 to-blue-600 text-white" : "bg-muted"
                      }`}
                    >
                      <p className="text-sm">{message.message}</p>
                      {message.suggestions && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {message.suggestions.map((suggestion, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className="text-xs h-7 bg-transparent"
                              onClick={() => handleSuggestionClick(suggestion)}
                            >
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {chatMessages.some((message) => message.id === chatMessages.length && message.message === "") && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg p-3">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder="Ask LEO AI anything..."
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <Button
                    onClick={handleSendMessage}
                    className="bg-gradient-to-r from-violet-600 to-blue-600 text-white hover:from-violet-700 hover:to-blue-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="ticket" className="space-y-6">
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <h3 className="font-medium mb-4">Report an Issue</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Subject</label>
                    <Input
                      placeholder="Brief description of your issue"
                      value={ticketForm.subject}
                      onChange={(e) => setTicketForm((prev) => ({ ...prev, subject: e.target.value }))}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Category</label>
                      <Select
                        value={ticketForm.category}
                        onValueChange={(value) => setTicketForm((prev) => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Priority</label>
                      <Select
                        value={ticketForm.priority}
                        onValueChange={(value) => setTicketForm((prev) => ({ ...prev, priority: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Description</label>
                    <Textarea
                      placeholder="Please provide detailed information about your issue..."
                      rows={5}
                      value={ticketForm.description}
                      onChange={(e) => setTicketForm((prev) => ({ ...prev, description: e.target.value }))}
                    />
                  </div>

                  <Button
                    onClick={handleSubmitTicket}
                    className="w-full bg-gradient-to-r from-violet-600 to-blue-600 text-white hover:from-violet-700 hover:to-blue-700"
                  >
                    Submit Ticket
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-0 shadow-md">
                <CardContent className="p-6 text-center">
                  <div className="h-12 w-12 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                  </div>
                  <h3 className="font-medium mb-2">Live Chat</h3>
                  <p className="text-sm text-muted-foreground mb-4">Chat with our support team in real-time</p>
                  <Button variant="outline" className="w-full bg-transparent">
                    Start Chat
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardContent className="p-6 text-center">
                  <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-4">
                    <Phone className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-medium mb-2">Phone Support</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Call us: +1 (555) 123-4567
                    <br />
                    Mon-Fri, 9 AM - 6 PM
                  </p>
                  <Button variant="outline" className="w-full bg-transparent">
                    Call Now
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardContent className="p-6 text-center">
                  <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                    <Mail className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-medium mb-2">Email Support</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Send us an email at
                    <br />
                    support@leo.edu
                  </p>
                  <Button variant="outline" className="w-full bg-transparent">
                    Send Email
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
