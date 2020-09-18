import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { ActivatedRoute } from '@angular/router';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import Story from 'src/app/shared/models/story.model';

@Component({
  selector: 'app-project-stories',
  templateUrl: './project-stories.component.html',
  styleUrls: ['./project-stories.component.css']
})
export class ProjectStoriesComponent implements OnInit {
  storiesQuery = gql`
    query($fkProjectId: String!) {
      stories(fkProjectId: $fkProjectId) {
        storyId
        title
        description
      }
    }
  `;

  createStoryMutation = gql`
    mutation($fkProjectId: String!, $title: String) {
      createStory(fkProjectId: $fkProjectId, story: { title: $title }) {
        storyId
        title
        description
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

  stories: Story[] = [];
  showEditStoryModal = false;
  clickedStory: Story = null;



  constructor(private apollo: Apollo, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.parent.params.subscribe(val => {
      this.fetchStories();
    });
  }

  private fetchStories() {
    this.apollo
      .query({
        query: this.storiesQuery,
        variables: {
          fkProjectId: this.getProjectId()
        },
        fetchPolicy: 'no-cache'
      })
      .pipe(map(res => res.data['stories']))
      .subscribe((stories: Story[]) => {
        this.stories = stories;
      });
  }

  onStoryClick(story: Story) {
    this.clickedStory = story;
    this.showEditStoryModal = true;
  }

  onCreateStory() {
    this.apollo
      .mutate({
        mutation: this.createStoryMutation,
        variables: {
          fkProjectId: this.getProjectId(),
          title: '[new story  title]'
        }
      })
      .pipe(map(res => res.data['createStory']))
      .subscribe((story: Story) => {
        this.clickedStory = story;
        this.showEditStoryModal = true;
      });
  }

  onStoryModalStatusChanged() {
    if (this.clickedStory) {
      this.fetchStories();
      this.showEditStoryModal = false;
      this.clickedStory = null;
    }
  }

  private getProjectId() {
    return this.route.parent.snapshot.params['projectId'];
  }
}
