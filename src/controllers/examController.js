const Exam = require('../models/Exam');
const Result = require('../models/Result');
const Student = require('../models/Student');

// @desc    Get all exams
// @route   GET /api/exams
// @access  Private (Admin)
exports.getExams = async (req, res) => {
  try {
    const exams = await Exam.find().sort('-date');
    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create an exam
// @route   POST /api/exams
// @access  Private (Admin)
exports.createExam = async (req, res) => {
  try {
    const exam = await Exam.create(req.body);
    res.status(201).json(exam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete an exam
// @route   DELETE /api/exams/:id
// @access  Private (Admin)
exports.deleteExam = async (req, res) => {
  try {
    await Exam.findByIdAndDelete(req.params.id);
    await Result.deleteMany({ exam: req.params.id });
    res.json({ message: 'Exam and associated results deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get results for an exam and class section
// @route   GET /api/exams/:id/results
// @access  Private (Admin)
exports.getExamResults = async (req, res) => {
  try {
    const { id } = req.params;
    const { section } = req.query;
    
    const exam = await Exam.findById(id);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });

    // Find students in this class and section
    const students = await Student.find({ className: exam.className, section: section || 'A' }).sort('name');
    
    // Find existing results for this exam
    const results = await Result.find({ exam: id }).populate('student', 'name admissionNumber rollNumber');

    // Merge existing results with students list
    const mappedResults = students.map(student => {
      const existing = results.find(r => r.student._id.toString() === student._id.toString());
      if (existing) {
        return existing;
      }
      
      // Template for students who don't have results yet
      return {
        student,
        exam: id,
        marks: exam.subjects.map(sub => ({
          subjectName: sub.name,
          marksObtained: 0,
          remarks: ''
        })),
        teacherRemarks: '',
        status: 'Pass'
      };
    });

    res.json(mappedResults);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Save/Update multiple results for an exam
// @route   POST /api/exams/:id/results
// @access  Private (Admin)
exports.saveExamResults = async (req, res) => {
  try {
    const { id } = req.params;
    const { results } = req.body;
    
    const exam = await Exam.findById(id);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });

    const savedResults = [];

    for (const result of results) {
      let totalMarks = 0;
      let totalMaxMarks = 0;
      let isFail = false;

      // Calculate totals and grade
      result.marks.forEach(m => {
        totalMarks += Number(m.marksObtained);
        const subjectDef = exam.subjects.find(s => s.name === m.subjectName);
        if (subjectDef) {
          totalMaxMarks += subjectDef.maxMarks;
          if (Number(m.marksObtained) < subjectDef.passingMarks) {
            isFail = true;
          }
        }
      });

      const percentage = totalMaxMarks > 0 ? (totalMarks / totalMaxMarks) * 100 : 0;
      let grade = 'F';
      if (!isFail) {
        if (percentage >= 90) grade = 'A+';
        else if (percentage >= 80) grade = 'A';
        else if (percentage >= 70) grade = 'B';
        else if (percentage >= 60) grade = 'C';
        else if (percentage >= 50) grade = 'D';
        else grade = 'E';
      }
      
      const status = isFail ? 'Fail' : 'Pass';

      const updateData = {
        exam: id,
        student: result.student,
        marks: result.marks,
        totalMarksObtained: totalMarks,
        percentage: Number(percentage.toFixed(2)),
        grade,
        status,
        teacherRemarks: result.teacherRemarks
      };

      const saved = await Result.findOneAndUpdate(
        { exam: id, student: result.student },
        updateData,
        { new: true, upsert: true }
      );
      savedResults.push(saved);
    }

    res.json({ message: 'Results saved successfully', count: savedResults.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get student's report cards
// @route   GET /api/exams/student/reports
// @access  Private (Student)
exports.getStudentReports = async (req, res) => {
  try {
    const studentId = req.student._id;
    const results = await Result.find({ student: studentId })
      .populate('exam', 'name className academicYear date subjects')
      .sort('-createdAt');
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
