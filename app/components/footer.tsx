import Link from 'next/link'
import { FaTelegramPlane } from 'react-icons/fa' // Импорт иконки Telegram

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">О нас</h3>
            <p className="text-sm md:text-base text-gray-400">Мы специализируемся на управлении многоквартирными домами и коммерческой недвижимостью, обеспечивая высокое качество обслуживания.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Контакты</h3>
            <p className="text-sm md:text-base text-gray-400"><strong>Юридический адрес:</strong> Садовая, 135 кв 41</p>
            <p className="text-sm md:text-base text-gray-400"><strong>Фактический адрес:</strong> г. Тюмень, ул. Институтская, д. 6/3</p>
            <p className="text-sm md:text-base text-gray-400"><strong>Телефон:</strong> +7 (3452) 51-77-07</p>
            <p className="text-sm md:text-base text-gray-400"><strong>Email:</strong> Office.delta@bk.ru</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Следите за нами</h3>
            <div className="flex space-x-4">
              <a href="https://t.me/YKdelta72" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <FaTelegramPlane size={24} /> {/* Использование иконки Telegram */}
              </a>
            </div>
          </div>
        </div>
        {/* Новый раздел с временем работы */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Время работы</h3>
          <p className="text-sm md:text-base text-gray-400"><strong>Пн-Чт:</strong> с 09:00 до 18:00, обед с 12:00 до 13:00</p>
          <p className="text-sm md:text-base text-gray-400"><strong>Пт:</strong> с 09:00 до 17:00, обед с 12:00 до 13:00</p>
          <p className="text-sm md:text-base text-gray-400"><strong>Сб-Вс:</strong> выходной</p>
          <p className="text-sm md:text-base text-gray-400"><strong>Аварийно-диспетчерская служба:</strong> работает 24/7 (круглосуточно)</p>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p className="text-sm md:text-base text-gray-400">&copy; 2025 Управляющая Компания. Все права защищены.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
