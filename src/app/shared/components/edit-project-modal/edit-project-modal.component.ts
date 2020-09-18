import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import Project from '../../models/project.model';
import { Apollo } from 'apollo-angular';
import { Router } from '@angular/router';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-edit-project-modal',
  templateUrl: './edit-project-modal.component.html',
  styleUrls: ['./edit-project-modal.component.css']
})
export class EditProjectModalComponent implements OnInit {

  projectQuery = gql`
  query($projectId: String!) {
    project(projectId: $projectId) {
      projectId
      title
      description
      favorite
      color
    }
  }
`;

updateProjectMutation = gql`
    mutation(
      $projectId: String!
      $favorite: Boolean
      $title: String
      $description: String
      $color: String
    ) {
      updateProject(
        projectId: $projectId
        favorite: $favorite
        title: $title
        description: $description
        color: $color
      ) {
        projectId
        title
        favorite
        description
      }
    }
  `;

  deleteProjectMutation = gql`
    mutation($projectId: String!) {
      deleteProject(projectId: $projectId) {
        projectId
        title
        description
      }
    }
  `;



  @Input() open = false;
  @Input('project') set _project(project: Project) {
    if (project) {
      this.fetchProject(project.projectId);
    }
  }
  @Output() openChange: EventEmitter<boolean> = new EventEmitter();
  @Output() projectChange: EventEmitter<Project> = new EventEmitter();

  project: Project = null;

  showDeleteProjectModal = false;



  constructor(private apollo: Apollo, private router: Router) { }

  ngOnInit() {
  }

  private fetchProject(projectId: string) {
    this.apollo
    .query({
      query: this.projectQuery,
      variables: {
        projectId: projectId
      },
      fetchPolicy: 'no-cache'
    })
    .pipe(map(res => res.data['project']))
    .subscribe((project: Project) => {
      this.project = project;
    });
  }

  onDeleteProject() {
    this.showDeleteProjectModal = true;
  }

  deleteProject() {
    this.apollo
    .mutate({
      mutation: this.deleteProjectMutation,
      variables: {
        projectId: this.project.projectId
      }
    })
    .subscribe(res => {
      this.router.navigateByUrl('/projects');
    });
  }

  private updateProject(status?: boolean) {
    this.apollo
    .mutate({
      mutation: this.updateProjectMutation,
      variables: {
        projectId: this.project.projectId,
        title: this.project.title,
        description: this.project.description,
        color: this.project.color
      }
    })
    .subscribe(res => {
      this.projectChange.emit(this.project);
      this.openChange.emit(status);
    }, err => {
      this.projectChange.emit(this.project);
      this.openChange.emit(status);
    });
  }

  onOpenChanged(status: boolean) {
    if (this.project) {
      this.updateProject(status);
    }
  }

}
