import { toast } from "react-toastify";

export const attendanceService = {
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
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"name": "student_id_c"}, "referenceField": {"field": {"Name": "Name"}}}
        ]
      };

      const response = await apperClient.fetchRecords('attendance_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching attendance:", error?.message || error);
      toast.error("Failed to load attendance");
      return [];
    }
  },

  async getByStudentId(studentId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"name": "student_id_c"}, "referenceField": {"field": {"Name": "Name"}}}
        ],
        where: [
          {"FieldName": "student_id_c", "Operator": "EqualTo", "Values": [parseInt(studentId)]}
        ]
      };

      const response = await apperClient.fetchRecords('attendance_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching student attendance:", error?.message || error);
      return [];
    }
  },

  async getByDate(date) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"name": "student_id_c"}, "referenceField": {"field": {"Name": "Name"}}}
        ],
        where: [
          {"FieldName": "date_c", "Operator": "EqualTo", "Values": [date]}
        ]
      };

      const response = await apperClient.fetchRecords('attendance_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching attendance by date:", error?.message || error);
      return [];
    }
  },

  async create(attendance) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const payload = {
        records: [{
          Name: `Attendance - ${attendance.date_c}`,
          student_id_c: parseInt(attendance.student_id_c),
          date_c: attendance.date_c,
          status_c: attendance.status_c,
          notes_c: attendance.notes_c || ""
        }]
      };

      const response = await apperClient.createRecord('attendance_c', payload);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to create attendance:`, failed);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
            }
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to create attendance");
        }

        return response.results[0].data;
      }

      throw new Error("No data returned from create operation");
    } catch (error) {
      console.error("Error creating attendance:", error?.message || error);
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
          ...(data.student_id_c !== undefined && { student_id_c: parseInt(data.student_id_c) }),
          ...(data.date_c && { date_c: data.date_c }),
          ...(data.status_c && { status_c: data.status_c }),
          ...(data.notes_c !== undefined && { notes_c: data.notes_c })
        }]
      };

      const response = await apperClient.updateRecord('attendance_c', payload);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update attendance:`, failed);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
            }
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to update attendance");
        }

        return response.results[0].data;
      }

      throw new Error("No data returned from update operation");
    } catch (error) {
      console.error("Error updating attendance:", error?.message || error);
      throw error;
    }
  },

  async markAttendance(studentId, date, status, notes = "") {
    try {
      const existing = await this.getByDate(date);
      const studentRecord = existing.find(
        a => a.student_id_c?.Id === parseInt(studentId)
      );

      if (studentRecord) {
        return this.update(studentRecord.Id, { status_c: status, notes_c: notes });
      }

      return this.create({ student_id_c: parseInt(studentId), date_c: date, status_c: status, notes_c: notes });
    } catch (error) {
      console.error("Error marking attendance:", error?.message || error);
      throw error;
    }
  }
};