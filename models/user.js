const db = require('../util/database')
const bcrypt = require('bcrypt')

module.exports = class User {
  constructor(id, user_name, first_name, last_name, birth_date, password, creation_time, email) {
    this.id = id
    this.user_name = user_name
    this.first_name = first_name
    this.last_name = last_name
    this.birth_date = birth_date
    this.password = password
    this.creation_time = creation_time
    this.email = email
  }

  create() {
    return db.execute(
      'INSERT INTO users (user_name, first_name, last_name, birth_date, password, creation_time, email) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [this.user_name, this.first_name, this.last_name, this.birth_date, this.password, this.creation_time, this.email]
    );
  }

  save() {
    return db.execute(
      'UPDATE users SET user_name = ?, first_name = ?, last_name = ?, birth_date = ?, password = ?, creation_time =?, email = ? WHERE id = ?',
      [this.user_name, this.first_name, this.last_name, this.birth_date, this.password, this.creation_time, this.email, this.id]
    );
  }

  static edit(user_name, change) {
    let user
    return  User.isUnique(change.user_name ? change.user_name : "", change.email ? change.email : "")
    .then(result => {
      if (result.error) throw result
    }).then(() => {
      return db.execute('SELECT * FROM users WHERE user_name = ?', [user_name])
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
      .catch(err => err)
  }

  static deleteById(id) {
    return db.execute('DELETE FROM users WHERE id = ?', [id])
  }

  static fetchAll() {
    return db.execute('SELECT * FROM users');
  }

  static findById(id) {
    return db.execute('SELECT * FROM users WHERE id = ?', [id]);
  }

  static isUnique(user_name, email) {
    const errorMessages = {error: null, messages: []}
    return db.execute('SELECT * FROM users WHERE user_name = ? OR email = ?', [user_name, email])
    .then(result => {
      for (let i = 0; i < result[0].length; i++) {
        if (result[0][i].user_name === user_name ) {
          errorMessages.error = true
          errorMessages.messages.push({type: 'duplicateUserName', message: "This username already exists"})
        } 
        if (result[0][i].email === email) {
          errorMessages.error = true
          errorMessages.messages.push({type: 'duplicateEmail', message: "This email already exists"})
        }
      }
      return errorMessages
    })
  }
};
