import { Component, OnInit } from '@angular/core';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import ProjectIdea from '../shared/models/project-idea.model';
import Project from '../shared/models/project.model';

@Component({
  selector: 'app-ideas',
  templateUrl: './ideas.component.html',
  styleUrls: ['./ideas.component.css']
})
export class IdeasComponent implements OnInit {
  ideasQuery = gql`
    {
      projectIdeas {
        projectIdeaId
        title
        description
      }
    }
  `;

  createIdeaMutation = gql`
    mutation($title: String, $description: String) {
      createProjectIdea(
        projectIdea: { title: $title, description: $description }
      ) {
        projectIdeaId
        title
        description
      }
    }
  `;

  clickedIdea: ProjectIdea = null;
  showEditIdeaModal = false;

  ideas: ProjectIdea[] = [];

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.fetchIdeas();
  }

  onCreateIdea() {
    this.apollo
      .mutate({
        mutation: this.createIdeaMutation,
        variables: {
          title: '[new project idea title]'
        }
      })
      .pipe(map(res => res.data['createProjectIdea']))
      .subscribe((idea: ProjectIdea) => {
        this.clickedIdea = idea;
        this.showEditIdeaModal = true;
      });
  }

  private fetchIdeas() {
    this.apollo
      .query({
        query: this.ideasQuery,
        fetchPolicy: 'no-cache'
      })
      .pipe(map(res => res.data['projectIdeas']))
      .subscribe((ideas: ProjectIdea[]) => {
        this.ideas = ideas;
      });
  }

  onIdeaClick(idea: ProjectIdea) {
    this.clickedIdea = idea;
    this.showEditIdeaModal = true;
  }

  onIdeaModalStatusChanged() {
    if (this.clickedIdea) {
      this.fetchIdeas();
      this.showEditIdeaModal = false;
      this.clickedIdea = null;
    }
  }
}
