import { TeacherSubject } from "enum/teacher-subject.enum";

export interface ITeacher {
    id: string;
    subject: TeacherSubject;
    preview: string;
    presenterId: string;
    driverId: string;
    voiceId: string;
  }