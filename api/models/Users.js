const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    _id: mongoose.SchemaTypes.ObjectId,
    name: String, 
    email: String, 
    password: String
});
module.exports = mongoose.model('Users', userSchema);
