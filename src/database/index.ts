const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const os = require('os')
const path = require('path');
const makeDir = require('make-dir');

try {
  makeDir.sync(path.join(os.homedir(), '.maker'))
} catch (e) { }

const adapter = new FileSync(path.join(os.homedir(), '.maker/db.json'))
const db = low(adapter)
db
  .defaults({
    user: {}
  })
  .write()

export default db
