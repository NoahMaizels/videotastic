const bcrypt = require('bcrypt')
const SALT_ROUNDS = 10
const User = require('../models/user');



exports.create = (req, res) => {
  const user = new User(null, 
    req.body.user_name, 
    req.body.first_name, 
    req.body.last_name, 
    req.body.birth_date, 
    req.body.password, 
    req.body.creation_time, 
    req.body.email)

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
  let username = req.body.username
  let change = req.body.change
  User.edit(username, change)
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


exports.delete = (req, res) => {
  const id = req.params.id
  User.deleteById(id)
  .then(res.redirect('/'))
}