import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Scm27Component } from './scm27.component';

describe('Scm27Component', () => {
  let component: Scm27Component;
  let fixture: ComponentFixture<Scm27Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Scm27Component]
    });
    fixture = TestBed.createComponent(Scm27Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
