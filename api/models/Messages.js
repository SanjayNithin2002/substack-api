const mongoose = require('mongoose');
const messageSchema = mongoose.Schema({
    _id: mongoose.SchemaTypes.ObjectId,
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Users'
    },
    postedOn: Date,
    content: String
});
module.exports = mongoose.model('Messages', messageSchema);