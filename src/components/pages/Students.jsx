import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import StudentTable from "@/components/organisms/StudentTable";
import StudentModal from "@/components/organisms/StudentModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { studentService } from "@/services/api/studentService";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await studentService.getAll();
      setStudents(data);
      setFilteredStudents(data);
    } catch (err) {
      setError(err.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    let filtered = students;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
filtered = filtered.filter(s =>
        s.first_name_c?.toLowerCase().includes(query) ||
        s.last_name_c?.toLowerCase().includes(query) ||
        s.email_c?.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== "all") {
filtered = filtered.filter(s => s.status_c === statusFilter);
    }

    setFilteredStudents(filtered);
  }, [searchQuery, statusFilter, students]);

  const handleAddStudent = () => {
    setSelectedStudent(null);
    setIsModalOpen(true);
  };

  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedStudent) {
        await studentService.update(selectedStudent.Id, formData);
        toast.success("Student updated successfully!");
      } else {
        await studentService.create(formData);
        toast.success("Student added successfully!");
      }
      setIsModalOpen(false);
      loadStudents();
    } catch (err) {
      toast.error(err.message || "Failed to save student");
    }
  };

  const handleDeleteStudent = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await studentService.delete(id);
        toast.success("Student deleted successfully!");
        loadStudents();
      } catch (err) {
        toast.error(err.message || "Failed to delete student");
      }
    }
  };

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadStudents} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            Students
          </h1>
          <p className="text-secondary">Manage student records and information</p>
        </div>
        <Button variant="primary" onClick={handleAddStudent}>
          <ApperIcon name="Plus" size={18} className="mr-2" />
          Add Student
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by name or email..."
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-semibold text-slate-700 whitespace-nowrap">
                Status:
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 border-2 border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="graduated">Graduated</option>
              </select>
            </div>
            <div className="text-sm text-secondary whitespace-nowrap">
              {filteredStudents.length} students
            </div>
          </div>
        </div>
      </div>

      {filteredStudents.length === 0 ? (
        <Empty
          icon="Users"
          title="No Students Found"
          message={searchQuery || statusFilter !== "all" 
            ? "Try adjusting your search or filter criteria" 
            : "Start by adding your first student to the system"}
          actionLabel={!searchQuery && statusFilter === "all" ? "Add First Student" : undefined}
          onAction={!searchQuery && statusFilter === "all" ? handleAddStudent : undefined}
        />
      ) : (
        <StudentTable
          students={filteredStudents}
          onEdit={handleEditStudent}
          onDelete={handleDeleteStudent}
        />
      )}

      <StudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        student={selectedStudent}
      />
    </div>
  );
};

export default Students;