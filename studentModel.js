const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    classRoom: { type: String, required: true },
    rollNo: { type: String, required: true }
});


module.exports = mongoose.model('student', studentSchema);
