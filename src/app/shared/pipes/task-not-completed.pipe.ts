import { Pipe, PipeTransform } from '@angular/core';
import Task from '../models/task.model';

@Pipe({
  name: 'taskNotCompleted'
})
export class TaskNotCompletedPipe implements PipeTransform {
  transform(tasks: Task[]) {
    return tasks.filter(t => !t.completed);
  }
}
