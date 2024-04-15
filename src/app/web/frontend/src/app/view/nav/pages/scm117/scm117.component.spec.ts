import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Scm117Component } from './scm117.component';

describe('Scm117Component', () => {
  let component: Scm117Component;
  let fixture: ComponentFixture<Scm117Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Scm117Component]
    });
    fixture = TestBed.createComponent(Scm117Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
