import Project from './project.model';

export default interface LearningGoal {
  learningGoalId: string;
  fkProjectId?: string;
  project?: Project;
  title?: string;
  description?: string;
}
