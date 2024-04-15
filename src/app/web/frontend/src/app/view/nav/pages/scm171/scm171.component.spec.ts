import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Scm171Component } from './scm171.component';

describe('Scm171Component', () => {
  let component: Scm171Component;
  let fixture: ComponentFixture<Scm171Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Scm171Component]
    });
    fixture = TestBed.createComponent(Scm171Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
