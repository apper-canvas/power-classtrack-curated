import studentsData from "@/services/mockData/students.json";

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