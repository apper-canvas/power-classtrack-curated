import { toast } from "react-toastify";

const calculateLetterGrade = (score, maxScore) => {
  const percentage = (score / maxScore) * 100;
  if (percentage >= 93) return "A";
  if (percentage >= 90) return "A-";
  if (percentage >= 87) return "B+";
  if (percentage >= 83) return "B";
  if (percentage >= 80) return "B-";
  if (percentage >= 77) return "C+";
  if (percentage >= 73) return "C";
  if (percentage >= 70) return "C-";
  if (percentage >= 67) return "D+";
  if (percentage >= 63) return "D";
  if (percentage >= 60) return "D-";
  return "F";
};

export const gradeService = {
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
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "term_c"}},
          {"field": {"Name": "score_c"}},
          {"field": {"Name": "max_score_c"}},
          {"field": {"Name": "letter_grade_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"name": "student_id_c"}, "referenceField": {"field": {"Name": "Name"}}}
        ]
      };

      const response = await apperClient.fetchRecords('grade_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching grades:", error?.message || error);
      toast.error("Failed to load grades");
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
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "term_c"}},
          {"field": {"Name": "score_c"}},
          {"field": {"Name": "max_score_c"}},
          {"field": {"Name": "letter_grade_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"name": "student_id_c"}, "referenceField": {"field": {"Name": "Name"}}}
        ],
        where: [
          {"FieldName": "student_id_c", "Operator": "EqualTo", "Values": [parseInt(studentId)]}
        ]
      };

      const response = await apperClient.fetchRecords('grade_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching student grades:", error?.message || error);
      return [];
    }
  },

  async create(grade) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const letterGrade = calculateLetterGrade(grade.score_c, grade.max_score_c);

      const payload = {
        records: [{
          Name: `${grade.subject_c} - ${grade.term_c}`,
          student_id_c: parseInt(grade.student_id_c),
          subject_c: grade.subject_c,
          term_c: grade.term_c,
          score_c: grade.score_c,
          max_score_c: grade.max_score_c,
          letter_grade_c: letterGrade,
          date_c: grade.date_c
        }]
      };

      const response = await apperClient.createRecord('grade_c', payload);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to create grade:`, failed);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
            }
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to create grade");
        }

        return response.results[0].data;
      }

      throw new Error("No data returned from create operation");
    } catch (error) {
      console.error("Error creating grade:", error?.message || error);
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

      const letterGrade = data.score_c && data.max_score_c 
        ? calculateLetterGrade(data.score_c, data.max_score_c)
        : undefined;

      const payload = {
        records: [{
          Id: parseInt(id),
          ...(data.student_id_c !== undefined && { student_id_c: parseInt(data.student_id_c) }),
          ...(data.subject_c && { subject_c: data.subject_c }),
          ...(data.term_c && { term_c: data.term_c }),
          ...(data.score_c !== undefined && { score_c: data.score_c }),
          ...(data.max_score_c !== undefined && { max_score_c: data.max_score_c }),
          ...(letterGrade && { letter_grade_c: letterGrade }),
          ...(data.date_c && { date_c: data.date_c })
        }]
      };

      const response = await apperClient.updateRecord('grade_c', payload);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update grade:`, failed);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
            }
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to update grade");
        }

        return response.results[0].data;
      }

      throw new Error("No data returned from update operation");
    } catch (error) {
      console.error("Error updating grade:", error?.message || error);
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

      const response = await apperClient.deleteRecord('grade_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return { success: false };
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to delete grade:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return { success: false };
        }

        return { success: true };
      }

      return { success: true };
    } catch (error) {
      console.error("Error deleting grade:", error?.message || error);
      return { success: false };
    }
  }
};