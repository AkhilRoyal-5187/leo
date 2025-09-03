export type Question = {
  id: number
  text: string
  options: string[]
  correctAnswer: number // index 0..n
}

export type EpisodeQuiz = {
  id: number
  title: string
  timeLimit: number // minutes
  passingScore: number // percentage
  questions: Question[]
}

export type Episode = {
  id: number
  title: string
  durationSeconds: number
  videoUrl: string
  coins?: number
  quiz: EpisodeQuiz
}

export type Course = {
  id: number
  title: string
  subject: string
  level: string
  category: "academic" | "programming" | "government"
  thumbnail: string
  description: string
  teacher: {
    id: number
    name: string
    avatar?: string
  }
  episodes: Episode[]
}

const SAMPLE_MP4 = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"

function makeEpisodeQuiz(courseId: number, episodeId: number, courseTitle: string, episodeTitle: string): EpisodeQuiz {
  // Deterministic 8 Q quiz per episode
  const seed = courseId * 1000 + episodeId
  const questions: Question[] = Array.from({ length: 8 }).map((_, i) => {
    const a = ((seed + i * 7) % 11) + 2
    const b = ((seed + i * 5) % 9) + 1
    const correct = a + b
    const opts = [correct, correct + 1, correct - 1, correct + 2]
    return {
      id: i + 1,
      text: `Q${i + 1}. In "${courseTitle}" - "${episodeTitle}", what is ${a} + ${b}?`,
      options: opts.map(String),
      correctAnswer: 0,
    }
  })
  return {
    id: Number(`${courseId}${episodeId}`), // unique id
    title: `Episode Quiz: ${episodeTitle}`,
    timeLimit: 10,
    passingScore: 60,
    questions,
  }
}

export const coursesDB: Course[] = [
  {
    id: 1,
    title: "Advanced Mathematics",
    subject: "Mathematics",
    level: "Intermediate",
    category: "academic",
    thumbnail: "/images/courses/math.png",
    description: "Master calculus, algebra, and problem-solving techniques for competitive exams and higher studies.",
    teacher: { id: 101, name: "Dr. Sarah Johnson", avatar: "/teacher-sarah.png" },
    episodes: [],
  },
  {
    id: 2,
    title: "Python Programming Basics",
    subject: "Computer Science",
    level: "Beginner",
    category: "programming",
    thumbnail: "/images/courses/python.png",
    description: "Learn Python syntax, data structures, functions, and modules with hands-on examples.",
    teacher: { id: 102, name: "Prof. Michael Chen", avatar: "/teacher-chen.png" },
    episodes: [],
  },
  {
    id: 3,
    title: "Indian Constitution Overview",
    subject: "Civics",
    level: "Intermediate",
    category: "government",
    thumbnail: "/images/courses/constitution.png",
    description: "Understand the structure, fundamental rights, and key features of the Constitution of India.",
    teacher: { id: 103, name: "Dr. Meera Gupta", avatar: "/teacher-anita.png" },
    episodes: [],
  },
  {
    id: 4,
    title: "B.Tech CSE: Operating Systems",
    subject: "Computer Science & Engineering",
    level: "Undergraduate",
    category: "academic",
    thumbnail: "/btech-operating-systems-course-cover.png",
    description:
      "Processes, threads, CPU scheduling, memory management, file systems, and concurrency control with real-world OS concepts.",
    teacher: { id: 104, name: "Prof. Ananya Rao", avatar: "/cs-professor-avatar.png" },
    episodes: [],
  },
  {
    id: 5,
    title: "B.Tech CSE: Database Management Systems",
    subject: "Computer Science & Engineering",
    level: "Undergraduate",
    category: "academic",
    thumbnail: "/btech-database-management-systems-cover.png",
    description:
      "Relational model, SQL, normalization, transactions, indexing, and query optimization with practical examples.",
    teacher: { id: 105, name: "Dr. Karthik Menon", avatar: "/db-professor-avatar.png" },
    episodes: [],
  },
  {
    id: 6,
    title: "B.Tech ECE: Digital Logic Design",
    subject: "Electronics & Communication Engineering",
    level: "Undergraduate",
    category: "academic",
    thumbnail: "/btech-digital-logic-design-cover.png",
    description:
      "Number systems, Boolean algebra, combinational/sequential circuits, FSMs, and basic digital system design.",
    teacher: { id: 106, name: "Dr. Neha Kapoor", avatar: "/ece-professor-avatar.png" },
    episodes: [],
  },
  {
    id: 7,
    title: "B.Tech ME: Thermodynamics",
    subject: "Mechanical Engineering",
    level: "Undergraduate",
    category: "academic",
    thumbnail: "/btech-thermodynamics-cover.png",
    description:
      "Thermodynamic systems, properties, first and second laws, entropy, and applications in engines and power cycles.",
    teacher: { id: 107, name: "Prof. Arvind Singh", avatar: "/me-professor-avatar.png" },
    episodes: [],
  },
  {
    id: 8,
    title: "B.Tech Civil: Structural Analysis",
    subject: "Civil Engineering",
    level: "Undergraduate",
    category: "academic",
    thumbnail: "/btech-structural-analysis-cover.png",
    description:
      "Analysis of determinate and indeterminate structures, truss and frame behavior, influence lines, and displacement methods.",
    teacher: { id: 108, name: "Dr. Ritu Sharma", avatar: "/civil-professor-avatar.png" },
    episodes: [],
  },
  {
    id: 9,
    title: "Advanced Java with Spring Boot",
    subject: "Programming",
    level: "Intermediate",
    category: "programming",
    thumbnail: "/advanced-java-spring-boot-course-cover.png",
    description:
      "Build production-grade REST APIs with Spring Boot, JPA, Spring Security, testing, and deployment best practices.",
    teacher: { id: 109, name: "Rahul Verma", avatar: "/java-instructor-avatar.png" },
    episodes: [],
  },
  {
    id: 10,
    title: "Full-Stack Web Dev (MERN)",
    subject: "Programming",
    level: "Intermediate",
    category: "programming",
    thumbnail: "/mern-full-stack-web-development-cover.png",
    description:
      "Learn MongoDB, Express, React, and Node.js to build full-stack apps with authentication, APIs, and state management.",
    teacher: { id: 110, name: "Priya Sharma", avatar: "/web-dev-instructor-avatar.png" },
    episodes: [],
  },
  {
    id: 11,
    title: "C++ OOP and STL Mastery",
    subject: "Programming",
    level: "Intermediate",
    category: "programming",
    thumbnail: "/cpp-oop-stl-course-cover.png",
    description:
      "Master classes, inheritance, templates, and the Standard Template Library for competitive programming and systems dev.",
    teacher: { id: 111, name: "Aniket Kulkarni", avatar: "/placeholder.svg?height=200&width=200" },
    episodes: [],
  },
  {
    id: 12,
    title: "Data Science with Python",
    subject: "Programming",
    level: "Intermediate",
    category: "programming",
    thumbnail: "/placeholder.svg?height=200&width=300",
    description: "Pandas, NumPy, data visualization, feature engineering, and ML workflows with scikit-learn.",
    teacher: { id: 112, name: "Sneha Iyer", avatar: "/placeholder.svg?height=200&width=200" },
    episodes: [],
  },
]

// Build episodes with per-episode quizzes
const episodesByCourse: Record<number, Omit<Episode, "quiz">[]> = {
  1: [
    { id: 11, title: "Limits and Continuity", durationSeconds: 18 * 60, videoUrl: SAMPLE_MP4, coins: 10 },
    { id: 12, title: "Derivatives Basics", durationSeconds: 22 * 60, videoUrl: SAMPLE_MP4, coins: 10 },
    { id: 13, title: "Chain Rule & Applications", durationSeconds: 20 * 60, videoUrl: SAMPLE_MP4, coins: 10 },
    { id: 14, title: "Integration Techniques", durationSeconds: 24 * 60, videoUrl: SAMPLE_MP4, coins: 10 },
  ],
  2: [
    { id: 21, title: "Getting Started with Python", durationSeconds: 16 * 60, videoUrl: SAMPLE_MP4, coins: 10 },
    { id: 22, title: "Variables & Data Types", durationSeconds: 19 * 60, videoUrl: SAMPLE_MP4, coins: 10 },
    { id: 23, title: "Control Flow", durationSeconds: 21 * 60, videoUrl: SAMPLE_MP4, coins: 10 },
    { id: 24, title: "Functions & Modules", durationSeconds: 24 * 60, videoUrl: SAMPLE_MP4, coins: 10 },
  ],
  3: [
    { id: 31, title: "Preamble & Basic Structure", durationSeconds: 14 * 60, videoUrl: SAMPLE_MP4, coins: 10 },
    { id: 32, title: "Fundamental Rights", durationSeconds: 22 * 60, videoUrl: SAMPLE_MP4, coins: 10 },
    { id: 33, title: "Directive Principles", durationSeconds: 18 * 60, videoUrl: SAMPLE_MP4, coins: 10 },
    { id: 34, title: "Union Government", durationSeconds: 20 * 60, videoUrl: SAMPLE_MP4, coins: 10 },
  ],
  4: [
    { id: 41, title: "Intro to OS & Process Model", durationSeconds: 17 * 60, videoUrl: SAMPLE_MP4, coins: 10 },
    { id: 42, title: "CPU Scheduling Algorithms", durationSeconds: 21 * 60, videoUrl: SAMPLE_MP4, coins: 10 },
    { id: 43, title: "Memory Management & Paging", durationSeconds: 23 * 60, videoUrl: SAMPLE_MP4, coins: 10 },
    { id: 44, title: "File Systems & I/O", durationSeconds: 20 * 60, videoUrl: SAMPLE_MP4, coins: 10 },
  ],
  5: [
    { id: 51, title: "Relational Model & Keys", durationSeconds: 16 * 60, videoUrl: SAMPLE_MP4, coins: 10 },
    { id: 52, title: "SQL Basics & Joins", durationSeconds: 22 * 60, videoUrl: SAMPLE_MP4, coins: 10 },
    { id: 53, title: "Normalization", durationSeconds: 19 * 60, videoUrl: SAMPLE_MP4, coins: 10 },
    { id: 54, title: "Transactions & Indexing", durationSeconds: 24 * 60, videoUrl: SAMPLE_MP4, coins: 10 },
  ],
  6: [
    { id: 61, title: "Number Systems & Codes", durationSeconds: 15 * 60, videoUrl: SAMPLE_MP4, coins: 10 },
    { id: 62, title: "Boolean Algebra & K-Maps", durationSeconds: 20 * 60, videoUrl: SAMPLE_MP4, coins: 10 },
    { id: 63, title: "Combinational Circuits", durationSeconds: 21 * 60, videoUrl: SAMPLE_MP4, coins: 10 },
    { id: 64, title: "Sequential Circuits & FSMs", durationSeconds: 23 * 60, videoUrl: SAMPLE_MP4, coins: 10 },
  ],
  7: [
    { id: 71, title: "Thermodynamic Systems & Properties", durationSeconds: 18 * 60, videoUrl: SAMPLE_MP4, coins: 10 },
    { id: 72, title: "First Law of Thermodynamics", durationSeconds: 22 * 60, videoUrl: SAMPLE_MP4, coins: 10 },
    { id: 73, title: "Second Law & Entropy", durationSeconds: 21 * 60, videoUrl: SAMPLE_MP4, coins: 10 },
    { id: 74, title: "Power Cycles & Applications", durationSeconds: 24 * 60, videoUrl: SAMPLE_MP4, coins: 10 },
  ],
  8: [
    { id: 81, title: "Basics of Structural Analysis", durationSeconds: 17 * 60, videoUrl: SAMPLE_MP4, coins: 10 },
    { id: 82, title: "Analysis of Trusses", durationSeconds: 20 * 60, videoUrl: SAMPLE_MP4, coins: 10 },
    { id: 83, title: "Beams & Frames", durationSeconds: 22 * 60, videoUrl: SAMPLE_MP4, coins: 10 },
    { id: 84, title: "Indeterminate Structures", durationSeconds: 23 * 60, videoUrl: SAMPLE_MP4, coins: 10 },
  ],
  9: [
    { id: 91, title: "Spring Boot Fundamentals", durationSeconds: 18 * 60, videoUrl: SAMPLE_MP4, coins: 10 },
    { id: 92, title: "REST APIs & Validation", durationSeconds: 23 * 60, videoUrl: SAMPLE_MP4, coins: 10 },
    { id: 93, title: "JPA & Database Integration", durationSeconds: 24 * 60, videoUrl: SAMPLE_MP4, coins: 10 },
    { id: 94, title: "Security & Testing", durationSeconds: 22 * 60, videoUrl: SAMPLE_MP4, coins: 10 },
  ],
  10: [
    { id: 101, title: "MongoDB & Data Modeling", durationSeconds: 20 * 60, videoUrl: SAMPLE_MP4, coins: 10 },
    { id: 102, title: "Express APIs & Auth", durationSeconds: 23 * 60, videoUrl: SAMPLE_MP4, coins: 10 },
    { id: 103, title: "React State & Routing", durationSeconds: 24 * 60, videoUrl: SAMPLE_MP4, coins: 10 },
    { id: 104, title: "Node.js Deployment", durationSeconds: 21 * 60, videoUrl: SAMPLE_MP4, coins: 10 },
  ],
  11: [
    { id: 111, title: "OOP Basics & Classes", durationSeconds: 18 * 60, videoUrl: SAMPLE_MP4, coins: 10 },
    { id: 112, title: "Inheritance & Polymorphism", durationSeconds: 22 * 60, videoUrl: SAMPLE_MP4, coins: 10 },
    { id: 113, title: "Templates & Generic Programming", durationSeconds: 23 * 60, videoUrl: SAMPLE_MP4, coins: 10 },
    { id: 114, title: "STL Containers & Algorithms", durationSeconds: 24 * 60, videoUrl: SAMPLE_MP4, coins: 10 },
  ],
  12: [
    { id: 121, title: "Pandas DataFrames", durationSeconds: 20 * 60, videoUrl: SAMPLE_MP4, coins: 10 },
    { id: 122, title: "Exploratory Data Analysis", durationSeconds: 23 * 60, videoUrl: SAMPLE_MP4, coins: 10 },
    { id: 123, title: "Feature Engineering", durationSeconds: 21 * 60, videoUrl: SAMPLE_MP4, coins: 10 },
    { id: 124, title: "ML with scikit-learn", durationSeconds: 25 * 60, videoUrl: SAMPLE_MP4, coins: 10 },
  ],
}

for (const course of coursesDB) {
  const base = episodesByCourse[course.id] || []
  course.episodes = base.map((e) => ({
    ...e,
    quiz: makeEpisodeQuiz(course.id, e.id, course.title, e.title),
  }))
}

// Utilities
export function getCourse(courseId: number): Course | null {
  return coursesDB.find((c) => c.id === courseId) || null
}

export function getEpisode(courseId: number, episodeId: number): Episode | null {
  const c = getCourse(courseId)
  if (!c) return null
  return c.episodes.find((e) => e.id === episodeId) || null
}
