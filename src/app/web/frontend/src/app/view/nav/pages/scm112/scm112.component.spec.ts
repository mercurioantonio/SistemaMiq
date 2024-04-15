import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Scm112Component } from './scm112.component';

describe('Scm112Component', () => {
  let component: Scm112Component;
  let fixture: ComponentFixture<Scm112Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Scm112Component]
    });
    fixture = TestBed.createComponent(Scm112Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
