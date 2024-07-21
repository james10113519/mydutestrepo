const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  data: [mongoose.Schema.Types.Mixed],
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('File', fileSchema);
