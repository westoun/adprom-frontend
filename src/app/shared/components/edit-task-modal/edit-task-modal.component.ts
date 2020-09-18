import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import Task from '../../models/task.model';
import TaskType from '../../models/task-type.model';
import { Router } from '@angular/router';
import { t } from '@angular/core/src/render3';

@Component({
  selector: 'app-edit-task-modal',
  templateUrl: './edit-task-modal.component.html',
  styleUrls: ['./edit-task-modal.component.css']
})
export class EditTaskModalComponent implements OnInit {
  taskQuery = gql`
    query($taskId: String!) {
      task(taskId: $taskId) {
        taskId
        title
        description
        completed
        taskStatus {
          title
          taskStatusId
        }
        project {
          projectId
          title
        }
        taskType {
          title
          taskTypeId
        }
        date
      }
    }
  `;

  updateTaskMutation = gql`
    mutation(
      $taskId: String!
      $title: String
      $description: String
      $completed: Boolean
      $fkTaskTypeId: String
      $date: DateTime
    ) {
      updateTask(
        taskId: $taskId
        title: $title
        description: $description
        completed: $completed
        fkTaskTypeId: $fkTaskTypeId
        date: $date
      ) {
        taskId
        title
        description
        completed
        taskStatus {
          title
          taskStatusId
        }
        taskType {
          title
          taskTypeId
        }
        date
      }
    }
  `;

  deleteTaskMutation = gql`
    mutation($taskId: String!) {
      deleteTask(taskId: $taskId) {
        taskId
        title
      }
    }
  `;

  taskTypesQuery = gql`
    {
      taskTypes {
        taskTypeId
        title
      }
    }
  `;

  @Input() open = false;
  @Input('task') set _task(task: Task) {
    if (task) {
      this.fetchTask(task.taskId);
    }
  }
  @Output() openChange: EventEmitter<boolean> = new EventEmitter();
  @Output() taskChange: EventEmitter<Task> = new EventEmitter();

  task: Task = null;

  taskTypes: TaskType[] = [];

  showDeleteTaskModal = false;

  constructor(private apollo: Apollo, private router: Router) {}

  ngOnInit() {
    this.fetchTaskTypes();
  }

  private fetchTask(taskId) {
    this.apollo
      .query({
        query: this.taskQuery,
        variables: {
          taskId: taskId
        },
        fetchPolicy: 'no-cache'
      })
      .pipe(map(res => res.data['task']))
      .subscribe((task: Task) => {
        this.task = {
          ...task,
          date: task.date ? new Date(task.date) : null
        };
      });
  }

  private fetchTaskTypes() {
    this.apollo
      .query({
        query: this.taskTypesQuery
      })
      .pipe(map(res => res.data['taskTypes']))
      .subscribe((types: TaskType[]) => {
        this.taskTypes = types;
      });
  }

  onToggleTask() {
    if (this.task) {
      this.task.completed = !this.task.completed;
      this.updateTask();
    }
  }

  onDeleteTask() {
    this.showDeleteTaskModal = true;
  }

  deleteTask() {
    this.apollo
      .mutate({
        mutation: this.deleteTaskMutation,
        variables: {
          taskId: this.task.taskId
        }
      })
      .subscribe(res => {
        this.openChange.emit(false);
      });
  }

  private updateTask(status?: boolean) {
    this.apollo
      .mutate({
        mutation: this.updateTaskMutation,
        variables: {
          taskId: this.task.taskId,
          title: this.task.title,
          description: this.task.description,
          completed: this.task.completed,
          priority: this.task.priority,
          date: this.task.date ? new Date(this.task.date) : null,
          fkTaskTypeId: this.task.taskType
            ? this.task.taskType.taskTypeId
            : null
        }
      })
      .subscribe(
        res => {
          this.taskChange.emit(this.task);
          this.openChange.emit(status);
        },
        err => {
          this.taskChange.emit(this.task);
          this.openChange.emit(status);
        }
      );
  }

  onOpenChanged(status: boolean) {
    if (this.task) {
      this.updateTask(status);
    }
  }

  onNavigateToProject() {
    if (this.task) {
      this.updateTask();
      this.router.navigate(['projects', this.task.project.projectId]);
    }
  }
}
