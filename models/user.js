const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: String,
    lastName: String,
    username: String,
    password: String,
    isMember: Boolean,
    isAdmin: Boolean
});

module.exports = mongoose.model('User', UserSchema);
