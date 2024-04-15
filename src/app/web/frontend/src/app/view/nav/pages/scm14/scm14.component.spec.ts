import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Scm14Component } from './scm14.component';

describe('Scm14Component', () => {
  let component: Scm14Component;
  let fixture: ComponentFixture<Scm14Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Scm14Component]
    });
    fixture = TestBed.createComponent(Scm14Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
