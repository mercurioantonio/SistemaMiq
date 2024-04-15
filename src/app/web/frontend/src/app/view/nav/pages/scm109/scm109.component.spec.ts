import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Scm109Component } from './scm109.component';

describe('Scm109Component', () => {
  let component: Scm109Component;
  let fixture: ComponentFixture<Scm109Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Scm109Component]
    });
    fixture = TestBed.createComponent(Scm109Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
