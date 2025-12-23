
export interface Objective {
  knowledge: string;
  language: string;
  commonComp: string;
  digitalComp: string;
  qualities: string;
}

export interface Procedure {
  step: string;
  objective: string;
  content: string;
  product: string;
  teacherActivity: string;
  studentActivity: string;
}

export interface LessonPlan {
  school: string;
  teacher: string;
  unit: string;
  lessonCategory: string;
  lessonTitle: string;
  period: string;
  objectives: Objective;
  aids: string;
  procedures: Procedure[];
}

export interface UnitData {
  id: number;
  name: string;
}

export interface NLSMapping {
  code: string;
  activity: string;
}
