import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Scm9Component } from './scm9.component';

describe('Scm9Component', () => {
  let component: Scm9Component;
  let fixture: ComponentFixture<Scm9Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Scm9Component]
    });
    fixture = TestBed.createComponent(Scm9Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
