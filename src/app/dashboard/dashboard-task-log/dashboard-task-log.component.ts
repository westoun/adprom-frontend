import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import TaskLog from 'src/app/shared/models/task-log.model';

@Component({
  selector: 'app-dashboard-task-log',
  templateUrl: './dashboard-task-log.component.html',
  styleUrls: ['./dashboard-task-log.component.css']
})
export class DashboardTaskLogComponent implements OnInit {
  taskLogsQuery = gql`
    {
      taskLogs {
        text
        createdAt
        task {
          title
          project {
            title
          }
        }
      }
    }
  `;

  taskLogs: TaskLog[] = [];

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.fetchTaskLogs();
  }

  private fetchTaskLogs() {
    this.apollo
      .query({
        query: this.taskLogsQuery,
        fetchPolicy: 'no-cache'
      })
      .pipe(map(res => res.data['taskLogs']))
      .subscribe((taskLogs: TaskLog[]) => {
        this.taskLogs = taskLogs.slice(taskLogs.length - 5);
      });
  }
}
