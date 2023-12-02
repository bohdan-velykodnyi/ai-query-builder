import { TeacherSubject } from '../enum/teacher-subject.enum';

export interface CreateQuestionDto {
  question: string;
  teacher: TeacherSubject;
}
