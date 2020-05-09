const User = require('../models/user');

exports.createUser = (req, res) => {
  
  const user = new User(
    null, 
    req.body.user_name, 
    req.body.first_name, 
    req.body.last_name, 
    req.body.birth_date, 
    req.body.password, 
    req.body.creation_time, 
    req.body.email
  )

  User.exists(req.body.user_name, req.body.email)
    .then(result => {
      let error = {user_name: null, email: null}
      console.log(result[0])
      for (let i = 0; i < result[0].length; i++) {
        if (result[0][i].user_name === req.body.user_name ) {
          console.log('duplicate username')
          error.user_name = true
        } 
        if (result[0][i].email === req.body.email ) {
          console.log('duplicate email')
          error.email = true
        }
      }
      return error
    })
    .then(error => {
      if (error.user_name || error.email) {
        throw error
      } 
    })
    .then(() => user.save())
    .then(() => res.json({"user_name": req.body.user_name, "email": req.body.email}))
    .catch(err => {
      error = {error: true, "message": []}
      if (err.user_name) error.message.push("This user name already exists")
      if (err.email) error.message.push("This email already exists")
      res.send(error)
    })
};

exports.getUser = (req, res) => {
  const id = req.params.id
  User.findById(id)
    .then(result => {
      res.send(result[0][0])
    })
}

exports.getUsers = (req, res) => {
  User.fetchAll()
  .then(users => {
    res.send(users[0])
  })
  .catch(err => res.send(err))
}

exports.deleteUser = (req, res) => {
  const id = req.params.id
  User.deleteById(id)
  .then(res.redirect('/'))
}