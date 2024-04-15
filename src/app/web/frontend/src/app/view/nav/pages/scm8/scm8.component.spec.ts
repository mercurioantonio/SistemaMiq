import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Scm8Component } from './scm8.component';

describe('Scm8Component', () => {
  let component: Scm8Component;
  let fixture: ComponentFixture<Scm8Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Scm8Component]
    });
    fixture = TestBed.createComponent(Scm8Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
