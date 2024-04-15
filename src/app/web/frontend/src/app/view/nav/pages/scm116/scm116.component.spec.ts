import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Scm116Component } from './scm116.component';

describe('Scm116Component', () => {
  let component: Scm116Component;
  let fixture: ComponentFixture<Scm116Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Scm116Component]
    });
    fixture = TestBed.createComponent(Scm116Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
