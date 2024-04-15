import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Scm11Component } from './scm11.component';

describe('Scm11Component', () => {
  let component: Scm11Component;
  let fixture: ComponentFixture<Scm11Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Scm11Component]
    });
    fixture = TestBed.createComponent(Scm11Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
