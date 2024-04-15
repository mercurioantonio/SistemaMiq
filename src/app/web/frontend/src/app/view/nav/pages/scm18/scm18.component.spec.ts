import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Scm18Component } from './scm18.component';

describe('Scm18Component', () => {
  let component: Scm18Component;
  let fixture: ComponentFixture<Scm18Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Scm18Component]
    });
    fixture = TestBed.createComponent(Scm18Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
