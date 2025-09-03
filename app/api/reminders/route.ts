import { type NextRequest, NextResponse } from "next/server"

// Mock database for reminders
const remindersData = {
  reminders: [
    {
      id: 1,
      userId: 1,
      type: "live_class",
      itemId: 1,
      title: "Advanced Calculus",
      scheduledTime: "2024-01-20T10:00:00Z",
      reminderTime: "2024-01-20T09:45:00Z", // 15 minutes before
      status: "active",
      notificationMethods: ["push", "email"],
      createdAt: "2024-01-15T10:30:00Z",
    },
  ],
  notifications: [
    {
      id: 1,
      userId: 1,
      reminderId: 1,
      message: "Your live class 'Advanced Calculus' starts in 15 minutes!",
      type: "live_class_reminder",
      status: "sent",
      sentAt: "2024-01-20T09:45:00Z",
    },
  ],
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId") || "1"
  const type = searchParams.get("type")

  let userReminders = remindersData.reminders.filter((r) => r.userId === Number.parseInt(userId))

  if (type) {
    userReminders = userReminders.filter((r) => r.type === type)
  }

  return NextResponse.json({
    success: true,
    data: userReminders.sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime()),
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, userId, type, itemId, title, scheduledTime, reminderMinutes, notificationMethods } = body

    if (action === "create_reminder") {
      // Check if reminder already exists
      const existingReminder = remindersData.reminders.find(
        (r) => r.userId === Number.parseInt(userId) && r.itemId === Number.parseInt(itemId) && r.type === type,
      )

      if (existingReminder) {
        return NextResponse.json({ error: "Reminder already exists for this item" }, { status: 400 })
      }

      const scheduledDate = new Date(scheduledTime)
      const reminderDate = new Date(scheduledDate.getTime() - (reminderMinutes || 15) * 60000)

      const newReminder = {
        id: remindersData.reminders.length + 1,
        userId: Number.parseInt(userId),
        type,
        itemId: Number.parseInt(itemId),
        title,
        scheduledTime,
        reminderTime: reminderDate.toISOString(),
        status: "active",
        notificationMethods: notificationMethods || ["push"],
        createdAt: new Date().toISOString(),
      }

      remindersData.reminders.push(newReminder)

      return NextResponse.json({
        success: true,
        data: {
          message: "Reminder set successfully",
          reminder: newReminder,
        },
      })
    }

    if (action === "delete_reminder") {
      const { reminderId } = body
      const reminderIndex = remindersData.reminders.findIndex((r) => r.id === Number.parseInt(reminderId))

      if (reminderIndex === -1) {
        return NextResponse.json({ error: "Reminder not found" }, { status: 404 })
      }

      remindersData.reminders.splice(reminderIndex, 1)

      return NextResponse.json({
        success: true,
        data: {
          message: "Reminder deleted successfully",
        },
      })
    }

    if (action === "update_reminder") {
      const { reminderId, reminderMinutes, notificationMethods } = body
      const reminder = remindersData.reminders.find((r) => r.id === Number.parseInt(reminderId))

      if (!reminder) {
        return NextResponse.json({ error: "Reminder not found" }, { status: 404 })
      }

      const scheduledDate = new Date(reminder.scheduledTime)
      const reminderDate = new Date(scheduledDate.getTime() - (reminderMinutes || 15) * 60000)

      reminder.reminderTime = reminderDate.toISOString()
      reminder.notificationMethods = notificationMethods || reminder.notificationMethods

      return NextResponse.json({
        success: true,
        data: {
          message: "Reminder updated successfully",
          reminder,
        },
      })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
