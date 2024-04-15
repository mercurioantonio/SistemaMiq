import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Scm100Component } from './scm100.component';

describe('Scm100Component', () => {
  let component: Scm100Component;
  let fixture: ComponentFixture<Scm100Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Scm100Component]
    });
    fixture = TestBed.createComponent(Scm100Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
