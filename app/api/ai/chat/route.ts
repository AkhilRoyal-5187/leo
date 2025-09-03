import { type NextRequest, NextResponse } from "next/server"

// Mock AI responses - in production, integrate with actual AI service
const aiResponses = {
  greetings: [
    "Hello! I'm LEO AI, your educational assistant. How can I help you today?",
    "Hi there! I'm here to help you with your learning journey. What would you like to know?",
    "Welcome! I'm LEO AI. I can help you with courses, assignments, or any educational questions.",
  ],
  courseRecommendations: {
    mathematics:
      "Based on your profile, I recommend starting with 'Advanced Mathematics' by Dr. Sarah Johnson. It covers calculus and algebra fundamentals that will help you excel in higher-level math.",
    physics:
      "For physics, I suggest 'Physics Fundamentals' by Prof. Michael Chen. It's perfect for building a strong foundation in mechanics and thermodynamics.",
    general:
      "I recommend exploring our most popular courses: Advanced Mathematics, Physics Fundamentals, and Chemistry Basics. These provide excellent foundational knowledge.",
  },
  studyTips: [
    "Here are some effective study tips: 1) Create a consistent study schedule, 2) Take regular breaks using the Pomodoro technique, 3) Practice active recall, 4) Join study groups, 5) Use visual aids and mind maps.",
    "To improve your learning: Set specific goals, eliminate distractions, teach concepts to others, use spaced repetition, and regularly review your progress on the LEO platform.",
    "Effective study strategies include: Breaking complex topics into smaller chunks, using multiple learning modalities, practicing regularly, seeking help when needed, and maintaining a healthy study-life balance.",
  ],
  examPrep: [
    "For exam preparation: Review your course materials, take practice quizzes, create summary notes, form study groups, and ensure you get adequate rest before exams.",
    "Exam success tips: Start preparation early, understand the exam format, practice time management, focus on weak areas, and stay calm during the exam.",
    "To excel in exams: Create a study timeline, use active learning techniques, take mock tests, review mistakes, and maintain confidence in your abilities.",
  ],
}

function getAIResponse(message: string): string {
  const lowerMessage = message.toLowerCase()

  // Greetings
  if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey")) {
    return aiResponses.greetings[Math.floor(Math.random() * aiResponses.greetings.length)]
  }

  // Course recommendations
  if (lowerMessage.includes("recommend") && lowerMessage.includes("course")) {
    if (lowerMessage.includes("math")) {
      return aiResponses.courseRecommendations.mathematics
    } else if (lowerMessage.includes("physics")) {
      return aiResponses.courseRecommendations.physics
    } else {
      return aiResponses.courseRecommendations.general
    }
  }

  // Study tips
  if (lowerMessage.includes("study") && (lowerMessage.includes("tip") || lowerMessage.includes("help"))) {
    return aiResponses.studyTips[Math.floor(Math.random() * aiResponses.studyTips.length)]
  }

  // Exam preparation
  if (lowerMessage.includes("exam") || lowerMessage.includes("test") || lowerMessage.includes("quiz")) {
    return aiResponses.examPrep[Math.floor(Math.random() * aiResponses.examPrep.length)]
  }

  // Scholarship information
  if (lowerMessage.includes("scholarship")) {
    return "We offer several scholarships including LEO Excellence Scholarship (₹50,000), STEM Innovation Scholarship (₹75,000), and Need-based Support Scholarship (₹30,000). Check the scholarships section for eligibility criteria and application details."
  }

  // Internship information
  if (lowerMessage.includes("internship")) {
    return "We have exciting internship opportunities in Software Development, Data Science, and Digital Marketing. Visit the internships section to explore available positions and apply directly through the platform."
  }

  // LEO Coins
  if (lowerMessage.includes("coin") || lowerMessage.includes("earn")) {
    return "You can earn LEO Coins by: Completing courses (120+ coins), passing quizzes (50+ coins), watching videos (25 coins each), participating in competitions, and referring friends. Use coins to purchase items from the LEO Store!"
  }

  // Default response
  return "I'm here to help you with your educational journey! You can ask me about course recommendations, study tips, exam preparation, scholarships, internships, or how to earn LEO Coins. What specific topic would you like to explore?"
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, userId } = body

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const aiResponse = getAIResponse(message)

    // Log conversation for analytics (in production, store in database)
    const conversation = {
      id: Date.now(),
      userId: userId || "anonymous",
      userMessage: message,
      aiResponse,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      data: {
        response: aiResponse,
        conversationId: conversation.id,
        suggestions: [
          "Recommend me a course",
          "How to earn more coins?",
          "Study tips for exams",
          "Tell me about scholarships",
        ],
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
