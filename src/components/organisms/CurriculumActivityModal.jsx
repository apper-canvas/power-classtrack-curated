import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import FormField from "@/components/molecules/FormField";

const CurriculumActivityModal = ({ isOpen, onClose, onSubmit, activity }) => {
  const [formData, setFormData] = useState({
    Name: "",
    name_c: "",
    description_c: "",
    start_date_c: "",
    end_date_c: "",
    Tags: ""
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (activity) {
      setFormData({
        Name: activity.Name || "",
        name_c: activity.name_c || "",
        description_c: activity.description_c || "",
        start_date_c: activity.start_date_c || "",
        end_date_c: activity.end_date_c || "",
        Tags: activity.Tags || ""
      });
    } else {
      setFormData({
        Name: "",
        name_c: "",
        description_c: "",
        start_date_c: "",
        end_date_c: "",
        Tags: ""
      });
    }
    setErrors({});
  }, [activity, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name_c.trim()) {
      newErrors.name_c = "Activity name is required";
    }

    if (!formData.description_c.trim()) {
      newErrors.description_c = "Description is required";
    }

    if (formData.start_date_c && formData.end_date_c) {
      const startDate = new Date(formData.start_date_c);
      const endDate = new Date(formData.end_date_c);
      if (startDate > endDate) {
        newErrors.end_date_c = "End date must be after start date";
      }
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
      await onSubmit(formData);
    } catch (error) {
      // Error handled by parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50"
          onClick={handleClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden"
        >
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">
              {activity ? "Edit" : "Add"} Curriculum Activity
            </h2>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <ApperIcon name="X" size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Activity Name"
                error={errors.name_c}
                required
              >
                <Input
                  value={formData.name_c}
                  onChange={(e) => handleInputChange("name_c", e.target.value)}
                  placeholder="Enter activity name"
                  disabled={isSubmitting}
                />
              </FormField>

              <FormField
                label="Display Name"
                error={errors.Name}
              >
                <Input
                  value={formData.Name}
                  onChange={(e) => handleInputChange("Name", e.target.value)}
                  placeholder="Enter display name (optional)"
                  disabled={isSubmitting}
                />
              </FormField>
            </div>

            <FormField
              label="Description"
              error={errors.description_c}
              required
            >
              <textarea
                value={formData.description_c}
                onChange={(e) => handleInputChange("description_c", e.target.value)}
                placeholder="Enter activity description"
                disabled={isSubmitting}
                rows={4}
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 disabled:bg-slate-50 disabled:text-slate-500"
              />
            </FormField>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Start Date"
                error={errors.start_date_c}
              >
                <Input
                  type="date"
                  value={formData.start_date_c}
                  onChange={(e) => handleInputChange("start_date_c", e.target.value)}
                  disabled={isSubmitting}
                />
              </FormField>

              <FormField
                label="End Date"
                error={errors.end_date_c}
              >
                <Input
                  type="date"
                  value={formData.end_date_c}
                  onChange={(e) => handleInputChange("end_date_c", e.target.value)}
                  disabled={isSubmitting}
                />
              </FormField>
            </div>

            <FormField
              label="Tags"
              error={errors.Tags}
            >
              <Input
                value={formData.Tags}
                onChange={(e) => handleInputChange("Tags", e.target.value)}
                placeholder="Enter tags separated by commas"
                disabled={isSubmitting}
              />
            </FormField>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <Button
                type="button"
                variant="outline"
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
                    <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                    {activity ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  <>
                    <ApperIcon name="Save" size={16} className="mr-2" />
                    {activity ? "Update" : "Add"} Activity
                  </>
                )}
              </Button>
            </div>
          </form>
</motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CurriculumActivityModal;