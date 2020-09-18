import { Pipe, PipeTransform } from '@angular/core';
import Task from '../models/task.model';

@Pipe({
  name: 'taskCompleted'
})
export class TaskCompletedPipe implements PipeTransform {
  transform(tasks: Task[]) {
    return tasks.filter(t => t.completed);
  }
}
