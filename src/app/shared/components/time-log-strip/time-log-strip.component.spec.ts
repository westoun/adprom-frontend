import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeLogStripComponent } from './time-log-strip.component';

describe('TimeLogStripComponent', () => {
  let component: TimeLogStripComponent;
  let fixture: ComponentFixture<TimeLogStripComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeLogStripComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeLogStripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
