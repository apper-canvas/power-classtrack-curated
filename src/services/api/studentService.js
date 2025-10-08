import { toast } from "react-toastify";

export const studentService = {
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
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "date_of_birth_c"}},
          {"field": {"Name": "enrollment_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "guardian_name_c"}},
          {"field": {"Name": "guardian_contact_c"}},
          {"field": {"Name": "photo_c"}},
          {"field": {"name": "class_id_c"}, "referenceField": {"field": {"Name": "Name"}}}
        ]
      };

      const response = await apperClient.fetchRecords('student_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching students:", error?.message || error);
      toast.error("Failed to load students");
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
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "date_of_birth_c"}},
          {"field": {"Name": "enrollment_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "guardian_name_c"}},
          {"field": {"Name": "guardian_contact_c"}},
          {"field": {"Name": "photo_c"}},
          {"field": {"name": "class_id_c"}, "referenceField": {"field": {"Name": "Name"}}}
        ]
      };

      const response = await apperClient.getRecordById('student_c', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Student not found");
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching student ${id}:`, error?.message || error);
      throw new Error("Student not found");
    }
  },

  async create(student) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const payload = {
        records: [{
          Name: `${student.first_name_c} ${student.last_name_c}`,
          first_name_c: student.first_name_c,
          last_name_c: student.last_name_c,
          email_c: student.email_c,
          phone_c: student.phone_c,
          date_of_birth_c: student.date_of_birth_c,
          enrollment_date_c: student.enrollment_date_c,
          class_id_c: student.class_id_c ? parseInt(student.class_id_c) : null,
          status_c: student.status_c,
          address_c: student.address_c,
          guardian_name_c: student.guardian_name_c,
          guardian_contact_c: student.guardian_contact_c,
          photo_c: student.photo_c || ""
        }]
      };

      const response = await apperClient.createRecord('student_c', payload);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to create student:`, failed);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
            }
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to create student");
        }

        const newStudent = response.results[0].data;
        
try {
          const syncResult = await apperClient.functions.invoke(
            import.meta.env.VITE_SYNC_STUDENT_TO_CLOCKIFY,
            {
              body: JSON.stringify({
                studentId: newStudent.Id,
                firstName: newStudent.first_name_c,
                lastName: newStudent.last_name_c,
                email: newStudent.email_c,
                phone: newStudent.phone_c
              }),
              headers: {
                'Content-Type': 'application/json'
              }
            }
          );

          if (!syncResult.success) {
            console.info(`apper_info: Got an error in this function: ${import.meta.env.VITE_SYNC_STUDENT_TO_CLOCKIFY}. The response body is: ${JSON.stringify(syncResult)}.`);
            toast.warning("Student created but sync to Clockify failed");
          } else {
            toast.success("Student created and synced to Clockify!");
          }
        } catch (error) {
          console.info(`apper_info: Got this error in this function: ${import.meta.env.VITE_SYNC_STUDENT_TO_CLOCKIFY}. The error is: ${error.message}`);
          toast.warning("Student created but Clockify sync encountered an error");
        }

        return newStudent;
      }

      throw new Error("No data returned from create operation");
    } catch (error) {
      console.error("Error creating student:", error?.message || error);
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
          ...(data.first_name_c && data.last_name_c && { Name: `${data.first_name_c} ${data.last_name_c}` }),
          ...(data.first_name_c && { first_name_c: data.first_name_c }),
          ...(data.last_name_c && { last_name_c: data.last_name_c }),
          ...(data.email_c && { email_c: data.email_c }),
          ...(data.phone_c && { phone_c: data.phone_c }),
          ...(data.date_of_birth_c && { date_of_birth_c: data.date_of_birth_c }),
          ...(data.enrollment_date_c && { enrollment_date_c: data.enrollment_date_c }),
          ...(data.class_id_c !== undefined && { class_id_c: data.class_id_c ? parseInt(data.class_id_c) : null }),
          ...(data.status_c && { status_c: data.status_c }),
          ...(data.address_c !== undefined && { address_c: data.address_c }),
          ...(data.guardian_name_c && { guardian_name_c: data.guardian_name_c }),
          ...(data.guardian_contact_c && { guardian_contact_c: data.guardian_contact_c }),
          ...(data.photo_c !== undefined && { photo_c: data.photo_c })
        }]
      };

      const response = await apperClient.updateRecord('student_c', payload);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update student:`, failed);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
            }
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to update student");
        }

        return response.results[0].data;
      }

      throw new Error("No data returned from update operation");
    } catch (error) {
      console.error("Error updating student:", error?.message || error);
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

      const response = await apperClient.deleteRecord('student_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return { success: false };
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to delete student:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return { success: false };
        }

        return { success: true };
      }

      return { success: true };
    } catch (error) {
      console.error("Error deleting student:", error?.message || error);
      return { success: false };
    }
  },

  async search(query) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "date_of_birth_c"}},
          {"field": {"Name": "enrollment_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "guardian_name_c"}},
          {"field": {"Name": "guardian_contact_c"}},
          {"field": {"Name": "photo_c"}},
          {"field": {"name": "class_id_c"}, "referenceField": {"field": {"Name": "Name"}}}
        ],
        whereGroups: {
          operator: "OR",
          subGroups: [
            {
              conditions: [
                {"fieldName": "first_name_c", "operator": "Contains", "values": [query]}
              ],
              operator: "OR"
            },
            {
              conditions: [
                {"fieldName": "last_name_c", "operator": "Contains", "values": [query]}
              ],
              operator: "OR"
            },
            {
              conditions: [
                {"fieldName": "email_c", "operator": "Contains", "values": [query]}
              ],
              operator: "OR"
            }
          ]
        }
      };

      const response = await apperClient.fetchRecords('student_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error searching students:", error?.message || error);
      return [];
    }
  }
};