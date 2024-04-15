import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Scm98Component } from './scm98.component';

describe('Scm98Component', () => {
  let component: Scm98Component;
  let fixture: ComponentFixture<Scm98Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Scm98Component]
    });
    fixture = TestBed.createComponent(Scm98Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
