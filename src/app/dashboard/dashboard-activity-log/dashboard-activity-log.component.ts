import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import TaskLog from 'src/app/shared/models/task-log.model';
import Project from 'src/app/shared/models/project.model';
import Task from 'src/app/shared/models/task.model';

@Component({
  selector: 'app-dashboard-activity-log',
  templateUrl: './dashboard-activity-log.component.html',
  styleUrls: ['./dashboard-activity-log.component.css']
})
export class DashboardActivityLogComponent implements OnInit {
  WEEKS_COUNT = 6;

  colorSchema = {
    name: 'schema',
    domain: ['#aaa', '#2ECC40']
  };

  data = [];

  taskLogsQuery = gql`
    {
      projects {
        title
        tasks {
          taskLogs {
            createdAt
          }
        }
      }
    }
  `;

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.fetchLogs();
  }

  private fetchLogs() {
    this.apollo
      .query({
        query: this.taskLogsQuery,
        fetchPolicy: 'no-cache'
      })
      .pipe(map(res => res.data['projects']))
      .subscribe((projects: Project[]) => {
        this.data = this.parseProjectsToData(projects);
      });
  }

  private parseProjectsToData(projects: Project[]) {
    const data = [];

    let endDate = this.computeEndOfThisWeek();
    let startDate = this.computeStartOfThisWeek();

    for (let i = 0; i < this.WEEKS_COUNT; i++) {
      data.unshift({
        name: 'Week ' + this.weekOfYear(endDate),
        start: startDate,
        end: endDate,
        series: []
      });
      endDate = this.computeOneWeekAgo(endDate);
      startDate = this.computeOneWeekAgo(startDate);
    }

    for (const column of data) {
      for (const project of projects) {
        column.series.push({
          name: project.title,
          value: this.countTaskLogs(project, column.start, column.end)
        });
      }
    }
    return data;
  }

  private computeOneWeekAgo(date: Date): Date {
    return new Date(date.valueOf() - 7 * 24 * 60 * 60 * 1000);
  }

  private computeEndOfThisWeek(): Date {
    const currentDate = new Date();
    currentDate.setHours(23, 59, 59);
    const currentDay = currentDate.getDay();
    const daysTillSunday = 7 % currentDay;

    return new Date(
      currentDate.valueOf() + 1000 * 60 * 60 * 24 * daysTillSunday
    );
  }

  private computeStartOfThisWeek(): Date {
    const endDate = this.computeEndOfThisWeek();
    return new Date(
      endDate.valueOf() - 7 * 24 * 60 * 60 * 1000 + 1 * 1000
    );
  }

  private countTaskLogs(project: Project, startDate: Date, endDate: Date): number {
    const tasks: Task[] = project.tasks;
    const taskLogs = [];
    tasks.forEach(t => taskLogs.push(...t.taskLogs));
    const filteredTaskLogs = taskLogs.filter(tL =>
      this.dateIsBetween(new Date(tL.createdAt), startDate, endDate)
    );
    return filteredTaskLogs.length;
  }

  private dateIsBetween(date: Date, dateBefore: Date, dateAfter: Date): boolean {
    return (
      date.valueOf() >= dateBefore.valueOf() &&
      date.valueOf() < dateAfter.valueOf()
    );
  }

  private weekOfYear(date: Date): number {
    const dateCopy = new Date(date.valueOf());
    const dayNr = (date.getDay() + 6) % 7;
    dateCopy.setDate(dateCopy.getDate() - dayNr + 3);
    const jan4 = new Date(dateCopy.getFullYear(), 0, 4); // jan 4 is in week 1
    const dayDiff = (dateCopy.valueOf() - jan4.valueOf()) / 86400000;
    const weekNr = 1 + Math.ceil(dayDiff / 7);
    return weekNr;
  }
}
