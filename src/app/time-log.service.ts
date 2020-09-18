import { Injectable } from '@angular/core';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import Task from './shared/models/task.model';
import { BehaviorSubject, Subject } from 'rxjs';
import { cloneDeep } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class TimeLogService {

  createTaskTimeLogMutation = gql`
    mutation($fkTaskId: String!, $duration: Int) {
      createTaskTimeLog(fkTaskId: $fkTaskId, duration: $duration) {
        taskTimeLogId
        duration
      }
    }
  `;

  private trackedTask: Task = null;

  private trackedTaskSubject: BehaviorSubject<Task> = new BehaviorSubject<Task>(null);
  trackedTask$ = this.trackedTaskSubject.asObservable();

  private startDate: Date = null;
  private stopDate: Date = null;

  constructor(private apollo: Apollo) { }

  startTimeLog(task: Task) {
    if (this.trackedTask) {
      this.stopTimeLog();
    }
    this.trackedTask = task;
    this.startDate = new Date();
    this.trackedTaskSubject.next(task);
  }

  stopTimeLog() {
    this.stopDate = new Date();
    const duration = this.calculateDuration(this.startDate, this.stopDate);
    this.createTaskTimeLog(cloneDeep(this.trackedTask), duration);
    this.resetLogValues();
  }

  private calculateDuration(date1: Date, date2: Date) {
    return Math.abs(date1.valueOf() - date2.valueOf());
  }

  private createTaskTimeLog(task: Task, duration: number) {
    this.apollo
      .mutate({
        mutation: this.createTaskTimeLogMutation,
        variables: {
          fkTaskId: task.taskId,
          duration: duration
        }
      })
      .subscribe(res => {
        //
      });
  }

  private resetLogValues() {
    this.startDate = null;
    this.stopDate = null;
    this.trackedTask = null;
    this.trackedTaskSubject.next(null);
  }
}
