import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Scm28Component } from './scm28.component';

describe('Scm28Component', () => {
  let component: Scm28Component;
  let fixture: ComponentFixture<Scm28Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Scm28Component]
    });
    fixture = TestBed.createComponent(Scm28Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
