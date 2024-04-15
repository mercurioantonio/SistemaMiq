import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Scm122Component } from './scm122.component';

describe('Scm122Component', () => {
  let component: Scm122Component;
  let fixture: ComponentFixture<Scm122Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Scm122Component]
    });
    fixture = TestBed.createComponent(Scm122Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
