const https = require("https")

// Конфигурация
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "8069781675:AAHZ-0Lu_THbc-OFblUSmQjD9vuPeB9_YuI"
const WEBHOOK_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://ykdelta.vercel.app"

console.log("🤖 Настройка Telegram бота...")
console.log("Bot Token:", BOT_TOKEN ? "Установлен" : "НЕ УСТАНОВЛЕН")
console.log("Webhook URL:", WEBHOOK_URL)

// Функция для HTTP запросов
function makeRequest(url, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      method: data ? "POST" : "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }

    const req = https.request(url, options, (res) => {
      let body = ""
      res.on("data", (chunk) => {
        body += chunk
      })
      res.on("end", () => {
        try {
          const result = JSON.parse(body)
          resolve(result)
        } catch (error) {
          reject(new Error(`Ошибка парсинга JSON: ${error.message}`))
        }
      })
    })

    req.on("error", (error) => {
      reject(error)
    })

    if (data) {
      req.write(JSON.stringify(data))
    }

    req.end()
  })
}

async function setupWebhook() {
  try {
    console.log("\n📡 Настройка webhook...")

    const webhookUrl = `${WEBHOOK_URL}/api/telegram-webhook`
    const setWebhookUrl = `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`

    const response = await makeRequest(setWebhookUrl, {
      url: webhookUrl,
      allowed_updates: ["message"],
    })

    if (response.ok) {
      console.log("✅ Webhook успешно установлен!")
      console.log("📍 URL:", webhookUrl)
    } else {
      console.error("❌ Ошибка установки webhook:", response.description)
    }

    return response.ok
  } catch (error) {
    console.error("❌ Ошибка при настройке webhook:", error.message)
    return false
  }
}

async function setCommands() {
  try {
    console.log("\n📝 Установка команд бота...")

    const commands = [
      { command: "start", description: "Начать работу с ботом" },
      { command: "news", description: "Добавить новость" },
      { command: "list", description: "Список всех новостей" },
      { command: "edit", description: "Редактировать новость" },
      { command: "delete", description: "Удалить новость" },
      { command: "status", description: "Проверить статус системы" },
      { command: "test", description: "Добавить тестовую новость" },
    ]

    const setCommandsUrl = `https://api.telegram.org/bot${BOT_TOKEN}/setMyCommands`
    const response = await makeRequest(setCommandsUrl, { commands })

    if (response.ok) {
      console.log("✅ Команды успешно установлены!")
      commands.forEach((cmd) => {
        console.log(`  /${cmd.command} - ${cmd.description}`)
      })
    } else {
      console.error("❌ Ошибка установки команд:", response.description)
    }

    return response.ok
  } catch (error) {
    console.error("❌ Ошибка при установке команд:", error.message)
    return false
  }
}

async function getWebhookInfo() {
  try {
    console.log("\n📋 Получение информации о webhook...")

    const getWebhookUrl = `https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo`
    const response = await makeRequest(getWebhookUrl)

    if (response.ok) {
      console.log("📊 Информация о webhook:")
      console.log("  URL:", response.result.url || "Не установлен")
      console.log("  Статус:", response.result.url ? "Активен" : "Неактивен")
      console.log("  Ожидающие обновления:", response.result.pending_update_count)
      console.log("  Последняя ошибка:", response.result.last_error_message || "Нет")
    } else {
      console.error("❌ Ошибка получения информации:", response.description)
    }

    return response
  } catch (error) {
    console.error("❌ Ошибка при получении информации:", error.message)
    return null
  }
}

async function getBotInfo() {
  try {
    console.log("\n🤖 Получение информации о боте...")

    const getMeUrl = `https://api.telegram.org/bot${BOT_TOKEN}/getMe`
    const response = await makeRequest(getMeUrl)

    if (response.ok) {
      console.log("✅ Информация о боте:")
      console.log("  Имя:", response.result.first_name)
      console.log("  Username:", `@${response.result.username}`)
      console.log("  ID:", response.result.id)
    } else {
      console.error("❌ Ошибка получения информации о боте:", response.description)
    }

    return response.ok
  } catch (error) {
    console.error("❌ Ошибка при получении информации о боте:", error.message)
    return false
  }
}

async function testWebhook() {
  try {
    console.log("\n🧪 Тестирование webhook...")

    const testUrl = `${WEBHOOK_URL}/api/telegram-webhook`
    const response = await makeRequest(testUrl)

    console.log("📊 Webhook работает корректно")
    return true
  } catch (error) {
    console.error("❌ Ошибка тестирования webhook:", error.message)
    return false
  }
}

// Основная функция
async function main() {
  console.log("🚀 Начинаем настройку...\n")

  if (!BOT_TOKEN) {
    console.error("❌ TELEGRAM_BOT_TOKEN не установлен!")
    process.exit(1)
  }

  if (!WEBHOOK_URL) {
    console.error("❌ NEXT_PUBLIC_BASE_URL не установлен!")
    process.exit(1)
  }

  // Получаем информацию о боте
  const botInfoSuccess = await getBotInfo()
  if (!botInfoSuccess) {
    console.error("❌ Не удалось получить информацию о боте. Проверьте токен.")
    process.exit(1)
  }

  // Настраиваем webhook
  const webhookSuccess = await setupWebhook()
  if (!webhookSuccess) {
    console.error("❌ Не удалось настроить webhook.")
    process.exit(1)
  }

  // Устанавливаем команды
  await setCommands()

  // Получаем информацию о webhook
  await getWebhookInfo()

  // Тестируем webhook
  await testWebhook()

  console.log("\n✅ Настройка завершена!")
  console.log("\n📝 Доступные команды:")
  console.log("• /start - Начать работу")
  console.log("• /news Заголовок | Описание - Добавить новость")
  console.log("• /list - Показать список новостей")
  console.log("• /edit ID | Заголовок | Описание - Редактировать")
  console.log("• /delete ID - Удалить новость")
  console.log("• /status - Проверить статус")
  console.log("• /test - Тестовая новость")
  console.log("• 📸 Отправить фото с подписью - Новость с фото")
  console.log("\n🌐 Страница новостей:", `${WEBHOOK_URL}/news`)
}

// Запускаем скрипт
main().catch((error) => {
  console.error("💥 Критическая ошибка:", error.message)
  process.exit(1)
})
