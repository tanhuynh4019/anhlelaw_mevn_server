const mongoose = require('mongoose');
const newsSchema = mongoose.Schema({
    title: String,
    content: String,
    description: String,
    active: Boolean,
    image: String,
    isComment: Boolean,
    view: Number,
    bin: { type: Boolean, default: false },
    dateCreated: { type: Date, default: Date.now },
    dateEdit: { type: Date, default: Date.now }
});
module.exports = mongoose.model('News', newsSchema);