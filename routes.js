const express = require('express');
const router = express.Router();
const controllers = require('./controllers')
router.post('/addStudent', controllers.addStudent)
router.get('/getAllStudents', controllers.getAllStudents)
router.post('/addMarks', controllers.addMarks)
router.get('/getMarks/:id', controllers.getMarks)
router.get('/studentMarks', controllers.studentMarks)
router.get('/studentMarks/:id', controllers.studentMarks)
router.get('/studentGrade', controllers.studentGrade)



module.exports = router;