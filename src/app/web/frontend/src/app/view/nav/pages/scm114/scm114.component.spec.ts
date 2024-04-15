import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Scm114Component } from './scm114.component';

describe('Scm114Component', () => {
  let component: Scm114Component;
  let fixture: ComponentFixture<Scm114Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Scm114Component]
    });
    fixture = TestBed.createComponent(Scm114Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
