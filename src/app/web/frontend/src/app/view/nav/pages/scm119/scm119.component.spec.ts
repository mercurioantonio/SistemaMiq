import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Scm119Component } from './scm119.component';

describe('Scm119Component', () => {
  let component: Scm119Component;
  let fixture: ComponentFixture<Scm119Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Scm119Component]
    });
    fixture = TestBed.createComponent(Scm119Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
