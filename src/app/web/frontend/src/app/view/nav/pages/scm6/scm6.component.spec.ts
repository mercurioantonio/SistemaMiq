import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Scm6Component } from './scm6.component';

describe('Scm6Component', () => {
  let component: Scm6Component;
  let fixture: ComponentFixture<Scm6Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Scm6Component]
    });
    fixture = TestBed.createComponent(Scm6Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
