const mongoose = require('mongoose');

const envChecklistDataSchema = new mongoose.Schema({
  title: String,
    id: String,
    questions: [String]
});

module.exports = mongoose.model('EnvChecklistData', envChecklistDataSchema);