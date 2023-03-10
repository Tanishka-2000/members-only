const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    title: String,
    msg: String,
    img: String,
    timestamp: Date,
    user: { type: Schema.Types.ObjectId, ref: "User" }
});

module.exports = mongoose.model('Message', MessageSchema);
