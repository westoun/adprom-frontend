import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClarityModule } from '@clr/angular';
import { RouterModule, Routes } from '@angular/router';
import { ProjectsComponent } from './projects/projects.component';
import { ProjectComponent } from './project/project.component';
import { IdeasComponent } from './ideas/ideas.component';
import { LearningGoalsComponent } from './learning-goals/learning-goals.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { WikiComponent } from './wiki/wiki.component';
import { ImgIntroComponent } from './shared/components/img-intro/img-intro.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { FormsModule } from '@angular/forms';
import { NgxDnDModule } from '@swimlane/ngx-dnd';
import { ProjectTasksComponent } from './project/project-tasks/project-tasks.component';
import { ProjectKanbanComponent } from './project/project-kanban/project-kanban.component';
import { ProjectOverviewComponent } from './project/project-overview/project-overview.component';
import { ProjectIdeasComponent } from './project/project-ideas/project-ideas.component';
import { KanbanComponent } from './kanban/kanban.component';
import { FavoriteProjectsPipe } from './shared/pipes/favorite-projects.pipe';
import { ArchiveComponent } from './archive/archive.component';
import { TaskStatusPipe } from './shared/pipes/task-status.pipe';
import { TaskCompletedPipe } from './shared/pipes/task-completed.pipe';
import { TaskNotCompletedPipe } from './shared/pipes/task-not-completed.pipe';
import { ConfirmationModalComponent } from './shared/components/confirmation-modal/confirmation-modal.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { DashboardActivityLogComponent } from './dashboard/dashboard-activity-log/dashboard-activity-log.component';
import { DashboardTaskLogComponent } from './dashboard/dashboard-task-log/dashboard-task-log.component';
import { DashboardProjectStatusComponent } from './dashboard/dashboard-project-status/dashboard-project-status.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ProjectStoriesComponent } from './project/project-stories/project-stories.component';
import { DashboardTaskTypesComponent } from './dashboard/dashboard-task-types/dashboard-task-types.component';
import { EditTaskModalComponent } from './shared/components/edit-task-modal/edit-task-modal.component';
import { StoryStartedPipe } from './shared/pipes/story-started.pipe';
import { StoryNotStartedPipe } from './shared/pipes/story-not-started.pipe';
import { EditStoryModalComponent } from './shared/components/edit-story-modal/edit-story-modal.component';
import { TimeLogButtonComponent } from './shared/components/time-log-button/time-log-button.component';
import { TimeLogStripComponent } from './shared/components/time-log-strip/time-log-strip.component';
import { ShortenPipe } from './shared/pipes/shorten.pipe';
import { EditIdeaModalComponent } from './shared/components/edit-idea-modal/edit-idea-modal.component';
import { OptionsComponent } from './options/options.component';
import { KanbanBoardComponent } from './shared/components/kanban-board/kanban-board.component';
import { TasksComponent } from './tasks/tasks.component';
import { EditProjectModalComponent } from './shared/components/edit-project-modal/edit-project-modal.component';
import { TasksOverviewComponent } from './shared/components/tasks-overview/tasks-overview.component';

const routes: Routes = [
  {
    path: 'projects',
    component: ProjectsComponent
  },
  {
    path: 'projects/:projectId',
    component: ProjectComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'stories'
      },
      {
        path: 'overview',
        component: ProjectOverviewComponent
      },
      {
        path: 'tasks',
        component: ProjectTasksComponent
      },
      {
        path: 'stories',
        component: ProjectStoriesComponent
      },
      {
        path: 'kanban',
        component: ProjectKanbanComponent
      },
      {
        path: 'ideas',
        component: ProjectIdeasComponent
      }
    ]
  },

  {
    path: 'tasks',
    component: TasksComponent
  },
  {
    path: 'options',
    component: OptionsComponent
  },
  {
    path: 'archive',
    component: ArchiveComponent
  },
  {
    path: 'ideas',
    component: IdeasComponent
  },
  {
    path: 'wiki',
    component: WikiComponent
  },
  {
    path: 'favorites',
    component: FavoritesComponent
  },
  {
    path: 'goals',
    component: LearningGoalsComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'kanban',
    component: KanbanComponent
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];

@NgModule({
  declarations: [
    AppComponent,
    ProjectsComponent,
    ProjectComponent,
    IdeasComponent,
    LearningGoalsComponent,
    DashboardComponent,
    WikiComponent,
    ImgIntroComponent,
    FavoritesComponent,
    ProjectTasksComponent,
    ProjectKanbanComponent,
    ProjectOverviewComponent,
    ProjectIdeasComponent,
    KanbanComponent,
    FavoriteProjectsPipe,
    TaskStatusPipe,
    TaskCompletedPipe,
    TaskNotCompletedPipe,
    StoryStartedPipe,
    StoryNotStartedPipe,
    ShortenPipe,
    ArchiveComponent,
    ConfirmationModalComponent,
    DashboardActivityLogComponent,
    DashboardTaskLogComponent,
    DashboardProjectStatusComponent,
    ProjectStoriesComponent,
    DashboardTaskTypesComponent,
    EditTaskModalComponent,
    EditStoryModalComponent,
    TimeLogButtonComponent,
    TimeLogStripComponent,
    EditIdeaModalComponent,
    OptionsComponent,
    KanbanBoardComponent,
    TasksComponent,
    EditProjectModalComponent,
    TasksOverviewComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    GraphQLModule,
    HttpClientModule,
    ClarityModule,
    NgxDnDModule,
    ColorPickerModule,
    NgxChartsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
