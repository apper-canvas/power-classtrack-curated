import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { studentService } from "@/services/api/studentService";
import { attendanceService } from "@/services/api/attendanceService";
import { gradeService } from "@/services/api/gradeService";

const StudentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [studentData, attendanceData, gradesData] = await Promise.all([
        studentService.getById(id),
        attendanceService.getByStudentId(id),
        gradeService.getByStudentId(id)
      ]);
      setStudent(studentData);
      setAttendance(attendanceData);
      setGrades(gradesData);
    } catch (err) {
      setError(err.message || "Failed to load student details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  if (loading) return <Loading type="profile" />;
  if (error) return <Error message={error} onRetry={loadData} />;
  if (!student) return <Error message="Student not found" />;

  const getStatusVariant = (status) => {
    switch (status) {
      case "active": return "success";
      case "inactive": return "warning";
      case "graduated": return "info";
      default: return "default";
    }
  };

  const getAttendanceVariant = (status) => {
    switch (status) {
      case "present": return "success";
      case "late": return "warning";
      case "absent": return "error";
      case "excused": return "info";
      default: return "default";
    }
  };

  const attendanceRate = attendance.length > 0
    ? ((attendance.filter(a => a.status === "present").length / attendance.length) * 100).toFixed(1)
    : 0;

  const totalScore = grades.reduce((sum, g) => sum + ((g.score / g.maxScore) * 100), 0);
  const averageGrade = grades.length > 0 ? (totalScore / grades.length).toFixed(1) : 0;

  const tabs = [
    { id: "overview", label: "Overview", icon: "User" },
    { id: "attendance", label: "Attendance", icon: "Calendar" },
    { id: "grades", label: "Grades", icon: "Award" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate("/students")}>
          <ApperIcon name="ArrowLeft" size={18} className="mr-2" />
          Back to Students
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col lg:flex-row items-start gap-6">
          <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-3xl font-bold">
{student.first_name_c?.[0]}{student.last_name_c?.[0]}
            </span>
          </div>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
{student.first_name_c} {student.last_name_c}
                </h1>
                <div className="flex items-center gap-3 mt-2">
                  <Badge variant={getStatusVariant(student.status_c)}>
                    {student.status_c?.charAt(0).toUpperCase() + student.status_c?.slice(1)}
                  </Badge>
                  <span className="text-sm text-secondary">
                    Grade {student.class_id_c?.Name || 'N/A'}
                  </span>
                </div>
              </div>
              <Button variant="primary">
                <ApperIcon name="Edit" size={18} className="mr-2" />
                Edit Profile
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-info/10 p-2 rounded-lg">
                  <ApperIcon name="Mail" className="w-5 h-5 text-info" />
                </div>
                <div>
                  <p className="text-xs text-secondary font-medium">Email</p>
<p className="text-sm text-slate-900">{student.email_c}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-success/10 p-2 rounded-lg">
                  <ApperIcon name="Phone" className="w-5 h-5 text-success" />
                </div>
                <div>
<p className="text-xs text-secondary font-medium">Phone</p>
                  <p className="text-sm text-slate-900">{student.phone_c}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-warning/10 p-2 rounded-lg">
                  <ApperIcon name="Calendar" className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-xs text-secondary font-medium">Enrolled</p>
<p className="text-sm text-slate-900">
                    {format(new Date(student.enrollment_date_c), "MMM dd, yyyy")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="border-b border-slate-200">
          <div className="flex flex-wrap gap-2 p-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-primary to-accent text-white shadow-md"
                    : "text-secondary hover:bg-slate-100"
                }`}
              >
                <ApperIcon name={tab.icon} size={18} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg p-6 border-2 border-primary/10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <ApperIcon name="Calendar" className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-3xl font-bold text-primary">{attendanceRate}%</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-700">Attendance Rate</p>
                  <p className="text-xs text-secondary mt-1">{attendance.length} total records</p>
                </div>

                <div className="bg-gradient-to-br from-success/5 to-success/10 rounded-lg p-6 border-2 border-success/10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-success/10 p-3 rounded-lg">
                      <ApperIcon name="Award" className="w-6 h-6 text-success" />
                    </div>
                    <span className="text-3xl font-bold text-success">{averageGrade}%</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-700">Average Grade</p>
                  <p className="text-xs text-secondary mt-1">{grades.length} subjects</p>
                </div>

                <div className="bg-gradient-to-br from-info/5 to-info/10 rounded-lg p-6 border-2 border-info/10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-info/10 p-3 rounded-lg">
                      <ApperIcon name="Users" className="w-6 h-6 text-info" />
                    </div>
                    <span className="text-3xl font-bold text-info">
{student.class_id_c?.Name || 'N/A'}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-slate-700">Current Class</p>
                  <p className="text-xs text-secondary mt-1">Academic Year 2024</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Personal Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-sm font-medium text-secondary">Date of Birth</span>
                      <span className="text-sm text-slate-900 font-semibold">
{format(new Date(student.date_of_birth_c), "MMMM dd, yyyy")}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-sm font-medium text-secondary">Address</span>
                      <span className="text-sm text-slate-900 font-semibold text-right max-w-xs">
{student.address_c}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Guardian Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-sm font-medium text-secondary">Name</span>
                      <span className="text-sm text-slate-900 font-semibold">
{student.guardian_name_c}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-sm font-medium text-secondary">Contact</span>
<span className="text-sm text-slate-900 font-semibold">
                        {student.guardian_contact_c}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "attendance" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900">Attendance Records</h3>
                <div className="text-sm text-secondary">
                  {attendance.length} total records
                </div>
              </div>
              {attendance.length === 0 ? (
                <Empty
                  icon="Calendar"
                  title="No Attendance Records"
                  message="No attendance records found for this student"
                />
              ) : (
                <div className="space-y-3">
                  {attendance.slice(0, 10).map((record) => (
                    <div
                      key={record.Id}
                      className="flex items-center justify-between p-4 border-2 border-slate-100 rounded-lg hover:border-primary/20 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-slate-100 p-3 rounded-lg">
                          <ApperIcon name="Calendar" className="w-5 h-5 text-secondary" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
{format(new Date(record.date_c), "MMMM dd, yyyy")}
                          </p>
                          {record.notes_c && (
                            <p className="text-xs text-secondary mt-1">{record.notes_c}</p>
                          )}
                        </div>
                      </div>
                      <Badge variant={getAttendanceVariant(record.status_c)}>
                        {record.status_c?.charAt(0).toUpperCase() + record.status_c?.slice(1)}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "grades" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900">Grade Records</h3>
                <div className="text-sm text-secondary">
                  Average: {averageGrade}%
                </div>
              </div>
              {grades.length === 0 ? (
                <Empty
                  icon="Award"
                  title="No Grade Records"
                  message="No grade records found for this student"
                />
              ) : (
                <div className="space-y-3">
                  {grades.map((grade) => (
                    <div
                      key={grade.Id}
                      className="flex items-center justify-between p-4 border-2 border-slate-100 rounded-lg hover:border-primary/20 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-br from-warning/10 to-warning/20 p-3 rounded-lg">
                          <ApperIcon name="Award" className="w-5 h-5 text-warning" />
                        </div>
                        <div>
<p className="text-sm font-semibold text-slate-900">{grade.subject_c}</p>
                          <p className="text-xs text-secondary">{grade.term_c}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-bold text-slate-900">
                            {grade.score_c}/{grade.max_score_c}
                          </span>
                          <Badge variant="success">{grade.letter_grade_c}</Badge>
                        </div>
                        <p className="text-xs text-secondary mt-1">
                          {((grade.score / grade.maxScore) * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDetail;