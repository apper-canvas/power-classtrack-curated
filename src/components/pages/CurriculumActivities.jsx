import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { curriculumActivityService } from "@/services/api/curriculumActivityService";
import CurriculumActivityModal from "@/components/organisms/CurriculumActivityModal";
import CurriculumActivityTable from "@/components/organisms/CurriculumActivityTable";

const CurriculumActivities = () => {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const loadActivities = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await curriculumActivityService.getAll();
      setActivities(data);
      setFilteredActivities(data);
    } catch (err) {
      setError(err.message || "Failed to load curriculum activities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
  }, []);

  useEffect(() => {
    let filtered = activities;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(activity =>
        activity.name_c?.toLowerCase().includes(query) ||
        activity.description_c?.toLowerCase().includes(query) ||
        activity.Tags?.toLowerCase().includes(query)
      );
    }

    setFilteredActivities(filtered);
  }, [searchQuery, activities]);

  const handleAddActivity = () => {
    setSelectedActivity(null);
    setIsModalOpen(true);
  };

  const handleEditActivity = (activity) => {
    setSelectedActivity(activity);
    setIsModalOpen(true);
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedActivity) {
        await curriculumActivityService.update(selectedActivity.Id, formData);
        toast.success("Curriculum activity updated successfully!");
      } else {
        await curriculumActivityService.create(formData);
        toast.success("Curriculum activity added successfully!");
      }
      setIsModalOpen(false);
      loadActivities();
    } catch (err) {
      toast.error(err.message || "Failed to save curriculum activity");
    }
  };

  const handleDeleteActivity = async (id) => {
    if (window.confirm("Are you sure you want to delete this curriculum activity?")) {
      try {
        await curriculumActivityService.delete(id);
        toast.success("Curriculum activity deleted successfully!");
        loadActivities();
      } catch (err) {
        toast.error(err.message || "Failed to delete curriculum activity");
      }
    }
  };

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadActivities} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            Curriculum Activities
          </h1>
          <p className="text-secondary">Manage curriculum activities and educational programs</p>
        </div>
        <Button variant="primary" onClick={handleAddActivity}>
          <ApperIcon name="Plus" size={18} className="mr-2" />
          Add Activity
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by name, description, or tags..."
            />
          </div>
          <div className="text-sm text-secondary whitespace-nowrap">
            {filteredActivities.length} activities
          </div>
        </div>
      </div>

      {filteredActivities.length === 0 ? (
        <Empty
          icon="Activity"
          title="No Curriculum Activities Found"
          message={searchQuery 
            ? "Try adjusting your search criteria" 
            : "Start by adding your first curriculum activity"}
          actionLabel={!searchQuery ? "Add First Activity" : undefined}
          onAction={!searchQuery ? handleAddActivity : undefined}
        />
      ) : (
        <CurriculumActivityTable
          activities={filteredActivities}
          onEdit={handleEditActivity}
          onDelete={handleDeleteActivity}
        />
      )}

      <CurriculumActivityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        activity={selectedActivity}
      />
    </div>
  );
};

export default CurriculumActivities;