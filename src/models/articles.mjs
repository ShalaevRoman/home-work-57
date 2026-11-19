import { randomUUID } from 'crypto'

export const articles = new Map()

articles.set(randomUUID(), { title: 'First Article' })
