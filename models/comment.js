const db = require('../util/database')

module.exports = class Comment {
  constructor(id, userID, text) {
    this.id = id
    this.userID = userID
    this.text = text
  }

  create() {
    return db.execute(
      'INSERT INTO comments (userID, text) VALUES ( ?, ?)',
      [this.userID, this.text]
    );
  }

  save() {
    return db.execute(
      'UPDATE users SET text = ? WHERE id = ?',
      [this.text]
    );
  }

  static deleteById(id) {
    return db.execute('DELETE FROM comments WHERE id = ?', [id])
  }

  static fetchAll() {
    return db.execute('SELECT * FROM comments');
  }

  static findById(id) {
    return db.execute('SELECT * FROM comments WHERE id = ?', [id]);
  }

  static findByUsername(user_name) {
    return db.execute('SELECT * FROM users WHERE user_name = ?', [user_name]);
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
