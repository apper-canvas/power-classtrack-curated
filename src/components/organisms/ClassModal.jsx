import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";

const ClassModal = ({ isOpen, onClose, onSubmit, classData }) => {
  const [formData, setFormData] = useState({
    name_c: "",
    year_c: "",
    section_c: "",
    capacity_c: "",
    teacher_id_c: ""
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (classData) {
      setFormData({
        name_c: classData.name_c || "",
        year_c: classData.year_c?.toString() || "",
        section_c: classData.section_c || "",
        capacity_c: classData.capacity_c?.toString() || "",
        teacher_id_c: classData.teacher_id_c || ""
      });
    } else {
      setFormData({
        name_c: "",
        year_c: "",
        section_c: "",
        capacity_c: "",
        teacher_id_c: ""
      });
    }
    setErrors({});
  }, [classData, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name_c?.trim()) {
      newErrors.name_c = "Class name is required";
    }

    if (!formData.year_c?.trim()) {
      newErrors.year_c = "Year is required";
    } else if (isNaN(formData.year_c) || parseInt(formData.year_c) < 1) {
      newErrors.year_c = "Year must be a positive number";
    }

    if (!formData.section_c?.trim()) {
      newErrors.section_c = "Section is required";
    }

    if (formData.capacity_c && (isNaN(formData.capacity_c) || parseInt(formData.capacity_c) < 1)) {
      newErrors.capacity_c = "Capacity must be a positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const submitData = {
        name_c: formData.name_c.trim(),
        year_c: parseInt(formData.year_c),
        section_c: formData.section_c.trim(),
        capacity_c: formData.capacity_c ? parseInt(formData.capacity_c) : undefined,
        teacher_id_c: formData.teacher_id_c?.trim() || undefined
      };
      await onSubmit(submitData);
    } catch (error) {
      // Error handled by parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
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
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto my-8">
              <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
                <h2 className="text-2xl font-bold text-slate-900">
                  {classData ? "Edit Class" : "Add New Class"}
                </h2>
                <button
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
                >
                  <ApperIcon name="X" size={20} className="text-secondary" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <FormField
                  label="Class Name"
                  required
                  value={formData.name_c}
                  onChange={(e) => handleChange("name_c", e.target.value)}
                  error={errors.name_c}
                  placeholder="e.g., Grade 10A"
                  disabled={isSubmitting}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    label="Year"
                    type="number"
                    required
                    value={formData.year_c}
                    onChange={(e) => handleChange("year_c", e.target.value)}
                    error={errors.year_c}
                    placeholder="e.g., 2024"
                    disabled={isSubmitting}
                  />

                  <FormField
                    label="Section"
                    required
                    value={formData.section_c}
                    onChange={(e) => handleChange("section_c", e.target.value)}
                    error={errors.section_c}
                    placeholder="e.g., A, B, C"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    label="Capacity"
                    type="number"
                    value={formData.capacity_c}
                    onChange={(e) => handleChange("capacity_c", e.target.value)}
                    error={errors.capacity_c}
                    placeholder="Maximum students"
                    disabled={isSubmitting}
                  />

                  <FormField
                    label="Teacher ID"
                    value={formData.teacher_id_c}
                    onChange={(e) => handleChange("teacher_id_c", e.target.value)}
                    error={errors.teacher_id_c}
                    placeholder="Assigned teacher ID"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                  <Button 
                    type="button" 
                    variant="secondary" 
                    onClick={handleClose}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    variant="primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <ApperIcon name="Loader2" size={18} className="mr-2 animate-spin" />
                        {classData ? "Updating..." : "Adding..."}
                      </>
                    ) : (
                      <>
                        <ApperIcon name="Save" size={18} className="mr-2" />
                        {classData ? "Update Class" : "Add Class"}
                      </>
                    )}
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

export default ClassModal;