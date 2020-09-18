import { Pipe, PipeTransform } from '@angular/core';
import Task from '../models/task.model';
import TaskStatus from '../models/task-status.model';

@Pipe({
  name: 'status'
})
export class TaskStatusPipe implements PipeTransform {
  transform(tasks: Task[], status: TaskStatus) {
    return tasks.filter(t => t.fkTaskStatusId === status.taskStatusId);
  }
}
