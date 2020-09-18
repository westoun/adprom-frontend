import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeLogButtonComponent } from './time-log-button.component';

describe('TimeLogButtonComponent', () => {
  let component: TimeLogButtonComponent;
  let fixture: ComponentFixture<TimeLogButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeLogButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeLogButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
