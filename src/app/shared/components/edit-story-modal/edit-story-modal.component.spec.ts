import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStoryModalComponent } from './edit-story-modal.component';

describe('EditStoryModalComponent', () => {
  let component: EditStoryModalComponent;
  let fixture: ComponentFixture<EditStoryModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditStoryModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditStoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
