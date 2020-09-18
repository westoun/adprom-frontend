import { Component, OnInit } from '@angular/core';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import Project from '../shared/models/project.model';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  projectQuery = gql`
    query($projectId: String!) {
      project(projectId: $projectId) {
        projectId
        title
        favorite
      }
    }
  `;

  updateProjectMutation = gql`
    mutation(
      $projectId: String!
      $favorite: Boolean
    ) {
      updateProject(
        projectId: $projectId
        favorite: $favorite
      ) {
        projectId
        title
        favorite
      }
    }
  `;

  project: Project;
  showEditProjectModal = false;

  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(val => {
      this.fetchProject();
    });
  }

  onToggleFavorite() {
    this.apollo
      .mutate({
        mutation: this.updateProjectMutation,
        variables: {
          projectId: this.getProjectId(),
          favorite: !this.project.favorite
        }
      })
      .subscribe(res => {
        this.fetchProject();
      });
  }

  onEditProject() {
    this.showEditProjectModal = true;
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
        this.project = project;
      });
  }

  private getProjectId() {
    return this.route.snapshot.params['projectId'];
  }
}
