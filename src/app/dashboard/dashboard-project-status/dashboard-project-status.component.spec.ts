import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardProjectStatusComponent } from './dashboard-project-status.component';

describe('DashboardProjectStatusComponent', () => {
  let component: DashboardProjectStatusComponent;
  let fixture: ComponentFixture<DashboardProjectStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardProjectStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardProjectStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
