import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardActivityLogComponent } from './dashboard-activity-log.component';

describe('DashboardActivityLogComponent', () => {
  let component: DashboardActivityLogComponent;
  let fixture: ComponentFixture<DashboardActivityLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardActivityLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardActivityLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
