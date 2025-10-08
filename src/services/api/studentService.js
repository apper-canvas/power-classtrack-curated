import studentsData from "@/services/mockData/students.json";
import { toast } from "react-toastify";

let students = [...studentsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const studentService = {
  async getAll() {
    await delay(300);
    return [...students];
  },

  async getById(id) {
    await delay(200);
    const student = students.find(s => s.Id === parseInt(id));
    if (!student) throw new Error("Student not found");
    return { ...student };
  },

async create(student) {
    await delay(400);
    const maxId = students.length > 0 ? Math.max(...students.map(s => s.Id)) : 0;
    const newStudent = {
      ...student,
      Id: maxId + 1
    };
    students.push(newStudent);
    
    // Sync to CompanyHub Contact table
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const syncResult = await apperClient.functions.invoke(
        import.meta.env.VITE_SYNC_STUDENT_TO_COMPANYHUB,
        {
          body: JSON.stringify({
            studentId: newStudent.Id,
            firstName: newStudent.firstName,
            lastName: newStudent.lastName,
            email: newStudent.email,
            phone: newStudent.phone,
            address: newStudent.address
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (!syncResult.success) {
        console.info(`apper_info: Got an error in this function: ${import.meta.env.VITE_SYNC_STUDENT_TO_COMPANYHUB}. The response body is: ${JSON.stringify(syncResult)}.`);
        toast.warning("Student created but sync to CompanyHub failed");
      } else {
        toast.success("Student created and synced to CompanyHub!");
      }
    } catch (error) {
      console.info(`apper_info: Got this error in this function: ${import.meta.env.VITE_SYNC_STUDENT_TO_COMPANYHUB}. The error is: ${error.message}`);
      toast.warning("Student created but CompanyHub sync encountered an error");
    }
    
    return { ...newStudent };
  },

  async update(id, data) {
    await delay(400);
    const index = students.findIndex(s => s.Id === parseInt(id));
    if (index === -1) throw new Error("Student not found");
    
    students[index] = {
      ...students[index],
      ...data,
      Id: students[index].Id
    };
    return { ...students[index] };
  },

  async delete(id) {
    await delay(300);
    const index = students.findIndex(s => s.Id === parseInt(id));
    if (index === -1) throw new Error("Student not found");
    
    students.splice(index, 1);
    return { success: true };
  },

  async search(query) {
    await delay(200);
    const lowerQuery = query.toLowerCase();
    return students.filter(s => 
      s.firstName.toLowerCase().includes(lowerQuery) ||
      s.lastName.toLowerCase().includes(lowerQuery) ||
      s.email.toLowerCase().includes(lowerQuery)
    );
  }
};