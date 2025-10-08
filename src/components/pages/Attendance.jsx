import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { studentService } from "@/services/api/studentService";
import { attendanceService } from "@/services/api/attendanceService";

const Attendance = () => {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedClass, setSelectedClass] = useState("all");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [studentsData, attendanceData] = await Promise.all([
        studentService.getAll(),
        attendanceService.getAll()
      ]);
      setStudents(studentsData.filter(s => s.status === "active"));
      setAttendance(attendanceData);
    } catch (err) {
      setError(err.message || "Failed to load attendance data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredStudents = selectedClass === "all"
    ? students
    : students.filter(s => s.classId === selectedClass);

  const dateStr = format(selectedDate, "yyyy-MM-dd");

  const getAttendanceStatus = (studentId) => {
    const record = attendance.find(
      a => a.studentId === studentId && a.date === dateStr
    );
    return record?.status || null;
  };

  const handleMarkAttendance = async (studentId, status) => {
    try {
      await attendanceService.markAttendance(studentId, dateStr, status);
      toast.success("Attendance marked successfully!");
      loadData();
    } catch (err) {
      toast.error(err.message || "Failed to mark attendance");
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "present": return "success";
      case "late": return "warning";
      case "absent": return "error";
      case "excused": return "info";
      default: return "default";
    }
  };

  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const todayAttendance = attendance.filter(a => a.date === format(new Date(), "yyyy-MM-dd"));
  const presentToday = todayAttendance.filter(a => a.status === "present").length;
  const absentToday = todayAttendance.filter(a => a.status === "absent").length;

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            Attendance
          </h1>
          <p className="text-secondary">Track and manage student attendance records</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-success/5 to-success/10 rounded-lg p-6 border-2 border-success/20">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-success/10 p-3 rounded-lg">
              <ApperIcon name="CheckCircle" className="w-6 h-6 text-success" />
            </div>
            <span className="text-3xl font-bold text-success">{presentToday}</span>
          </div>
          <p className="text-sm font-semibold text-slate-700">Present Today</p>
        </div>

        <div className="bg-gradient-to-br from-error/5 to-error/10 rounded-lg p-6 border-2 border-error/20">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-error/10 p-3 rounded-lg">
              <ApperIcon name="XCircle" className="w-6 h-6 text-error" />
            </div>
            <span className="text-3xl font-bold text-error">{absentToday}</span>
          </div>
          <p className="text-sm font-semibold text-slate-700">Absent Today</p>
        </div>

        <div className="bg-gradient-to-br from-primary/5 to-accent/10 rounded-lg p-6 border-2 border-primary/20">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-primary/10 p-3 rounded-lg">
              <ApperIcon name="Users" className="w-6 h-6 text-primary" />
            </div>
            <span className="text-3xl font-bold text-primary">{students.length}</span>
          </div>
          <p className="text-sm font-semibold text-slate-700">Total Students</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <input
              type="date"
              value={format(selectedDate, "yyyy-MM-dd")}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className="px-4 py-2.5 border-2 border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
            />
            {!isToday(selectedDate) && (
              <Button variant="secondary" size="sm" onClick={() => setSelectedDate(new Date())}>
                <ApperIcon name="Calendar" size={16} className="mr-2" />
                Today
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-slate-700 whitespace-nowrap">
              Class:
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-4 py-2.5 border-2 border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
            >
              <option value="all">All Classes</option>
              <option value="1">Grade 10A</option>
              <option value="2">Grade 10B</option>
              <option value="3">Grade 10C</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Class
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredStudents.map((student, index) => {
                const status = getAttendanceStatus(student.Id);
                return (
                  <tr
                    key={student.Id}
                    className={index % 2 === 0 ? "bg-white" : "bg-slate-50/50"}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-sm font-bold">
                            {student.firstName[0]}{student.lastName[0]}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {student.firstName} {student.lastName}
                          </p>
                          <p className="text-xs text-secondary">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-slate-900 font-medium">
                        Grade {student.classId === "1" ? "10A" : student.classId === "2" ? "10B" : "10C"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {status ? (
                        <Badge variant={getStatusVariant(status)}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </Badge>
                      ) : (
                        <Badge variant="default">Not Marked</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarkAttendance(student.Id, "present")}
                          className="text-success hover:bg-success/10"
                          title="Mark Present"
                        >
                          <ApperIcon name="CheckCircle" size={18} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarkAttendance(student.Id, "late")}
                          className="text-warning hover:bg-warning/10"
                          title="Mark Late"
                        >
                          <ApperIcon name="Clock" size={18} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarkAttendance(student.Id, "absent")}
                          className="text-error hover:bg-error/10"
                          title="Mark Absent"
                        >
                          <ApperIcon name="XCircle" size={18} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Monthly Overview</h2>
        <div className="grid grid-cols-7 gap-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center text-sm font-bold text-slate-700 py-2">
              {day}
            </div>
          ))}
          {monthDays.map((day) => {
            const dayStr = format(day, "yyyy-MM-dd");
            const dayAttendance = attendance.filter(a => a.date === dayStr);
            const presentCount = dayAttendance.filter(a => a.status === "present").length;
            const hasAttendance = dayAttendance.length > 0;
            
            return (
              <button
                key={day.toString()}
                onClick={() => setSelectedDate(day)}
                className={`p-3 rounded-lg text-sm font-semibold transition-all ${
                  isSameDay(day, selectedDate)
                    ? "bg-gradient-to-r from-primary to-accent text-white shadow-md"
                    : isToday(day)
                    ? "bg-primary/10 text-primary border-2 border-primary"
                    : hasAttendance
                    ? "bg-success/10 text-success hover:bg-success/20"
                    : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <div>{format(day, "d")}</div>
                {hasAttendance && (
                  <div className="text-xs mt-1">{presentCount}</div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Attendance;