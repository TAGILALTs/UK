-- Создание таблицы новостей для Supabase
CREATE TABLE IF NOT EXISTS news (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image TEXT,
    author VARCHAR(100) NOT NULL,
    date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание индексов для оптимизации запросов
CREATE INDEX IF NOT EXISTS idx_news_date ON news(date DESC);
CREATE INDEX IF NOT EXISTS idx_news_author ON news(author);
CREATE INDEX IF NOT EXISTS idx_news_created_at ON news(created_at DESC);

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

-- Включение Row Level Security (RLS)
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- Создание политики для чтения (все могут читать)
CREATE POLICY IF NOT EXISTS "Allow public read access" ON news
    FOR SELECT USING (true);

-- Создание политики для вставки (только авторизованные пользователи)
CREATE POLICY IF NOT EXISTS "Allow authenticated insert" ON news
    FOR INSERT WITH CHECK (true);

-- Создание политики для обновления (только авторизованные пользователи)
CREATE POLICY IF NOT EXISTS "Allow authenticated update" ON news
    FOR UPDATE USING (true);

-- Создание политики для удаления (только авторизованные пользователи)
CREATE POLICY IF NOT EXISTS "Allow authenticated delete" ON news
    FOR DELETE USING (true);

-- Комментарии к таблице и столбцам
COMMENT ON TABLE news IS 'Таблица новостей управляющей компании';
COMMENT ON COLUMN news.id IS 'Уникальный идентификатор новости';
COMMENT ON COLUMN news.title IS 'Заголовок новости';
COMMENT ON COLUMN news.description IS 'Полное описание новости';
COMMENT ON COLUMN news.image IS 'URL изображения для новости (необязательно)';
COMMENT ON COLUMN news.author IS 'Автор новости';
COMMENT ON COLUMN news.date IS 'Дата публикации новости';
COMMENT ON COLUMN news.created_at IS 'Дата создания записи';
COMMENT ON COLUMN news.updated_at IS 'Дата последнего обновления записи';
