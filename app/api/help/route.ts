import { type NextRequest, NextResponse } from "next/server"

// Mock database for help center
const helpData = {
  faqs: [
    {
      id: 1,
      category: "General",
      question: "How do I get started with LEO?",
      answer:
        "To get started with LEO, simply create an account, complete your profile, and explore our course catalog. You can start with free courses and earn LEO Coins as you progress.",
      helpful: 45,
      notHelpful: 3,
    },
    {
      id: 2,
      category: "LEO Coins",
      question: "How can I earn LEO Coins?",
      answer:
        "You can earn LEO Coins by completing courses, passing quizzes, watching educational videos, participating in competitions, and referring friends to the platform.",
      helpful: 52,
      notHelpful: 1,
    },
    {
      id: 3,
      category: "Courses",
      question: "Can I access courses offline?",
      answer:
        "Currently, courses require an internet connection. However, you can download course materials and notes for offline study.",
      helpful: 28,
      notHelpful: 8,
    },
    {
      id: 4,
      category: "Technical",
      question: "I'm having trouble playing videos. What should I do?",
      answer:
        "If you're experiencing video playback issues, try refreshing the page, clearing your browser cache, or switching to a different browser. If the problem persists, contact our technical support.",
      helpful: 35,
      notHelpful: 5,
    },
    {
      id: 5,
      category: "Scholarships",
      question: "How do I apply for scholarships?",
      answer:
        "Visit the Scholarships section, review the eligibility criteria, prepare required documents, and submit your application before the deadline. You'll receive updates on your application status via email.",
      helpful: 41,
      notHelpful: 2,
    },
  ],
  tickets: [
    {
      id: 1,
      userId: 1,
      subject: "Unable to access purchased course",
      description: "I purchased the Advanced Mathematics course but cannot access the videos.",
      category: "Technical",
      priority: "High",
      status: "Open",
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-01-15T10:30:00Z",
      responses: [],
    },
  ],
  categories: ["General", "LEO Coins", "Courses", "Technical", "Scholarships", "Internships", "Account"],
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")
  const ticketId = searchParams.get("ticketId")
  const userId = searchParams.get("userId")

  if (ticketId) {
    const ticket = helpData.tickets.find((t) => t.id === Number.parseInt(ticketId))
    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: ticket,
    })
  }

  if (userId) {
    const userTickets = helpData.tickets.filter((t) => t.userId === Number.parseInt(userId))
    return NextResponse.json({
      success: true,
      data: userTickets,
    })
  }

  let filteredFAQs = helpData.faqs
  if (category && category !== "all") {
    filteredFAQs = helpData.faqs.filter((faq) => faq.category.toLowerCase() === category.toLowerCase())
  }

  return NextResponse.json({
    success: true,
    data: {
      faqs: filteredFAQs,
      categories: helpData.categories,
    },
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, userId, subject, description, category, priority, faqId, helpful } = body

    if (action === "create_ticket") {
      const newTicket = {
        id: helpData.tickets.length + 1,
        userId: Number.parseInt(userId),
        subject,
        description,
        category,
        priority: priority || "Medium",
        status: "Open",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        responses: [],
      }

      helpData.tickets.push(newTicket)

      return NextResponse.json({
        success: true,
        data: {
          message: "Support ticket created successfully",
          ticket: newTicket,
        },
      })
    }

    if (action === "rate_faq") {
      const faq = helpData.faqs.find((f) => f.id === Number.parseInt(faqId))
      if (!faq) {
        return NextResponse.json({ error: "FAQ not found" }, { status: 404 })
      }

      if (helpful) {
        faq.helpful += 1
      } else {
        faq.notHelpful += 1
      }

      return NextResponse.json({
        success: true,
        data: {
          message: "Thank you for your feedback",
          faq,
        },
      })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
