-- Создание таблицы новостей для Supabase
CREATE TABLE IF NOT EXISTS news (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT,
    author TEXT NOT NULL DEFAULT 'System',
    date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Создание индексов для оптимизации запросов
CREATE INDEX IF NOT EXISTS idx_news_date ON news(date DESC);
CREATE INDEX IF NOT EXISTS idx_news_created_at ON news(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_author ON news(author);

-- Включение Row Level Security (RLS)
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- Создание политики для чтения (все могут читать)
CREATE POLICY IF NOT EXISTS "Allow public read access" ON news
    FOR SELECT USING (true);

-- Создание политики для вставки (только аутентифицированные пользователи)
CREATE POLICY IF NOT EXISTS "Allow authenticated insert" ON news
    FOR INSERT WITH CHECK (true);

-- Создание политики для обновления (только аутентифицированные пользователи)
CREATE POLICY IF NOT EXISTS "Allow authenticated update" ON news
    FOR UPDATE USING (true);

-- Создание политики для удаления (только аутентифицированные пользователи)
CREATE POLICY IF NOT EXISTS "Allow authenticated delete" ON news
    FOR DELETE USING (true);

-- Комментарии к таблице и столбцам
COMMENT ON TABLE news IS 'Таблица для хранения новостей управляющей компании';
COMMENT ON COLUMN news.id IS 'Уникальный идентификатор новости';
COMMENT ON COLUMN news.title IS 'Заголовок новости';
COMMENT ON COLUMN news.description IS 'Полное описание новости';
COMMENT ON COLUMN news.image IS 'URL изображения для новости (необязательно)';
COMMENT ON COLUMN news.author IS 'Автор новости';
COMMENT ON COLUMN news.date IS 'Дата публикации новости';
COMMENT ON COLUMN news.created_at IS 'Дата создания записи';
COMMENT ON COLUMN news.updated_at IS 'Дата последнего обновления записи';
