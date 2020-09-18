import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { Router } from '@angular/router';
import ProjectIdea from '../../models/project-idea.model';
import { map } from 'rxjs/operators';
import Project from '../../models/project.model';

@Component({
  selector: 'app-edit-idea-modal',
  templateUrl: './edit-idea-modal.component.html',
  styleUrls: ['./edit-idea-modal.component.css']
})
export class EditIdeaModalComponent implements OnInit {
  ideaQuery = gql`
    query($projectIdeaId: String!) {
      projectIdea(projectIdeaId: $projectIdeaId) {
        projectIdeaId
        title
        description
      }
    }
  `;

  updateIdeaMutation = gql`
    mutation($projectIdeaId: String!, $title: String, $description: String) {
      updateProjectIdea(
        projectIdeaId: $projectIdeaId
        title: $title
        description: $description
      ) {
        projectIdeaId
        title
        description
      }
    }
  `;

  createProjectMutation = gql`
    mutation($title: String, $description: String) {
      createProject(project: { title: $title, description: $description }) {
        projectId
        title
        description
      }
    }
  `;

  deleteIdeaMutation = gql`
    mutation($projectIdeaId: String!) {
      deleteProjectIdea(projectIdeaId: $projectIdeaId) {
        projectIdeaId
        title
        description
      }
    }
  `;

  @Input() open = false;
  @Input('idea') set _idea(idea: ProjectIdea) {
    if (idea) {
      this.fetchIdea(idea.projectIdeaId);
    }
  }
  @Output() openChange: EventEmitter<boolean> = new EventEmitter();
  @Output() ideaChange: EventEmitter<ProjectIdea> = new EventEmitter();

  idea: ProjectIdea = null;

  showDeleteIdeaModal = false;

  constructor(private apollo: Apollo, private router: Router) {}

  ngOnInit() {}

  onDeleteIdea() {
    this.showDeleteIdeaModal = true;
  }

  deleteIdea() {
    this.apollo.mutate({
      mutation: this.deleteIdeaMutation,
      variables: {
        projectIdeaId: this.idea.projectIdeaId
      }
    }).subscribe(res => {
      this.openChange.emit(false);
    });
  }

  private fetchIdea(ideaId) {
    this.apollo
      .query({
        query: this.ideaQuery,
        variables: {
          projectIdeaId: ideaId
        },
        fetchPolicy: 'no-cache'
      })
      .pipe(map(res => res.data['projectIdea']))
      .subscribe((idea: ProjectIdea) => {
        this.idea = idea;
      });
  }

  private updateIdea(status?: boolean) {
    this.apollo
      .mutate({
        mutation: this.updateIdeaMutation,
        variables: {
          projectIdeaId: this.idea.projectIdeaId,
          title: this.idea.title,
          description: this.idea.description
        }
      })
      .subscribe(
        res => {
          this.ideaChange.emit(this.idea);
          this.openChange.emit(status);
        },
        err => {
          this.ideaChange.emit(this.idea);
          this.openChange.emit(status);
        }
      );
  }

  onStartProject() {
    this.apollo
      .mutate({
        mutation: this.createProjectMutation,
        variables: {
          title: this.idea.title,
          description: this.idea.description
        }
      })
      .pipe(map(res => res.data['createProject']))
      .subscribe((project: Project) => {
        this.apollo
          .mutate({
            mutation: this.deleteIdeaMutation,
            variables: {
              projectIdeaId: this.idea.projectIdeaId
            }
          })
          .subscribe(res => {
            this.ideaChange.emit(null);
            this.openChange.emit(false);
            this.router.navigateByUrl(`/projects/${project.projectId}`);
          });
      });
  }
  onOpenChanged(status: boolean) {
    if (this.idea) {
      this.updateIdea();
    }
  }
}
