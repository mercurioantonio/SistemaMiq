import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Scm16Component } from './scm16.component';

describe('Scm16Component', () => {
  let component: Scm16Component;
  let fixture: ComponentFixture<Scm16Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Scm16Component]
    });
    fixture = TestBed.createComponent(Scm16Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
