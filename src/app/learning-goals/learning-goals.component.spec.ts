import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LearningGoalsComponent } from './learning-goals.component';

describe('LearningGoalsComponent', () => {
  let component: LearningGoalsComponent;
  let fixture: ComponentFixture<LearningGoalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LearningGoalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LearningGoalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
