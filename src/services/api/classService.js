import { toast } from "react-toastify";

export const classService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "year_c"}},
          {"field": {"Name": "section_c"}},
          {"field": {"Name": "capacity_c"}},
          {"field": {"Name": "teacher_id_c"}}
        ]
      };

      const response = await apperClient.fetchRecords('class_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching classes:", error?.message || error);
      toast.error("Failed to load classes");
      return [];
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "year_c"}},
          {"field": {"Name": "section_c"}},
          {"field": {"Name": "capacity_c"}},
          {"field": {"Name": "teacher_id_c"}}
        ]
      };

      const response = await apperClient.getRecordById('class_c', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Class not found");
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching class ${id}:`, error?.message || error);
      throw new Error("Class not found");
    }
  },

  async create(classData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const payload = {
        records: [{
          Name: classData.name_c,
          name_c: classData.name_c,
          year_c: classData.year_c,
          section_c: classData.section_c,
          capacity_c: classData.capacity_c,
          teacher_id_c: classData.teacher_id_c
        }]
      };

      const response = await apperClient.createRecord('class_c', payload);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to create class:`, failed);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
            }
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to create class");
        }

        return response.results[0].data;
      }

      throw new Error("No data returned from create operation");
    } catch (error) {
      console.error("Error creating class:", error?.message || error);
      throw error;
    }
  },

  async update(id, data) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const payload = {
        records: [{
          Id: parseInt(id),
          ...(data.name_c && { Name: data.name_c, name_c: data.name_c }),
          ...(data.year_c !== undefined && { year_c: data.year_c }),
          ...(data.section_c && { section_c: data.section_c }),
          ...(data.capacity_c !== undefined && { capacity_c: data.capacity_c }),
          ...(data.teacher_id_c && { teacher_id_c: data.teacher_id_c })
        }]
      };

      const response = await apperClient.updateRecord('class_c', payload);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update class:`, failed);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
            }
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to update class");
        }

        return response.results[0].data;
      }

      throw new Error("No data returned from update operation");
    } catch (error) {
      console.error("Error updating class:", error?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('class_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return { success: false };
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to delete class:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return { success: false };
        }

        return { success: true };
      }

      return { success: true };
    } catch (error) {
      console.error("Error deleting class:", error?.message || error);
      return { success: false };
    }
  }
};