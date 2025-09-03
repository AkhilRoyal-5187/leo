import { type NextRequest, NextResponse } from "next/server"
import { streamText } from "ai"
import { openai } from "@ai-sdk/openai" // Uses AI SDK provider. Replace or add others as needed. [^2]

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { message } = body as { message: string }

    // Fallback to mock streaming if no API key available
    if (!process.env.OPENAI_API_KEY) {
      const encoder = new TextEncoder()
      const stream = new ReadableStream({
        start(controller) {
          const chunks = [
            "Hello! I'm LEO AI streaming assistant. ",
            "I respond in real-time as you type. ",
            "Ask about courses, exams, coins or certificates. ",
            "How can I help you today?",
          ]
          let i = 0
          const interval = setInterval(() => {
            controller.enqueue(encoder.encode(chunks[i]))
            i++
            if (i >= chunks.length) {
              clearInterval(interval)
              controller.close()
            }
          }, 400)
        },
      })
      return new NextResponse(stream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-cache",
        },
      })
    }

    // Real streaming via AI SDK (OpenAI as an example) [^2]
    const result = await streamText({
      model: openai("gpt-4o"),
      system:
        "You are LEO AI, a helpful educational assistant. Be concise, friendly, and recommend next actions inside the LEO app.",
      prompt: `User: ${message}\nAssistant:`,
    })

    // Convert to a streaming response; pipe text deltas as they arrive.
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      start(controller) {
        result.onChunk(({ chunk }) => {
          if (chunk.type === "text-delta") {
            controller.enqueue(encoder.encode(chunk.text))
          }
        })
        result.onFinish(() => {
          controller.close()
        })
      },
      cancel() {
        // no-op
      },
    })

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    })
  } catch (e) {
    return NextResponse.json({ error: "AI streaming error" }, { status: 500 })
  }
}
