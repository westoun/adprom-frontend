import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import gql from 'graphql-tag';
import Project from '../../models/project.model';
import TaskStatus from '../../models/task-status.model';
import Task from '../../models/task.model';
import Story from '../../models/story.model';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-tasks-overview',
  templateUrl: './tasks-overview.component.html',
  styleUrls: ['./tasks-overview.component.css']
})
export class TasksOverviewComponent implements OnInit {

  taskStatusesQuery = gql`
    {
      taskStatuses {
        taskStatusId
        title
      }
    }
  `;

  projectQuery = gql`
    query($projectId: String!) {
      project(projectId: $projectId) {
        projectId
        title
        tasks {
          taskId
          title
          completed
          fkProjectId
          project {
            title
            color
          }
          fkTaskStatusId
          taskStatus {
            taskStatusId
            title
          }
        }
      }
    }
  `;

  projectsQuery = gql`
    {
      projects {
        projectId
        title
        tasks {
          taskId
          title
          completed
          fkProjectId
          project {
            title
            color
          }
          fkTaskStatusId
          taskStatus {
            taskStatusId
            title
          }
        }
        stories {
          fkProjectId
          storyId
          project {
            title
            color
          }
          title
          tasks {
            taskId
            fkTaskStatusId
            title
            description
            completed
          }
        }
      }
    }
  `;

  updateTaskMutation = gql`
    mutation(
      $taskId: String!
      $fkTaskStatusId: String
      $title: String
      $description: String
      $priority: Int
      $completed: Boolean
    ) {
      updateTask(
        taskId: $taskId
        fkTaskStatusId: $fkTaskStatusId
        title: $title
        description: $description
        priority: $priority
        completed: $completed
      ) {
        taskId
        title
        description
      }
    }
  `;

  createTaskMutation = gql`
    mutation($fkProjectId: String!, $title: String) {
      createTask(fkProjectId: $fkProjectId, task: { title: $title }) {
        taskId
        title
        description
        completed
        priority
      }
    }
  `;

  projects: Project[] = [];
  taskStatuses: TaskStatus[] = [];
  private _tasks: Task[] = [];
  tasks: Task[] = [];
  private _stories: Story[] = [];
  stories: Story[] = [];
  draggedItem: any = null; // can be task OR story
  clickedTask: Task = null;
  showEditTaskModal = false;

  showProjectFilters = false;
  projectFilters = [];
  taskInput = '';

  constructor(private route: ActivatedRoute, private apollo: Apollo) { }

  ngOnInit() {
    const projectId = this.getProjectId();
    if (projectId) {
      // case: component is placed in project component
      this.fetchProject();
    } else {
      this.projectFilters = this.getProjectFilters();
      this.fetchProjects();
    }
    this.fetchTaskStatuses();
  }

  onToggleProjectFilters() {
    this.showProjectFilters = !this.showProjectFilters;
  }

  private fetchTaskStatuses(projectId?: string) {
    this.apollo
      .query({
        query: this.taskStatusesQuery,
        fetchPolicy: 'no-cache'
      })
      .pipe(map(res => res.data['taskStatuses']))
      .subscribe((statuses: TaskStatus[]) => {
        this.taskStatuses = statuses;
      });
  }

  onCreateTask() {
    this.apollo
      .mutate({
        mutation: this.createTaskMutation,
        variables: {
          fkProjectId: this.getProjectId(),
          title: this.taskInput
        }
      })
      .subscribe(res => {
        this.taskInput = '';
        this.projects.length > 1 ? this.fetchProjects() : this.fetchProject();
      });
  }

  private fetchProject() {
    this.apollo
      .query({
        query: this.projectQuery,
        variables: {
          projectId: this.getProjectId()
        },
        fetchPolicy: 'no-cache'
      })
      .pipe(map(res => res.data['project']))
      .subscribe((project: Project) => {
        this._tasks.length = 0;
        this._stories.length = 0;
        this.projects = [project];
        this._tasks = [...this._tasks, ...project.tasks];
        this._stories = [...this._stories, ...project.stories];
        this.tasks = this._tasks;
        this.stories = this._stories;
      });
  }

  private fetchProjects() {
    this.apollo
      .query({
        query: this.projectsQuery,
        fetchPolicy: 'no-cache'
      })
      .pipe(map(res => res.data['projects']))
      .subscribe((projects: Project[]) => {
        this._tasks.length = 0;
        this._stories.length = 0;
        this.projects = projects;
        projects.forEach(p => {
          this._tasks = [...this._tasks, ...p.tasks];
          this._stories = [...this._stories, ...p.stories];
        });
        if (!this.projectFilters.length) {
          this.projectFilters = projects.map(p => {
            return {
              ptitle: p.title,
              pId: p.projectId,
              show: true
            };
          });
        }
        this.tasks = this.filterTasks(this._tasks, this.projectFilters);
      });
  }

  onUpdateFilter() {
    this.tasks = this.filterTasks(this._tasks, this.projectFilters);
    this.setProjectFilters(this.projectFilters);
  }

  private getProjectFilters() {
    return JSON.parse(localStorage.getItem('projectFilters')) || [];
  }

  private setProjectFilters(projectFilters) {
    localStorage.setItem('projectFilters', JSON.stringify(projectFilters));
  }

  private filterTasks(tasks: Task[], projectFilters) {
    const displayedProjectIds = projectFilters
      .filter(p => p.show)
      .map(p => p.pId);
    const filteredTasks = tasks.filter(t =>
      displayedProjectIds.includes(t.fkProjectId)
    );
    return [...filteredTasks];
  }

  onTaskClick(task: Task) {
    this.clickedTask = task;
    this.showEditTaskModal = true;
  }

  onToggleTask(task: Task) {
    this.showEditTaskModal = false;
    this.clickedTask = null;
    this.toggleTask(task);
  }

  private toggleTask(task: Task) {
    this.apollo
      .mutate({
        mutation: this.updateTaskMutation,
        variables: {
          taskId: task.taskId,
          completed: !task.completed
        }
      })
      .subscribe(res => {
        //
      }, err => {
        this.projects.length > 1 ? this.fetchProjects() : this.fetchProject();
      });
  }

  onTaskModalStatusChanged() {
    if (this.clickedTask) {
      this.projects.length > 1 ? this.fetchProjects() : this.fetchProject();
      this.showEditTaskModal = false;
      this.clickedTask = null;
    }
  }

  private getProjectId() {
    return this.route.parent.snapshot.params['projectId'];
  }
}
