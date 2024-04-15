import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Scm1Component } from './scm1.component';

describe('Scm1Component', () => {
  let component: Scm1Component;
  let fixture: ComponentFixture<Scm1Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Scm1Component]
    });
    fixture = TestBed.createComponent(Scm1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
