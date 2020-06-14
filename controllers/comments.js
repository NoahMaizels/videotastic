const Comment = require('../models/comment');
const Joi = require('@hapi/joi')



exports.create = (req, res) => {
  const schema = Joi.object({
    id: Joi.allow(null),
    userID: Joi.number()
      .required(),
    text: Joi.string()
      .alphanum()
      .min(1)
      .max(500)
      .required(),
  })

  const comment = new Comment(null, 
    req.body.userID, 
    req.body.text, 
  )

  let {value, error} = schema.validate(comment, {abortEarly: false})

  if (error) {
    return res.send(error.details)
  }

 comment.create()
  .then(() => res.json({"text": req.body.text}))
  .catch(err => {
    res.send(err)
  })
};


exports.edit = (req, res) => {

  const schema = schema = Joi.object({
    text: Joi.string()
      .alphanum()
      .min(1)
      .max(500)
      .required(),
  })
  let id = req.body.id
  let text = req.body.text


  let {value, error} = schema.validate(change, {abortEarly: false})

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
  Comment.findById(id)
    .then(result => {
      res.send(result[0][0])
    })
}

exports.getAll = (req, res) => {

  Comment.fetchAll()
  .then(comments => {
    res.send(comments[0])
  })
  .catch(err => res.send(err))
}

exports.delete = (req, res, next) => {
  if (!req.isAdmin) return forbidden(next)

  const id = req.params.id

  Comment.deleteById(id)
  .then(res.redirect('/'))
}

function forbidden (next) {
  const err = new Error('Forbidden') 
  err.statusCode = 403
  return next(err)
}