const Student = require('./studentModel');
const Marks = require('./marksModel');
const joiSchema = require('./validation');
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const Grade = require('./services');




async function addStudent(req, res) {
    const { name, classRoom, rollNo } = req.body;
    try {
        await joiSchema.validateAsync({ name, classRoom, rollNo });

        // Check
        const existingStudent = await Student.findOne({ rollNo });
        if (existingStudent) {
            return res.status(400).send(`Roll number ${rollNo} already exists.`);
        }

        await Student.create({
            name,
            classRoom,
            rollNo
        })
        return res.status(200).send(`${name}'s info added successfully`)
    } catch (error) {
        return res.status(500).send(`${error} Unable to add the ${name}'s info.`)
    }
}

async function getAllStudents(req, res) {
    try {
        return res.status(200).send(await Student.find({}));
    } catch (error) {
        return res.status(500).send(`Unable to find the Student: ${error}`)
    }
}


let studentsCount = 0;

async function addMarks(req, res) {
    const { subject, marks, userId } = req.body;
    try {
        await Marks.create({
            subject,
            marks,
            userId
        });


        let a = studentsCount++;
        console.log(a);

        if (studentsCount === 10) {

            const topper = await calculateTopper();

            await sendEmailToTopper(topper);

        }
        await delayMail();
        res.status(200).json(`Marks added Successfully!`);
    } catch (error) {
        res.status(500).json(`Error in adding marks: ${error}`);
    }
}
// for Marks added 
async function delayMail() {
    setTimeout(async () => {
        try {
            await Grade.sendGrade('student@gmail.com', 'Congratulations! Your marks added Successfully.');
            console.log(" marks added : Email sent successfully.");
        } catch (error) {
            console.error("Error sending email:", error);
        }
    }, 60000);
}

async function calculateTopper() {
    try {
        const allMarks = await Marks.find({}).sort({ marks: -1 }).limit(1);

        let topper;
        if (allMarks.length > 0) {
            topper = allMarks[0].userId;
        }
        return topper;
    } catch (error) {
        throw new Error(`Error in calculating topper: ${error}`);
    }
}

async function sendEmailToTopper(topper) {
    try {

        await Student.findById(topper);
        await Grade.sendGrade('student@gmail.com', 'Congratulations! You are the class topper.');

        console.log('Email sent to the topper successfully');
    } catch (error) {
        console.error('Error sending email to topper:', error);
    }
}


async function getMarks(req, res) {
    try {
        return res.status(200).json(await Marks.find({ userId: ObjectId(req.params.id) }));
    } catch (error) {
        return res.status(500).json(`Unable to find the marks: ${error}`)
    }
}

async function studentMarks(req, res) {
    try {
        const marksObtained = await Marks.find({ userId: ObjectId(req.params.id) }).populate('userId');

        console.log("Marks obtained in :", marksObtained.length, "subjects");


        //this code is for sending the Grade Card to student having marks in atlist 5 subjects
        if (marksObtained && marksObtained.length >= 5) {
            await Grade.sendGrade('student@gmail.com', 'Congratulation! You Pass the exam');
        }

        // Check if the student failed in three or more subjects
        if (marksObtained && marksObtained.length > 0) {
            const failedSubjects = marksObtained.filter(subjectMarks => subjectMarks.marks < 33); // 33 is the passing mark
            if (failedSubjects.length >= 3) {
                await Grade.sendGrade('student@gmail.com', 'Dear student, unfortunately, you have failed in three or more subjects.');
            }
        }



        if (marksObtained && marksObtained.length == 0) {

            return res.status(404).send("No marks data found for the student");
        }
        return res.status(200).send({ message: `This is the marks:`, data: marksObtained })
    } catch (error) {
        return res.status(500).send(`Error in geting the Marks of student : ${error}`)
    }
}

async function studentGrade(req, res) {
    try {

        const studentPercentage = await Marks.aggregate([

            {
                $group: {
                    _id: "$userId",
                    totalMarks: { $sum: "$marks" }
                }
            },
            {
                $lookup: {
                    from: "students",
                    localField: "_id",
                    foreignField: "_id",
                    as: "student"
                }
            },

            {
                $unwind: "$student"
            },
            {
                $project: {
                    _id: 0,
                    studentId: "$student._id",
                    name: "$student.name",
                    classRoom: "$student.classRoom",
                    rollNo: "$student.rollNo",
                    totalMarks: true
                }
            },
            {
                $addFields: {
                    percentage: { $multiply: [{ $divide: ["$totalMarks", 500] }, 100] }
                }
            },
            {
                $addFields: {
                    percentage: { $multiply: [{ $divide: ["$totalMarks", 500] }, 100] }
                }
            },

            {
                $sort: { "rollNo": 1 }
            }
        ]);
        const rearrangedGrades = studentPercentage.map(grade => ({
            studentId: grade.studentId,
            name: grade.name,
            classRoom: grade.classRoom,
            rollNo: grade.rollNo,
            totalMarks: grade.totalMarks,
            percentage: grade.percentage
        }));

        return res.json({ studentPercentage: rearrangedGrades });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


module.exports = { addStudent, addMarks, studentMarks, getAllStudents, getMarks, studentGrade };

