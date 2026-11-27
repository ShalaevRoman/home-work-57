import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { randomUUID } from 'crypto'

export const users = new Map()

passport.use(
  new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    const user = [...users.values()].find(
      (u) => u.email === email && u.password === password
    )
    if (!user) {
      return done(null, false, { message: 'Invalid credentials' })
    }
    return done(null, user)
  })
)

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  const user = users.get(id)
  done(null, user || false)
})

export default passport
