# Лабораторная работа №4

Сетевая многопользовательская игра "Код-Мастер" 

## Технологии

- Express
- uuid Генерация уникальных playerId для игроков
- dotenv (управление конфигурацией)
- nodemon (запус сервера в dev режиме)
- xmlbuilder2 (Создание и запись XML-файлов)

## структура проекта
```
project/
    app.js                    # Точка входа, настройка Express и подключение роутов
    .env                      # Конфигурационный файл (порт, папка для загрузок, файл результатов)
    routes/
        - gameRoutes.js         # обработка маршрутов
    game/
        - GameMaster.js         # Логика генерации и проверки кода
    services/
        - GameSession.js        # Управление раундами, игроками, очередями
    utils/
        - XmlLogger.js          # XML-сериализация и запись результатов
    results.xml               # Лог игры (создаётся автоматически)
    package.json              # Зависимости и скрипты проекта
```
##  эндпоинты

POST /game/join - Подключение игрока. Возвращает playerId.

GET /game/status/:playerId - Получить текущий статус игры и игрока.

POST /game/guess - Сделать ход (если ваша очередь).

POST /game/leave - Отключить игрока от текущей сессии.
