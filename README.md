# Express Server with PUG & EJS Template Engines

Express сервер з MVC архітектурою, що використовує шаблонізатори **PUG** та **EJS** для рендерингу HTML сторінок.

## Встановлення

```bash
npm install
```

## Запуск

```bash
node src/server.mjs
```

Сервер запускається на `http://localhost:3000`

## Шаблонізатори

- **PUG** — використовується для маршрутів `/users` та `/users/:userId`
- **EJS** — використовується для маршрутів `/articles` та `/articles/:articleId`

## Маршрути

### Root

| Метод | URL | Опис |
|-------|-----|------|
| GET | `/` | Повертає текст `Get root route` |

### Users (PUG шаблони)

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

## Коди відповідей

| Код | Опис |
|-----|------|
| `200` | Успішний GET або PUT |
| `201` | Успішний POST (ресурс створено) |
| `204` | Успішний DELETE (без тіла відповіді) |
| `400` | Bad Request — відсутнє або порожнє обов'язкове поле |
| `404` | Not Found — ресурс не існує |
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
  controllers/
    usersController.mjs
    articlesController.mjs
  models/
    users.mjs
    articles.mjs
  middlewares/
    auth.mjs
    validation.mjs
    accessControl.mjs
    errorHandler.mjs
    logger.mjs
  routes/
    index.mjs
    users.mjs
    articles.mjs
  server.mjs
```
