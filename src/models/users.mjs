import { randomUUID } from 'crypto'

export const users = new Map()

users.set(randomUUID(), { name: 'Alice' })
