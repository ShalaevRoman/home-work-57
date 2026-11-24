import { app, server } from '../server.mjs'
import { describe, test, expect, beforeAll, afterAll, vi } from 'vitest'
import request from 'supertest'

let testUserId
let testArticleId
let testUserName
let testArticleTitle
const NON_EXISTENT_ID = 'non-existent-id'
let agent

describe('Express REST API', () => {
  beforeAll(async () => {
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})

    // Створюємо agent щоб cookie з JWT токеном зберігалась між запитами
    agent = request.agent(app)
    await agent.post('/auth/register').send({ username: 'testuser', password: 'testpass' })

    // GET /users повертає HTML, тому тестові ID отримуємо через POST
    const newUserResp = await agent.post('/users').send({ name: 'Test User For ID' })
    testUserId = newUserResp.body.id
    testUserName = newUserResp.body.name

    const newArticleResp = await request(app).post('/articles').send({ title: 'Test Article For ID' })
    testArticleId = newArticleResp.body.id
    testArticleTitle = newArticleResp.body.title
  })

  afterAll(() => {
    if (server && server.listening) {
      server.close()
    }
    vi.restoreAllMocks()
  })

  // Тестування маршруту "/"
  describe('Root Route', () => {
    test('GET / повинен повертати статус 200 та правильне повідомлення', async () => {
      const response = await request(app).get('/')

      expect(response.status).toBe(200)
      expect(response.text).toMatch(/Get root route/i)
    })
  })

  // Тестування маршрутів "/users"
  describe('Users Routes', () => {
    test('GET /users повинен повертати статус 200 та HTML-сторінку зі списком користувачів', async () => {
      const response = await agent.get('/users')

      expect(response.status).toBe(200)
      expect(response.type).toMatch(/html/)
      expect(response.text).toContain(testUserName)
    })

    test('POST /users повинен повертати статус 201 та правильне повідомлення, і створювати користувача', async () => {
      const testName = 'New Test User ' + Date.now()
      const response = await agent.post('/users').send({ name: testName })

      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty('id')
      expect(response.body).toHaveProperty('name', testName)

      // Перевіряємо через GET /users/:id, що HTML містить дані нового користувача
      const getResp = await agent.get(`/users/${response.body.id}`)
      expect(getResp.status).toBe(200)
      expect(getResp.type).toMatch(/html/)
      expect(getResp.text).toContain(response.body.id)
      expect(getResp.text).toContain(testName)
    })

    test('POST /users повинен повертати статус 400 при некоректних даних', async () => {
      // Перевіряємо порожній рядок
      const response1 = await agent.post('/users').send({ name: '' })
      expect(response1.status).toBe(400)
      expect(response1.text).toMatch(/Bad Request/i)

      // Перевіряємо відсутність поля
      const response2 = await agent.post('/users').send({})
      expect(response2.status).toBe(400)
      expect(response2.text).toMatch(/Bad Request/i)
    })

    test('GET /users/:userId повинен повертати статус 200 та HTML-сторінку з даними користувача', async () => {
      const response = await agent.get(`/users/${testUserId}`)

      expect(response.status).toBe(200)
      expect(response.type).toMatch(/html/)
      expect(response.text).toContain(testUserId)
      expect(response.text).toContain(testUserName)
    })

    test('GET /users/:userId повинен повертати статус 404 для неіснуючого користувача', async () => {
      const response = await agent.get(`/users/${NON_EXISTENT_ID}`)

      expect(response.status).toBe(404)
      expect(response.text).toMatch(/Not Found/i)
    })

    test('PUT /users/:userId повинен повертати статус 200, правильне повідомлення та оновлювати користувача', async () => {
      const newName = 'Updated User ' + Date.now()
      const response = await agent.put(`/users/${testUserId}`).send({ name: newName })

      expect(response.status).toBe(200)
      expect(response.body).toEqual({
        id: testUserId,
        name: newName
      })

      // Перевіряємо через GET /users/:userId, що HTML містить оновлені дані
      const getResp = await agent.get(`/users/${testUserId}`)
      expect(getResp.status).toBe(200)
      expect(getResp.type).toMatch(/html/)
      expect(getResp.text).toContain(newName)

      testUserName = newName
    })

    test('PUT /users/:userId повинен повертати статус 400 при некоректних даних', async () => {
      // Перевіряємо порожній рядок
      const response1 = await agent.put(`/users/${testUserId}`).send({ name: '' })
      expect(response1.status).toBe(400)
      expect(response1.text).toMatch(/Bad Request/i)

      // Перевіряємо відсутність поля
      const response2 = await agent.put(`/users/${testUserId}`).send({})
      expect(response2.status).toBe(400)
      expect(response2.text).toMatch(/Bad Request/i)
    })

    test('PUT /users/:userId повинен повертати статус 404 для неіснуючого користувача', async () => {
      const response = await agent.put(`/users/${NON_EXISTENT_ID}`).send({ name: 'Updated User' })

      expect(response.status).toBe(404)
      expect(response.text).toMatch(/Not Found/i)
    })

    test('DELETE /users/:userId повинен повертати статус 204 без вмісту та видаляти користувача', async () => {
      // Створюємо тимчасового користувача для видалення через API
      const createResp = await agent.post('/users').send({ name: 'Temporary User' })
      const tempUserId = createResp.body.id

      const deleteResp = await agent.delete(`/users/${tempUserId}`)
      expect(deleteResp.status).toBe(204)
      expect(deleteResp.text).toBe('')

      // Перевіряємо через GET /users/:id, що користувача видалено
      const getAfter = await agent.get(`/users/${tempUserId}`)
      expect(getAfter.status).toBe(404)
      expect(getAfter.text).toMatch(/Not Found/i)
    })

    test('DELETE /users/:userId повинен повертати статус 404 для неіснуючого користувача', async () => {
      const response = await agent.delete(`/users/${NON_EXISTENT_ID}`)

      expect(response.status).toBe(404)
      expect(response.text).toMatch(/Not Found/i)
    })
  })

  // Тестування маршрутів "/articles"
  describe('Articles Routes', () => {
    test('GET /articles повинен повертати статус 200 та HTML-сторінку зі списком статей', async () => {
      const response = await request(app).get('/articles')

      expect(response.status).toBe(200)
      expect(response.type).toMatch(/html/)
      expect(response.text).toContain(testArticleTitle)
    })

    test('POST /articles повинен повертати статус 201 та правильне повідомлення, і створювати статтю', async () => {
      const testTitle = 'New Test Article ' + Date.now()
      const response = await request(app).post('/articles').send({ title: testTitle })

      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty('id')
      expect(response.body).toHaveProperty('title', testTitle)

      // Перевіряємо через GET /articles/:id, що HTML містить дані нової статті
      const getResp = await request(app).get(`/articles/${response.body.id}`)
      expect(getResp.status).toBe(200)
      expect(getResp.type).toMatch(/html/)
      expect(getResp.text).toContain(response.body.id)
      expect(getResp.text).toContain(testTitle)
    })

    test('POST /articles повинен повертати статус 400 при некоректних даних', async () => {
      // Перевіряємо порожній рядок
      const response1 = await request(app).post('/articles').send({ title: '' })
      expect(response1.status).toBe(400)
      expect(response1.text).toMatch(/Bad Request/i)

      // Перевіряємо відсутність поля
      const response2 = await request(app).post('/articles').send({})
      expect(response2.status).toBe(400)
      expect(response2.text).toMatch(/Bad Request/i)
    })

    test('GET /articles/:articleId повинен повертати статус 200 та HTML-сторінку з даними статті', async () => {
      const response = await request(app).get(`/articles/${testArticleId}`)

      expect(response.status).toBe(200)
      expect(response.type).toMatch(/html/)
      expect(response.text).toContain(testArticleId)
      expect(response.text).toContain(testArticleTitle)
    })

    test('GET /articles/:articleId повинен повертати статус 404 для неіснуючої статті', async () => {
      const response = await request(app).get(`/articles/${NON_EXISTENT_ID}`)

      expect(response.status).toBe(404)
      expect(response.text).toMatch(/Not Found/i)
    })

    test('PUT /articles/:articleId повинен повертати статус 200, правильне повідомлення та оновлювати статтю', async () => {
      const newTitle = 'Updated Article ' + Date.now()
      const response = await request(app).put(`/articles/${testArticleId}`).send({ title: newTitle })

      expect(response.status).toBe(200)
      expect(response.body).toEqual({
        id: testArticleId,
        title: newTitle
      })

      // Перевіряємо через GET /articles/:id, що HTML містить оновлені дані
      const getResp = await request(app).get(`/articles/${testArticleId}`)
      expect(getResp.status).toBe(200)
      expect(getResp.type).toMatch(/html/)
      expect(getResp.text).toContain(newTitle)

      testArticleTitle = newTitle
    })

    test('PUT /articles/:articleId повинен повертати статус 400 при некоректних даних', async () => {
      // Перевіряємо порожній рядок
      const response1 = await request(app).put(`/articles/${testArticleId}`).send({ title: '' })
      expect(response1.status).toBe(400)
      expect(response1.text).toMatch(/Bad Request/i)

      // Перевіряємо відсутність поля
      const response2 = await request(app).put(`/articles/${testArticleId}`).send({})
      expect(response2.status).toBe(400)
      expect(response2.text).toMatch(/Bad Request/i)
    })

    test('PUT /articles/:articleId повинен повертати статус 404 для неіснуючої статті', async () => {
      const response = await request(app).put(`/articles/${NON_EXISTENT_ID}`).send({ title: 'Updated Article' })

      expect(response.status).toBe(404)
      expect(response.text).toMatch(/Not Found/i)
    })

    test('DELETE /articles/:articleId повинен повертати статус 204 без вмісту та видаляти статтю', async () => {
      // Створюємо тимчасову статтю для видалення через API
      const createResp = await request(app).post('/articles').send({ title: 'Temporary Article' })
      const tempArticleId = createResp.body.id

      const deleteResp = await request(app).delete(`/articles/${tempArticleId}`)
      expect(deleteResp.status).toBe(204)
      expect(deleteResp.text).toBe('')

      // Перевіряємо через GET /articles/:id, що статтю видалено
      const getAfter = await request(app).get(`/articles/${tempArticleId}`)
      expect(getAfter.status).toBe(404)
      expect(getAfter.text).toMatch(/Not Found/i)
    })

    test('DELETE /articles/:articleId повинен повертати статус 404 для неіснуючої статті', async () => {
      const response = await request(app).delete(`/articles/${NON_EXISTENT_ID}`)

      expect(response.status).toBe(404)
      expect(response.text).toMatch(/Not Found/i)
    })
  })

  // Тестування обробки помилок
  describe('Error Handling', () => {
    test('Запит до неіснуючого маршруту повинен повертати статус 404', async () => {
      const response = await request(app).get('/nonexistent-route')

      expect(response.status).toBe(404)
      expect(response.text).toMatch(/Not Found/i)
    })

    test('Глобальна обробка помилок повинна повертати статус 500', async () => {
      const usersModel = await import('../models/users.mjs')
      vi.spyOn(usersModel.users, 'set').mockImplementationOnce(() => {
        throw new Error('Test internal error')
      })

      const response = await agent.post('/users').send({ name: 'Error User' })

      expect(response.status).toBe(500)
      expect(response.text).toMatch(/Internal Server Error/i)

      vi.restoreAllMocks()
    })
  })

  // Тестування JWT авторизації
  describe('JWT Auth', () => {
    test('GET /users без токену повинен повертати статус 401', async () => {
      const response = await request(app).get('/users')

      expect(response.status).toBe(401)
      expect(response.text).toMatch(/Unauthorized/i)
    })

    test('GET /users з невалідним токеном повинен повертати статус 401', async () => {
      const response = await request(app)
        .get('/users')
        .set('Cookie', 'token=invalid.token.here')

      expect(response.status).toBe(401)
      expect(response.text).toMatch(/Unauthorized/i)
    })

    test('POST /auth/register повинен повертати статус 201 та дані користувача', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({ username: 'newuser', password: 'newpass' })

      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty('id')
      expect(response.body).toHaveProperty('username', 'newuser')
    })

    test('POST /auth/register з тим самим username повинен повертати статус 409', async () => {
      await request(app).post('/auth/register').send({ username: 'dupuser', password: 'pass' })
      const response = await request(app)
        .post('/auth/register')
        .send({ username: 'dupuser', password: 'pass' })

      expect(response.status).toBe(409)
      expect(response.text).toMatch(/already exists/i)
    })

    test('POST /auth/login з неправильним паролем повинен повертати статус 401', async () => {
      await request(app).post('/auth/register').send({ username: 'loginuser', password: 'correctpass' })
      const response = await request(app)
        .post('/auth/login')
        .send({ username: 'loginuser', password: 'wrongpass' })

      expect(response.status).toBe(401)
      expect(response.text).toMatch(/Unauthorized/i)
    })

    test('POST /auth/login з неіснуючим username повинен повертати статус 401', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ username: 'nonexistent', password: 'pass' })

      expect(response.status).toBe(401)
      expect(response.text).toMatch(/Unauthorized/i)
    })
  })

  // Тестування cookie теми
  describe('Theme Cookie', () => {
    test('POST /theme повинен зберегти тему і повернути статус 200', async () => {
      const response = await request(app)
        .post('/theme')
        .send({ theme: 'dark' })

      expect(response.status).toBe(200)
      expect(response.body).toEqual({ theme: 'dark' })
    })

    test('GET /theme повинен повернути збережену тему', async () => {
      const themeAgent = request.agent(app)
      await themeAgent.post('/theme').send({ theme: 'dark' })
      const response = await themeAgent.get('/theme')

      expect(response.status).toBe(200)
      expect(response.body).toEqual({ theme: 'dark' })
    })

    test('GET /theme без cookie повинен повернути тему за замовчуванням', async () => {
      const response = await request(app).get('/theme')

      expect(response.status).toBe(200)
      expect(response.body).toEqual({ theme: 'light' })
    })
  })

  // Тестування унікальності ID
  describe('Unique IDs', () => {
    test('Кілька створених користувачів повинні мати унікальні ID', async () => {
      const responses = await Promise.all([
        agent.post('/users').send({ name: 'User A' }),
        agent.post('/users').send({ name: 'User B' }),
        agent.post('/users').send({ name: 'User C' }),
      ])

      const ids = responses.map(r => r.body.id)
      const uniqueIds = new Set(ids)

      expect(uniqueIds.size).toBe(3)
    })

    test('Кілька створених статей повинні мати унікальні ID', async () => {
      const responses = await Promise.all([
        request(app).post('/articles').send({ title: 'Article A' }),
        request(app).post('/articles').send({ title: 'Article B' }),
        request(app).post('/articles').send({ title: 'Article C' }),
      ])

      const ids = responses.map(r => r.body.id)
      const uniqueIds = new Set(ids)

      expect(uniqueIds.size).toBe(3)
    })
  })
})
