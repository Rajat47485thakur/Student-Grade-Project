const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const marksSchema = new mongoose.Schema({
    subject: { type: String },
    marks: { type: Number },
    userId: { type: ObjectId, ref: "student", default: null }

});

module.exports = mongoose.model( 'marks', marksSchema );
