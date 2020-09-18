import Task from './task.model';

export default interface TaskStatus {
  taskStatusId: string;
  title?: string;
  tasks?: Task[];
}
