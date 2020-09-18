import Task from './task.model';

export default interface TaskTimeLog {
  taskTimeLogId: string;
  fkTaskId?: string;
  task?: Task;
  duration?: number;
}
