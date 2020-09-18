import { Component, OnInit } from '@angular/core';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';
import TaskType from 'src/app/shared/models/task-type.model';
import Task from 'src/app/shared/models/task.model';

@Component({
  selector: 'app-dashboard-task-types',
  templateUrl: './dashboard-task-types.component.html',
  styleUrls: ['./dashboard-task-types.component.css']
})
export class DashboardTaskTypesComponent implements OnInit {
  data = [];

  taskTypesQuery = gql`
    {
      taskTypes {
        title
        icon
        tasks {
          title
        }
      }
    }
  `;

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.fetchTaskTypes();
  }

  private fetchTaskTypes() {
    this.apollo
      .query({
        query: this.taskTypesQuery,
        fetchPolicy: 'no-cache'
      })
      .pipe(map(res => res.data['taskTypes']))
      .subscribe((types: TaskType[]) => {
        this.data = this.parseTypesToData(types);
      });
  }

  private parseTypesToData(types: TaskType[]) {
    return types.map(t => {
      return {
        name: t.title,
        value: this.filterTasksByCompleteness(t.tasks).length
      };
    });
  }

  private filterTasksByCompleteness(tasks: Task[]) {
    return tasks.filter(t => !t.completed);
  }
}
