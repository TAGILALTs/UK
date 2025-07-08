-- Создание таблицы новостей
CREATE TABLE IF NOT EXISTS news (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT,
    author TEXT NOT NULL,
    date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Создание индексов для оптимизации запросов
CREATE INDEX IF NOT EXISTS idx_news_date ON news(date DESC);
CREATE INDEX IF NOT EXISTS idx_news_created_at ON news(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_author ON news(author);

-- Создание функции для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Создание триггера для автоматического обновления updated_at
DROP TRIGGER IF EXISTS update_news_updated_at ON news;
CREATE TRIGGER update_news_updated_at
    BEFORE UPDATE ON news
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Добавление приветственной новости
INSERT INTO news (id, title, description, author, date, created_at, updated_at)
VALUES (
    'welcome',
    'Добро пожаловать!',
    'Система новостей готова к работе. Теперь вы можете публиковать новости через Telegram бота.',
    'Система',
    NOW(),
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Включение Row Level Security (опционально)
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- Создание политики для чтения (все могут читать)
CREATE POLICY IF NOT EXISTS "Anyone can read news" ON news
    FOR SELECT USING (true);

-- Создание политики для записи (только авторизованные пользователи)
CREATE POLICY IF NOT EXISTS "Authenticated users can insert news" ON news
    FOR INSERT WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Authenticated users can update news" ON news
    FOR UPDATE USING (true);

CREATE POLICY IF NOT EXISTS "Authenticated users can delete news" ON news
    FOR DELETE USING (true);
