import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Scm60Component } from './scm60.component';

describe('Scm60Component', () => {
  let component: Scm60Component;
  let fixture: ComponentFixture<Scm60Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Scm60Component]
    });
    fixture = TestBed.createComponent(Scm60Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
