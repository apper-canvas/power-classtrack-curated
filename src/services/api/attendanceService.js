import attendanceData from "@/services/mockData/attendance.json";

let attendanceRecords = [...attendanceData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const attendanceService = {
  async getAll() {
    await delay(250);
    return [...attendanceRecords];
  },

  async getByStudentId(studentId) {
    await delay(200);
    return attendanceRecords.filter(a => a.studentId === parseInt(studentId));
  },

  async getByDate(date) {
    await delay(200);
    return attendanceRecords.filter(a => a.date === date);
  },

  async create(attendance) {
    await delay(400);
    const maxId = attendanceRecords.length > 0 ? Math.max(...attendanceRecords.map(a => a.Id)) : 0;
    const newAttendance = {
      ...attendance,
      Id: maxId + 1
    };
    attendanceRecords.push(newAttendance);
    return { ...newAttendance };
  },

  async update(id, data) {
    await delay(400);
    const index = attendanceRecords.findIndex(a => a.Id === parseInt(id));
    if (index === -1) throw new Error("Attendance record not found");
    
    attendanceRecords[index] = {
      ...attendanceRecords[index],
      ...data,
      Id: attendanceRecords[index].Id
    };
    return { ...attendanceRecords[index] };
  },

  async markAttendance(studentId, date, status, notes = "") {
    await delay(400);
    const existing = attendanceRecords.find(
      a => a.studentId === parseInt(studentId) && a.date === date
    );

    if (existing) {
      return this.update(existing.Id, { status, notes });
    }

    return this.create({ studentId: parseInt(studentId), date, status, notes });
  }
};