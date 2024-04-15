import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Scm17Component } from './scm17.component';

describe('Scm17Component', () => {
  let component: Scm17Component;
  let fixture: ComponentFixture<Scm17Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Scm17Component]
    });
    fixture = TestBed.createComponent(Scm17Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
