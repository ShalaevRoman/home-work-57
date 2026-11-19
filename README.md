# Express Server with Middlewares

RESTful API сервер на базі Express.js з MVC архітектурою та мідлварами для логування, аутентифікації, валідації даних і управління доступом.

## Встановлення та запуск

```bash
npm install
npm start       # запуск на порту 3000
npm run dev     # запуск з авто-перезавантаженням (nodemon)
npm test        # запуск тестів
```

## Структура проекту

```
src/
├── models/           # Зберігання даних (Map)
├── controllers/      # Обробка бізнес-логіки
├── routes/           # Маршрутизація
├── middlewares/      # Мідлвари
└── server.mjs        # Точка входу
```

## Мідлвари

| Мідлвар | Маршрут | Призначення |
|---------|---------|-------------|
| `loggerMiddleware` | `GET /` | Логує метод, URL та час запиту |
| `authMiddleware` | `/users/*` | Перевіряє хедер `x-auth-token` |
| `validateUserMiddleware` | `POST/PUT /users` | Валідує поле `name` |
| `validateArticleMiddleware` | `POST/PUT /articles` | Валідує поле `title` |
| `articleAccessMiddleware` | `/articles/*` | Перевіряє роль з хедера `x-user-role` |
| `notFoundHandler` | всі маршрути | Повертає 404 для невідомих шляхів |
| `errorHandler` | всі маршрути | Повертає 500 при непередбачених помилках |

## Маршрути

### `GET /`
Повертає текст `Get root route`. Логується через `loggerMiddleware`.

---

### `GET /users`
Повертає масив усіх користувачів.
```json
[{ "id": "1234", "name": "Alice" }]
```

### `POST /users`
Створює нового користувача. Вимагає поле `name`.
```json
// body: { "name": "Bob" }
// відповідь 201: { "id": "1234", "name": "Bob" }
```

### `GET /users/:userId`
Повертає користувача за ID або `404 Not Found`.

### `PUT /users/:userId`
Оновлює ім'я користувача. Вимагає поле `name`. Повертає `404` якщо не існує.

### `DELETE /users/:userId`
Видаляє користувача. Повертає `204 No Content` або `404 Not Found`.

---

### `GET /articles`
Повертає масив усіх статей.
```json
[{ "id": "1234", "title": "First Article" }]
```

### `POST /articles`
Створює нову статтю. Вимагає поле `title`.
```json
// body: { "title": "My Article" }
// відповідь 201: { "id": "1234", "title": "My Article" }
```

### `GET /articles/:articleId`
Повертає статтю за ID або `404 Not Found`.

### `PUT /articles/:articleId`
Оновлює заголовок статті. Вимагає поле `title`. Повертає `404` якщо не існує.

### `DELETE /articles/:articleId`
Видаляє статтю. Повертає `204 No Content` або `404 Not Found`.

## Коди відповідей

| Код | Опис |
|-----|------|
| `200` | Успішний GET або PUT |
| `201` | Успішний POST (ресурс створено) |
| `204` | Успішний DELETE (без тіла відповіді) |
| `400` | Bad Request — відсутнє або порожнє обов'язкове поле |
| `404` | Not Found — ресурс або маршрут не існує |
| `500` | Internal Server Error — непередбачена помилка |
