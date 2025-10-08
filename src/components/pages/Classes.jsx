import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { classService } from "@/services/api/classService";
import { studentService } from "@/services/api/studentService";

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [classesData, studentsData] = await Promise.all([
        classService.getAll(),
        studentService.getAll()
      ]);
      setClasses(classesData);
      setStudents(studentsData);
    } catch (err) {
      setError(err.message || "Failed to load classes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const getClassStudents = (classId) => {
return students.filter(s => s.class_id_c?.Id === classId && s.status_c === "active");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            Classes
          </h1>
          <p className="text-secondary">Manage class sections and student rosters</p>
        </div>
        <Button variant="primary">
          <ApperIcon name="Plus" size={18} className="mr-2" />
          Add Class
        </Button>
      </div>

      {classes.length === 0 ? (
        <Empty
          icon="BookOpen"
          title="No Classes Found"
          message="Start by adding your first class to the system"
          actionLabel="Add First Class"
          onAction={() => toast.info("Add class functionality coming soon")}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {classes.map((classItem) => {
const classStudents = getClassStudents(classItem.Id);
            const enrollmentRate = (classStudents.length / classItem.capacity_c) * 100;

            return (
              <div
                key={classItem.Id}
                className="bg-white rounded-lg shadow-sm border-2 border-slate-200 hover:border-primary/20 hover:shadow-md transition-all overflow-hidden group"
              >
                <div className="bg-gradient-to-r from-primary to-accent p-6 text-white">
                  <div className="flex items-start justify-between mb-4">
                    <div>
<h3 className="text-2xl font-bold mb-1">{classItem.name_c}</h3>
                      <p className="text-sm opacity-90">Section {classItem.section_c}</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg">
                      <ApperIcon name="BookOpen" className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm opacity-90">
<span>Academic Year {classItem.year_c}</span>
                    <span>Teacher ID: {classItem.teacher_id_c}</span>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold text-slate-900">{classStudents.length}</p>
                      <p className="text-sm text-secondary">Active Students</p>
                    </div>
                    <div className="text-right">
<p className="text-3xl font-bold text-secondary">{classItem.capacity_c}</p>
                      <p className="text-sm text-secondary">Total Capacity</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-secondary font-medium">Enrollment</span>
                      <span className="text-slate-900 font-bold">{enrollmentRate.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
                        style={{ width: `${enrollmentRate}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="primary" size="sm" className="flex-1">
                      <ApperIcon name="Users" size={16} className="mr-1" />
                      View Roster
                    </Button>
                    <Button variant="secondary" size="sm" className="flex-1">
                      <ApperIcon name="Edit" size={16} className="mr-1" />
                      Edit Class
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Classes;