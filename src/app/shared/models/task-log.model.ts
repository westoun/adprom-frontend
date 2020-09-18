import Task from './task.model';

export default interface TaskLog {
  taskLogId: string;
  fkTaskId: string;
  task: Task;
  createdAt: Date;
}
