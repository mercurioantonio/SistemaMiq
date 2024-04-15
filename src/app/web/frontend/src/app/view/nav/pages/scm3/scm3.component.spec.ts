import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Scm3Component } from './scm3.component';

describe('Scm3Component', () => {
  let component: Scm3Component;
  let fixture: ComponentFixture<Scm3Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Scm3Component]
    });
    fixture = TestBed.createComponent(Scm3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
