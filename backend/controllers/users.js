const User = require('../models/user');

exports.postUser = (req, res) => {
  console.log('Post user create')
  const user_name = req.body.user_name
  const first_name = req.body.first_name
  const last_name = req.body.last_name 
  const birth_date = req.body.birth_date
  const password = req.body.password
  const creation_time = req.body.creation_time
  const email = req.body.email
  
  const user = new User(null, user_name, first_name, last_name, birth_date, password, creation_time, email)
  
  user
    .save()
    .then(res.redirect('/'))
    .catch(err => console.log(err));
};

exports.getUser = (req, res) => {
  const id = req.params.id
  User.findById(id)
    .then(result => {
      res.send(result[0][0])
    })
}

exports.deleteUser = (req, res) => {
  const id = req.params.id
  User.deleteById(id)
  .then(res.redirect('/'))
}