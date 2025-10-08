import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import StatCard from "@/components/molecules/StatCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import { studentService } from "@/services/api/studentService";
import { attendanceService } from "@/services/api/attendanceService";
import { gradeService } from "@/services/api/gradeService";
import { format, subDays } from "date-fns";

const Dashboard = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [studentsData, attendanceData, gradesData] = await Promise.all([
        studentService.getAll(),
        attendanceService.getAll(),
        gradeService.getAll()
      ]);
      setStudents(studentsData);
      setAttendance(attendanceData);
      setGrades(gradesData);
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadData} />;

const activeStudents = students.filter(s => s.status_c === "active").length;
  const totalStudents = students.length;
  
  const recentAttendance = attendance.filter(a => {
    const date = new Date(a.date_c);
    const today = new Date();
    const daysDiff = Math.floor((today - date) / (1000 * 60 * 60 * 24));
    return daysDiff <= 7;
  });
  
  const presentCount = recentAttendance.filter(a => a.status_c === "present").length;
  const attendanceRate = recentAttendance.length > 0 
    ? ((presentCount / recentAttendance.length) * 100).toFixed(1)
    : 0;

  const totalScore = grades.reduce((sum, g) => sum + ((g.score_c / g.max_score_c) * 100), 0);
  const averageGrade = grades.length > 0 
    ? (totalScore / grades.length).toFixed(1)
    : 0;

  const recentActivities = [
    {
      id: 1,
      type: "student",
      message: "New student Emma Johnson enrolled in Grade 10A",
      time: "2 hours ago",
      icon: "UserPlus",
      iconBg: "bg-success/10",
      iconColor: "text-success"
    },
    {
      id: 2,
      type: "attendance",
      message: "Attendance marked for Grade 10B - 28 students present",
      time: "4 hours ago",
      icon: "Calendar",
      iconBg: "bg-info/10",
      iconColor: "text-info"
    },
    {
      id: 3,
      type: "grade",
      message: "Mathematics grades updated for Grade 10A",
      time: "1 day ago",
      icon: "Award",
      iconBg: "bg-warning/10",
      iconColor: "text-warning"
    }
  ];

  const upcomingEvents = [
    { id: 1, title: "Parent-Teacher Conference", date: "Jan 20, 2024", type: "Meeting" },
    { id: 2, title: "Mid-term Examinations", date: "Jan 25, 2024", type: "Exam" },
    { id: 3, title: "Science Fair", date: "Feb 05, 2024", type: "Event" }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            Dashboard
          </h1>
          <p className="text-secondary">Welcome back! Here's what's happening today.</p>
        </div>
        <Button variant="primary" onClick={() => navigate("/students")}>
          <ApperIcon name="Plus" size={18} className="mr-2" />
          Add Student
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon="Users"
          iconBg="bg-primary/10"
          iconColor="text-primary"
          title="Total Students"
          value={totalStudents}
          trend="+12%"
          trendDirection="up"
        />
        <StatCard
          icon="UserCheck"
          iconBg="bg-success/10"
          iconColor="text-success"
          title="Active Students"
          value={activeStudents}
          trend="+5%"
          trendDirection="up"
        />
        <StatCard
          icon="Calendar"
          iconBg="bg-info/10"
          iconColor="text-info"
          title="Attendance Rate"
          value={`${attendanceRate}%`}
          trend="+3%"
          trendDirection="up"
        />
        <StatCard
          icon="Award"
          iconBg="bg-warning/10"
          iconColor="text-warning"
          title="Average Grade"
          value={`${averageGrade}%`}
          trend="+2%"
          trendDirection="up"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Recent Activities</h2>
            <Button variant="ghost" size="sm">
              View All
              <ApperIcon name="ArrowRight" size={16} className="ml-1" />
            </Button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors">
                <div className={`p-2 rounded-lg ${activity.iconBg} flex-shrink-0`}>
                  <ApperIcon name={activity.icon} className={`w-5 h-5 ${activity.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-900 font-medium">{activity.message}</p>
                  <p className="text-xs text-secondary mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Upcoming Events</h2>
            <Button variant="ghost" size="sm">
              View Calendar
              <ApperIcon name="ArrowRight" size={16} className="ml-1" />
            </Button>
          </div>
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-4 border-2 border-slate-100 rounded-lg hover:border-primary/20 hover:bg-slate-50 transition-all">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-1">{event.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-secondary">
                    <ApperIcon name="Calendar" size={14} />
                    <span>{event.date}</span>
                  </div>
                </div>
                <Badge variant="info">{event.type}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => navigate("/students")}
            className="flex flex-col items-center gap-3 p-6 border-2 border-slate-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all group"
          >
            <div className="bg-primary/10 p-4 rounded-full group-hover:bg-primary group-hover:scale-110 transition-all">
              <ApperIcon name="UserPlus" className="w-6 h-6 text-primary group-hover:text-white" />
            </div>
            <span className="text-sm font-semibold text-slate-900">Add Student</span>
          </button>

          <button
            onClick={() => navigate("/attendance")}
            className="flex flex-col items-center gap-3 p-6 border-2 border-slate-200 rounded-lg hover:border-info hover:bg-info/5 transition-all group"
          >
            <div className="bg-info/10 p-4 rounded-full group-hover:bg-info group-hover:scale-110 transition-all">
              <ApperIcon name="Calendar" className="w-6 h-6 text-info group-hover:text-white" />
            </div>
            <span className="text-sm font-semibold text-slate-900">Mark Attendance</span>
          </button>

          <button
            onClick={() => navigate("/grades")}
            className="flex flex-col items-center gap-3 p-6 border-2 border-slate-200 rounded-lg hover:border-warning hover:bg-warning/5 transition-all group"
          >
            <div className="bg-warning/10 p-4 rounded-full group-hover:bg-warning group-hover:scale-110 transition-all">
              <ApperIcon name="Award" className="w-6 h-6 text-warning group-hover:text-white" />
            </div>
            <span className="text-sm font-semibold text-slate-900">Enter Grades</span>
          </button>

          <button
            onClick={() => navigate("/classes")}
            className="flex flex-col items-center gap-3 p-6 border-2 border-slate-200 rounded-lg hover:border-success hover:bg-success/5 transition-all group"
          >
            <div className="bg-success/10 p-4 rounded-full group-hover:bg-success group-hover:scale-110 transition-all">
              <ApperIcon name="BookOpen" className="w-6 h-6 text-success group-hover:text-white" />
            </div>
            <span className="text-sm font-semibold text-slate-900">Manage Classes</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;