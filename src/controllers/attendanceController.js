const Attendance = require('../models/Attendance');
const Student = require('../models/Student');

// @desc    Get attendance for a specific class, section, and date
// @route   GET /api/attendance
// @access  Private (Admin/Faculty)
exports.getAttendance = async (req, res) => {
  try {
    const { date, className, section } = req.query;
    
    if (!date || !className) {
      return res.status(400).json({ message: 'Date and Class Name are required' });
    }

    const queryDate = new Date(date);
    queryDate.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      date: queryDate,
      className,
      section: section || 'A'
    }).populate('records.student', 'name admissionNumber rollNumber');

    if (attendance) {
      return res.json(attendance);
    } else {
      // If no attendance found, return a template with all students of that class
      const students = await Student.find({ className, section: section || 'A' }).sort('name');
      const template = {
        date: queryDate,
        className,
        section: section || 'A',
        records: students.map(s => ({
          student: s,
          status: 'Present', // Default
          remarks: ''
        }))
      };
      return res.json(template);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark or update attendance
// @route   POST /api/attendance
// @access  Private (Admin/Faculty)
exports.markAttendance = async (req, res) => {
  try {
    const { date, className, section, records } = req.body;

    const queryDate = new Date(date);
    queryDate.setHours(0, 0, 0, 0);

    let attendance = await Attendance.findOne({
      date: queryDate,
      className,
      section: section || 'A'
    });

    if (attendance) {
      // Update existing
      attendance.records = records;
      attendance.markedBy = req.user._id;
      await attendance.save();
    } else {
      // Create new
      attendance = await Attendance.create({
        date: queryDate,
        className,
        section: section || 'A',
        records,
        markedBy: req.user._id
      });
    }

    res.json({ message: 'Attendance saved successfully', attendance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get attendance summary for a student
// @route   GET /api/attendance/student/summary
// @access  Private (Student)
exports.getStudentSummary = async (req, res) => {
  try {
    const studentId = req.student._id;
    const { month, year } = req.query; // Optional filters

    let dateMatch = {};
    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);
      dateMatch = { date: { $gte: startDate, $lte: endDate } };
    }

    const attendances = await Attendance.find({
      'records.student': studentId,
      ...dateMatch
    }).sort('-date');

    let totalDays = attendances.length;
    let presentCount = 0;
    let absentCount = 0;
    let lateCount = 0;
    let halfDayCount = 0;

    const history = attendances.map(a => {
      const record = a.records.find(r => r.student.toString() === studentId.toString());
      if (record) {
        if (record.status === 'Present') presentCount++;
        if (record.status === 'Absent') absentCount++;
        if (record.status === 'Late') lateCount++;
        if (record.status === 'Half-day') halfDayCount++;
      }
      return {
        date: a.date,
        status: record ? record.status : 'Unknown',
        remarks: record ? record.remarks : ''
      };
    });

    res.json({
      summary: {
        totalDays,
        present: presentCount,
        absent: absentCount,
        late: lateCount,
        halfDay: halfDayCount,
        percentage: totalDays > 0 ? Math.round((presentCount + (halfDayCount * 0.5)) / totalDays * 100) : 0
      },
      history
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
