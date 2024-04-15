import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Scm0Component } from './scm0.component';

describe('Scm0Component', () => {
  let component: Scm0Component;
  let fixture: ComponentFixture<Scm0Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Scm0Component]
    });
    fixture = TestBed.createComponent(Scm0Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
