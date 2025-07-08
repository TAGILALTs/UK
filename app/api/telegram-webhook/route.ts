import { type NextRequest, NextResponse } from "next/server"
import { NewsDatabase } from "@/lib/database"

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const AUTHORIZED_USERS = process.env.AUTHORIZED_TELEGRAM_USERS?.split(",").map(Number) || []

interface TelegramUpdate {
  message?: {
    message_id: number
    from: {
      id: number
      first_name: string
      username?: string
    }
    chat: {
      id: number
      type: string
    }
    date: number
    text?: string
    photo?: Array<{
      file_id: string
      file_unique_id: string
      width: number
      height: number
      file_size?: number
    }>
    caption?: string
  }
  callback_query?: {
    id: string
    from: {
      id: number
      first_name: string
      username?: string
    }
    message?: {
      message_id: number
      chat: {
        id: number
        type: string
      }
    }
    data?: string
  }
}

const userStates = new Map<
  number,
  {
    step: "title" | "description" | "image" | "confirm"
    data: {
      title?: string
      description?: string
      image?: string
    }
  }
>()

async function sendTelegramMessage(chatId: number, text: string, replyMarkup?: any) {
  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: "HTML",
        reply_markup: replyMarkup,
      }),
    })

    if (!response.ok) {
      console.error("Failed to send message:", await response.text())
    }
  } catch (error) {
    console.error("Error sending message:", error)
  }
}

async function getFileUrl(fileId: string): Promise<string | null> {
  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getFile?file_id=${fileId}`)
    const data = await response.json()
    return data.ok ? `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${data.result.file_path}` : null
  } catch (error) {
    console.error("Error getting file URL:", error)
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: TelegramUpdate = await request.json()
    console.log("Incoming update:", JSON.stringify(body, null, 2))

    // Обработка callback кнопок
    if (body.callback_query) {
      const callback = body.callback_query
      const chatId = callback.message?.chat.id
      const userId = callback.from.id
      const data = callback.data

      console.log(`Processing callback from ${userId}, data: ${data}`)

      if (!chatId || !AUTHORIZED_USERS.includes(userId)) {
        console.log(`User ${userId} not authorized`)
        return NextResponse.json({ ok: true })
      }

      const userState = userStates.get(userId)
      console.log("Current user state:", userState)

      if (data === "confirm_publish" && userState?.step === "confirm") {
        try {
          if (!userState.data.title || !userState.data.description) {
            throw new Error("Missing required fields")
          }

          const author = `${callback.from.first_name}${callback.from.username ? ` (@${callback.from.username})` : ""}`
          
          console.log("Publishing news:", {
            title: userState.data.title,
            description: userState.data.description,
            author,
            image: userState.data.image
          })

          const result = await NewsDatabase.addNews(
            userState.data.title,
            userState.data.description,
            author,
            userState.data.image
          )

          userStates.delete(userId)
          
          await sendTelegramMessage(
            chatId,
            `✅ <b>Новость опубликована!</b>\n\n` +
            `📰 <b>Заголовок:</b> ${userState.data.title}\n` +
            `📝 <b>Описание:</b> ${userState.data.description.substring(0, 50)}...\n` +
            `🆔 <b>ID:</b> ${result.id}\n\n` +
            `🌐 <a href="${process.env.NEXT_PUBLIC_BASE_URL}/news">Просмотреть на сайте</a>`
          )

        } catch (error) {
          console.error("Publish error:", error)
          await sendTelegramMessage(
            chatId,
            `❌ <b>Ошибка публикации</b>\n\n${error instanceof Error ? error.message : String(error)}`
          )
        }
      } 
      else if (data === "cancel_publish") {
        userStates.delete(userId)
        await sendTelegramMessage(chatId, "❌ Публикация отменена")
      }

      return NextResponse.json({ ok: true })
    }

    // Обработка обычных сообщений
    const message = body.message
    if (!message) return NextResponse.json({ ok: true })

    const userId = message.from.id
    const chatId = message.chat.id

    // Проверка авторизации
    if (!AUTHORIZED_USERS.includes(userId)) {
      console.log(`Unauthorized access attempt by ${userId}`)
      await sendTelegramMessage(chatId, "❌ У вас нет прав для использования этого бота")
      return NextResponse.json({ ok: true })
    }

    // Обработка команд
    if (message.text) {
      const text = message.text.trim()

      if (text === "/start") {
        await sendStartMessage(chatId, message.from)
        return NextResponse.json({ ok: true })
      }

      if (text === "/news") {
        userStates.set(userId, { step: "title", data: {} })
        await sendTelegramMessage(
          chatId,
          "📝 <b>Создание новости - Шаг 1/4</b>\n\nВведите <b>заголовок</b> новости:"
        )
        return NextResponse.json({ ok: true })
      }

      // Остальные команды (/list, /edit, /delete и т.д.)
      // ...
    }

    // Обработка состояний создания новости
    const userState = userStates.get(userId)
    if (userState) {
      await handleUserState(userState, message, chatId, userId)
    }

    return NextResponse.json({ ok: true })

  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function handleUserState(
  userState: NonNullable<ReturnType<typeof userStates.get>>,
  message: NonNullable<TelegramUpdate['message']>,
  chatId: number,
  userId: number
) {
  switch (userState.step) {
    case "title":
      userState.data.title = message.text?.trim() || ""
      userState.step = "description"
      await sendTelegramMessage(
        chatId,
        "✅ <b>Заголовок сохранен</b>\n\n" +
        "📝 <b>Создание новости - Шаг 2/4</b>\n\n" +
        "Введите <b>описание</b> новости:"
      )
      break

    case "description":
      userState.data.description = message.text?.trim() || ""
      userState.step = "image"
      await sendTelegramMessage(
        chatId,
        "✅ <b>Описание сохранено</b>\n\n" +
        "📷 <b>Создание новости - Шаг 3/4</b>\n\n" +
        "Отправьте <b>изображение</b> или напишите 'пропустить':"
      )
      break

    case "image":
      if (message.text?.toLowerCase() === "пропустить") {
        userState.step = "confirm"
        await sendConfirmation(chatId, userState, message.from)
      } else if (message.photo) {
        const photo = message.photo[message.photo.length - 1]
        userState.data.image = await getFileUrl(photo.file_id)
        userState.step = "confirm"
        await sendConfirmation(chatId, userState, message.from)
      } else {
        await sendTelegramMessage(
          chatId,
          "❌ Отправьте изображение или напишите 'пропустить'"
        )
      }
      break
  }
}

async function sendConfirmation(
  chatId: number,
  userState: NonNullable<ReturnType<typeof userStates.get>>,
  from: TelegramUpdate['message']['from']
) {
  const preview = `📋 <b>Предпросмотр новости</b>\n\n` +
    `📰 <b>Заголовок:</b> ${userState.data.title}\n` +
    `📝 <b>Описание:</b> ${userState.data.description?.substring(0, 100)}...\n` +
    `📸 <b>Изображение:</b> ${userState.data.image ? "Да" : "Нет"}\n` +
    `👤 <b>Автор:</b> ${from.first_name}${from.username ? ` (@${from.username})` : ""}\n\n` +
    `Подтвердите публикацию:`

  await sendTelegramMessage(chatId, preview, {
    inline_keyboard: [
      [
        { text: "✅ Опубликовать", callback_data: "confirm_publish" },
        { text: "❌ Отменить", callback_data: "cancel_publish" },
      ],
    ],
  })
}

async function sendStartMessage(chatId: number, from: TelegramUpdate['message']['from']) {
  await sendTelegramMessage(
    chatId,
    `👋 <b>Привет, ${from.first_name}!</b>\n\n` +
    `Это бот для управления новостями ООО "ДЕЛЬТА"\n\n` +
    `📌 <b>Основные команды:</b>\n` +
    `/news - Создать новость\n` +
    `/list - Список новостей\n` +
    `/edit - Редактировать новость\n` +
    `/delete - Удалить новость\n\n` +
    `📸 Можно отправить фото с подписью в формате:\n` +
    `<code>Заголовок | Описание</code>`
  )
}

export async function GET() {
  return NextResponse.json({
    status: "Telegram webhook handler",
    authorized_users: AUTHORIZED_USERS,
    active_sessions: userStates.size,
  })
}