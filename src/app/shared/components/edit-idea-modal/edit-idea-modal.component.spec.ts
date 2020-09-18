import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditIdeaModalComponent } from './edit-idea-modal.component';

describe('EditIdeaModalComponent', () => {
  let component: EditIdeaModalComponent;
  let fixture: ComponentFixture<EditIdeaModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditIdeaModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditIdeaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
