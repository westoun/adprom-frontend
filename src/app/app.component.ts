import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import {map} from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  projectsQuery = gql`
  {
    projects {
      projectId
      title
      favorite
    }
  }
`;
  showSideNav = false;

  projects = [];
  constructor(private apollo: Apollo, private route: ActivatedRoute) {
  }

  toggleSideNav() {
    this.showSideNav = !this.showSideNav;
  }

  ngOnInit() {
    this.fetchProjects();
  }

  private fetchProjects() {
    this.apollo.query({
      query: this.projectsQuery,
      fetchPolicy: 'no-cache'
    }).pipe(
      map(res => res.data['projects'])
    )
    .subscribe((projects: any[]) => {
      this.projects = projects;
    });
  }
}
