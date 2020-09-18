import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import Task from '../../models/task.model';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { TimeLogService } from 'src/app/time-log.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-time-log-button',
  templateUrl: './time-log-button.component.html',
  styleUrls: ['./time-log-button.component.css']
})
export class TimeLogButtonComponent implements OnInit, OnDestroy {
  @Input('task') set _task(task: Task) {
    // this setter was necessary for the time log strip component
    // isActive would otherwise be false all the time
    // since the service subscription fires before the input setter is executed
    this.task = task;
    if (task && this.activeTask && task.taskId === this.activeTask.taskId) {
      this.isActive = true;
    } else {
      this.isActive = false;
    }
  }

  task: Task = null;

  isActive = false;


  private taskSubscription: Subscription = null;
  private activeTask: Task = null;

  constructor(private apollo: Apollo, private timeLogService: TimeLogService) {}

  ngOnInit() {
    this.taskSubscription = this.timeLogService.trackedTask$.subscribe(task => {
      if (task && task.taskId === this.task.taskId) {
        this.isActive = true;
      } else {
        this.isActive = false;
      }
      this.activeTask = task;
    });
  }

  ngOnDestroy() {
    if (this.taskSubscription) {
      this.taskSubscription.unsubscribe();
    }
  }

  onToggleTimeLog() {
    event.stopPropagation();
    if (this.isActive) {
      this.stopTimeLog();
    } else {
      this.startTimeLog();
    }
  }

  private startTimeLog() {
    this.timeLogService.startTimeLog(this.task);
  }

  private stopTimeLog() {
    this.timeLogService.stopTimeLog();
  }
}
