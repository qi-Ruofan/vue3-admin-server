let mongoose = require('mongoose')

let sessionsSchema = new mongoose.Schema({
  session: { type: String, unique: true, required: true },
})

let sessionsModel = mongoose.model('sessions', sessionsSchema)

module.exports = sessionsModel
