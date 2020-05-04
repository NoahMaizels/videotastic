const db = require('../util/database')

module.exports = class Video {
  constructor(id, title, description) {
    this.id = id
    this.title = title
    this.description = description
  }

  save() {
    return db.execute(
      'INSERT INTO videos (title, description) VALUES (?, ?)',
      [this.title, this.description]
    );
  }

  static deleteById(id) {
    return db.execute('DELETE * FROM videos WHERE id = ?', [id])
  }

  static fetchAll() {
    return db.execute('SELECT * FROM videos');
  }

  static findById(id) {
    console.log(id)
    return db.execute('SELECT * FROM videos WHERE id = ?', [id]);
  }

};
