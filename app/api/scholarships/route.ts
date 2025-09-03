import { type NextRequest, NextResponse } from "next/server"

// Mock database
const scholarshipsData = {
  scholarships: [
    {
      id: 1,
      title: "LEO Excellence Scholarship",
      amount: "₹50,000",
      description: "Merit-based scholarship for top-performing students in academics and extracurricular activities.",
      eligibility: [
        "Minimum 85% in previous academic year",
        "Active participation in LEO platform",
        "Completed at least 5 courses with distinction",
        "Strong leadership qualities",
      ],
      requirements: [
        "Academic transcripts",
        "LEO platform activity report",
        "Essay on future goals (500 words)",
        "Two recommendation letters",
      ],
      applicationDeadline: "2024-03-31",
      resultsDate: "2024-04-30",
      category: "Merit-based",
      level: "All Classes",
      availableSlots: 10,
      appliedCount: 25,
      status: "Open",
    },
    {
      id: 2,
      title: "STEM Innovation Scholarship",
      amount: "₹75,000",
      description:
        "Scholarship for students showing exceptional promise in Science, Technology, Engineering, and Mathematics.",
      eligibility: [
        "Enrolled in STEM subjects",
        "Minimum 90% in Mathematics and Science",
        "Completed advanced STEM courses on LEO",
        "Demonstrated innovation through projects",
      ],
      requirements: [
        "Academic records in STEM subjects",
        "Portfolio of STEM projects",
        "Research proposal (1000 words)",
        "Faculty recommendation",
      ],
      applicationDeadline: "2024-04-15",
      resultsDate: "2024-05-15",
      category: "STEM",
      level: "Class 9-12",
      availableSlots: 5,
      appliedCount: 18,
      status: "Open",
    },
    {
      id: 3,
      title: "Need-based Support Scholarship",
      amount: "₹30,000",
      description: "Financial assistance for deserving students from economically disadvantaged backgrounds.",
      eligibility: [
        "Family income below ₹3,00,000 per annum",
        "Minimum 75% academic performance",
        "Regular attendance on LEO platform",
        "Community service involvement",
      ],
      requirements: [
        "Income certificate",
        "Academic transcripts",
        "Personal statement",
        "Community service certificates",
      ],
      applicationDeadline: "2024-02-28",
      resultsDate: "2024-03-31",
      category: "Need-based",
      level: "All Classes",
      availableSlots: 20,
      appliedCount: 42,
      status: "Open",
    },
  ],
  applications: [
    {
      id: 1,
      userId: 1,
      scholarshipId: 1,
      status: "Under Review",
      appliedDate: "2024-01-20",
      documents: [
        { name: "Academic Transcripts", url: "/placeholder-transcript.pdf" },
        { name: "Essay", url: "/placeholder-essay.pdf" },
      ],
      essay: "My future goals include becoming a software engineer and contributing to educational technology...",
      expectedAmount: "₹50,000",
    },
  ],
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const scholarshipId = searchParams.get("scholarshipId")
  const userId = searchParams.get("userId")
  const category = searchParams.get("category")

  if (scholarshipId) {
    const scholarship = scholarshipsData.scholarships.find((s) => s.id === Number.parseInt(scholarshipId))
    if (!scholarship) {
      return NextResponse.json({ error: "Scholarship not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: scholarship,
    })
  }

  if (userId) {
    const userApplications = scholarshipsData.applications.filter((a) => a.userId === Number.parseInt(userId))
    const applicationsWithDetails = userApplications.map((app) => {
      const scholarship = scholarshipsData.scholarships.find((s) => s.id === app.scholarshipId)
      return {
        ...app,
        scholarship,
      }
    })

    return NextResponse.json({
      success: true,
      data: applicationsWithDetails,
    })
  }

  let filteredScholarships = scholarshipsData.scholarships

  if (category && category !== "all") {
    filteredScholarships = filteredScholarships.filter((s) => s.category.toLowerCase() === category.toLowerCase())
  }

  return NextResponse.json({
    success: true,
    data: filteredScholarships,
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, userId, scholarshipId, documents, essay, expectedAmount } = body

    if (action === "apply") {
      // Check if user already applied
      const existingApplication = scholarshipsData.applications.find(
        (a) => a.userId === Number.parseInt(userId) && a.scholarshipId === Number.parseInt(scholarshipId),
      )

      if (existingApplication) {
        return NextResponse.json({ error: "Already applied for this scholarship" }, { status: 400 })
      }

      const scholarship = scholarshipsData.scholarships.find((s) => s.id === Number.parseInt(scholarshipId))
      if (!scholarship) {
        return NextResponse.json({ error: "Scholarship not found" }, { status: 404 })
      }

      const newApplication = {
        id: scholarshipsData.applications.length + 1,
        userId: Number.parseInt(userId),
        scholarshipId: Number.parseInt(scholarshipId),
        status: "Under Review",
        appliedDate: new Date().toISOString(),
        documents,
        essay,
        expectedAmount,
      }

      scholarshipsData.applications.push(newApplication)
      scholarship.appliedCount += 1

      return NextResponse.json({
        success: true,
        data: {
          message: "Scholarship application submitted successfully",
          application: newApplication,
        },
      })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
