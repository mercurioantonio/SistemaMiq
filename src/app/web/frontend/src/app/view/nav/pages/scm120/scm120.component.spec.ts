import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Scm120Component } from './scm120.component';

describe('Scm120Component', () => {
  let component: Scm120Component;
  let fixture: ComponentFixture<Scm120Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Scm120Component]
    });
    fixture = TestBed.createComponent(Scm120Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
