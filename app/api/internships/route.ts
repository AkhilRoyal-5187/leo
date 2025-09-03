import { type NextRequest, NextResponse } from "next/server"

// Mock database
const internshipsData = {
  internships: [
    {
      id: 1,
      title: "Software Development Intern",
      company: "TechCorp Solutions",
      companyLogo: "/placeholder.svg?height=100&width=100",
      location: "Remote",
      duration: "3 months",
      stipend: "₹15,000/month",
      description:
        "Join our development team to work on cutting-edge web applications using React, Node.js, and modern technologies.",
      requirements: [
        "Basic knowledge of JavaScript and React",
        "Understanding of web development concepts",
        "Good problem-solving skills",
        "Currently enrolled in Computer Science or related field",
      ],
      skills: ["JavaScript", "React", "Node.js", "Git"],
      applicationDeadline: "2024-02-15",
      startDate: "2024-03-01",
      type: "Technical",
      level: "Beginner",
      applicationsCount: 45,
      status: "Open",
    },
    {
      id: 2,
      title: "Data Science Intern",
      company: "DataMinds Analytics",
      companyLogo: "/placeholder.svg?height=100&width=100",
      location: "Bangalore, India",
      duration: "6 months",
      stipend: "₹20,000/month",
      description:
        "Work with our data science team to analyze large datasets and build machine learning models for business insights.",
      requirements: [
        "Knowledge of Python and data analysis libraries",
        "Understanding of statistics and machine learning",
        "Experience with data visualization tools",
        "Strong analytical thinking",
      ],
      skills: ["Python", "Pandas", "Scikit-learn", "Matplotlib", "SQL"],
      applicationDeadline: "2024-02-20",
      startDate: "2024-03-15",
      type: "Technical",
      level: "Intermediate",
      applicationsCount: 32,
      status: "Open",
    },
    {
      id: 3,
      title: "Digital Marketing Intern",
      company: "Creative Minds Agency",
      companyLogo: "/placeholder.svg?height=100&width=100",
      location: "Mumbai, India",
      duration: "4 months",
      stipend: "₹12,000/month",
      description:
        "Support our marketing team in creating digital campaigns, content creation, and social media management.",
      requirements: [
        "Interest in digital marketing and social media",
        "Basic understanding of marketing concepts",
        "Creative thinking and communication skills",
        "Familiarity with social media platforms",
      ],
      skills: ["Social Media", "Content Creation", "Analytics", "SEO"],
      applicationDeadline: "2024-02-10",
      startDate: "2024-02-25",
      type: "Non-Technical",
      level: "Beginner",
      applicationsCount: 28,
      status: "Open",
    },
  ],
  applications: [
    {
      id: 1,
      userId: 1,
      internshipId: 1,
      status: "Applied",
      appliedDate: "2024-01-15",
      resume: "/placeholder-resume.pdf",
      coverLetter: "I am excited to apply for this internship opportunity...",
      expectedStartDate: "2024-03-01",
    },
  ],
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const internshipId = searchParams.get("internshipId")
  const userId = searchParams.get("userId")
  const type = searchParams.get("type")
  const level = searchParams.get("level")

  if (internshipId) {
    const internship = internshipsData.internships.find((i) => i.id === Number.parseInt(internshipId))
    if (!internship) {
      return NextResponse.json({ error: "Internship not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: internship,
    })
  }

  if (userId) {
    const userApplications = internshipsData.applications.filter((a) => a.userId === Number.parseInt(userId))
    const applicationsWithDetails = userApplications.map((app) => {
      const internship = internshipsData.internships.find((i) => i.id === app.internshipId)
      return {
        ...app,
        internship,
      }
    })

    return NextResponse.json({
      success: true,
      data: applicationsWithDetails,
    })
  }

  let filteredInternships = internshipsData.internships

  if (type && type !== "all") {
    filteredInternships = filteredInternships.filter((i) => i.type.toLowerCase() === type.toLowerCase())
  }

  if (level && level !== "all") {
    filteredInternships = filteredInternships.filter((i) => i.level.toLowerCase() === level.toLowerCase())
  }

  return NextResponse.json({
    success: true,
    data: filteredInternships,
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, userId, internshipId, resume, coverLetter, expectedStartDate } = body

    if (action === "apply") {
      // Check if user already applied
      const existingApplication = internshipsData.applications.find(
        (a) => a.userId === Number.parseInt(userId) && a.internshipId === Number.parseInt(internshipId),
      )

      if (existingApplication) {
        return NextResponse.json({ error: "Already applied for this internship" }, { status: 400 })
      }

      const internship = internshipsData.internships.find((i) => i.id === Number.parseInt(internshipId))
      if (!internship) {
        return NextResponse.json({ error: "Internship not found" }, { status: 404 })
      }

      const newApplication = {
        id: internshipsData.applications.length + 1,
        userId: Number.parseInt(userId),
        internshipId: Number.parseInt(internshipId),
        status: "Applied",
        appliedDate: new Date().toISOString(),
        resume,
        coverLetter,
        expectedStartDate,
      }

      internshipsData.applications.push(newApplication)
      internship.applicationsCount += 1

      return NextResponse.json({
        success: true,
        data: {
          message: "Application submitted successfully",
          application: newApplication,
        },
      })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
