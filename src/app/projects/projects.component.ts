import { Component, OnInit } from '@angular/core';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import Project from '../shared/models/project.model';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  projectsQuery = gql`
    {
      projects {
        projectId
        title
        description
      }
    }
  `;

  projects: Project[] = [];

  constructor(private apollo: Apollo, private router: Router) { }

  ngOnInit() {
    this.fetchProjects();
  }

  private fetchProjects() {
    this.apollo.query({
      query: this.projectsQuery,
      fetchPolicy: 'no-cache'
    })
    .pipe(
      map(res => res.data['projects'])
    ).subscribe((projects: Project[]) => {
      this.projects = projects;
    });
  }
}
