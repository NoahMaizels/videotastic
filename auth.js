const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('./models/user')
const passport = require('passport')
const Strategy = require('passport-local').Strategy 
const autoCatch = require('./lib/auto-catch')
const jwtSecret = process.env.JWT_SECRET || 'mark it zero'
const jwtOpts = { algorithm: 'HS256', expiresIn: '30d' }
const adminPassword = process.env.ADMIN_PASSWORD || 'iamthewalrus'

passport.use(adminStrategy())

const authenticate = passport.authenticate('local', { session: false })

module.exports = {
  authenticate: autoCatch(authenticate),
  currentUser: autoCatch(currentUser),
  ensureUser: autoCatch(ensureUser),
  login: autoCatch(login), 
  optionsLogin: autoCatch(optionsLogin), 
  ensureAdmin: autoCatch(ensureAdmin)
}

async function optionsLogin (req, res) {
  res.status(200).send('options ok')
}

async function login (req, res, next) {
  const token = await sign({ username: req.user.username, id: req.user.id }) 
  res.cookie('jwt', token, { httpOnly: false, secure: false })
  res.status(200).json({ username: req.user.username, success: true, token: token })
}


async function ensureUser (req, res, next) {
  const jwtString = req.headers.authorization || req.cookies.jwt 
  const payload = await verify(jwtString)
  if (payload.username) {
    req.user = payload
    if (req.user.username === 'admin') req.isAdmin = true 
    return next()
  }
  const err = new Error('Unauthorized') 
  err.statusCode = 401
  next(err)
}

async function ensureAdmin (req, res, next) {
  const jwtString = req.headers.authorization || req.cookies.jwt 
  const payload = await verify(jwtString)
  if (payload.username === 'admin') return next()
  const err = new Error('Unauthorized') 
  err.statusCode = 401
  next(err)
}

async function sign (payload) {
  const token = await jwt.sign(payload, jwtSecret, jwtOpts) 
  return token
}

async function verify (jwtString = '') { 
  jwtString = jwtString.replace(/^Bearer /i, '')
  try {
    const payload = await jwt.verify(jwtString, jwtSecret) 
    return payload
  } catch (err) { 
    err.statusCode = 401 
    throw err
  } 
}

function currentUser (req, res) {
  const jwtString = req.headers.authorization || req.cookies.jwt 
  if (!jwtString) return res.send({"noUser": true})
  verify(jwtString).then(payload => {
    if (payload.username) {
      res.json({"username": payload.username})
    }
  })
}

function adminStrategy () {
  return new Strategy(function (username, password, cb) {
    const isAdmin = username === 'admin' && password === adminPassword 
    let targetUser
    if (isAdmin) return cb(null, { username: 'admin' })
    return User.findByUsername(username)
      .then(user => {
        if (!user) return cb(null, false)
        targetUser = user
        return user
      })
      .then(user => {
        return bcrypt.compare(password, user[0][0].password)
      })
      .then(isUser => {

        if (isUser) return cb(null, { username: targetUser[0][0].user_name, id: targetUser[0][0].id})
      })
      .catch(err => console.log(err))
    cb(null, false) 
  })
}



