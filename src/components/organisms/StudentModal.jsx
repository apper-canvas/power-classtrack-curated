import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";

const StudentModal = ({ isOpen, onClose, onSubmit, student }) => {
const [formData, setFormData] = useState({
    first_name_c: "",
    last_name_c: "",
    email_c: "",
    phone_c: "",
    date_of_birth_c: "",
    enrollment_date_c: "",
    class_id_c: "1",
    status_c: "active",
    address_c: "",
    guardian_name_c: "",
    guardian_contact_c: "",
    photo_c: ""
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
if (student) {
      setFormData({
        first_name_c: student.first_name_c || "",
        last_name_c: student.last_name_c || "",
        email_c: student.email_c || "",
        phone_c: student.phone_c || "",
        date_of_birth_c: student.date_of_birth_c || "",
        enrollment_date_c: student.enrollment_date_c || "",
        class_id_c: student.class_id_c?.Id?.toString() || "1",
        status_c: student.status_c || "active",
        address_c: student.address_c || "",
        guardian_name_c: student.guardian_name_c || "",
        guardian_contact_c: student.guardian_contact_c || "",
        photo_c: student.photo_c || ""
      });
    } else {
      setFormData({
        first_name_c: "",
        last_name_c: "",
        email_c: "",
        phone_c: "",
        date_of_birth_c: "",
        enrollment_date_c: new Date().toISOString().split("T")[0],
        class_id_c: "1",
        status_c: "active",
        address_c: "",
        guardian_name_c: "",
        guardian_contact_c: "",
        photo_c: ""
      });
    }
    setErrors({});
  }, [student, isOpen]);

  const validateForm = () => {
    const newErrors = {};

if (!formData.first_name_c?.trim()) newErrors.first_name_c = "First name is required";
    if (!formData.last_name_c?.trim()) newErrors.last_name_c = "Last name is required";
    if (!formData.email_c?.trim()) {
      newErrors.email_c = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email_c)) {
      newErrors.email_c = "Email is invalid";
    }
    if (!formData.phone_c?.trim()) newErrors.phone_c = "Phone is required";
    if (!formData.date_of_birth_c) newErrors.date_of_birth_c = "Date of birth is required";
    if (!formData.enrollment_date_c) newErrors.enrollment_date_c = "Enrollment date is required";
    if (!formData.guardian_name_c?.trim()) newErrors.guardian_name_c = "Guardian name is required";
    if (!formData.guardian_contact_c?.trim()) newErrors.guardian_contact_c = "Guardian contact is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto my-8">
              <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
                <h2 className="text-2xl font-bold text-slate-900">
                  {student ? "Edit Student" : "Add New Student"}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" size={20} className="text-secondary" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    label="First Name"
                    required
value={formData.first_name_c}
                    onChange={(e) => handleChange("first_name_c", e.target.value)}
                    error={errors.firstName}
                    placeholder="Enter first name"
                  />

                  <FormField
                    label="Last Name"
required
                    value={formData.last_name_c}
                    onChange={(e) => handleChange("last_name_c", e.target.value)}
                    error={errors.last_name_c}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                    error={errors.lastName}
                    placeholder="Enter last name"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    label="Email"
type="email"
                    required
                    value={formData.email_c}
                    onChange={(e) => handleChange("email_c", e.target.value)}
                    error={errors.email_c}
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    error={errors.email}
                    placeholder="student@school.edu"
                  />

                  <FormField
                    label="Phone"
                    type="tel"
                    required
value={formData.phone_c}
                    onChange={(e) => handleChange("phone_c", e.target.value)}
                    error={errors.phone_c}
                    error={errors.phone}
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    label="Date of Birth"
                    type="date"
                    required
value={formData.date_of_birth_c}
                    onChange={(e) => handleChange("date_of_birth_c", e.target.value)}
                    error={errors.date_of_birth_c}
                    error={errors.dateOfBirth}
                  />

                  <FormField
                    label="Enrollment Date"
                    type="date"
required
                    value={formData.enrollment_date_c}
                    onChange={(e) => handleChange("enrollment_date_c", e.target.value)}
                    error={errors.enrollment_date_c}
                    onChange={(e) => handleChange("enrollmentDate", e.target.value)}
                    error={errors.enrollmentDate}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Class <span className="text-error">*</span>
                    </label>
                    <select
value={formData.class_id_c}
                      onChange={(e) => handleChange("class_id_c", e.target.value)}
                      onChange={(e) => handleChange("classId", e.target.value)}
                      className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                    >
                      <option value="1">Grade 10A</option>
                      <option value="2">Grade 10B</option>
                      <option value="3">Grade 10C</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Status <span className="text-error">*</span>
                    </label>
                    <select
value={formData.status_c}
                      onChange={(e) => handleChange("status_c", e.target.value)}
                      onChange={(e) => handleChange("status", e.target.value)}
                      className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="graduated">Graduated</option>
                    </select>
                  </div>
                </div>

                <FormField
                  label="Address"
value={formData.address_c}
                  onChange={(e) => handleChange("address_c", e.target.value)}
                  placeholder="Enter full address"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    label="Guardian Name"
                    required
value={formData.guardian_name_c}
                    onChange={(e) => handleChange("guardian_name_c", e.target.value)}
                    error={errors.guardian_name_c}
                    error={errors.guardianName}
                    placeholder="Enter guardian name"
                  />

                  <FormField
                    label="Guardian Contact"
                    type="tel"
required
                    value={formData.guardian_contact_c}
                    onChange={(e) => handleChange("guardian_contact_c", e.target.value)}
                    error={errors.guardian_contact_c}
                    onChange={(e) => handleChange("guardianContact", e.target.value)}
                    error={errors.guardianContact}
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                  <Button type="button" variant="secondary" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary">
                    <ApperIcon name="Save" size={18} className="mr-2" />
                    {student ? "Update Student" : "Add Student"}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default StudentModal;