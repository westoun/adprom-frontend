import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImgIntroComponent } from './img-intro.component';

describe('ImgIntroComponent', () => {
  let component: ImgIntroComponent;
  let fixture: ComponentFixture<ImgIntroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImgIntroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImgIntroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
