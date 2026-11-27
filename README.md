# Express Server with Passport Auth, PUG & EJS

Express сервер з MVC архітектурою, авторизацією через **Passport.js** (сесії) та шаблонізаторами **PUG** і **EJS** для рендерингу HTML сторінок.

## Встановлення

```bash
npm install
```

## Запуск

```bash
node src/server.mjs
```

Сервер запускається на `http://localhost:3000`

## Тести

```bash
# Запустити всі тести
npm test

# Запустити тести у watch режимі
npm run test:watch

# Згенерувати звіт про покриття
npm run test:coverage
```

## Зберігання даних

Дані користувачів та статей зберігаються **в оперативній пам'яті** (Map). Після перезапуску сервера всі дані скидаються. Для поточного навчального завдання це є допустимим і не потребує підключення бази даних.

## Шаблонізатори

- **PUG** — використовується для маршрутів `/users` та `/users/:userId`
- **EJS** — використовується для маршрутів `/articles` та `/articles/:articleId`

## Маршрути

### Root

| Метод | URL | Опис |
|-------|-----|------|
| GET | `/` | Повертає текст `Get root route` |
| POST | `/theme` | Зберегти тему оформлення в cookie `{ theme: string }` |
| GET | `/theme` | Отримати поточну тему з cookie |

### Auth (Passport авторизація)

| Метод | URL | Опис |
|-------|-----|------|
| POST | `/auth/register` | Реєстрація `{ email: string, password: string }` → `{ id, email }` |
| POST | `/auth/login` | Вхід `{ email: string, password: string }` → сесія в httpOnly cookie |
| POST | `/auth/logout` | Вихід — знищує сесію |

### Protected

| Метод | URL | Опис |
|-------|-----|------|
| GET | `/protected` | Захищений маршрут — потребує активної сесії → `{ message, user }` |

### Users (PUG шаблони, потребують сесії)

| Метод | URL | Опис |
|-------|-----|------|
| GET | `/users` | HTML сторінка зі списком всіх користувачів |
| POST | `/users` | Створити нового користувача `{ name: string }` |
| GET | `/users/:userId` | HTML сторінка з деталями користувача |
| PUT | `/users/:userId` | Оновити користувача `{ name: string }` |
| DELETE | `/users/:userId` | Видалити користувача |

### Articles (EJS шаблони)

| Метод | URL | Опис |
|-------|-----|------|
| GET | `/articles` | HTML сторінка зі списком всіх статей |
| POST | `/articles` | Створити нову статтю `{ title: string }` |
| GET | `/articles/:articleId` | HTML сторінка з деталями статті |
| PUT | `/articles/:articleId` | Оновити статтю `{ title: string }` |
| DELETE | `/articles/:articleId` | Видалити статтю |

## Авторизація

Авторизація побудована на **Passport.js** з локальною стратегією (email + пароль) та сесіями через `express-session`.

Маршрути `/users` та `/protected` захищені — потребують активної сесії. Для доступу:
1. Зареєструватись: `POST /auth/register` з `{ email, password }`
2. Увійти: `POST /auth/login` з `{ email, password }`

Сесія зберігається автоматично в `httpOnly` cookie і передається при кожному запиті. Для виходу: `POST /auth/logout`.

## Коди відповідей

| Код | Опис |
|-----|------|
| `200` | Успішний GET або PUT |
| `201` | Успішний POST (ресурс створено) |
| `204` | Успішний DELETE (без тіла відповіді) |
| `400` | Bad Request — відсутнє або порожнє обов'язкове поле |
| `401` | Unauthorized — відсутня або невалідна сесія |
| `404` | Not Found — ресурс не існує |
| `409` | Conflict — користувач вже існує |
| `500` | Internal Server Error — непередбачена помилка |

## Структура проекту

```
src/
  views/
    users.pug        — HTML сторінка зі списком користувачів (PUG)
    user.pug         — HTML сторінка з деталями користувача (PUG)
    articles.ejs     — HTML сторінка зі списком статей (EJS)
    article.ejs      — HTML сторінка з деталями статті (EJS)
  public/
    style.css        — CSS стилі
    favicon.ico      — іконка сайту
  controllers/
    usersController.mjs
    articlesController.mjs
  models/
    users.mjs
    articles.mjs
  config/
    passport.mjs     — Passport стратегія, serializeUser, deserializeUser
  middlewares/
    auth.mjs         — перевірка Passport сесії (isAuthenticated)
    validation.mjs
    accessControl.mjs
    errorHandler.mjs
    logger.mjs
  routes/
    index.mjs        — кореневі маршрути + тема + /protected
    auth.mjs         — реєстрація, логін, логаут (Passport)
    users.mjs
    articles.mjs
  server.mjs
```
