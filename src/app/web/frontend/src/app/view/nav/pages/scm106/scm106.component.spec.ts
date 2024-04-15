import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Scm106Component } from './scm106.component';

describe('Scm106Component', () => {
  let component: Scm106Component;
  let fixture: ComponentFixture<Scm106Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Scm106Component]
    });
    fixture = TestBed.createComponent(Scm106Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
