import Task from './task.model';
import Story from './story.model';
import LearningGoal from './learning-goal.model';

export default interface Project {
  projectId: string;
  title?: string;
  description?: string;
  favorite?: boolean;
  archived?: boolean;
  deadline?: Date;
  color?: string;
  tasks?: Task[];
  learningGoals?: LearningGoal[];
  stories?: Story[];
}
