import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Scm61Component } from './scm61.component';

describe('Scm61Component', () => {
  let component: Scm61Component;
  let fixture: ComponentFixture<Scm61Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Scm61Component]
    });
    fixture = TestBed.createComponent(Scm61Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
