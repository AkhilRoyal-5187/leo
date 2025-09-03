"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { AppLayout } from "@/components/app-layout"
import { MapPin, Clock, DollarSign, Users, Calendar, Filter, Search, Briefcase } from "lucide-react"
import { Input } from "@/components/ui/input"
import Image from "next/image"

interface Internship {
  id: number
  title: string
  company: string
  companyLogo: string
  location: string
  duration: string
  stipend: string
  description: string
  requirements: string[]
  skills: string[]
  applicationDeadline: string
  startDate: string
  type: string
  level: string
  applicationsCount: number
  status: string
}

export default function InternshipsPage() {
  const [internships, setInternships] = useState<Internship[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")

  useEffect(() => {
    fetchInternships()
  }, [activeFilter])

  const fetchInternships = async () => {
    try {
      const response = await fetch(`/api/internships?type=${activeFilter}`)
      const result = await response.json()
      if (result.success) {
        setInternships(result.data)
      }
    } catch (error) {
      console.error("Error fetching internships:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleApply = async (internshipId: number) => {
    try {
      const response = await fetch("/api/internships", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "apply",
          userId: 1, // Current user ID
          internshipId,
          resume: "/placeholder-resume.pdf",
          coverLetter: "I am excited to apply for this internship opportunity...",
          expectedStartDate: new Date().toISOString(),
        }),
      })

      const result = await response.json()
      if (result.success) {
        alert("Application submitted successfully!")
        fetchInternships() // Refresh data
      } else {
        alert(result.error || "Failed to submit application")
      }
    } catch (error) {
      console.error("Error applying for internship:", error)
      alert("Failed to submit application")
    }
  }

  const filters = [
    { id: "all", label: "All" },
    { id: "technical", label: "Technical" },
    { id: "non-technical", label: "Non-Technical" },
  ]

  const filteredInternships = internships.filter(
    (internship) =>
      internship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      internship.company.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (loading) {
    return (
      <AppLayout>
        <div className="p-4 md:p-6 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
            <p>Loading internships...</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="p-52 text-4xl text-center ">
      <iframe className="ml-44 " src="https://lottie.host/embed/3468bad0-05ac-4fda-aaa7-cee86757c9c4/7o7ncaxPRf.lottie">
      </iframe>
        <div className="mt-[-40px]">
          Coming Soon...
        </div>
        {/* md:p-6 space-y-6 */}
        {/* <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Internships & Scholarships</h1>
            <p className="text-muted-foreground">Explore opportunities to grow your career</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search internships..."
                className="pl-9 w-full md:w-[200px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="internships">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="internships">Internships</TabsTrigger>
            <TabsTrigger value="scholarships">Scholarships</TabsTrigger>
          </TabsList>

          <TabsContent value="internships" className="space-y-6">
            <div className="flex overflow-auto pb-2 gap-2 scrollbar-hide">
              {filters.map((filter) => (
                <Button
                  key={filter.id}
                  variant={activeFilter === filter.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter(filter.id)}
                  className={`rounded-full ${
                    activeFilter === filter.id ? "bg-gradient-to-r from-violet-600 to-blue-600 text-white" : ""
                  }`}
                >
                  {filter.label}
                </Button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredInternships.map((internship) => (
                <Card key={internship.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 rounded-lg overflow-hidden border">
                          <Image
                            src={internship.companyLogo || "/placeholder.svg"}
                            alt={internship.company}
                            width={48}
                            height={48}
                            className="object-cover"
                          />
                        </div>
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{internship.title}</h3>
                            <p className="text-muted-foreground">{internship.company}</p>
                          </div>
                          <Badge
                            className={`${
                              internship.type === "Technical"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                                : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                            } border-0`}
                          >
                            {internship.type}
                          </Badge>
                        </div>

                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{internship.description}</p>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-violet-500" />
                            <span>{internship.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-blue-500" />
                            <span>{internship.duration}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <DollarSign className="h-4 w-4 text-green-500" />
                            <span>{internship.stipend}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="h-4 w-4 text-orange-500" />
                            <span>{internship.applicationsCount} applied</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1 mt-3">
                          {internship.skills.slice(0, 3).map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {internship.skills.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{internship.skills.length - 3} more
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>Apply by {new Date(internship.applicationDeadline).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-6 pt-0 flex justify-between items-center">
                    <Badge variant="outline" className="font-normal">
                      {internship.level}
                    </Badge>
                    <Button
                      className="bg-gradient-to-r from-violet-600 to-blue-600 text-white hover:from-violet-700 hover:to-blue-700"
                      onClick={() => handleApply(internship.id)}
                    >
                      <Briefcase className="h-4 w-4 mr-2" />
                      Apply Now
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="scholarships">
            <ScholarshipsSection />
          </TabsContent>
        </Tabs> */}

      </div>
    </AppLayout>
  )
}

function ScholarshipsSection() {
  const [scholarships, setScholarships] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchScholarships()
  }, [])

  const fetchScholarships = async () => {
    try {
      const response = await fetch("/api/scholarships")
      const result = await response.json()
      if (result.success) {
        setScholarships(result.data)
      }
    } catch (error) {
      console.error("Error fetching scholarships:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleApply = async (scholarshipId: number) => {
    try {
      const response = await fetch("/api/scholarships", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "apply",
          userId: 1,
          scholarshipId,
          documents: [
            { name: "Academic Transcripts", url: "/placeholder-transcript.pdf" },
            { name: "Essay", url: "/placeholder-essay.pdf" },
          ],
          essay: "My future goals include...",
          expectedAmount: "₹50,000",
        }),
      })

      const result = await response.json()
      if (result.success) {
        alert("Scholarship application submitted successfully!")
        fetchScholarships()
      } else {
        alert(result.error || "Failed to submit application")
      }
    } catch (error) {
      console.error("Error applying for scholarship:", error)
      alert("Failed to submit application")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p>Loading scholarships...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {scholarships.map((scholarship: any) => (
        <Card key={scholarship.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg">{scholarship.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
                    {scholarship.amount}
                  </Badge>
                  <Badge variant="outline">{scholarship.category}</Badge>
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-4">{scholarship.description}</p>

            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium mb-2">Eligibility:</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {scholarship.eligibility.slice(0, 2).map((item: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-violet-500 mt-2 flex-shrink-0"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <span>Apply by {new Date(scholarship.applicationDeadline).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-3 w-3 text-muted-foreground" />
                  <span>
                    {scholarship.appliedCount}/{scholarship.availableSlots}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-6 pt-0">
            <Button
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700"
              onClick={() => handleApply(scholarship.id)}
            >
              Apply for Scholarship
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
