import { Component, OnInit } from '@angular/core';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import TaskIdea from 'src/app/shared/models/task-idea.model';

@Component({
  selector: 'app-project-ideas',
  templateUrl: './project-ideas.component.html',
  styleUrls: ['./project-ideas.component.css']
})
export class ProjectIdeasComponent implements OnInit {

  taskIdeasQuery = gql`
    query($fkProjectId: String!) {
      taskIdeas(fkProjectId: $fkProjectId) {
        taskIdeaId
        title
        description
      }
    }
  `;

  createTaskIdeaMutation = gql`
    mutation($fkProjectId: String!, $title: String, $description: String) {
      createTaskIdea(
        fkProjectId: $fkProjectId
        taskIdea: {
          title: $title
          description: $description
        }
      ) {
        taskIdeaId
        title
        description
      }
    }
  `;

  updateTaskIdeaMutation = gql`
    mutation($taskIdeaId: String!, $title: String, $description: String) {
      updateTaskIdea(
        taskIdeaId: $taskIdeaId
        title: $title
        description: $description
      ) {
        taskIdeaId
        title
        description
      }
    }
  `;

  ideas: TaskIdea[] = [];
  clickedIdea: TaskIdea = null;
  showEditIdeaModal = null;

  constructor(private apollo: Apollo, private route: ActivatedRoute) { }

  ngOnInit() {
    this.fetchIdeas();
  }

  onIdeaClick(idea: TaskIdea) {
    this.clickedIdea = idea;
    this.showEditIdeaModal = true;
  }

  onModalStatusChanged() {
    if (this.clickedIdea && (this.clickedIdea.title || this.clickedIdea)) {
      this.apollo
        .mutate({
          mutation: this.updateTaskIdeaMutation,
          variables: {
            taskIdeaId: this.clickedIdea.taskIdeaId,
            title: this.clickedIdea.title,
            description: this.clickedIdea.description
          }
        })
        .subscribe(res => {
          this.fetchIdeas();
          this.showEditIdeaModal = false;
          this.clickedIdea = null;
        });
    }
  }

  onCreateIdea() {
    this.apollo
      .mutate({
        mutation: this.createTaskIdeaMutation,
        variables: {
          fkProjectId: this.getProjectId()
        }
      })
      .pipe(map(res => res.data['createTaskIdea']))
      .subscribe((idea: TaskIdea) => {
        this.clickedIdea = idea;
        this.showEditIdeaModal = true;
      });
  }


  private fetchIdeas() {
    this.apollo.query(
      {
        query: this.taskIdeasQuery,
        variables: {
          fkProjectId: this.getProjectId()
        },
        fetchPolicy: 'no-cache'
      }
    ).pipe(
      map(res => res.data['taskIdeas'])
    ).subscribe((ideas: TaskIdea[]) => {
      this.ideas = ideas;
    });
  }

  private getProjectId() {
    return this.route.parent.snapshot.params['projectId'];
  }
}
