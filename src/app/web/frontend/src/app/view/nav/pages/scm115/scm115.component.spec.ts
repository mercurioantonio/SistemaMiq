import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Scm115Component } from './scm115.component';

describe('Scm115Component', () => {
  let component: Scm115Component;
  let fixture: ComponentFixture<Scm115Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Scm115Component]
    });
    fixture = TestBed.createComponent(Scm115Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
