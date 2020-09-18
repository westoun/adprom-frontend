import { Component, OnInit } from '@angular/core';
import { TimeLogService } from 'src/app/time-log.service';
import Task from '../../models/task.model';

@Component({
  selector: 'app-time-log-strip',
  templateUrl: './time-log-strip.component.html',
  styleUrls: ['./time-log-strip.component.css']
})
export class TimeLogStripComponent implements OnInit {
  activeTask: Task = null;

  private resetTimer = null;

  constructor(private timeLogService: TimeLogService) { }

  ngOnInit() {
    this.timeLogService.trackedTask$.subscribe(task => {
      if (this.resetTimer) {
        clearTimeout(this.resetTimer);
      }
      if (!task) {
        this.resetTimer = setTimeout(() => {
          this.activeTask = null;
        }, 20000);
      } else {
        this.resetTimer = null;
        this.activeTask = task;
      }
    });
  }

}
