import Project from './project.model';
import Story from './story.model';
import TaskStatus from './task-status.model';
import TaskLog from './task-log.model';
import TaskType from './task-type.model';
import TaskTimeLog from './task-time-log.model';

export default interface Task {
  taskId: string;
  fkProjectId?: string;
  project?: Project;
  fkStoryId?: string;
  story?: Story;
  title?: string;
  description?: string;
  plannedHours?: number;
  completed?: boolean;
  fkTaskStatusId?: string;
  taskStatus?: TaskStatus;
  fkTaskTypeId?: string;
  date?: any;
  taskType?: TaskType;
  priority?: number;
  taskLogs?: TaskLog[];
  taskTimeLogs?: TaskTimeLog[];
}
