import { Component, OnInit } from '@angular/core';
import Story from '../../models/story.model';
import Task from '../../models/task.model';
import { forkJoin } from 'rxjs';
import TaskStatus from '../../models/task-status.model';
import Project from '../../models/project.model';
import { map } from 'rxjs/operators';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-kanban-board',
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.css']
})
export class KanbanBoardComponent implements OnInit {
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
    ) {
      updateTask(
        taskId: $taskId
        fkTaskStatusId: $fkTaskStatusId
        title: $title
        description: $description
        priority: $priority
      ) {
        taskId
        title
        description
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
  clickedStory: Story = null;
  showEditStoryModal = false;

  showProjectFilters = false;
  projectFilters = [];

  constructor(private apollo: Apollo, private route: ActivatedRoute) {}

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
        this.stories = this.filterStories(this._stories, this.projectFilters);
      });
  }

  onItemDrop(status: TaskStatus, ev) {
    if (this.draggedItem) {
      if (this.draggedItem.storyId) {
        // case: story has been dragged
        ev.el.parentNode.removeChild(ev.el); // remove story card from kaban board
        forkJoin(
          this.draggedItem.tasks.map(t =>
            this.apollo.mutate({
              mutation: this.updateTaskMutation,
              variables: {
                taskId: t.taskId,
                fkTaskStatusId: status.taskStatusId
              }
            })
          )
        ).subscribe(res => {
          this.projects.length > 1 ? this.fetchProjects() : this.fetchProject();
          this.draggedItem = null;
        });
      } else {
        this.apollo
          .mutate({
            mutation: this.updateTaskMutation,
            variables: {
              taskId: this.draggedItem.taskId,
              fkTaskStatusId: status.taskStatusId
            }
          })
          .subscribe(res => {
            this.projects.length > 1 ? this.fetchProjects() : this.fetchProject();
            this.draggedItem = null;
          });
      }
    }
  }

  onItemDrag(item) {
    this.draggedItem = item;
  }

  onUpdateFilter() {
    this.tasks = this.filterTasks(this._tasks, this.projectFilters);
    this.stories = this.filterStories(this._stories, this.projectFilters);
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

  private filterStories(stories: Story[], projectFilters) {
    const displayedProjectIds = projectFilters
      .filter(p => p.show)
      .map(p => p.pId);
    const filteredStories = stories.filter(s =>
      displayedProjectIds.includes(s.fkProjectId)
    );
    return [...filteredStories];
  }

  onTaskClick(task: Task) {
    this.clickedTask = task;
    this.showEditTaskModal = true;
  }

  onTaskModalStatusChanged() {
    if (this.clickedTask) {
      this.projects.length > 1 ? this.fetchProjects() : this.fetchProject();
      this.showEditTaskModal = false;
      this.clickedTask = null;
    }
  }

  onStoryClick(story: Story) {
    this.clickedStory = story;
    this.showEditStoryModal = true;
  }

  onStoryModalStatusChanged() {
    if (this.clickedStory) {
      this.projects.length > 1 ? this.fetchProjects() : this.fetchProject();
      this.showEditStoryModal = false;
      this.clickedStory = null;
    }
  }

  private getProjectId() {
    return this.route.parent.snapshot.params['projectId'];
  }
}
