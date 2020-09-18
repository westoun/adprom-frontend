import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import gql from 'graphql-tag';
import Project from 'src/app/shared/models/project.model';

@Component({
  selector: 'app-project-overview',
  templateUrl: './project-overview.component.html',
  styleUrls: ['./project-overview.component.css']
})
export class ProjectOverviewComponent implements OnInit {

  projectQuery = gql`
    query($projectId: String!) {
      project(projectId: $projectId) {
        title
        description
      }
    }
  `;

  project: Project;

  constructor(private apollo: Apollo, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(val => {
      this.fetchProject();
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
        this.project = project;
      });
  }

  private getProjectId() {
    return this.route.parent.snapshot.params['projectId'];
  }
}
