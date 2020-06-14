const bcrypt = require('bcrypt')
const SALT_ROUNDS = 10
const User = require('../models/user');
const Joi = require('@hapi/joi')



exports.create = (req, res) => {
  const origin = req.get('origin')
  const schema = Joi.object({
    id: Joi.allow(null),
    user_name: Joi.string()
      .alphanum()
      .min(3)
      .max(30)
      .required(),
    first_name: Joi.string()
      .alphanum()
      .min(3)
      .max(30)
      .required(),
    last_name: Joi.string()
      .alphanum()
      .min(3)
      .max(30)
      .required(),
    birth_date: Joi.date()
      .required(),
    password: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
      .required(),
    repeat_password: Joi.string().required().valid(Joi.ref('password')),
    email: Joi.string()
      .email({ minDomainSegments: 2 })
      .required(),
  })
  const userObj = {
    user_name: req.body.user_name, 
    first_name: req.body.first_name, 
    last_name: req.body.last_name, 
    birth_date: req.body.birth_date, 
    password: req.body.password, 
    repeat_password: req.body.repeat_password,
    email: req.body.email
  }

  let {value, error} = schema.validate(userObj, {abortEarly: false})
  
  if (error) {
    return res.send(error.details)
  }

  const user = new User(null, 
    req.body.user_name, 
    req.body.first_name, 
    req.body.last_name, 
    req.body.birth_date, 
    req.body.password, 
    req.body.email
  )

  User.isUnique(req.body.user_name, req.body.email)
    .then(result => {
      if (result.error) throw result
    })
    .then(() => bcrypt.hash(user.password, SALT_ROUNDS))
    .then(password => user.password = password)
    .then(() => user.create())
    .then(() => res.json({"user_name": req.body.user_name, "email": req.body.email}))
    .catch(err => {
      res.send(err)
    })
};

exports.edit = (req, res) => {
  const schema = Joi.object({
    id: Joi.allow(null),
    user_name: Joi.string()
      .alphanum()
      .min(3)
      .max(30),
    first_name: Joi.string()
      .alphanum()
      .min(3)
      .max(30),
    last_name: Joi.string()
      .alphanum()
      .min(3)
      .max(30),
    birth_date: Joi.number()
      .integer()
      .min(1900)
      .max(2020),
    password: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    email: Joi.string()
      .email({ minDomainSegments: 2 }),
  })
 
  let {value, error} = schema.validate(change, {abortEarly: false})

  let id = req.body.id
  let change = req.body.change
  let user
  
  if (error) {
    return res.send(error.details)
  }

  return  User.isUnique(change.user_name ? change.user_name : "", change.email ? change.email : "")
  .then(result => {
    if (result.error) throw result
  })
  .then(() => {
    return User.findById(id)
  })
  .then(targetUser => {
    Object.keys(change).forEach(key => {
      targetUser[0][0][key] = change[key]
    })
    user = targetUser[0][0]
    return user
  })
  .then(user => {
    let password = null
    if (change.password) {
      const SALT_ROUNDS = 10
      password = bcrypt.hash(user.password, SALT_ROUNDS)
    }
    return password
  })
  .then(password => {
    if (password) user.password = password
    return user
  })
  .then(user => {
    return Object.keys(user).map(key => user[key])
  })
  .then(result => {
    if (result.error) throw result
    let newUser = new User(...result)
    newUser.save()
    res.send({user_name: newUser.user_name, email: newUser.email})
  })
  .catch(err => res.send(err))
}

exports.get = (req, res) => {
  const id = req.params.id
  User.findById(id)
    .then(result => {
      res.send(result[0][0])
    })
}

exports.getAll = (req, res) => {
  User.fetchAll()
  .then(users => {
    res.send(users[0])
  })
  .catch(err => res.send(err))
}

exports.delete = (req, res, next) => {
  if (!req.isAdmin) return forbidden(next)
  const id = req.params.id
  User.deleteById(id)
  .then(res.redirect('/'))
}

exports.boing = (req, res) => {
  res.send("boing")
}

function forbidden (next) {
  const err = new Error('Forbidden') 
  err.statusCode = 403
  return next(err)
}