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

// Состояние для отслеживания процесса создания новости
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

      const userState = userStates.get(userId)

      if (data === "confirm_publish" && userState) {
        try {
          const author = `${callbackQuery.from.first_name}${callbackQuery.from.username ? ` (@${callbackQuery.from.username})` : ""}`

          await NewsDatabase.addNews(userState.data.title!, userState.data.description!, author, userState.data.image)

          userStates.delete(userId)

          await sendTelegramMessage(chatId, "🎉 Новость успешно опубликована!")
        } catch (error) {
          console.error("Error publishing news:", error)
          await sendTelegramMessage(chatId, `❌ Ошибка при публикации новости: ${error}`)
        }
      } else if (data === "cancel_publish") {
        userStates.delete(userId)
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
    const userName = message.from.first_name || "Пользователь"

    // Проверка авторизации
    if (!AUTHORIZED_USERS.includes(userId)) {
      await sendTelegramMessage(chatId, `❌ У вас нет прав для использования этого бота.`)
      return NextResponse.json({ ok: true })
    }

    // Обработка фотографий
    if (message.photo && message.photo.length > 0) {
      const userState = userStates.get(message.from.id)

      if (userState && userState.step === "image") {
        // Берем изображение наибольшего размера
        const photo = message.photo[message.photo.length - 1]
        const imageUrl = await getFileUrl(photo.file_id)

        if (imageUrl) {
          userState.data.image = imageUrl
          await sendTelegramMessage(chatId, "✅ Изображение сохранено.")
        } else {
          await sendTelegramMessage(chatId, "❌ Ошибка при сохранении изображения. Продолжаем без изображения.")
        }

        userState.step = "confirm"

        const preview = `📋 <b>Предварительный просмотр новости:</b>

<b>Заголовок:</b> ${userState.data.title}

<b>Описание:</b> ${userState.data.description}

<b>Изображение:</b> ${userState.data.image ? "Да" : "Нет"}

<b>Автор:</b> ${message.from.first_name}${message.from.username ? ` (@${message.from.username})` : ""}

Подтвердите публикацию новости:`

        await sendTelegramMessage(chatId, preview, {
          inline_keyboard: [
            [
              { text: "✅ Опубликовать", callback_data: "confirm_publish" },
              { text: "❌ Отменить", callback_data: "cancel_publish" },
            ],
          ],
        })

        return NextResponse.json({ ok: true })
      }

      const caption = message.caption || ""

      if (!caption.includes("|")) {
        await sendTelegramMessage(
          chatId,
          "❌ <b>Неверный формат</b>\n\nДля новости с фото используйте:\n<b>Заголовок | Описание</b>\n\nПример:\n<b>Важная новость | Подробное описание</b>",
        )
        return NextResponse.json({ ok: true })
      }

      const parts = caption.split("|")
      const title = parts[0].trim()
      const description = parts.slice(1).join("|").trim()

      if (!title || !description) {
        await sendTelegramMessage(chatId, "❌ <b>Пустые поля</b>\n\nЗаголовок и описание не могут быть пустыми")
        return NextResponse.json({ ok: true })
      }

      // Получаем самое большое фото
      const largestPhoto = message.photo.reduce((prev, current) =>
        prev.width * prev.height > current.width * current.height ? prev : current,
      )

      const imageUrl = await getFileUrl(largestPhoto.file_id)

      await sendTelegramMessage(chatId, "⏳ <b>Добавляю новость с фото...</b>")

      try {
        const newNews = await NewsDatabase.addNews(title, description, userName, imageUrl || undefined)

        const successMessage = `✅ <b>Новость с фото успешно добавлена!</b>

📰 <b>Заголовок:</b> ${title}
📝 <b>Описание:</b> ${description.length > 100 ? description.substring(0, 100) + "..." : description}
👤 <b>Автор:</b> ${userName}
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

    // Обработка состояний создания новости
    const userState = userStates.get(message.from.id)
    if (userState) {
      switch (userState.step) {
        case "title":
          if (!text.trim()) {
            await sendTelegramMessage(chatId, "❌ Заголовок не может быть пустым. Попробуйте еще раз:")
            return NextResponse.json({ ok: true })
          }

          userState.data.title = text.trim()
          userState.step = "description"

          await sendTelegramMessage(
            chatId,
            `✅ Заголовок сохранен: "${text.trim()}"

📝 <b>Создание новости - Шаг 2/4</b>

Введите <b>описание</b> новости:

<i>Пример: "С 1 января вводятся новые правила парковки. Подробности в объявлении на доске."</i>`,
          )
          return NextResponse.json({ ok: true })

        case "description":
          if (!text.trim()) {
            await sendTelegramMessage(chatId, "❌ Описание не может быть пустым. Попробуйте еще раз:")
            return NextResponse.json({ ok: true })
          }

          userState.data.description = text.trim()
          userState.step = "image"

          await sendTelegramMessage(
            chatId,
            `✅ Описание сохранено.

📷 <b>Создание новости - Шаг 3/4</b>

Отправьте <b>изображение</b> для новости или напишите "пропустить":

<i>Изображение поможет сделать новость более привлекательной.</i>`,
          )
          return NextResponse.json({ ok: true })

        case "image":
          if (text.toLowerCase() === "пропустить") {
            await sendTelegramMessage(chatId, "✅ Изображение пропущено.")
          } else {
            await sendTelegramMessage(
              chatId,
              "❌ Отправьте изображение или напишите 'пропустить' для продолжения без изображения.",
            )
            return NextResponse.json({ ok: true })
          }

          userState.step = "confirm"

          const preview = `📋 <b>Предварительный просмотр новости:</b>

<b>Заголовок:</b> ${userState.data.title}

<b>Описание:</b> ${userState.data.description}

<b>Изображение:</b> ${userState.data.image ? "Да" : "Нет"}

<b>Автор:</b> ${message.from.first_name}${message.from.username ? ` (@${message.from.username})` : ""}

Подтвердите публикацию новости:`

          await sendTelegramMessage(chatId, preview, {
            inline_keyboard: [
              [
                { text: "✅ Опубликовать", callback_data: "confirm_publish" },
                { text: "❌ Отменить", callback_data: "cancel_publish" },
              ],
            ],
          })
          return NextResponse.json({ ok: true })
      }
    }

    // Команда /start
    if (text === "/start") {
      const welcomeMessage = `🏢 <b>Бот управляющей компании</b>

Добро пожаловать, ${userName}!

📰 <b>Управление новостями:</b>
• /news - Создать новость (пошагово)
• /list - Список всех новостей
• /edit - Редактировать новость
• /delete - Удалить новость
• /status - Проверить статус системы
• /test - Тестовая новость

📝 <b>Форматы команд:</b>
<code>/news</code> - запустить мастер создания новости
<code>/edit ID | Новый заголовок | Новое описание</code>
<code>/delete ID</code>

📸 <b>Новость с фото:</b>
Отправьте фото с подписью в формате:
<b>Заголовок | Описание</b>

💡 <b>Пример:</b>
<code>/news</code> - затем следуйте инструкциям`

      await sendTelegramMessage(chatId, welcomeMessage)
      return NextResponse.json({ ok: true })
    }

    // Команда /news - запуск мастера создания новости
    if (text === "/news") {
      userStates.set(message.from.id, {
        step: "title",
        data: {},
      })
      await sendTelegramMessage(
        chatId,
        `📝 <b>Создание новости - Шаг 1/4</b>

Введите <b>заголовок</b> новости:

<i>Пример: "Новые правила парковки во дворе"</i>`,
      )
      return NextResponse.json({ ok: true })
    }

    // Команда /list - показать список новостей
    if (text === "/list") {
      try {
        const newsList = await NewsDatabase.getNewsListForTelegram()

        if (newsList.length === 0) {
          await sendTelegramMessage(
            chatId,
            "📰 <b>Список новостей пуст</b>\n\nИспользуйте /news для добавления новости",
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
          "❌ <b>Пустая команда редактирования</b>\n\nИспользуйте формат:\n<code>/edit ID | Новый заголовок | Новое описание</code>\n\nДля получения списка ID используйте /list",
        )
        return NextResponse.json({ ok: true })
      }

      const parts = editContent.split("|")
      if (parts.length < 3) {
        await sendTelegramMessage(
          chatId,
          "❌ <b>Неверный формат</b>\n\nИспользуйте:\n<code>/edit ID | Новый заголовок | Новое описание</code>\n\nПример:\n<code>/edit news_123 | Обновленный заголовок | Обновленное описание</code>",
        )
        return NextResponse.json({ ok: true })
      }

      const newsId = parts[0].trim()
      const newTitle = parts[1].trim()
      const newDescription = parts.slice(2).join("|").trim()

      if (!newsId || !newTitle || !newDescription) {
        await sendTelegramMessage(chatId, "❌ <b>Пустые поля</b>\n\nID, заголовок и описание не могут быть пустыми")
        return NextResponse.json({ ok: true })
      }

      await sendTelegramMessage(chatId, "⏳ <b>Обновляю новость...</b>")

      try {
        const updatedNews = await NewsDatabase.updateNews(newsId, newTitle, newDescription, userName)

        const successMessage = `✅ <b>Новость успешно обновлена!</b>

📰 <b>Новый заголовок:</b> ${newTitle}
📝 <b>Новое описание:</b> ${newDescription.length > 100 ? newDescription.substring(0, 100) + "..." : newDescription}
👤 <b>Автор:</b> ${userName}
⏰ <b>Время обновления:</b> ${new Date().toLocaleString("ru-RU")}

🌐 <b>Просмотреть:</b> <a href="${process.env.NEXT_PUBLIC_BASE_URL}/news">Страница новостей</a>`

        await sendTelegramMessage(chatId, successMessage)
      } catch (error) {
        await sendTelegramMessage(
          chatId,
          `❌ <b>Ошибка обновления</b>\n\n${String(error)}\n\nИспользуйте /list для получения актуального списка новостей`,
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
          "❌ <b>Не указан ID новости</b>\n\nИспользуйте формат:\n<code>/delete ID</code>\n\nДля получения списка ID используйте /list",
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
          `❌ <b>Ошибка удаления</b>\n\n${String(error)}\n\nИспользуйте /list для получения актуального списка новостей`,
        )
      }

      return NextResponse.json({ ok: true })
    }

    // Команда /test - добавляет тестовую новость
    if (text === "/test") {
      const testTitle = `Тестовая новость ${new Date().toLocaleTimeString("ru-RU")}`
      const testDescription = `Это тестовая новость, добавленная ${new Date().toLocaleString("ru-RU")} пользователем ${userName}`

      try {
        const newNews = await NewsDatabase.addNews(testTitle, testDescription, userName)

        const successMessage = `✅ <b>Тестовая новость добавлена!</b>

📰 <b>Заголовок:</b> ${testTitle}
📝 <b>Описание:</b> ${testDescription}
👤 <b>Автор:</b> ${userName}
⏰ <b>Время:</b> ${new Date().toLocaleString("ru-RU")}

🌐 <b>Просмотреть:</b> <a href="${process.env.NEXT_PUBLIC_BASE_URL}/news">Страница новостей</a>`

        await sendTelegramMessage(chatId, successMessage)
      } catch (error) {
        await sendTelegramMessage(chatId, `❌ Ошибка добавления тестовой новости: ${String(error)}`)
      }

      return NextResponse.json({ ok: true })
    }

    // Команда /status
    if (text === "/status") {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://ykdelta.vercel.app"
        const newsCount = await NewsDatabase.getNewsCount()
        const userNewsCount = newsCount > 0 ? newsCount - 1 : 0 // Исключаем welcome сообщение
        const dbConnected = await NewsDatabase.testConnection()

        const statusMessage = `📊 <b>Статус системы</b>

🌐 <b>Сайт:</b> ${baseUrl}
🗄️ <b>База данных Supabase:</b> ${dbConnected ? "✅ Подключена" : "❌ Ошибка подключения"}
📰 <b>Система новостей:</b> ${newsCount > 0 ? "✅ Работает" : "❌ Пусто"}
📝 <b>Всего новостей:</b> ${newsCount}
📄 <b>Пользовательских новостей:</b> ${userNewsCount}
⏰ <b>Время проверки:</b> ${new Date().toLocaleString("ru-RU")}

🔗 <b>Ссылки:</b>
• <a href="${baseUrl}/news">Страница новостей</a>

💡 <b>Команды управления:</b>
• /list - Список новостей
• /test - Добавить тестовую новость
• /news - Создать новость (мастер)
• /edit ID | Заголовок | Описание - Редактировать
• /delete ID - Удалить новость
• 📸 Отправить фото с подписью - Новость с фото`

        await sendTelegramMessage(chatId, statusMessage)
      } catch (error) {
        console.error("Status check error:", error)
        await sendTelegramMessage(chatId, `❌ <b>Ошибка проверки статуса</b>\n\n${String(error)}`)
      }
      return NextResponse.json({ ok: true })
    }

    // Неизвестная команда
    await sendTelegramMessage(
      chatId,
      `❓ <b>Неизвестная команда</b>\n\nКоманда "${text}" не распознана.\n\nИспользуйте /start для просмотра доступных команд.`,
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
