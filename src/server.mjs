import express from 'express'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import cookieParser from 'cookie-parser'
import indexRouter from './routes/index.mjs'
import usersRouter from './routes/users.mjs'
import articlesRouter from './routes/articles.mjs'
import authRouter from './routes/auth.mjs'
import { notFoundHandler, errorHandler } from './middlewares/errorHandler.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(express.static(join(__dirname, 'public')))
app.set('views', join(__dirname, 'views'))

app.use('/', indexRouter)
app.use('/auth', authRouter)
app.use('/users', usersRouter)
app.use('/articles', articlesRouter)

app.use(notFoundHandler)
app.use(errorHandler)

const server = app.listen(3000)

export { app, server }
