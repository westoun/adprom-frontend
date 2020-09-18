import Task from './task.model';

export default interface TaskType {
  taskTypeId: string;
  title?: string;
  icon?: string;
  tasks?: Task[];
}
