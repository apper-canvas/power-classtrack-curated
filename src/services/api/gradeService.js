import gradesData from "@/services/mockData/grades.json";

let grades = [...gradesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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
    await delay(250);
    return [...grades];
  },

  async getByStudentId(studentId) {
    await delay(200);
    return grades.filter(g => g.studentId === parseInt(studentId));
  },

  async create(grade) {
    await delay(400);
    const maxId = grades.length > 0 ? Math.max(...grades.map(g => g.Id)) : 0;
    const letterGrade = calculateLetterGrade(grade.score, grade.maxScore);
    const newGrade = {
      ...grade,
      Id: maxId + 1,
      letterGrade
    };
    grades.push(newGrade);
    return { ...newGrade };
  },

  async update(id, data) {
    await delay(400);
    const index = grades.findIndex(g => g.Id === parseInt(id));
    if (index === -1) throw new Error("Grade not found");
    
    const letterGrade = data.score && data.maxScore 
      ? calculateLetterGrade(data.score, data.maxScore)
      : grades[index].letterGrade;

    grades[index] = {
      ...grades[index],
      ...data,
      Id: grades[index].Id,
      letterGrade
    };
    return { ...grades[index] };
  },

  async delete(id) {
    await delay(300);
    const index = grades.findIndex(g => g.Id === parseInt(id));
    if (index === -1) throw new Error("Grade not found");
    
    grades.splice(index, 1);
    return { success: true };
  }
};