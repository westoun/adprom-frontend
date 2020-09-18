import Project from './project.model';
import Task from './task.model';

export default interface Story {
  storyId: string;
  fkProjectId?: string;
  project?: Project;
  title?: string;
  description?: string;
  plannedHours?: number;
  tasks?: Task[];
}
