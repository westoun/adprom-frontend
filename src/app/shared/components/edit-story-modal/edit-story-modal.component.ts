import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import Story from '../../models/story.model';
import Task from '../../models/task.model';

@Component({
  selector: 'app-edit-story-modal',
  templateUrl: './edit-story-modal.component.html',
  styleUrls: ['./edit-story-modal.component.css']
})
export class EditStoryModalComponent implements OnInit {

  storyQuery = gql`
    query($storyId: String!) {
      story(storyId: $storyId) {
        storyId
        title
        description
        fkProjectId
        project {
          projectId
          title
        }
        tasks {
          taskId
          title
          taskStatus {
            title
            taskStatusId
          }
          completed
        }
      }
    }
  `;

  createTaskMutation = gql`
    mutation($fkProjectId: String!, $fkStoryId: String, $title: String) {
      createTask(
        fkProjectId: $fkProjectId
        task: { title: $title, fkStoryId: $fkStoryId }
      ) {
        taskId
          title
          description
          completed
          taskStatus {
            title
            taskStatusId
          }
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
    ) {
      updateTask(
        taskId: $taskId
        title: $title
        description: $description
        completed: $completed
        fkTaskTypeId: $fkTaskTypeId
      ) {
        taskId
          title
          description
          completed
          taskStatus {
            title
            taskStatusId
          }
      }
    }
  `;

  deleteStoryMutation = gql`
    mutation($storyId: String!) {
      deleteStory(
        storyId: $storyId
      ) {
        title
        storyId
      }
    }
  `;

  updateStoryMutation = gql`
    mutation($storyId: String!, $title: String, $description: String) {
      updateStory(storyId: $storyId, title: $title, description: $description) {
        storyId
        title
        description
      }
    }
  `;

  @Input() open = false;
  @Input('story') set _story(story: Story) {
    if (story) {
      this.fetchStory(story.storyId);
    }
  }

  @Output() openChange: EventEmitter<boolean> = new EventEmitter();
  @Output() storyChange: EventEmitter<Story> = new EventEmitter();

  clickedTask: Task = null;
  showEditTaskModal = false;

  showDeleteStoryModal = false;

  taskInput = '';

  story: Story = null;

  constructor(private apollo: Apollo, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
  }

  private fetchStory(storyId) {
    this.apollo
    .query({
      query: this.storyQuery,
      variables: {
        storyId: storyId
      },
      fetchPolicy: 'no-cache'
    })
    .pipe(map(res => res.data['story']))
    .subscribe((story: Story) => {
      this.story = story;
    });
  }

  onCreateTask() {
    this.apollo
      .mutate({
        mutation: this.createTaskMutation,
        variables: {
          fkProjectId: this.story.fkProjectId,
          fkStoryId: this.story.storyId,
          title: this.taskInput
        }
      })
      .pipe(map(res => res.data['createTask']))
      .subscribe((task: Task) => {
        this.story.tasks.unshift(task);
        this.fetchStory(this.story.storyId);
        this.taskInput = '';
      });
  }

  onOpenChanged(status: boolean) {
    if (this.story) {
      this.updateStory(status);
    }
  }

  private updateStory(status?: boolean) {
    this.apollo
    .mutate({
      mutation: this.updateStoryMutation,
      variables: {
        storyId: this.story.storyId,
        title: this.story.title,
        description: this.story.description
      }
    })
    .subscribe(res => {
      this.storyChange.emit(this.story);
      this.openChange.emit(status);
    }, err => {
      this.storyChange.emit(this.story);
      this.openChange.emit(status);
    });
  }

  onTaskModalStatusChanged() {
    if (this.clickedTask) {
          this.fetchStory(this.story.storyId);
          this.showEditTaskModal = false;
          this.clickedTask = null;
    }
  }

  onToggleTask(task: Task) {
    this.showEditTaskModal = false;
    this.toggleTask(task);
    this.clickedTask = null;
  }


  private toggleTask(task: Task) {
    task.completed = !task.completed;
    this.apollo
      .mutate({
        mutation: this.updateTaskMutation,
        variables: {
          taskId: task.taskId,
          completed: task.completed
        }
      })
      .subscribe(res => {
        this.fetchStory(this.story.storyId);
      });
  }

  onTaskClick(task: Task) {
    event.preventDefault();
    this.clickedTask = task;
    this.showEditTaskModal = true;
  }

  onDeleteStory() {
    this.showDeleteStoryModal = true;
  }

  deleteStory() {
      this.apollo.mutate({
        mutation: this.deleteStoryMutation,
        variables: {
          storyId: this.story.storyId
        }
      }).subscribe(res => {
        this.openChange.emit(false);
      });
  }


  onNavigateToProject() {
    if (this.story) {
      this.updateStory();
      this.router.navigate(['projects', this.story.project.projectId]);
    }
  }
}
