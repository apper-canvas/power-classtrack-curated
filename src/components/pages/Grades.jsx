import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { studentService } from "@/services/api/studentService";
import { gradeService } from "@/services/api/gradeService";

const Grades = () => {
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedTerm, setSelectedTerm] = useState("Fall 2023");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [studentsData, gradesData] = await Promise.all([
        studentService.getAll(),
        gradeService.getAll()
      ]);
      setStudents(studentsData.filter(s => s.status === "active"));
      setGrades(gradesData);
    } catch (err) {
      setError(err.message || "Failed to load grades data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const subjects = ["Mathematics", "English", "Science", "History", "Physical Education"];

  const getStudentGrade = (studentId, subject) => {
    return grades.find(
      g => g.studentId === studentId && g.subject === subject && g.term === selectedTerm
    );
  };

  const getLetterGradeVariant = (letterGrade) => {
    if (letterGrade.startsWith("A")) return "success";
    if (letterGrade.startsWith("B")) return "info";
    if (letterGrade.startsWith("C")) return "warning";
    return "error";
  };

  const calculateStudentAverage = (studentId) => {
    const studentGrades = grades.filter(
      g => g.studentId === studentId && g.term === selectedTerm
    );
    if (studentGrades.length === 0) return 0;
    
    const total = studentGrades.reduce(
      (sum, g) => sum + ((g.score / g.maxScore) * 100),
      0
    );
    return (total / studentGrades.length).toFixed(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            Grades
          </h1>
          <p className="text-secondary">Manage student grades and academic performance</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-slate-700 whitespace-nowrap">
            Term:
          </label>
          <select
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value)}
            className="px-4 py-2.5 border-2 border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
          >
            <option value="Fall 2023">Fall 2023</option>
            <option value="Spring 2024">Spring 2024</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-success/5 to-success/10 rounded-lg p-6 border-2 border-success/20">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-success/10 p-3 rounded-lg">
              <ApperIcon name="Award" className="w-6 h-6 text-success" />
            </div>
            <span className="text-3xl font-bold text-success">
              {grades.filter(g => g.letterGrade.startsWith("A")).length}
            </span>
          </div>
          <p className="text-sm font-semibold text-slate-700">A Grades</p>
        </div>

        <div className="bg-gradient-to-br from-info/5 to-info/10 rounded-lg p-6 border-2 border-info/20">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-info/10 p-3 rounded-lg">
              <ApperIcon name="TrendingUp" className="w-6 h-6 text-info" />
            </div>
            <span className="text-3xl font-bold text-info">
              {grades.filter(g => g.letterGrade.startsWith("B")).length}
            </span>
          </div>
          <p className="text-sm font-semibold text-slate-700">B Grades</p>
        </div>

        <div className="bg-gradient-to-br from-primary/5 to-accent/10 rounded-lg p-6 border-2 border-primary/20">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-primary/10 p-3 rounded-lg">
              <ApperIcon name="BarChart" className="w-6 h-6 text-primary" />
            </div>
            <span className="text-3xl font-bold text-primary">
              {(grades.reduce((sum, g) => sum + ((g.score / g.maxScore) * 100), 0) / grades.length).toFixed(1)}%
            </span>
          </div>
          <p className="text-sm font-semibold text-slate-700">Class Average</p>
        </div>
      </div>

      {students.length === 0 ? (
        <Empty
          icon="Award"
          title="No Students Found"
          message="Add students to start managing grades"
        />
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider sticky left-0 bg-slate-50">
                    Student
                  </th>
                  {subjects.map((subject) => (
                    <th key={subject} className="px-6 py-4 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">
                      {subject}
                    </th>
                  ))}
                  <th className="px-6 py-4 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Average
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {students.map((student, index) => {
                  const average = calculateStudentAverage(student.Id);
                  return (
                    <tr
                      key={student.Id}
                      className={index % 2 === 0 ? "bg-white" : "bg-slate-50/50"}
                    >
                      <td className="px-6 py-4 whitespace-nowrap sticky left-0 bg-inherit">
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
                            <p className="text-xs text-secondary">
                              Grade {student.classId === "1" ? "10A" : student.classId === "2" ? "10B" : "10C"}
                            </p>
                          </div>
                        </div>
                      </td>
                      {subjects.map((subject) => {
                        const grade = getStudentGrade(student.Id, subject);
                        return (
                          <td key={subject} className="px-6 py-4 whitespace-nowrap text-center">
                            {grade ? (
                              <div className="flex flex-col items-center gap-1">
                                <Badge variant={getLetterGradeVariant(grade.letterGrade)}>
                                  {grade.letterGrade}
                                </Badge>
                                <span className="text-xs text-secondary">
                                  {grade.score}/{grade.maxScore}
                                </span>
                              </div>
                            ) : (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedStudent(student);
                                  toast.info("Grade entry coming soon");
                                }}
                              >
                                <ApperIcon name="Plus" size={16} />
                              </Button>
                            )}
                          </td>
                        );
                      })}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-xl font-bold text-slate-900">{average}%</span>
                          <Badge variant={average >= 90 ? "success" : average >= 80 ? "info" : "warning"}>
                            {average >= 93 ? "A" : average >= 90 ? "A-" : average >= 87 ? "B+" : average >= 83 ? "B" : average >= 80 ? "B-" : "C"}
                          </Badge>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Grades;