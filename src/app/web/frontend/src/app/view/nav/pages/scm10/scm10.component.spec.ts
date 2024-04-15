import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Scm10Component } from './scm10.component';

describe('Scm10Component', () => {
  let component: Scm10Component;
  let fixture: ComponentFixture<Scm10Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Scm10Component]
    });
    fixture = TestBed.createComponent(Scm10Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
