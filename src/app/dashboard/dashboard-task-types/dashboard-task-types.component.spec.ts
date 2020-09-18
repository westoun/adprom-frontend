import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTaskTypesComponent } from './dashboard-task-types.component';

describe('DashboardTaskTypesComponent', () => {
  let component: DashboardTaskTypesComponent;
  let fixture: ComponentFixture<DashboardTaskTypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardTaskTypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardTaskTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
