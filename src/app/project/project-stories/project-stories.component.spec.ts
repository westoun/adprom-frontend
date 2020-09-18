import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectStoriesComponent } from './project-stories.component';

describe('ProjectStoriesComponent', () => {
  let component: ProjectStoriesComponent;
  let fixture: ComponentFixture<ProjectStoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectStoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectStoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
