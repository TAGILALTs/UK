import { type NextRequest, NextResponse } from "next/server"
import { getAllNews, createNews, updateNews, deleteNews, getNewsById } from "@/lib/database"

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!
const AUTHORIZED_USERS = process.env.AUTHORIZED_TELEGRAM_USERS?.split(",") || []

interface TelegramUpdate {
  update_id: number
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
    text?: string
    date: number
  }
  callback_query?: {
    id: string
    from: {
      id: number
      first_name: string
      username?: string
    }
    message: {
      message_id: number
      chat: {
        id: number
      }
    }
    data: string
  }
}

// Состояния пользователей для создания/редактирования новостей
const userStates = new Map<
  number,
  {
    action: "creating" | "editing"
    step: "title" | "description" | "author" | "image" | "confirm"
    data: {
      id?: number
      title?: string
      description?: string
      author?: string
      image?: string
    }
  }
>()

async function sendMessage(chatId: number, text: string, replyMarkup?: any) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`

  const payload = {
    chat_id: chatId,
    text: text,
    parse_mode: "HTML",
    reply_markup: replyMarkup,
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
      console.error("Failed to send message:", await response.text())
    }
  } catch (error) {
    console.error("Error sending message:", error)
  }
}

async function editMessage(chatId: number, messageId: number, text: string, replyMarkup?: any) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/editMessageText`

  const payload = {
    chat_id: chatId,
    message_id: messageId,
    text: text,
    parse_mode: "HTML",
    reply_markup: replyMarkup,
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
      console.error("Failed to edit message:", await response.text())
    }
  } catch (error) {
    console.error("Error editing message:", error)
  }
}

async function answerCallbackQuery(callbackQueryId: string, text?: string) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/answerCallbackQuery`

  const payload = {
    callback_query_id: callbackQueryId,
    text: text,
  }

  try {
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
  } catch (error) {
    console.error("Error answering callback query:", error)
  }
}

function getMainMenuKeyboard() {
  return {
    inline_keyboard: [
      [
        { text: "📰 Список новостей", callback_data: "list_news" },
        { text: "➕ Создать новость", callback_data: "create_news" },
      ],
      [{ text: "📊 Статистика", callback_data: "stats" }],
    ],
  }
}

function getNewsListKeyboard(news: any[]) {
  const keyboard = news.map((item, index) => [
    { text: `${index + 1}. ${item.title.substring(0, 30)}...`, callback_data: `view_news_${item.id}` },
  ])

  keyboard.push([{ text: "🔙 Главное меню", callback_data: "main_menu" }])

  return { inline_keyboard: keyboard }
}

function getNewsActionKeyboard(newsId: number) {
  return {
    inline_keyboard: [
      [
        { text: "✏️ Редактировать", callback_data: `edit_news_${newsId}` },
        { text: "🗑️ Удалить", callback_data: `delete_news_${newsId}` },
      ],
      [
        { text: "🔙 К списку", callback_data: "list_news" },
        { text: "🏠 Главное меню", callback_data: "main_menu" },
      ],
    ],
  }
}

function getEditMenuKeyboard(newsId: number) {
  return {
    inline_keyboard: [
      [
        { text: "📝 Заголовок", callback_data: `edit_title_${newsId}` },
        { text: "📄 Описание", callback_data: `edit_description_${newsId}` },
      ],
      [
        { text: "👤 Автор", callback_data: `edit_author_${newsId}` },
        { text: "🖼️ Изображение", callback_data: `edit_image_${newsId}` },
      ],
      [
        { text: "🔙 К новости", callback_data: `view_news_${newsId}` },
        { text: "🏠 Главное меню", callback_data: "main_menu" },
      ],
    ],
  }
}

function getConfirmDeleteKeyboard(newsId: number) {
  return {
    inline_keyboard: [
      [
        { text: "✅ Да, удалить", callback_data: `confirm_delete_${newsId}` },
        { text: "❌ Отмена", callback_data: `view_news_${newsId}` },
      ],
    ],
  }
}

export async function POST(request: NextRequest) {
  try {
    const update: TelegramUpdate = await request.json()

    // Обработка текстовых сообщений
    if (update.message) {
      const { message } = update
      const userId = message.from.id
      const chatId = message.chat.id
      const text = message.text || ""

      // Проверка авторизации
      if (!AUTHORIZED_USERS.includes(userId.toString())) {
        await sendMessage(chatId, "❌ У вас нет доступа к этому боту.")
        return NextResponse.json({ ok: true })
      }

      // Команда отмены
      if (text === "/cancel") {
        userStates.delete(userId)
        await sendMessage(chatId, "❌ Операция отменена.", getMainMenuKeyboard())
        return NextResponse.json({ ok: true })
      }

      // Команда старт
      if (text === "/start") {
        userStates.delete(userId)
        await sendMessage(
          chatId,
          `👋 Добро пожаловать в панель управления новостями УК "ДЕЛЬТА"!\n\nВыберите действие:`,
          getMainMenuKeyboard(),
        )
        return NextResponse.json({ ok: true })
      }

      // Обработка состояний создания/редактирования
      const userState = userStates.get(userId)
      if (userState) {
        await handleUserState(userId, chatId, text, userState)
        return NextResponse.json({ ok: true })
      }

      // Если нет активного состояния, показываем главное меню
      await sendMessage(chatId, "Выберите действие:", getMainMenuKeyboard())
    }

    // Обработка callback запросов
    if (update.callback_query) {
      const { callback_query } = update
      const userId = callback_query.from.id
      const chatId = callback_query.message.chat.id
      const messageId = callback_query.message.message_id
      const data = callback_query.data

      // Проверка авторизации
      if (!AUTHORIZED_USERS.includes(userId.toString())) {
        await answerCallbackQuery(callback_query.id, "❌ У вас нет доступа")
        return NextResponse.json({ ok: true })
      }

      await handleCallbackQuery(userId, chatId, messageId, data, callback_query.id)
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Error processing webhook:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function handleUserState(userId: number, chatId: number, text: string, userState: any) {
  const { action, step, data } = userState

  if (action === "creating") {
    switch (step) {
      case "title":
        data.title = text
        userState.step = "description"
        await sendMessage(chatId, "📄 Введите описание новости:")
        break

      case "description":
        data.description = text
        userState.step = "author"
        await sendMessage(chatId, "👤 Введите имя автора:")
        break

      case "author":
        data.author = text
        userState.step = "image"
        await sendMessage(chatId, '🖼️ Введите URL изображения (или отправьте "нет" чтобы пропустить):')
        break

      case "image":
        if (text.toLowerCase() !== "нет") {
          data.image = text
        }
        userState.step = "confirm"

        const confirmText = `
📰 <b>Подтверждение создания новости</b>

<b>Заголовок:</b> ${data.title}
<b>Описание:</b> ${data.description}
<b>Автор:</b> ${data.author}
<b>Изображение:</b> ${data.image || "Не указано"}

Создать новость?`

        await sendMessage(chatId, confirmText, {
          inline_keyboard: [
            [
              { text: "✅ Создать", callback_data: "confirm_create" },
              { text: "❌ Отмена", callback_data: "cancel_create" },
            ],
          ],
        })
        break
    }
  } else if (action === "editing") {
    const newsId = data.id!

    try {
      const updateData: any = {}

      switch (step) {
        case "title":
          updateData.title = text
          break
        case "description":
          updateData.description = text
          break
        case "author":
          updateData.author = text
          break
        case "image":
          if (text.toLowerCase() !== "нет") {
            updateData.image = text
          } else {
            updateData.image = null
          }
          break
      }

      await updateNews(newsId, updateData)
      userStates.delete(userId)

      await sendMessage(chatId, "✅ Новость успешно обновлена!", getNewsActionKeyboard(newsId))
    } catch (error) {
      await sendMessage(chatId, "❌ Ошибка при обновлении новости.", getMainMenuKeyboard())
      userStates.delete(userId)
    }
  }
}

async function handleCallbackQuery(
  userId: number,
  chatId: number,
  messageId: number,
  data: string,
  callbackQueryId: string,
) {
  await answerCallbackQuery(callbackQueryId)

  if (data === "main_menu") {
    userStates.delete(userId)
    await editMessage(chatId, messageId, "Выберите действие:", getMainMenuKeyboard())
  } else if (data === "list_news") {
    try {
      const news = await getAllNews()
      if (news.length === 0) {
        await editMessage(chatId, messageId, "📰 Новостей пока нет.", getMainMenuKeyboard())
      } else {
        await editMessage(chatId, messageId, "📰 Список новостей:", getNewsListKeyboard(news))
      }
    } catch (error) {
      await editMessage(chatId, messageId, "❌ Ошибка при загрузке новостей.", getMainMenuKeyboard())
    }
  } else if (data === "create_news") {
    userStates.set(userId, {
      action: "creating",
      step: "title",
      data: {},
    })
    await editMessage(chatId, messageId, "📝 Введите заголовок новости:")
  } else if (data === "stats") {
    try {
      const news = await getAllNews()
      const statsText = `
📊 <b>Статистика системы</b>

📰 Всего новостей: ${news.length}
📅 Последняя новость: ${news.length > 0 ? new Date(news[0].date).toLocaleDateString("ru-RU") : "Нет"}
👤 Активных пользователей: ${AUTHORIZED_USERS.length}`

      await editMessage(chatId, messageId, statsText, getMainMenuKeyboard())
    } catch (error) {
      await editMessage(chatId, messageId, "❌ Ошибка при загрузке статистики.", getMainMenuKeyboard())
    }
  } else if (data.startsWith("view_news_")) {
    const newsId = Number.parseInt(data.replace("view_news_", ""))
    try {
      const news = await getNewsById(newsId)
      if (news) {
        const newsText = `
📰 <b>${news.title}</b>

📄 <b>Описание:</b>
${news.description}

👤 <b>Автор:</b> ${news.author}
📅 <b>Дата:</b> ${new Date(news.date).toLocaleDateString("ru-RU")}
${news.image ? `🖼️ <b>Изображение:</b> ${news.image}` : ""}`

        await editMessage(chatId, messageId, newsText, getNewsActionKeyboard(newsId))
      } else {
        await editMessage(chatId, messageId, "❌ Новость не найдена.", getMainMenuKeyboard())
      }
    } catch (error) {
      await editMessage(chatId, messageId, "❌ Ошибка при загрузке новости.", getMainMenuKeyboard())
    }
  } else if (data.startsWith("edit_news_")) {
    const newsId = Number.parseInt(data.replace("edit_news_", ""))
    await editMessage(chatId, messageId, "✏️ Что хотите изменить?", getEditMenuKeyboard(newsId))
  } else if (data.startsWith("edit_title_")) {
    const newsId = Number.parseInt(data.replace("edit_title_", ""))
    userStates.set(userId, {
      action: "editing",
      step: "title",
      data: { id: newsId },
    })
    await editMessage(chatId, messageId, "📝 Введите новый заголовок:")
  } else if (data.startsWith("edit_description_")) {
    const newsId = Number.parseInt(data.replace("edit_description_", ""))
    userStates.set(userId, {
      action: "editing",
      step: "description",
      data: { id: newsId },
    })
    await editMessage(chatId, messageId, "📄 Введите новое описание:")
  } else if (data.startsWith("edit_author_")) {
    const newsId = Number.parseInt(data.replace("edit_author_", ""))
    userStates.set(userId, {
      action: "editing",
      step: "author",
      data: { id: newsId },
    })
    await editMessage(chatId, messageId, "👤 Введите нового автора:")
  } else if (data.startsWith("edit_image_")) {
    const newsId = Number.parseInt(data.replace("edit_image_", ""))
    userStates.set(userId, {
      action: "editing",
      step: "image",
      data: { id: newsId },
    })
    await editMessage(chatId, messageId, '🖼️ Введите новый URL изображения (или "нет" для удаления):')
  } else if (data.startsWith("delete_news_")) {
    const newsId = Number.parseInt(data.replace("delete_news_", ""))
    await editMessage(
      chatId,
      messageId,
      "🗑️ Вы уверены, что хотите удалить эту новость?",
      getConfirmDeleteKeyboard(newsId),
    )
  } else if (data.startsWith("confirm_delete_")) {
    const newsId = Number.parseInt(data.replace("confirm_delete_", ""))
    try {
      await deleteNews(newsId)
      await editMessage(chatId, messageId, "✅ Новость успешно удалена!", getMainMenuKeyboard())
    } catch (error) {
      await editMessage(chatId, messageId, "❌ Ошибка при удалении новости.", getMainMenuKeyboard())
    }
  } else if (data === "confirm_create") {
    const userState = userStates.get(userId)
    if (userState && userState.action === "creating") {
      try {
        const newsData = {
          title: userState.data.title!,
          description: userState.data.description!,
          author: userState.data.author!,
          date: new Date().toISOString(),
          image: userState.data.image || null,
        }

        await createNews(newsData)
        userStates.delete(userId)

        await editMessage(chatId, messageId, "✅ Новость успешно создана!", getMainMenuKeyboard())
      } catch (error) {
        await editMessage(chatId, messageId, "❌ Ошибка при создании новости.", getMainMenuKeyboard())
        userStates.delete(userId)
      }
    }
  } else if (data === "cancel_create") {
    userStates.delete(userId)
    await editMessage(chatId, messageId, "❌ Создание новости отменено.", getMainMenuKeyboard())
  }
}
