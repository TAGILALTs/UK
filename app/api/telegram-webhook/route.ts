import { type NextRequest, NextResponse } from "next/server"

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
}

async function sendTelegramMessage(chatId: number, text: string) {
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

async function addNewsDirectly(title: string, description: string, author: string, image?: string) {
  try {
    // Инициализируем глобальное хранилище если его нет
    if (!global.newsStorage) {
      global.newsStorage = [
        {
          id: "welcome",
          title: "Добро пожаловать!",
          description: "Система новостей готова к работе. Теперь вы можете публиковать новости через Telegram бота.",
          date: new Date().toISOString(),
          author: "Система",
        },
      ]
    }

    // Создаем уникальный ID
    const newsId = `news_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const newNews = {
      id: newsId,
      title: title.trim(),
      description: description.trim(),
      image: image && typeof image === "string" ? image.trim() : undefined,
      date: new Date().toISOString(),
      author: author.trim(),
    }

    // Добавляем в начало массива
    global.newsStorage.unshift(newNews)

    return { success: true, news: newNews }
  } catch (error) {
    console.error("Error in addNewsDirectly:", error)
    return { success: false, error: String(error) }
  }
}

async function updateNewsDirectly(id: string, title: string, description: string, author: string, image?: string) {
  try {
    if (!global.newsStorage) {
      return { success: false, error: "Хранилище новостей не инициализировано" }
    }

    const newsIndex = global.newsStorage.findIndex((news) => news.id === id)

    if (newsIndex === -1) {
      return { success: false, error: "Новость не найдена" }
    }

    const updatedNews = {
      ...global.newsStorage[newsIndex],
      title: title.trim(),
      description: description.trim(),
      image: image && typeof image === "string" ? image.trim() : undefined,
      author: author.trim(),
    }

    global.newsStorage[newsIndex] = updatedNews

    return { success: true, news: updatedNews }
  } catch (error) {
    console.error("Error in updateNewsDirectly:", error)
    return { success: false, error: String(error) }
  }
}

async function deleteNewsDirectly(id: string) {
  try {
    if (!global.newsStorage) {
      return { success: false, error: "Хранилище новостей не инициализировано" }
    }

    if (id === "welcome") {
      return { success: false, error: "Нельзя удалить приветственное сообщение" }
    }

    const newsIndex = global.newsStorage.findIndex((news) => news.id === id)

    if (newsIndex === -1) {
      return { success: false, error: "Новость не найдена" }
    }

    const deletedNews = global.newsStorage[newsIndex]
    global.newsStorage.splice(newsIndex, 1)

    return { success: true, news: deletedNews }
  } catch (error) {
    console.error("Error in deleteNewsDirectly:", error)
    return { success: false, error: String(error) }
  }
}

function getNewsList() {
  if (!global.newsStorage) {
    return []
  }

  return global.newsStorage
    .filter((news) => news.id !== "welcome")
    .map((news, index) => `${index + 1}. ${news.title} (ID: ${news.id})`)
}

export async function POST(request: NextRequest) {
  try {
    const body: TelegramUpdate = await request.json()

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

      const result = await addNewsDirectly(title, description, userName, imageUrl || undefined)

      if (result.success) {
        const successMessage = `✅ <b>Новость с фото успешно добавлена!</b>

📰 <b>Заголовок:</b> ${title}
📝 <b>Описание:</b> ${description.length > 100 ? description.substring(0, 100) + "..." : description}
👤 <b>Автор:</b> ${userName}
📸 <b>Фото:</b> Прикреплено
⏰ <b>Время:</b> ${new Date().toLocaleString("ru-RU")}

🌐 <b>Просмотреть:</b> <a href="${process.env.NEXT_PUBLIC_BASE_URL}/news">Страница новостей</a>`

        await sendTelegramMessage(chatId, successMessage)
      } else {
        await sendTelegramMessage(chatId, `❌ <b>Ошибка публикации</b>\n\n${result.error}`)
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

Добро пожаловать, ${userName}!

📰 <b>Управление новостями:</b>
• /news - Добавить новость
• /list - Список всех новостей
• /edit - Редактировать новость
• /delete - Удалить новость
• /status - Проверить статус системы
• /test - Тестовая новость

📝 <b>Форматы команд:</b>
<code>/news Заголовок | Описание</code>
<code>/edit ID | Новый заголовок | Новое описание</code>
<code>/delete ID</code>

📸 <b>Новость с фото:</b>
Отправьте фото с подписью в формате:
<b>Заголовок | Описание</b>

💡 <b>Пример:</b>
<code>/news Важное объявление | Изменение графика работы офиса</code>`

      await sendTelegramMessage(chatId, welcomeMessage)
      return NextResponse.json({ ok: true })
    }

    // Команда /list - показать список новостей
    if (text === "/list") {
      const newsList = getNewsList()

      if (newsList.length === 0) {
        await sendTelegramMessage(chatId, "📰 <b>Список новостей пуст</b>\n\nИспользуйте /news для добавления новости")
      } else {
        const listMessage = `📰 <b>Список новостей (${newsList.length}):</b>

${newsList.join("\n")}

💡 <b>Для редактирования:</b>
<code>/edit ID | Новый заголовок | Новое описание</code>

🗑 <b>Для удаления:</b>
<code>/delete ID</code>`

        await sendTelegramMessage(chatId, listMessage)
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

      const result = await updateNewsDirectly(newsId, newTitle, newDescription, userName)

      if (result.success) {
        const successMessage = `✅ <b>Новость успешно обновлена!</b>

📰 <b>Новый заголовок:</b> ${newTitle}
📝 <b>Новое описание:</b> ${newDescription.length > 100 ? newDescription.substring(0, 100) + "..." : newDescription}
👤 <b>Автор:</b> ${userName}
⏰ <b>Время обновления:</b> ${new Date().toLocaleString("ru-RU")}

🌐 <b>Просмотреть:</b> <a href="${process.env.NEXT_PUBLIC_BASE_URL}/news">Страница новостей</a>`

        await sendTelegramMessage(chatId, successMessage)
      } else {
        await sendTelegramMessage(
          chatId,
          `❌ <b>Ошибка обновления</b>\n\n${result.error}\n\nИспользуйте /list для получения актуального списка новостей`,
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

      const result = await deleteNewsDirectly(newsId)

      if (result.success) {
        const successMessage = `✅ <b>Новость успешно удалена!</b>

📰 <b>Заголовок:</b> ${result.news?.title}
⏰ <b>Время удаления:</b> ${new Date().toLocaleString("ru-RU")}

🌐 <b>Просмотреть:</b> <a href="${process.env.NEXT_PUBLIC_BASE_URL}/news">Страница новостей</a>`

        await sendTelegramMessage(chatId, successMessage)
      } else {
        await sendTelegramMessage(
          chatId,
          `❌ <b>Ошибка удаления</b>\n\n${result.error}\n\nИспользуйте /list для получения актуального списка новостей`,
        )
      }

      return NextResponse.json({ ok: true })
    }

    // Команда /test - добавляет тестовую новость
    if (text === "/test") {
      const testTitle = `Тестовая новость ${new Date().toLocaleTimeString("ru-RU")}`
      const testDescription = `Это тестовая новость, добавленная ${new Date().toLocaleString("ru-RU")} пользователем ${userName}`

      const result = await addNewsDirectly(testTitle, testDescription, userName)

      if (result.success) {
        const successMessage = `✅ <b>Тестовая новость добавлена!</b>

📰 <b>Заголовок:</b> ${testTitle}
📝 <b>Описание:</b> ${testDescription}
👤 <b>Автор:</b> ${userName}
⏰ <b>Время:</b> ${new Date().toLocaleString("ru-RU")}

🌐 <b>Просмотреть:</b> <a href="${process.env.NEXT_PUBLIC_BASE_URL}/news">Страница новостей</a>`

        await sendTelegramMessage(chatId, successMessage)
      } else {
        await sendTelegramMessage(chatId, `❌ Ошибка добавления тестовой новости: ${result.error}`)
      }

      return NextResponse.json({ ok: true })
    }

    // Команда /status
    if (text === "/status") {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://ykdelta.vercel.app"
        const newsCount = global.newsStorage ? global.newsStorage.length : 0
        const userNewsCount = global.newsStorage ? global.newsStorage.filter((n) => n.id !== "welcome").length : 0

        const statusMessage = `📊 <b>Статус системы</b>

🌐 <b>Сайт:</b> ${baseUrl}
📰 <b>Система новостей:</b> ${newsCount > 0 ? "✅ Работает" : "❌ Пусто"}
📝 <b>Всего новостей:</b> ${newsCount}
📄 <b>Пользовательских новостей:</b> ${userNewsCount}
⏰ <b>Время проверки:</b> ${new Date().toLocaleString("ru-RU")}

🔗 <b>Ссылки:</b>
• <a href="${baseUrl}/news">Страница новостей</a>

💡 <b>Команды управления:</b>
• /list - Список новостей
• /test - Добавить тестовую новость
• /news Заголовок | Описание - Добавить новость
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

    // Команда /news
    if (text.startsWith("/news ")) {
      const newsContent = text.substring(6).trim()

      if (!newsContent) {
        await sendTelegramMessage(
          chatId,
          "❌ <b>Пустая новость</b>\n\nИспользуйте формат:\n<code>/news Заголовок | Описание</code>",
        )
        return NextResponse.json({ ok: true })
      }

      const parts = newsContent.split("|")
      if (parts.length < 2) {
        await sendTelegramMessage(
          chatId,
          "❌ <b>Неверный формат</b>\n\nИспользуйте:\n<code>/news Заголовок | Описание</code>\n\nПример:\n<code>/news Важная новость | Подробное описание события</code>",
        )
        return NextResponse.json({ ok: true })
      }

      const title = parts[0].trim()
      const description = parts.slice(1).join("|").trim()

      if (!title || !description) {
        await sendTelegramMessage(chatId, "❌ <b>Пустые поля</b>\n\nЗаголовок и описание не могут быть пустыми")
        return NextResponse.json({ ok: true })
      }

      await sendTelegramMessage(chatId, "⏳ <b>Добавляю новость на сайт...</b>")

      const result = await addNewsDirectly(title, description, userName)

      if (result.success) {
        const successMessage = `✅ <b>Новость успешно добавлена!</b>

📰 <b>Заголовок:</b> ${title}
📝 <b>Описание:</b> ${description.length > 100 ? description.substring(0, 100) + "..." : description}
👤 <b>Автор:</b> ${userName}
⏰ <b>Время:</b> ${new Date().toLocaleString("ru-RU")}

🌐 <b>Просмотреть:</b> <a href="${process.env.NEXT_PUBLIC_BASE_URL}/news">Страница новостей</a>`

        await sendTelegramMessage(chatId, successMessage)
      } else {
        const errorMessage = `❌ <b>Ошибка публикации</b>

Не удалось добавить новость на сайт.

💡 <b>Что делать:</b>
• Попробуйте команду /test для проверки
• Используйте команду /status для диагностики
• Обратитесь к администратору`

        await sendTelegramMessage(chatId, errorMessage)
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

    return NextResponse.json({
      status: "Telegram webhook handler",
      webhook_info: data,
      authorized_users: AUTHORIZED_USERS,
      bot_token_configured: !!TELEGRAM_BOT_TOKEN,
      base_url: process.env.NEXT_PUBLIC_BASE_URL,
      global_news_count: global.newsStorage ? global.newsStorage.length : 0,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to get webhook info" }, { status: 500 })
  }
}
