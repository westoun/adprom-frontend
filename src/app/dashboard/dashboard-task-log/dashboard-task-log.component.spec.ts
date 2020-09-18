import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTaskLogComponent } from './dashboard-task-log.component';

describe('DashboardTaskLogComponent', () => {
  let component: DashboardTaskLogComponent;
  let fixture: ComponentFixture<DashboardTaskLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardTaskLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardTaskLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
