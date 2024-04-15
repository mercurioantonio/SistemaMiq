import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Scm118Component } from './scm118.component';

describe('Scm118Component', () => {
  let component: Scm118Component;
  let fixture: ComponentFixture<Scm118Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Scm118Component]
    });
    fixture = TestBed.createComponent(Scm118Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
