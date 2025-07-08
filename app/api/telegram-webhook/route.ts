import { type NextRequest, NextResponse } from "next/server"
import { NewsDatabase } from "@/lib/database"

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const AUTHORIZED_USERS = process.env.AUTHORIZED_TELEGRAM_USERS?.split(",") || []

interface TelegramMessage {
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
}

interface TelegramCallbackQuery {
  id: string
  from: {
    id: number
    first_name: string
    username?: string
  }
  message: TelegramMessage
  data: string
}

interface TelegramUpdate {
  update_id: number
  message?: TelegramMessage
  callback_query?: TelegramCallbackQuery
}

// Состояние пользователей для создания новостей
const userStates = new Map<number, any>()

async function sendTelegramMessage(chatId: number, text: string, replyMarkup?: any) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`

  const payload = {
    chat_id: chatId,
    text: text,
    parse_mode: "HTML",
    ...(replyMarkup && { reply_markup: replyMarkup }),
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Telegram API error:", response.status, errorText)
      throw new Error(`Telegram API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error sending Telegram message:", error)
    throw error
  }
}

async function answerCallbackQuery(callbackQueryId: string, text?: string) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/answerCallbackQuery`

  const payload = {
    callback_query_id: callbackQueryId,
    ...(text && { text }),
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      console.error("Error answering callback query:", response.status)
    }
  } catch (error) {
    console.error("Error answering callback query:", error)
  }
}

function isAuthorized(userId: number): boolean {
  return AUTHORIZED_USERS.includes(userId.toString())
}

function getMainKeyboard() {
  return {
    inline_keyboard: [
      [
        { text: "📰 Список новостей", callback_data: "list_news" },
        { text: "➕ Добавить новость", callback_data: "add_news" },
      ],
      [
        { text: "📊 Статистика", callback_data: "stats" },
        { text: "🔄 Обновить", callback_data: "refresh" },
      ],
    ],
  }
}

async function handleMessage(message: TelegramMessage) {
  const userId = message.from.id
  const chatId = message.chat.id
  const text = message.text || ""

  console.log(`Message from ${message.from.first_name} (${userId}): ${text}`)

  if (!isAuthorized(userId)) {
    await sendTelegramMessage(chatId, "❌ У вас нет доступа к этому боту.")
    return
  }

  // Проверяем, находится ли пользователь в процессе создания новости
  const userState = userStates.get(userId)

  if (userState) {
    await handleNewsCreationStep(userId, chatId, text, userState)
    return
  }

  // Обработка команд
  if (text.startsWith("/start")) {
    const welcomeMessage = `
🏢 <b>Добро пожаловать в панель управления новостями!</b>

Привет, ${message.from.first_name}! 👋

Вы можете:
• 📰 Просматривать список новостей
• ➕ Добавлять новые новости
• ✏️ Редактировать существующие
• 🗑️ Удалять новости
• 📊 Просматривать статистику

Выберите действие из меню ниже:
    `
    await sendTelegramMessage(chatId, welcomeMessage, getMainKeyboard())
  } else if (text.startsWith("/help")) {
    const helpMessage = `
📖 <b>Справка по командам:</b>

<b>Основные команды:</b>
/start - Главное меню
/help - Эта справка
/stats - Статистика новостей
/list - Список всех новостей

<b>Управление новостями:</b>
• Используйте кнопки в меню для навигации
• При создании новости следуйте пошаговым инструкциям
• Вы можете отменить создание новости командой /cancel

<b>Форматирование:</b>
• Заголовки и описания могут содержать любой текст
• Поддерживаются ссылки на изображения
• Длинный текст автоматически форматируется
    `
    await sendTelegramMessage(chatId, helpMessage, getMainKeyboard())
  } else if (text.startsWith("/cancel")) {
    userStates.delete(userId)
    await sendTelegramMessage(chatId, "✅ Операция отменена.", getMainKeyboard())
  } else if (text.startsWith("/stats")) {
    await handleStatsCommand(chatId)
  } else if (text.startsWith("/list")) {
    await handleListCommand(chatId)
  } else {
    await sendTelegramMessage(
      chatId,
      "❓ Неизвестная команда. Используйте /help для получения справки.",
      getMainKeyboard(),
    )
  }
}

async function handleCallbackQuery(callbackQuery: TelegramCallbackQuery) {
  const userId = callbackQuery.from.id
  const chatId = callbackQuery.message.chat.id
  const data = callbackQuery.data

  console.log(`Callback from ${callbackQuery.from.first_name} (${userId}): ${data}`)

  if (!isAuthorized(userId)) {
    await answerCallbackQuery(callbackQuery.id, "❌ У вас нет доступа")
    return
  }

  await answerCallbackQuery(callbackQuery.id)

  switch (data) {
    case "list_news":
      await handleListCommand(chatId)
      break
    case "add_news":
      await startNewsCreation(userId, chatId)
      break
    case "stats":
      await handleStatsCommand(chatId)
      break
    case "refresh":
      await sendTelegramMessage(chatId, "🔄 Обновлено!", getMainKeyboard())
      break
    default:
      if (data.startsWith("delete_")) {
        const newsId = data.replace("delete_", "")
        await handleDeleteNews(chatId, newsId)
      } else if (data.startsWith("view_")) {
        const newsId = data.replace("view_", "")
        await handleViewNews(chatId, newsId)
      }
      break
  }
}

async function startNewsCreation(userId: number, chatId: number) {
  userStates.set(userId, { step: "title" })

  const message = `
📝 <b>Создание новой новости</b>

<b>Шаг 1/4:</b> Введите заголовок новости

💡 <i>Совет: Заголовок должен быть кратким и информативным</i>

Для отмены используйте команду /cancel
  `

  await sendTelegramMessage(chatId, message)
}

async function handleNewsCreationStep(userId: number, chatId: number, text: string, userState: any) {
  switch (userState.step) {
    case "title":
      userState.title = text.trim()
      userState.step = "description"

      const descMessage = `
✅ <b>Заголовок сохранен:</b> ${userState.title}

<b>Шаг 2/4:</b> Введите описание новости

💡 <i>Совет: Опишите новость подробно. Можно использовать несколько абзацев</i>

Для отмены используйте команду /cancel
      `

      await sendTelegramMessage(chatId, descMessage)
      break

    case "description":
      userState.description = text.trim()
      userState.step = "author"

      const authorMessage = `
✅ <b>Описание сохранено</b>

<b>Шаг 3/4:</b> Введите имя автора

💡 <i>Например: "Администрация УК" или ваше имя</i>

Для отмены используйте команду /cancel
      `

      await sendTelegramMessage(chatId, authorMessage)
      break

    case "author":
      userState.author = text.trim()
      userState.step = "image"

      const imageMessage = `
✅ <b>Автор сохранен:</b> ${userState.author}

<b>Шаг 4/4:</b> Отправьте ссылку на изображение (необязательно)

💡 <i>Можете отправить URL изображения или написать "нет" чтобы пропустить</i>

Для отмены используйте команду /cancel
      `

      await sendTelegramMessage(chatId, imageMessage)
      break

    case "image":
      const imageUrl = text.trim().toLowerCase() === "нет" ? undefined : text.trim()

      try {
        const news = await NewsDatabase.addNews(userState.title, userState.description, userState.author, imageUrl)

        userStates.delete(userId)

        const successMessage = `
🎉 <b>Новость успешно создана!</b>

📰 <b>Заголовок:</b> ${news.title}
👤 <b>Автор:</b> ${news.author}
📅 <b>Дата:</b> ${new Date(news.date).toLocaleString("ru-RU")}
${imageUrl ? `🖼️ <b>Изображение:</b> Добавлено` : ""}

Новость опубликована и доступна на сайте.
        `

        await sendTelegramMessage(chatId, successMessage, getMainKeyboard())
      } catch (error) {
        console.error("Error creating news:", error)
        await sendTelegramMessage(chatId, `❌ Ошибка при создании новости: ${String(error)}`, getMainKeyboard())
        userStates.delete(userId)
      }
      break
  }
}

async function handleListCommand(chatId: number) {
  try {
    const newsList = await NewsDatabase.getNewsListForTelegram()

    if (newsList.length === 0) {
      await sendTelegramMessage(chatId, "📰 Новостей пока нет.", getMainKeyboard())
      return
    }

    const message = `📰 <b>Список новостей (${newsList.length}):</b>\n\n${newsList.join("\n")}`

    // Создаем кнопки для первых 5 новостей
    const news = await NewsDatabase.getAllNews()
    const buttons = news
      .slice(0, 5)
      .map((item) => [{ text: `👁️ ${item.title.substring(0, 30)}...`, callback_data: `view_${item.id}` }])

    buttons.push([{ text: "🔙 Назад в меню", callback_data: "refresh" }])

    await sendTelegramMessage(chatId, message, { inline_keyboard: buttons })
  } catch (error) {
    console.error("Error listing news:", error)
    await sendTelegramMessage(chatId, `❌ Ошибка при получении списка: ${String(error)}`, getMainKeyboard())
  }
}

async function handleStatsCommand(chatId: number) {
  try {
    const count = await NewsDatabase.getNewsCount()
    const news = await NewsDatabase.getAllNews()

    const recentNews = news.slice(0, 3)
    const recentList = recentNews
      .map((item, index) => `${index + 1}. ${item.title} (${new Date(item.date).toLocaleDateString("ru-RU")})`)
      .join("\n")

    const message = `
📊 <b>Статистика новостей</b>

📰 <b>Всего новостей:</b> ${count}
📅 <b>Последнее обновление:</b> ${new Date().toLocaleString("ru-RU")}

${recentNews.length > 0 ? `🔥 <b>Последние новости:</b>\n${recentList}` : ""}

🌐 <b>Статус системы:</b> ✅ Работает
    `

    await sendTelegramMessage(chatId, message, getMainKeyboard())
  } catch (error) {
    console.error("Error getting stats:", error)
    await sendTelegramMessage(chatId, `❌ Ошибка при получении статистики: ${String(error)}`, getMainKeyboard())
  }
}

async function handleViewNews(chatId: number, newsId: string) {
  try {
    const news = await NewsDatabase.getNewsById(newsId)

    if (!news) {
      await sendTelegramMessage(chatId, "❌ Новость не найдена.", getMainKeyboard())
      return
    }

    const message = `
📰 <b>${news.title}</b>

👤 <b>Автор:</b> ${news.author}
📅 <b>Дата:</b> ${new Date(news.date).toLocaleString("ru-RU")}

📝 <b>Описание:</b>
${news.description}

${news.image ? `🖼️ <b>Изображение:</b> ${news.image}` : ""}
    `

    const keyboard = {
      inline_keyboard: [
        [{ text: "🗑️ Удалить", callback_data: `delete_${news.id}` }],
        [{ text: "🔙 К списку", callback_data: "list_news" }],
      ],
    }

    await sendTelegramMessage(chatId, message, keyboard)
  } catch (error) {
    console.error("Error viewing news:", error)
    await sendTelegramMessage(chatId, `❌ Ошибка при просмотре новости: ${String(error)}`, getMainKeyboard())
  }
}

async function handleDeleteNews(chatId: number, newsId: string) {
  try {
    const deletedNews = await NewsDatabase.deleteNews(newsId)

    const message = `
✅ <b>Новость удалена</b>

📰 <b>Заголовок:</b> ${deletedNews.title}
👤 <b>Автор:</b> ${deletedNews.author}
📅 <b>Дата:</b> ${new Date(deletedNews.date).toLocaleString("ru-RU")}
    `

    await sendTelegramMessage(chatId, message, getMainKeyboard())
  } catch (error) {
    console.error("Error deleting news:", error)
    await sendTelegramMessage(chatId, `❌ Ошибка при удалении: ${String(error)}`, getMainKeyboard())
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!TELEGRAM_BOT_TOKEN) {
      console.error("TELEGRAM_BOT_TOKEN is not set")
      return NextResponse.json({ error: "Bot token not configured" }, { status: 500 })
    }

    const body: TelegramUpdate = await request.json()
    console.log("Received Telegram update:", JSON.stringify(body, null, 2))

    if (body.message) {
      await handleMessage(body.message)
    } else if (body.callback_query) {
      await handleCallbackQuery(body.callback_query)
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Error processing Telegram webhook:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    status: "Telegram webhook is running",
    timestamp: new Date().toISOString(),
  })
}
