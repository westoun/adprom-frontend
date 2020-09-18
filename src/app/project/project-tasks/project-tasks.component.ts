import { Component, OnInit } from '@angular/core';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import Task from 'src/app/shared/models/task.model';

@Component({
  selector: 'app-project-tasks',
  templateUrl: './project-tasks.component.html',
  styleUrls: ['./project-tasks.component.css']
})
export class ProjectTasksComponent implements OnInit {
  ngOnInit() {}
}
