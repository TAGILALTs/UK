import { type NextRequest, NextResponse } from "next/server"
import { NewsDatabase } from "@/lib/database"

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const AUTHORIZED_USERS = process.env.AUTHORIZED_TELEGRAM_USERS?.split(",") || []

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
      const errorText = await response.text()
      console.error("Failed to send Telegram message:", errorText)
    }
  } catch (error) {
    console.error("Error sending Telegram message:", error)
  }
}

async function getFileUrl(fileId: string): Promise<string | null> {
  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getFile?file_id=${fileId}`)
    const data = await response.json()

    if (data.ok && data.result.file_path) {
      return `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${data.result.file_path}`
    }

    return null
  } catch (error) {
    console.error("Error getting file URL:", error)
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: TelegramUpdate = await request.json()

    // Обработка callback queries (кнопки)
    if (body.callback_query) {
      const callbackQuery = body.callback_query
      const chatId = callbackQuery.message?.chat.id
      const userId = callbackQuery.from.id
      const data = callbackQuery.data

      if (!chatId || !AUTHORIZED_USERS.includes(userId.toString())) {
        return NextResponse.json({ ok: true })
      }

      // Обработка кнопок подтверждения/отмены
      if (data === "confirm_publish") {
        await sendTelegramMessage(chatId, "✅ Новость опубликована!")
      } else if (data === "cancel_publish") {
        await sendTelegramMessage(chatId, "❌ Публикация новости отменена.")
      }

      return NextResponse.json({ ok: true })
    }

    const message = body.message
    if (!message) {
      return NextResponse.json({ ok: true })
    }

    const userId = message.from.id.toString()
    const chatId = message.chat.id

    // Проверка авторизации
    if (!AUTHORIZED_USERS.includes(userId)) {
      await sendTelegramMessage(chatId, `❌ У вас нет прав для использования этого бота.`)
      return NextResponse.json({ ok: true })
    }

    // Обработка фотографий с подписью
    if (message.photo && message.photo.length > 0 && message.caption) {
      const caption = message.caption.trim()
      
      if (!caption.includes("|")) {
        await sendTelegramMessage(
          chatId,
          "❌ <b>Неверный формат</b>\n\nДля новости с фото используйте:\n<b>Заголовок | Описание</b>\n\nПример:\n<b>Важная новость | Подробное описание</b>"
        )
        return NextResponse.json({ ok: true })
      }

      const parts = caption.split("|").map(part => part.trim())
      if (parts.length < 2) {
        await sendTelegramMessage(chatId, "❌ Необходимо указать заголовок и описание через символ |")
        return NextResponse.json({ ok: true })
      }

      const [title, description] = parts

      if (!title || !description) {
        await sendTelegramMessage(chatId, "❌ Заголовок и описание не могут быть пустыми")
        return NextResponse.json({ ok: true })
      }

      // Получаем самое большое фото
      const largestPhoto = message.photo.reduce((prev, current) =>
        prev.width * prev.height > current.width * current.height ? prev : current,
      )

      const imageUrl = await getFileUrl(largestPhoto.file_id)

      await sendTelegramMessage(chatId, "⏳ <b>Добавляю новость с фото...</b>")

      try {
        // Используем "Администратор" вместо имени пользователя
        await NewsDatabase.addNews(title, description, "Администратор", imageUrl || undefined)

        const successMessage = `✅ <b>Новость с фото успешно добавлена!</b>

📰 <b>Заголовок:</b> ${title}
📝 <b>Описание:</b> ${description.length > 100 ? description.substring(0, 100) + "..." : description}
📸 <b>Фото:</b> Прикреплено
⏰ <b>Время:</b> ${new Date().toLocaleString("ru-RU")}

🌐 <b>Просмотреть:</b> <a href="${process.env.NEXT_PUBLIC_BASE_URL}/news">Страница новостей</a>`

        await sendTelegramMessage(chatId, successMessage)
      } catch (error) {
        await sendTelegramMessage(chatId, `❌ <b>Ошибка публикации</b>\n\n${String(error)}`)
      }

      return NextResponse.json({ ok: true })
    }

    const text = message.text?.trim()
    if (!text) {
      return NextResponse.json({ ok: true })
    }

    // Команда /start
    if (text === "/start") {
      const welcomeMessage = `🏢 <b>Бот управляющей компании</b>

📰 <b>Добавление новости:</b>
1. Можно отправить текст в формате:
<code>/news Заголовок | Описание | Ссылка на изображение (по желанию)</code>

2. Или отправить фото с подписью в формате:
<code>Заголовок | Описание</code>

📋 <b>Другие команды:</b>
• /list - Список всех новостей
• /edit ID | Новый заголовок | Новое описание
• /delete ID - Удалить новость
• /status - Проверить статус системы`

      await sendTelegramMessage(chatId, welcomeMessage)
      return NextResponse.json({ ok: true })
    }

    // Команда /news - добавление новости
    if (text.startsWith("/news ")) {
      const newsContent = text.substring(6).trim()
      const parts = newsContent.split("|").map(part => part.trim())

      if (parts.length < 2 || parts.length > 3) {
        await sendTelegramMessage(
          chatId,
          `❌ <b>Неверный формат</b>\n\nИспользуйте:\n<code>/news Заголовок | Описание | Ссылка на изображение (по желанию)</code>\n\nПример:\n<code>/news Новые правила | С 1 января новые правила парковки | https://example.com/image.jpg</code>`
        )
        return NextResponse.json({ ok: true })
      }

      const [title, description, imageUrl] = parts

      if (!title || !description) {
        await sendTelegramMessage(chatId, "❌ <b>Пустые поля</b>\n\nЗаголовок и описание не могут быть пустыми")
        return NextResponse.json({ ok: true })
      }

      // Проверка URL изображения, если он есть
      if (imageUrl && !/^https?:\/\/.+\..+/.test(imageUrl)) {
        await sendTelegramMessage(chatId, "❌ Некорректная ссылка на изображение. Используйте полный URL (начинается с http:// или https://)")
        return NextResponse.json({ ok: true })
      }

      await sendTelegramMessage(chatId, "⏳ <b>Добавляю новость...</b>")

      try {
        // Используем "Администратор" вместо имени пользователя
        await NewsDatabase.addNews(title, description, "Администратор", imageUrl || undefined)

        const successMessage = `✅ <b>Новость успешно добавлена!</b>

📰 <b>Заголовок:</b> ${title}
📝 <b>Описание:</b> ${description.length > 100 ? description.substring(0, 100) + "..." : description}
${imageUrl ? `📸 <b>Изображение:</b> Прикреплено\n` : ""}
⏰ <b>Время:</b> ${new Date().toLocaleString("ru-RU")}

🌐 <b>Просмотреть:</b> <a href="${process.env.NEXT_PUBLIC_BASE_URL}/news">Страница новостей</a>`

        await sendTelegramMessage(chatId, successMessage)
      } catch (error) {
        await sendTelegramMessage(chatId, `❌ <b>Ошибка публикации</b>\n\n${String(error)}`)
      }

      return NextResponse.json({ ok: true })
    }

    // Команда /list - показать список новостей
    if (text === "/list") {
      try {
        const newsList = await NewsDatabase.getNewsListForTelegram()

        if (newsList.length === 0) {
          await sendTelegramMessage(
            chatId,
            "📰 <b>Список новостей пуст</b>\n\nИспользуйте /news для добавления новости"
          )
        } else {
          const listMessage = `📰 <b>Список новостей (${newsList.length}):</b>

${newsList.join("\n")}

💡 <b>Для редактирования:</b>
<code>/edit ID | Новый заголовок | Новое описание</code>

🗑 <b>Для удаления:</b>
<code>/delete ID</code>`

          await sendTelegramMessage(chatId, listMessage)
        }
      } catch (error) {
        await sendTelegramMessage(chatId, `❌ <b>Ошибка получения списка</b>\n\n${String(error)}`)
      }
      return NextResponse.json({ ok: true })
    }

    // Команда /edit - редактировать новость
    if (text.startsWith("/edit ")) {
      const editContent = text.substring(6).trim()

      if (!editContent) {
        await sendTelegramMessage(
          chatId,
          "❌ <b>Пустая команда редактирования</b>\n\nИспользуйте формат:\n<code>/edit ID | Новый заголовок | Новое описание</code>\n\nДля получения списка ID используйте /list"
        )
        return NextResponse.json({ ok: true })
      }

      const parts = editContent.split("|").map(part => part.trim())
      if (parts.length < 3) {
        await sendTelegramMessage(
          chatId,
          "❌ <b>Неверный формат</b>\n\nИспользуйте:\n<code>/edit ID | Новый заголовок | Новое описание</code>\n\nПример:\n<code>/edit news_123 | Обновленный заголовок | Обновленное описание</code>"
        )
        return NextResponse.json({ ok: true })
      }

      const [newsId, newTitle, newDescription] = parts

      if (!newsId || !newTitle || !newDescription) {
        await sendTelegramMessage(chatId, "❌ <b>Пустые поля</b>\n\nID, заголовок и описание не могут быть пустыми")
        return NextResponse.json({ ok: true })
      }

      await sendTelegramMessage(chatId, "⏳ <b>Обновляю новость...</b>")

      try {
        const updatedNews = await NewsDatabase.updateNews(newsId, newTitle, newDescription, "Администратор")

        const successMessage = `✅ <b>Новость успешно обновлена!</b>

📰 <b>Новый заголовок:</b> ${newTitle}
📝 <b>Новое описание:</b> ${newDescription.length > 100 ? newDescription.substring(0, 100) + "..." : newDescription}
⏰ <b>Время обновления:</b> ${new Date().toLocaleString("ru-RU")}

🌐 <b>Просмотреть:</b> <a href="${process.env.NEXT_PUBLIC_BASE_URL}/news">Страница новостей</a>`

        await sendTelegramMessage(chatId, successMessage)
      } catch (error) {
        await sendTelegramMessage(
          chatId,
          `❌ <b>Ошибка обновления</b>\n\n${String(error)}\n\nИспользуйте /list для получения актуального списка новостей`
        )
      }

      return NextResponse.json({ ok: true })
    }

    // Команда /delete - удалить новость
    if (text.startsWith("/delete ")) {
      const newsId = text.substring(8).trim()

      if (!newsId) {
        await sendTelegramMessage(
          chatId,
          "❌ <b>Не указан ID новости</b>\n\nИспользуйте формат:\n<code>/delete ID</code>\n\nДля получения списка ID используйте /list"
        )
        return NextResponse.json({ ok: true })
      }

      await sendTelegramMessage(chatId, "⏳ <b>Удаляю новость...</b>")

      try {
        const deletedNews = await NewsDatabase.deleteNews(newsId)

        const successMessage = `✅ <b>Новость успешно удалена!</b>

📰 <b>Заголовок:</b> ${deletedNews.title}
⏰ <b>Время удаления:</b> ${new Date().toLocaleString("ru-RU")}

🌐 <b>Просмотреть:</b> <a href="${process.env.NEXT_PUBLIC_BASE_URL}/news">Страница новостей</a>`

        await sendTelegramMessage(chatId, successMessage)
      } catch (error) {
        await sendTelegramMessage(
          chatId,
          `❌ <b>Ошибка удаления</b>\n\n${String(error)}\n\nИспользуйте /list для получения актуального списка новостей`
        )
      }

      return NextResponse.json({ ok: true })
    }

    // Команда /status
    if (text === "/status") {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://example.com"
        const newsCount = await NewsDatabase.getNewsCount()
        const dbConnected = await NewsDatabase.testConnection()

        const statusMessage = `📊 <b>Статус системы</b>

🌐 <b>Сайт:</b> ${baseUrl}
🗄️ <b>База данных:</b> ${dbConnected ? "✅ Подключена" : "❌ Ошибка подключения"}
📰 <b>Всего новостей:</b> ${newsCount}
⏰ <b>Время проверки:</b> ${new Date().toLocaleString("ru-RU")}

🔗 <b>Ссылки:</b>
• <a href="${baseUrl}/news">Страница новостей</a>`

        await sendTelegramMessage(chatId, statusMessage)
      } catch (error) {
        await sendTelegramMessage(chatId, `❌ <b>Ошибка проверки статуса</b>\n\n${String(error)}`)
      }
      return NextResponse.json({ ok: true })
    }

    // Неизвестная команда
    await sendTelegramMessage(
      chatId,
      `❓ <b>Неизвестная команда</b>\n\nКоманда "${text}" не распознана.\n\nИспользуйте /start для просмотра доступных команд.`
    )
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const webhookUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getWebhookInfo`
    const response = await fetch(webhookUrl)
    const data = await response.json()

    const newsCount = await NewsDatabase.getNewsCount()
    const dbConnected = await NewsDatabase.testConnection()

    return NextResponse.json({
      status: "Telegram webhook handler",
      webhook_info: data,
      authorized_users: AUTHORIZED_USERS,
      bot_token_configured: !!TELEGRAM_BOT_TOKEN,
      base_url: process.env.NEXT_PUBLIC_BASE_URL,
      supabase_news_count: newsCount,
      supabase_connected: dbConnected,
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to get webhook info",
        supabase_connected: false,
        details: String(error),
      },
      { status: 500 },
    )
  }
}