const sqlite3 = require('sqlite3').verbose();

class SqlStore {
  constructor() {
    this.db = new sqlite3.Database('./db/baby-cycle');
  }

  add({type, time}) {
    const stmt = this.db.prepare("INSERT INTO event (event_type, event_time) VALUES (?, ?)");

    stmt.run(type, time);

    stmt.finalize();
  }

  get(cb) {
    this.db.each(`
      SELECT
        event_type,
        event_time
      FROM event
      ORDER BY event_time DESC
      LIMIT 1
    `, (err, {event_type: type, event_time: time}) => {

      cb({type, time})
    });
  }

  getAll(cb) {
    this.db.all(`
      SELECT
        event_type,
        event_time
      FROM event
      ORDER BY event_time ASC
    `, (err, rows) => {
      cb(rows.map(({event_type, event_time}) => ({type: event_type, time: event_time})));
    });
  }
}

module.exports = SqlStore;
