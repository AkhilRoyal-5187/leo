import { type NextRequest, NextResponse } from "next/server"

// Mock database - in production, use a real database
const coinsData = {
  users: [
    {
      id: 1,
      name: "Alex Johnson",
      email: "alex.johnson@example.com",
      totalCoins: 2450,
      transactions: [
        {
          id: 1,
          type: "credit",
          amount: 250,
          description: "Course Completion Reward - Advanced Mathematics",
          date: new Date().toISOString(),
          source: "course_completion",
          courseId: 1,
        },
        {
          id: 2,
          type: "debit",
          amount: 120,
          description: "Premium Backpack Purchase",
          date: new Date(Date.now() - 86400000).toISOString(),
          source: "store_purchase",
          productId: 1,
        },
        {
          id: 3,
          type: "credit",
          amount: 100,
          description: "Quiz Competition Winner - Physics Quiz",
          date: new Date(Date.now() - 172800000).toISOString(),
          source: "quiz_completion",
          quizId: 1,
        },
      ],
    },
  ],
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId") || "1"

  const user = coinsData.users.find((u) => u.id === Number.parseInt(userId))

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  return NextResponse.json({
    success: true,
    data: {
      totalCoins: user.totalCoins,
      transactions: user.transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    },
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, type, amount, description, source, metadata } = body

    if (!userId || !type || !amount || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const user = coinsData.users.find((u) => u.id === Number.parseInt(userId))
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Create new transaction
    const newTransaction = {
      id: user.transactions.length + 1,
      type,
      amount: Number.parseInt(amount),
      description,
      date: new Date().toISOString(),
      source,
      ...metadata,
    }

    // Update user balance
    if (type === "credit") {
      user.totalCoins += Number.parseInt(amount)
    } else if (type === "debit") {
      if (user.totalCoins < Number.parseInt(amount)) {
        return NextResponse.json({ error: "Insufficient coins" }, { status: 400 })
      }
      user.totalCoins -= Number.parseInt(amount)
    }

    user.transactions.push(newTransaction)

    return NextResponse.json({
      success: true,
      data: {
        transaction: newTransaction,
        newBalance: user.totalCoins,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
